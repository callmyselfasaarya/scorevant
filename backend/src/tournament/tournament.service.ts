import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from '../schemas/tournament.schema';
import { Entrant, EntrantDocument } from '../schemas/entrant.schema';
import {
  TournamentMatch,
  TournamentMatchDocument,
} from '../schemas/tournament-match.schema';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name) private tournamentModel: Model<TournamentDocument>,
    @InjectModel(Entrant.name) private entrantModel: Model<EntrantDocument>,
    @InjectModel(TournamentMatch.name) private matchModel: Model<TournamentMatchDocument>,
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

  /**
   * Generates a tournament bracket for the given tournament ID.
   * It creates matches for each round, handling byes automatically.
   */
  async generateBracket(tournamentId: string) {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament not found');

    const entrants = await this.entrantModel
      .find({ tournamentId })
      .sort({ seed: 1 })
      .exec();
    const numEntrants = entrants.length;
    if (numEntrants < 2) throw new BadRequestException('Not enough entrants');

    // Determine the next power of two to calculate required byes
    let pow = 1;
    while (pow < numEntrants) pow *= 2;
    const numByes = pow - numEntrants;

    // Build initial slots: entrants followed by null placeholders for byes
    const slots: (EntrantDocument | null)[] = [...entrants];
    for (let i = 0; i < numByes; i++) slots.push(null);

    let currentRoundEntrants = slots;
    let roundNumber = 1;
    let previousRoundMatches: TournamentMatchDocument[] = [];

    // Clean any existing matches for this tournament
    await this.matchModel.deleteMany({ tournamentId });

    while (currentRoundEntrants.filter((e) => e).length > 1) {
      const isFirstRound = roundNumber === 1;
      const numMatches = isFirstRound
        ? currentRoundEntrants.length / 2
        : previousRoundMatches.length / 2;

      const currentRoundMatches: TournamentMatchDocument[] = [];

      for (let i = 0; i < numMatches; i++) {
        let entrant1Id: string | null = null;
        let entrant2Id: string | null = null;
        let winnerId: string | null = null;
        let status: string = 'Upcoming';

        if (isFirstRound) {
          const e1 = currentRoundEntrants[i * 2];
          const e2 = currentRoundEntrants[i * 2 + 1];
          entrant1Id = e1 ? e1._id.toString() : null;
          entrant2Id = e2 ? e2._id.toString() : null;

          // Auto‑advance BYE slots
          if (entrant1Id && !entrant2Id) {
            winnerId = entrant1Id;
            status = 'Completed';
          } else if (!entrant1Id && entrant2Id) {
            winnerId = entrant2Id;
            status = 'Completed';
          } else {
            status = 'Queue';
          }
        } else {
          // For later rounds, entrant IDs are resolved from previous matches
          const prevMatch1 = previousRoundMatches[i * 2];
          const prevMatch2 = previousRoundMatches[i * 2 + 1];
          if (prevMatch1?.winnerId) entrant1Id = prevMatch1.winnerId;
          if (prevMatch2?.winnerId) entrant2Id = prevMatch2.winnerId;
          status = entrant1Id && entrant2Id ? 'Queue' : 'Upcoming';
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

        // Link previous matches to this match for winner propagation
        if (!isFirstRound) {
          const prevMatch1 = previousRoundMatches[i * 2];
          const prevMatch2 = previousRoundMatches[i * 2 + 1];
          if (prevMatch1) {
            prevMatch1.nextMatchId = match._id.toString();
            await prevMatch1.save();
          }
          if (prevMatch2) {
            prevMatch2.nextMatchId = match._id.toString();
            await prevMatch2.save();
          }
        }
      }

      // Prepare entrants for the next round based on winners or completed BYE matches
      const nextRoundEntrants = currentRoundMatches.map((m) => {
        if (m.winnerId) return { _id: m.winnerId } as any;
        if (m.status === 'Completed' && m.winnerId) return { _id: m.winnerId } as any;
        return null;
      });

      previousRoundMatches = currentRoundMatches;
      currentRoundEntrants = nextRoundEntrants;
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

      // Advance winner to the next match if it exists
      if (match.nextMatchId) {
        const nextMatch = await this.matchModel.findById(match.nextMatchId);
        if (nextMatch) {
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
