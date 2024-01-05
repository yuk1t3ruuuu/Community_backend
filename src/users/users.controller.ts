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
    Put,
    Request,
    UseGuards,
  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {InternarException} from "src/error"
import {UpdateUserDto} from "src/users/dto/update-user.dto"

type PasswordOmitUser = Omit<User, "password">


  @Controller('users')
  @UseGuards(AuthGuard('jwt'))
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

    @Get('/profile')
    async getUserProfile(@Request() req: {user: { userId: number } }){
      const userProfile = await this.service.findOne(req.user.userId)
      .catch(e =>{
        throw new InternarException(e.message)
      })
      return userProfile
    }
  

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
      const user =  await this.authservice.siginup(body.firstName, body.lastName,body.email, body.password, body.description, body.image, body.gender);
      return user;
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        return this.service.remove(id);
    }


   @Put('/update')
   async updateUser(@Body() dto: UpdateUserDto, @Request() req: {user: { userId: number } }){
    await this.service.updateUser(req.user.userId, dto)
    .catch(e =>{
      throw new InternarException(e.message)
    })
   }


    /** 
    @Patch(":id")
    update(@Param("id") id: number, @Body() CreateUserDto: CreateUserDto){
        const {firstName, lastName} = CreateUserDto;
        return this.service.update(id, {firstName, lastName});
    }
    */
    
  }
  