import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.album) artist: Artist;
  @OneToMany(() => Track, (track) => track.album) track: Album;
}
