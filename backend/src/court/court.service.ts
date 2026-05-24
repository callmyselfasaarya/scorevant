import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Model, type Types } from 'mongoose';
import { Court, CourtDocument } from '../schemas/court.schema';
import {
  TournamentMatch,
  TournamentMatchDocument,
} from '../schemas/tournament-match.schema';

@Injectable()
export class CourtService {
  constructor(
    @InjectModel(Court.name) private courtModel: Model<CourtDocument>,
    @InjectModel(TournamentMatch.name)
    private matchModel: Model<TournamentMatchDocument>,
  ) {}

  async createCourt(name: string) {
    const court = new this.courtModel({ name });
    return court.save();
  }

  async getCourts() {
    return this.courtModel
      .find()
      .populate({
        path: 'currentMatchId',
        populate: [
          { path: 'entrant1Id', select: 'name' },
          { path: 'entrant2Id', select: 'name' },
          { path: 'tournamentId', select: 'name sportType' },
        ],
      })
      .exec();
  }

  async getQueuedMatches() {
    return this.matchModel
      .find({ status: 'Queue' })
      .populate('entrant1Id', 'name')
      .populate('entrant2Id', 'name')
      .populate('tournamentId', 'name sportType')
      .sort({ createdAt: 1 })
      .exec();
  }

  async assignMatchToCourt(matchId: string, courtId: string) {
    const court = await this.courtModel.findById(courtId);
    if (!court) throw new NotFoundException('Court not found');
    if (court.status === 'In Use')
      throw new BadRequestException('Court is already in use');

    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');
    if (match.status !== 'Queue')
      throw new BadRequestException('Match is not in Queue status');

    court.status = 'In Use';
    court.currentMatchId = match._id.toString();
    await court.save();

    match.status = 'Live';
    match.courtId = court._id.toString();
    await match.save();

    return { court, match };
  }

  async freeCourt(courtId: string) {
    const court = await this.courtModel.findById(courtId);
    if (!court) throw new NotFoundException('Court not found');

    if (court.currentMatchId) {
      const match = await this.matchModel.findById(court.currentMatchId);
      if (match && match.status === 'Live') {
        // We might not want to automatically complete the match, but maybe just free it?
        // Actually the tournament service should handle completing matches.
      }
    }

    court.status = 'Idle';
    court.currentMatchId = undefined;
    await court.save();

    return court;
  }
}
