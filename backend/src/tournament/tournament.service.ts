import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Model, type Types } from 'mongoose';
import { Tournament, TournamentDocument } from '../schemas/tournament.schema';
import { Entrant, EntrantDocument } from '../schemas/entrant.schema';
import {
  TournamentMatch,
  TournamentMatchDocument,
} from '../schemas/tournament-match.schema';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
    @InjectModel(Entrant.name) private entrantModel: Model<EntrantDocument>,
    @InjectModel(TournamentMatch.name)
    private matchModel: Model<TournamentMatchDocument>,
  ) {}

  async createTournament(
    userId: string,
    data: {
      name: string;
      sportType: string;
      maxSets: number;
      entrants: { name: string; seed?: number }[];
    },
  ) {
    const tournament = await this.tournamentModel.create({
      name: data.name,
      sportType: data.sportType,
      maxSets: data.maxSets,
      userId,
      status: 'Upcoming',
    });

    const entrantDocs = data.entrants.map((e) => ({
      name: e.name,
      seed: e.seed,
      tournamentId: tournament._id,
    }));
    await this.entrantModel.insertMany(entrantDocs);

    return tournament;
  }

  async generateBracket(tournamentId: string) {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament not found');

    const entrants = await this.entrantModel
      .find({ tournamentId })
      .sort({ seed: 1 })
      .exec();
    const numEntrants = entrants.length;
    if (numEntrants < 2) throw new BadRequestException('Not enough entrants');

    // Calculate power of 2
    let pow = 1;
    while (pow < numEntrants) pow *= 2;
    const numByes = pow - numEntrants;

    // We need 'pow' slots.
    // For simplicity in this implementation, we just mix entrants and nulls (byes)
    const slots: (EntrantDocument | null)[] = [...entrants];
    for (let i = 0; i < numByes; i++) {
      slots.push(null); // null represents a BYE
    }

    const currentRoundEntrants = slots;
    let roundNumber = 1;
    let currentRoundMatches: TournamentMatchDocument[] = [];
    let previousRoundMatches: TournamentMatchDocument[] = [];

    // Delete existing matches for this tournament if regenerating
    await this.matchModel.deleteMany({ tournamentId });

    while (currentRoundEntrants.length > 1 || previousRoundMatches.length > 1) {
      const isFirstRound = roundNumber === 1;
      const numMatches = isFirstRound
        ? currentRoundEntrants.length / 2
        : previousRoundMatches.length / 2;
      currentRoundMatches = [];

      for (let i = 0; i < numMatches; i++) {
        let entrant1Id = null;
        let entrant2Id = null;
        let status = 'Upcoming';
        let winnerId = null;

        if (isFirstRound) {
          const e1 = currentRoundEntrants[i * 2];
          const e2 = currentRoundEntrants[i * 2 + 1];
          entrant1Id = e1 ? e1._id : null;
          entrant2Id = e2 ? e2._id : null;

          // If one is a BYE, the other auto-advances
          if (entrant1Id && !entrant2Id) {
            winnerId = entrant1Id;
            status = 'Completed';
          } else if (!entrant1Id && entrant2Id) {
            winnerId = entrant2Id;
            status = 'Completed';
          } else {
            status = 'Queue'; // Ready to be assigned a court
          }
        }

        const match = new this.matchModel({
          tournamentId,
          round: roundNumber,
          matchNumber: i + 1,
          entrant1Id,
          entrant2Id,
          winnerId,
          status,
        });
        await match.save();
        currentRoundMatches.push(match);

        // Link previous round matches to this match
        if (!isFirstRound) {
          const prevMatch1 = previousRoundMatches[i * 2];
          const prevMatch2 = previousRoundMatches[i * 2 + 1];

          prevMatch1.nextMatchId = match._id.toString();
          await prevMatch1.save();

          prevMatch2.nextMatchId = match._id.toString();
          await prevMatch2.save();

          // Auto advance if previous match was already a BYE (completed)
          if (prevMatch1.winnerId) match.entrant1Id = prevMatch1.winnerId;
          if (prevMatch2.winnerId) match.entrant2Id = prevMatch2.winnerId;

          if (match.entrant1Id && match.entrant2Id) {
            match.status = 'Queue';
          } else if (match.entrant1Id || match.entrant2Id) {
            // Not fully ready, but if both were byes (rare), handle it.
          }
          await match.save();
        }
      }

      previousRoundMatches = currentRoundMatches;
      roundNumber++;
    }

    tournament.status = 'Live';
    await tournament.save();

    return { message: 'Bracket generated successfully' };
  }

  async getTournaments(userId: string) {
    return this.tournamentModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getTournamentDetails(id: string) {
    const tournament = await this.tournamentModel.findById(id);
    if (!tournament) throw new NotFoundException('Tournament not found');

    const entrants = await this.entrantModel.find({ tournamentId: id }).exec();
    const matches = await this.matchModel
      .find({ tournamentId: id })
      .populate('entrant1Id', 'name')
      .populate('entrant2Id', 'name')
      .populate('winnerId', 'name')
      .populate('courtId', 'name')
      .sort({ round: 1, matchNumber: 1 })
      .exec();

    return { tournament, entrants, matches };
  }

  async updateMatch(
    matchId: string,
    data: { score?: unknown; winnerId?: string; status?: string },
  ) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    if (data.score) match.score = data.score;
    if (data.status) match.status = data.status;
    if (data.winnerId) {
      match.winnerId = data.winnerId;
      match.status = 'Completed';

      // Advance winner to next match
      if (match.nextMatchId) {
        const nextMatch = await this.matchModel.findById(match.nextMatchId);
        if (nextMatch) {
          // Find which slot to put the winner in based on prev match positions
          // To be safe, just check which one is null
          if (!nextMatch.entrant1Id) {
            nextMatch.entrant1Id = match.winnerId;
          } else if (!nextMatch.entrant2Id) {
            nextMatch.entrant2Id = match.winnerId;
          }

          if (nextMatch.entrant1Id && nextMatch.entrant2Id) {
            nextMatch.status = 'Queue';
          }
          await nextMatch.save();
        }
      }
    }

    await match.save();
    return match;
  }
}
