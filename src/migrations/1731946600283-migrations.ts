import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1731946600283 implements MigrationInterface {
  name = 'Migrations1731946600283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fav" ("id" character varying NOT NULL, "artists" text array NOT NULL, "albums" text array NOT NULL, "tracks" text array NOT NULL, CONSTRAINT "PK_5b599fa3e2db35e989237949af5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "artistId" uuid, "albumId" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "fav"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
