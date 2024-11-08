import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { Artist } from 'src/artist/entities/artist.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StorageService {
  private users: User[] = [];
  private artists: Artist[] = [];

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

  addArtist(createArtistDto: CreateArtistDto) {
    const atrist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(atrist);

    return atrist;
  }

  getAllArtists() {
    return this.artists;
  }

  getArtistById(id: string) {
    return this.artists.find((user) => user.id === id);
  }

  updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.getArtistById(id);
    artist.name = updateArtistDto.name ?? artist.name;
    artist.grammy = updateArtistDto.grammy ?? artist.grammy;

    return artist;
  }

  removeArtist(id: string) {
    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
