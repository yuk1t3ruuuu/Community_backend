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
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { UsersService } from 'src/users/users.service';

@Controller('communities')
export class CommunitiesController {
  constructor(
    private readonly communityservice: CommunitiesService,
    private readonly userService: UsersService
    ){}

  @Get()
    getCommunity() {
      return this.communityservice.findCommunityAll();
  }

  // //中間テーブル(user_community)見る用
  @Get('/usercommunity')
    getUserCommunity(){
        return this.communityservice.findUserCommunityAll();
    }

  @Post('/create')
    async createCommuinty(@Body() body: CreateCommunityDto ){
      const communityId = await this.communityservice.createCommunity({
        name: body.name,
        description: body.description,
        image: body.image
      });
      const user = await this.userService.findOne(body.user_id);
  
      if(communityId !== null){
        await this.communityservice.createUserCommunity(communityId, user);
        console.log('コミュニティとuserCommunityテーブル作成成功') //後で消す
        return communityId;
      }else{
        console.log('コミュニティとuserCommunityテーブル作成失敗')//後で消す
        return null
      }
    }
}
