import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
  constructor(private database: DatabaseService) {}

  create(createArtistDto: CreateArtistDto) {
    return this.database.addArtist(createArtistDto);
  }

  findAll() {
    return this.database.getAllArtists();
  }

  async findOne(id: string) {
    const artist = await this.database.getArtistById(id);
    if (!artist) throw new NotFoundException();
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    await this.findOne(id);
    return await this.database.updateArtist(id, updateArtistDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.database.removeArtist(id);
  }
}
