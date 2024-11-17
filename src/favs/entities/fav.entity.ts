import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('fav')
export class Fav {
  @PrimaryColumn()
  id: string;

  @Column('simple-array')
  artists: string[];

  @Column('simple-array')
  albums: string[];

  @Column('simple-array')
  tracks: string[];
}
