import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    UsePipes,
    ValidationPipe,
    Param,
  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entity/user.entity';

type PasswordOmitUser = Omit<User, "password">


  @Controller('users')
  @UsePipes(new ValidationPipe({ transform: true }))
  export class UsersController {
    constructor(
      private readonly service: UsersService,
      private readonly authservice: AuthService,
      ) {}
  
    @Get()
    getUsers() {
      return this.service.findAll();
    }
  

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto,) {
      const user =  await this.authservice.siginup(body.firstName, body.lastName,body.email, body.password, body.description, body.image, body.gender);
      return user;
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        return this.service.remove(id);
    }

    /** 
    @Patch(":id")
    update(@Param("id") id: number, @Body() CreateUserDto: CreateUserDto){
        const {firstName, lastName} = CreateUserDto;
        return this.service.update(id, {firstName, lastName});
    }
    */
    
  }
  