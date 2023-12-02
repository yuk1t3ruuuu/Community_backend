import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/entity/community.entity';
import { User } from 'src/entity/user.entity';
import { UserCommunity } from 'src/entity/user_community.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communitiesRepository: Repository<Community>,

    @InjectRepository(UserCommunity)
    private readonly useresCommunitiesRepository: Repository<UserCommunity>,
  ){}

  findCommunityAll(): Promise<Community[]> { 
    return this.communitiesRepository.find();
  }

  //中間テーブル(user_community)見る用
  findUserCommunityAll(): Promise<UserCommunity[]> {
    return this.useresCommunitiesRepository.find();
  }

  async createCommunity({name, description,image}:{name: string, description:string, image: string}){
    const newCommunity = new Community();
    newCommunity.name = name;
    newCommunity.description = description;
    newCommunity.image = image;

    try{
        await this.communitiesRepository.insert(newCommunity);
        console.log('コミュニティ作成成功');  //後で消す
        console.log(newCommunity);
        return newCommunity;
    }catch(error){
        console.log('コミュニティ作成失敗');  //後で消す
        return null;
    }
  }


  async createUserCommunity(community: Community, user: User){
    const newUserCommunity = new UserCommunity();
    newUserCommunity.community = community;
    newUserCommunity.user = user;

    try{
      await this.useresCommunitiesRepository.insert(newUserCommunity);
      console.log(newUserCommunity.community);
      console.log(newUserCommunity.user);
      console.log('userCommunityテーブル作成成功');  //後で消す
      return newUserCommunity.id
    }catch(error){
      console.log('userCommunityテーブル作成失敗');  //後で消す
      return null;
    }
  }




}
