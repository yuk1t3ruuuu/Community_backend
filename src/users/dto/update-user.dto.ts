import { IsString,IsOptional } from 'class-validator';

export class UpdateUserDto {

    @IsOptional() 
    @IsString()
    firstName?: string;
  
    @IsOptional() 
    @IsString()
    description?: string; 
  
    @IsOptional() 
    @IsString()
    image?: string; 
  }