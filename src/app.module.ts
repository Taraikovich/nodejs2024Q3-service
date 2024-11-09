import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [UserModule, ArtistModule, AlbumModule, TrackModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
