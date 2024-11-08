import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { StorageService } from 'src/storage/storage.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, StorageService],
})
export class ArtistModule {}
