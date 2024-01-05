import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { Community } from 'src/entity/community.entity';
import { User } from 'src/entity/user.entity';
import { UserCommunity } from 'src/entity/user_community.entity';
import { Repository, Equal, QueryFailedError } from 'typeorm';


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

 

  findUserCommunityAll(): Promise<UserCommunity[]> {
    return this.useresCommunitiesRepository.find();
  }

  async findCommunity(community_id: Community['id']){
    try{
      return this.communitiesRepository.findOne({where: {id: community_id}});
    }catch{
      throw new Error("コミュニティ情報の取得に失敗しました")
    }
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

    const communitiesWithUserCount = await this.communitiesRepository
      .createQueryBuilder("community")
      .leftJoinAndSelect("user_community", "uc", "uc.communityId = community.id")
      .select("community.*") // Select all fields from community
      .addGroupBy("community.id") // Group by community id to aggregate the user counts
      .addSelect("COUNT(uc.userId)", "user_count") // Add a count of users in each community with an explicit alias
      .orderBy("user_count", "DESC") // Use the exact alias in the ORDER BY clause
      .getRawMany();

  
    console.log(`ソート後の配列${communitiesWithUserCount}`)
    
    return communitiesWithUserCount;

  }



  async removeCommunity(community_id: number) {

    try {
  
      await this.useresCommunitiesRepository
        .createQueryBuilder()
        .delete()
        .from(UserCommunity) 
        .where("communityId = :communityId", { communityId: community_id})
        .execute();

      await this.communitiesRepository
        .createQueryBuilder()
        .delete()
        .from(Community)
        .where("id = :id", { id: community_id})
        .execute();
  
    } catch (error) {
      
      if (error instanceof QueryFailedError) {
        throw new Error("DBエラー: " + error.message); 
      }

      throw new Error("予期せぬエラー");
  
    }
  
  }

  
  async getCommunityMembers(community_id: number) {

    try{
      const members = await this.useresCommunitiesRepository.createQueryBuilder('cu')
      .leftJoinAndSelect('cu.user', 'user')
      .where('cu.communityId = :communityId',{ communityId: community_id })
      .select([
        'user.id AS userId',
        'user.firstName', 
        'user.image'
      ])
      .getRawMany();
    
      return members;

    }catch(error){
        throw new Error("予期せぬエラー")
    }
    
  }


  async updateCommunity(id:number, update:{
    image?:string;
    name?:string;
    description?:string;
  }){
    try{
      await this.communitiesRepository.update(
        id,{
          image:update.image,
          name:update.name,
          description:update.description
        }
      )
    }catch(error){
      throw new Error("更新に失敗しました")
    }
  }


}
