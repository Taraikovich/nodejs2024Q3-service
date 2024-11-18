import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavsService {
  constructor(private database: DatabaseService) {}

  async findAll() {
    return await this.database.getFavs();
  }

  async create(rout: 'track' | 'album' | 'artist', id: string) {
    if (!['track', 'album', 'artist'].includes(rout)) {
      throw new BadRequestException();
    }

    const exists = await this.database.existsFav(rout, id);

    if (!exists) {
      throw new UnprocessableEntityException(`No ${rout} found with id ${id}`);
    }

    await this.database.addToFavs(rout, id);

    return { message: `${rout} with id ${id} has been added to favorites.` };
  }

  async remove(rout: 'track' | 'album' | 'artist', id: string) {
    if (!['track', 'album', 'artist'].includes(rout)) {
      throw new BadRequestException();
    }

    const exists = await this.database.existsInFav(rout, id);

    if (!exists) {
      throw new NotFoundException(`Favorite ${rout} with id ${id} not found.`);
    }

    await this.database.removeFromFavs(rout, id);
  }
}
