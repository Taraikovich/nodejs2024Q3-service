import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist) album: Album;
  @OneToMany(() => Album, (track) => track.artist) track: Track;
}
