import { IsNumber, IsString } from 'class-validator';
import { Community } from 'src/entity/community.entity';

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

