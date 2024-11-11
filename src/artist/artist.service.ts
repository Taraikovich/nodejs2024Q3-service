import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class ArtistService {
  constructor(private storage: StorageService) {}

  create(createArtistDto: CreateArtistDto) {
    return this.storage.addArtist(createArtistDto);
  }

  findAll() {
    return this.storage.getAllArtists();
  }

  findOne(id: string) {
    const artist = this.storage.getArtistById(id);
    if (!artist) throw new NotFoundException();
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    this.findOne(id);
    return this.storage.updateArtist(id, updateArtistDto);
  }

  remove(id: string) {
    this.findOne(id);
    this.storage.removeArtist(id);
  }
}
