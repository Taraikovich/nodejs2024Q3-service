import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  private saltRounds: number;

  constructor(private dataSource: DataSource, private jwtService: JwtService) {
    this.userRepository = this.dataSource.getRepository(User);
    this.saltRounds = parseInt(process.env.BCRYPT_SALT || '10');
  }

  async signUp(username: string, pass: string) {
    const user = this.userRepository.create({
      login: username,
      password: await bcrypt.hash(pass, this.saltRounds),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async signIn(username: string, pass: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.login = :login', { login: username })
      .getOne();

    if (!user) {
      throw new ForbiddenException('No user with such login!');
    }

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new ForbiddenException('Wrong password!');
    }

    const payload = { sub: user.id, username: user.login };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' },
      ),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const { sub: userId, type } = verifiedToken;

      if (type !== 'refresh') {
        throw new ForbiddenException('User not found!');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new ForbiddenException('User not found!');
      }

      const payload = { sub: user.id, username: user.login };

      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
      };
    } catch (err) {
      console.error('Refresh Token Error:', err);
      if (err.name === 'TokenExpiredError') {
        throw new ForbiddenException('Refresh token has expired!');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new ForbiddenException('Invalid refresh token!');
      }

      throw new ForbiddenException('Invalid or expired refresh token!');
    }
  }
}
