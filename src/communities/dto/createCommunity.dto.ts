import { IsString } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsString()
  user_id: number;
}

