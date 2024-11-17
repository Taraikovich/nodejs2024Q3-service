import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { Album } from 'src/album/entities/album.entity';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { Artist } from 'src/artist/entities/artist.entity';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { Track } from 'src/track/entities/track.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  private userRepository: Repository<User>;
  private artistRepository: Repository<Artist>;
  private albumRepository: Repository<Album>;
  private trackRepository: Repository<Track>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.artistRepository = this.dataSource.getRepository(Artist);
    this.albumRepository = this.dataSource.getRepository(Album);
    this.trackRepository = dataSource.getRepository(Track);
  }

  async addUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      login: createUserDto.login,
      password: createUserDto.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const savedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findBy({ id });
    if (user.length) return user[0];
    return null;
  }

  async updateUserPassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    user.password = updatePasswordDto.newPassword;
    user.createdAt = Number(user.createdAt);
    user.updatedAt = Date.now();
    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async getUserPassword(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['password'],
    });
    return user.password;
  }

  removeUser(id: string) {
    this.userRepository.delete({ id });
  }

  async addArtist(createArtistDto: CreateArtistDto) {
    const artist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(artist);
  }

  async getAllArtists() {
    return await this.artistRepository.find();
  }

  async getArtistById(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (artist) return artist;
    return null;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.artistRepository.findOneBy({ id });
    Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(artist);
  }

  async removeArtist(id: string) {
    const tracks = await this.trackRepository.find({
      where: { artistId: id },
    });
    for (const track of tracks) {
      track.artistId = null;
    }
    await this.trackRepository.save(tracks);

    const albums = await this.albumRepository.find({
      where: { artistId: id },
    });
    for (const album of albums) {
      album.artistId = null;
    }
    await this.albumRepository.save(albums);

    await this.artistRepository.delete({ id });
  }

  async addAlbum(createAlbumDto: CreateAlbumDto) {
    const album = this.albumRepository.create(createAlbumDto);
    return await this.albumRepository.save(album);
  }

  async getAllAlbums() {
    return await this.albumRepository.find();
  }

  async getAlbumById(id: string) {
    const artist = await this.albumRepository.findOneBy({ id });
    if (artist) return artist;
    return null;
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.albumRepository.findOneBy({ id });
    Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(album);
  }

  async removeAlbum(id: string) {
    const tracks = await this.trackRepository.find({
      where: { albumId: id },
    });
    for (const track of tracks) {
      track.albumId = null;
    }
    await this.trackRepository.save(tracks);
    await this.albumRepository.delete({ id });
  }

  async addTrack(createTrackDto: CreateTrackDto) {
    const track = this.trackRepository.create(createTrackDto);
    return await this.trackRepository.save(track);
  }

  async getAllTracks() {
    return await this.trackRepository.find();
  }

  async getTrackById(id: string) {
    const track = this.trackRepository.findOneBy({ id });
    if (track) return track;
    return null;
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.trackRepository.findOneBy({ id });
    Object.assign(track, updateTrackDto);
    return await this.trackRepository.save(track);
  }

  removeTrack(id: string) {
    this.trackRepository.delete({ id });
  }
}
