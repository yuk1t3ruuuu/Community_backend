import { Injectable } from '@nestjs/common';
import { InjectRepository, getRepositoryToken,  } from '@nestjs/typeorm';
import { Repository, Equal, FindOptionsOrder } from 'typeorm';
import { Community } from 'src/entity/community.entity';
import { Chat } from 'src/entity/chat.entity';
import { User } from 'src/entity/user.entity';


@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Community)
    private readonly communitiesRepository: Repository<Community>
  ){}


  async createChat({body, user, community_id}:{body:string, user:User, community_id:number}){
    const newChat = new Chat();
    const community = await this.communitiesRepository.findOne({where:{id:community_id}})
    newChat.body = body;
    newChat.user = user;
    newChat.community = community;

    try{
        console.log(newChat)
        await this.chatRepository.insert(newChat);
        return newChat;
    }catch(error){
        throw new Error("メッセージの送信に失敗しました");
    }
  }

  async findChats({community_id}:{community_id: number}){
    return await this.chatRepository.createQueryBuilder("chat")
    .where("chat.communityId = :id", { id: community_id })
    .orderBy("chat.createdAt", "DESC")
    .getMany();
  }

}