import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { LoggerMiddleware } from './logger-midddleware/logger-midddleware.middleware';
import { MyExceptionFilter } from './my-exception-filter/my-exception-filter.filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MyLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    DatabaseModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: MyExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
