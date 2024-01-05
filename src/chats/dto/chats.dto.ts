import { IsNumber, IsString } from 'class-validator';



export class ChatDto {
  @IsString()
  body: string;

  @IsNumber()
  community_id: number

}

