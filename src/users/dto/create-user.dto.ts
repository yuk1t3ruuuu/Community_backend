import { IsString } from 'class-validator';
import { Gender } from 'src/entity/user.entity';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  gender: Gender

}

