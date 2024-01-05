import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Chat } from 'src/entity/chat.entity';
import { Community } from 'src/entity/community.entity';
import { User } from 'src/entity/user.entity';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]),TypeOrmModule.forFeature([Community]),
            TypeOrmModule.forFeature([User])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsController, UsersService],
  exports: [ChatsController, ChatsService]        





})
export class ChatsModule {}
