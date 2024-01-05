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
    UseGuards,
    Request,
    HttpException
  } from '@nestjs/common';
import {InternarException} from "src/error"
import { ChatDto } from './dto/chats.dto';
import { ChatsService } from './chats.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { number } from 'joi';

type PasswordOmitUser = Omit<User, "password">

@Controller('chats')
  @UseGuards(AuthGuard('jwt'))
export class ChatsController {
  constructor(
    private readonly chatservice: ChatsService,
    private readonly userService: UsersService
  ){}


  @Post('/create')
    async createChat(@Body() body: ChatDto, @Request() req: {user: PasswordOmitUser}){
      const user = await this.userService.findOne(req.user.id);
      await this.chatservice.createChat({
        body: body.body,
        user: user,
        community_id:body.community_id
      }).catch(e => {
        throw new InternarException(e.message)
      })
    }

  @Get(':community_id')
    async getChats(@Param('community_id') community_id: number ){
      return this.chatservice.findChats({community_id})
    }

}