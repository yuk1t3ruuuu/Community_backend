import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { Community } from 'src/entity/community.entity';
import { User } from 'src/entity/user.entity';
import { UserCommunity } from 'src/entity/user_community.entity';
import { Repository, Equal } from 'typeorm';


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
        return newCommunity;
    }catch(error){
        return null;
    }
  }


  async createUserCommunity({community_id, user}:{community_id: number, user: User}){
    const newUserCommunity = new UserCommunity();
    const community = await this.communitiesRepository.findOne({where:{id:community_id}})
    newUserCommunity.community = community;
    newUserCommunity.user = user;

    console.log(newUserCommunity.community);
    if(!newUserCommunity.community){
      console.log("jjjj")
      throw new Error("コミニティーが見つかりませんでした")
    }
    try{
      await this.useresCommunitiesRepository.insert(newUserCommunity);
      return newUserCommunity.id
    }catch(error){
      throw new Error("コミニティーに参加することができませんでした。時間を空けてお試しください")
    }
  }


  async communityList() {

    const communities = await this.communitiesRepository.find();
    console.log(`コミュニティ一覧 ${communities}`)
  
  
    const result = communities.map(async community => {
  
      const userCount = await this.useresCommunitiesRepository.count({ 
        where: {
          community: Equal(community.id)
        }
      });
  
      return {
        ...community, 
        userCount 
      };
  
    });

    console.log(`result${result}`)
  
  
  
    const communitiesWithUserCount = await Promise.all(result);
  
  
  
    communitiesWithUserCount.sort((a, b) => {
      return b.userCount - a.userCount; 
    });
  
  
    console.log(`ソート後の配列${communitiesWithUserCount}`)
    
    return communitiesWithUserCount;

    
  
  }
}
