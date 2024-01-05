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
    HttpException,
    Put
  } from '@nestjs/common';
import {InternarException} from "src/error"
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/createCommunity.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entity/user.entity';
import { UpdateCommunityDto } from './dto/updateCommunity.dto';

type PasswordOmitUser = Omit<User, "password">

@Controller('communities')
  @UsePipes(new ValidationPipe({ transform: true }))
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

  @Get('/communityProfile/:community_id')
    getCommunityProfile(@Param('community_id') community_id: number){
      return this.communityservice.findCommunity(community_id)
      .catch(e => {
        throw new InternarException(e.message)
      })
    }

  @Get('/usercommunity')
    getUserCommunity(){
        return this.communityservice.findUserCommunityAll();
    }

  @Get('/list')  
    getCommunityList(){
      return this.communityservice.communityList();
    }

 
  @Post('/create')
    async createCommuinty(@Body() body: CreateCommunityDto, @Request() req: {user: { userId: number } } ){
      const community = await this.communityservice.createCommunity({
        name: body.name,
        description: body.description,
        image: body.image
      });

      const user = await this.userService.findOne(req.user.userId);

      
  
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
      async addUserCommunity(@Body() body:CreateCommunityDto, @Request() req: {user: { userId: number } }){
        const user = await this.userService.findOne(req.user.userId);
        await this.communityservice.createUserCommunity({
          community_id:body.community_id,
          user:user
        }).catch(e => {
          throw new InternarException(e.message);
        })
      }

    
    @Delete('/delete/:community_id')  
    async removeCommunity(@Param('community_id') community_id: number){
      return await this.communityservice.removeCommunity(community_id)
      .catch(e => {
        throw new InternarException(e.message)
      })
    }


    @Get('/member/:community_id')
    async getMembers(@Param('community_id') community_id: number){
      return this.communityservice.getCommunityMembers(community_id)
      .catch(e =>{
        throw new InternarException(e.message)
      })
    }

    @Put('/update/:community_id')
    async updateCommunity(@Param('community_id') community_id: number, @Body() dto: UpdateCommunityDto){
      await this.communityservice.updateCommunity(community_id, dto)
      .catch(e => {
        throw new InternarException(e.message)
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
