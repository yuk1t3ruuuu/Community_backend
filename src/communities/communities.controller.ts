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
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entity/user.entity';
import { Community } from 'src/entity/community.entity';

type PasswordOmitUser = Omit<User, "password">

@Controller('communities')
  @UseGuards(AuthGuard('jwt'))
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

  @Get('/list')  
    getCommunityList(){
      return this.communityservice.communityList();
    }

 
  @Post('/create')
    async createCommuinty(@Body() body: CreateCommunityDto, @Request() req: {user: PasswordOmitUser } ){
      const community = await this.communityservice.createCommunity({
        name: body.name,
        description: body.description,
        image: body.image
      });

      const user = await this.userService.findOne(req.user.id);

      
  
      if(community !== null){
        await this.communityservice.createUserCommunity({
          community_id: community.id, 
          user: user
        });
        return community;
      }else{
        return null
      }
    }


    @Post('/follow')
      async addUserCommunity(@Body() body:CreateCommunityDto, @Request() req: {user: PasswordOmitUser }){
        const user = await this.userService.findOne(req.user.id);
        console.log('コントローラー')
        console.log(body.community_id);
        await this.communityservice.createUserCommunity({
          community_id:body.community_id,
          user:user
        }).catch(e => {
          throw new InternarException(e.message);
        })
      }




  // @UseGuards(AuthGuard('jwt'))  //jwtでのログインをチェック
  // @Post('/create')
  //   async createCommuinty(@Body() body: CreateCommunityDto, @Request() req: { user: PasswordOmitUser } ){ 
  //     const communityId = await this.communityservice.createCommunity({
  //       name: body.name,
  //       description: body.description,
  //       image: body.image
  //     });

  //     console.log('user情報');
  //     console.log(req.user);
  //     const user = await this.userService.findOne(body.user_id);

      
  
  //     if(communityId !== null){
  //       await this.communityservice.createUserCommunity(communityId, user);
  //       console.log('コミュニティとuserCommunityテーブル作成成功') //後で消す
  //       return communityId;
  //     }else{
  //       console.log('コミュニティとuserCommunityテーブル作成失敗')//後で消す
  //       return null
  //     }
  //   }
}
