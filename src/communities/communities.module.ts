import { Module } from '@nestjs/common';
import { Community } from 'src/entity/community.entity';
import { UserCommunity } from 'src/entity/user_community.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';


@Module({
 imports: [TypeOrmModule.forFeature([Community]), TypeOrmModule.forFeature([UserCommunity]), TypeOrmModule.forFeature([User]), ],
 controllers: [CommunitiesController],
 providers: [CommunitiesService, CommunitiesController, UsersService], 
 exports: [CommunitiesController, CommunitiesService]

})
export class CommunitiesModule {}
