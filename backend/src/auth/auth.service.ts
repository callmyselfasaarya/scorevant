import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.userModel.findOne({ email: normalizedEmail });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email: normalizedEmail,
      passwordHash,
      fullName: fullName.trim(),
    });

    return this.buildAuthResponse(user);
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toPublicUser(user);
  }

  private buildAuthResponse(user: UserDocument) {
    const publicUser = this.toPublicUser(user);
    const access_token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return { access_token, user: publicUser };
  }

  private toPublicUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName ?? null,
    };
  }
}
