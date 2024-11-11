import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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

@Injectable()
export class StorageService {
  private users: User[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];
  private favs: Fav = {
    artists: [],
    albums: [],
    tracks: [],
  };

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
    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    this.albums.forEach((albums) => {
      if (albums.artistId === id) {
        albums.artistId = null;
      }
    });
  }

  addAlbum(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;

    const album: Album = {
      id: randomUUID(),
      name,
      year,
      artistId,
    };

    this.albums.push(album);

    return album;
  }

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string) {
    return this.albums.find((user) => user.id === id);
  }

  updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.getAlbumById(id);
    album.name = updateAlbumDto.name ?? album.name;
    album.year = updateAlbumDto.year ?? album.year;
    album.artistId = updateAlbumDto.artistId ?? album.artistId;

    return album;
  }

  removeAlbum(id: string) {
    this.albums = this.albums.filter((album) => album.id !== id);
    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }

  addTrack(createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;

    const track: Track = {
      id: randomUUID(),
      name,
      artistId,
      albumId,
      duration,
    };

    this.tracks.push(track);

    return track;
  }

  getAllTracks() {
    return this.tracks;
  }

  getTrackById(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.getTrackById(id);
    track.name = updateTrackDto.name ?? track.name;
    track.artistId = updateTrackDto.artistId ?? track.artistId;
    track.albumId = updateTrackDto.albumId ?? track.albumId;
    track.duration = updateTrackDto.duration ?? track.duration;

    return track;
  }

  removeTrack(id: string) {
    this.tracks = this.tracks.filter((track) => track.id !== id);
  }

  getFavs() {
    return {
      artists: this.favs.artists
        .map((artistId) =>
          this.artists.find((artist) => artist.id === artistId),
        )
        .filter((artist) => artist !== null && artist !== undefined),
      albums: this.favs.albums
        .map((albumId) => this.albums.find((album) => album.id === albumId))
        .filter((album) => album !== null && album !== undefined),
      tracks: this.favs.tracks
        .map((trackId) => this.tracks.find((track) => track.id === trackId))
        .filter((track) => track !== null && track !== undefined),
    };
  }

  existsFav(rout: 'track' | 'album' | 'artist', id: string) {
    const existsInData =
      (rout === 'track' && this.tracks.some((track) => track.id === id)) ||
      (rout === 'album' && this.albums.some((album) => album.id === id)) ||
      (rout === 'artist' && this.artists.some((artist) => artist.id === id));

    return existsInData;
  }

  existsInFav(rout: 'track' | 'album' | 'artist', id: string) {
    if (rout === 'track') return this.favs.tracks.includes(id);
    if (rout === 'album') return this.favs.albums.includes(id);
    if (rout === 'artist') return this.favs.artists.includes(id);
    return false;
  }

  addToFavs(rout: 'track' | 'album' | 'artist', id: string) {
    if (rout === 'track') {
      this.favs.tracks.push(id);
    }
    if (rout === 'album') {
      this.favs.albums.push(id);
    }
    if (rout === 'artist') {
      this.favs.artists.push(id);
    }
  }

  removeFromFavs(rout: 'track' | 'album' | 'artist', id: string) {
    if (rout === 'track') {
      this.favs.tracks = this.favs.tracks.filter((trackId) => trackId !== id);
    }
    if (rout === 'album') {
      this.favs.albums = this.favs.albums.filter((albumId) => albumId !== id);
    }
    if (rout === 'artist') {
      this.favs.artists = this.favs.artists.filter(
        (artistId) => artistId !== id,
      );
    }
  }
}
