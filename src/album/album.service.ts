import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AlbumService {
  constructor(private database: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return this.database.addAlbum(createAlbumDto);
  }

  findAll() {
    return this.database.getAllAlbums();
  }

  async findOne(id: string) {
    const album = await this.database.getAlbumById(id);
    if (!album) throw new NotFoundException();
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    await this.findOne(id);
    return this.database.updateAlbum(id, updateAlbumDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.database.removeAlbum(id);
  }
}
