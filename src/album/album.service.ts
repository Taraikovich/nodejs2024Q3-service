import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AlbumService {
  constructor(private storage: StorageService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return this.storage.addAlbum(createAlbumDto);
  }

  findAll() {
    return this.storage.getAllAlbums();
  }

  findOne(id: string) {
    const album = this.storage.getAlbumById(id);
    if (!album) throw new NotFoundException();
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    this.findOne(id);
    return this.storage.updateAlbum(id, updateAlbumDto);
  }

  remove(id: string) {
    this.findOne(id);
    this.storage.removeAlbum(id);
  }
}
