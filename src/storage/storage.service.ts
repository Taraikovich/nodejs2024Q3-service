import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StorageService {
  private users: User[] = [];

  getAllUsers() {
    return this.users.map((user) => this.excludePassword(user));
  }

  getUserById(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (user) return this.excludePassword(user);
    return;
  }

  addUser(createUserDto: CreateUserDto) {
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    return this.excludePassword(user);
  }

  updateUserPassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.users.find((user) => user.id === id);
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return this.excludePassword(user);
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  getUserPassword(id: string): string {
    const user = this.users.find((user) => user.id === id);
    return user.password;
  }

  private excludePassword(user: User) {
    const { password, ...publicUser } = user;
    return publicUser;
  }
}
