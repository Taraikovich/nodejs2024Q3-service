import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  constructor(private dataSource: DataSource, private jwtService: JwtService) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async signUp(username: string, pass: string) {
    const user = this.userRepository.create({
      login: username,
      password: pass,
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

    if (user?.password !== pass) {
      throw new ForbiddenException('Wrong password!');
    }

    const payload = { sub: user.id, username: user.login };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
