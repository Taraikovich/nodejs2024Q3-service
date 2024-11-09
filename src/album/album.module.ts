import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, StorageService],
})
export class AlbumModule {}
