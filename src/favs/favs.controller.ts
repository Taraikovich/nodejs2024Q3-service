import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post(':rout/:id')
  create(
    @Param('rout') rout: 'track' | 'album' | 'artist',
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.favsService.create(rout, id);
  }

  @Delete(':rout/:id')
  @HttpCode(204)
  remove(
    @Param('rout') rout: 'track' | 'album' | 'artist',
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.favsService.remove(rout, id);
  }
}
