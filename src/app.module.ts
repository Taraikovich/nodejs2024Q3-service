import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StorageService } from './storage/storage.service';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, StorageService],
})
export class AppModule {}
