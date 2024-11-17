import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StorageService } from 'src/storage/storage.service';
import { DatabaseService } from 'src/database/databse.service';

@Injectable()
export class TrackService {
  constructor(
    private storage: StorageService,
    private database: DatabaseService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    return this.database.addTrack(createTrackDto);
  }

  findAll() {
    return this.database.getAllTracks();
  }

  async findOne(id: string) {
    const track = await this.database.getTrackById(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    await this.findOne(id);
    return await this.database.updateTrack(id, updateTrackDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.database.removeTrack(id);
  }
}
