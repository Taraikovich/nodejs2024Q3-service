import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column({ select: false })
  password: string;

  @VersionColumn()
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;
}
