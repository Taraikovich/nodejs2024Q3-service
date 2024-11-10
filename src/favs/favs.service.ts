import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class FavsService {
  constructor(private storage: StorageService) {}

  findAll() {
    return this.storage.getFavs();
  }

  create(rout: 'track' | 'album' | 'artist', id: string) {
    if (!['track', 'album', 'artist'].includes(rout)) {
      throw new BadRequestException();
    }

    const exists = this.storage.existsFav(rout, id);

    if (!exists) {
      throw new UnprocessableEntityException(`No ${rout} found with id ${id}`);
    }

    this.storage.addToFavs(rout, id);

    return { message: `${rout} with id ${id} has been added to favorites.` };
  }

  remove(rout: 'track' | 'album' | 'artist', id: string) {
    if (!['track', 'album', 'artist'].includes(rout)) {
      throw new BadRequestException();
    }

    const exists = this.storage.existsInFav(rout, id);

    if (!exists) {
      throw new NotFoundException(`Favorite ${rout} with id ${id} not found.`);
    }

    this.storage.removeFromFavs(rout, id);
  }
}
