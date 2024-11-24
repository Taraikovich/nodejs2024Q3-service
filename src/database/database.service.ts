import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { Album } from 'src/album/entities/album.entity';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { Artist } from 'src/artist/entities/artist.entity';
import { Fav } from 'src/favs/entities/fav.entity';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { Track } from 'src/track/entities/track.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService {
  private userRepository: Repository<User>;
  private artistRepository: Repository<Artist>;
  private albumRepository: Repository<Album>;
  private trackRepository: Repository<Track>;
  private favsRepository: Repository<Fav>;
  private saltRounds: number;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.artistRepository = this.dataSource.getRepository(Artist);
    this.albumRepository = this.dataSource.getRepository(Album);
    this.trackRepository = this.dataSource.getRepository(Track);
    this.favsRepository = this.dataSource.getRepository(Fav);
    this.saltRounds = parseInt(process.env.BCRYPT_SALT || '10');
  }

  async addUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      login: createUserDto.login,
      password: await bcrypt.hash(createUserDto.password, this.saltRounds),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser;

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
    user.password = await bcrypt.hash(
      updatePasswordDto.newPassword,
      this.saltRounds,
    );
    user.createdAt = Number(user.createdAt);
    user.updatedAt = Date.now();
    await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

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
    await this.trackRepository.update({ artistId: id }, { artistId: null });
    await this.albumRepository.update({ artistId: id }, { artistId: null });
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
    await this.trackRepository.update({ albumId: id }, { albumId: null });
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

  async getFavs() {
    const [favs] = await this.favsRepository.find();
    if (!favs) {
      return { artists: [], albums: [], tracks: [] };
    }

    const artists = await Promise.all(
      favs.artists.map((artistId) =>
        this.artistRepository.findOneBy({ id: artistId }),
      ),
    );

    const albums = await Promise.all(
      favs.albums.map((albumId) =>
        this.albumRepository.findOneBy({ id: albumId }),
      ),
    );

    const tracks = await Promise.all(
      favs.tracks.map((trackId) =>
        this.trackRepository.findOneBy({ id: trackId }),
      ),
    );

    return {
      artists: artists.filter((artist) => artist),
      albums: albums.filter((album) => album),
      tracks: tracks.filter((track) => track),
    };
  }

  async existsFav(rout: 'artist' | 'album' | 'track', id: string) {
    const existsInData =
      (rout === 'track' && (await this.trackRepository.findOneBy({ id }))) ||
      (rout === 'album' && (await this.albumRepository.findOneBy({ id }))) ||
      (rout === 'artist' && (await this.artistRepository.findOneBy({ id })));

    return existsInData;
  }

  async existsInFav(rout: 'track' | 'album' | 'artist', id: string) {
    const [fav] = await this.favsRepository.find();
    return fav[rout + 's'].includes(id);
  }

  async addToFavs(rout: 'artist' | 'album' | 'track', id: string) {
    let [fav] = await this.favsRepository.find();

    if (!fav) {
      fav = this.favsRepository.create({
        id: 'favs',
        artists: rout === 'artist' ? [id] : [],
        albums: rout === 'album' ? [id] : [],
        tracks: rout === 'track' ? [id] : [],
      });
    } else if (!fav[rout + 's'].includes(id)) {
      fav[rout + 's'].push(id);
    }

    await this.favsRepository.save(fav);
  }

  async removeFromFavs(rout: 'artist' | 'album' | 'track', id: string) {
    const [fav] = await this.favsRepository.find();

    if (fav && fav[`${rout}s`]) {
      fav[`${rout}s`] = fav[`${rout}s`].filter((itemId) => itemId !== id);

      await this.favsRepository.save(fav);
    }
  }
}
