import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class TrackService {
  constructor(private storage: StorageService) {}

  create(createTrackDto: CreateTrackDto) {
    return this.storage.addTrack(createTrackDto);
  }

  findAll() {
    return this.storage.getAllTracks();
  }

  findOne(id: string) {
    const track = this.storage.getTrackById(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    this.findOne(id);
    return this.storage.updateTrack(id, updateTrackDto);
  }

  remove(id: string) {
    this.findOne(id);
    this.storage.removeTrack(id);
  }
}
