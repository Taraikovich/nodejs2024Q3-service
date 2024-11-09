import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  artistId: string | null;

  @IsOptional()
  @IsUUID()
  albumId: string | null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
