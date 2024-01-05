import { IsNumber, IsString } from 'class-validator';


export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsNumber()
  community_id: number
}

