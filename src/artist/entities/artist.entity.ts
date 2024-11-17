import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  grammy: boolean;
}

