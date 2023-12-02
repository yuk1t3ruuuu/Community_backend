import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CommunitiesService } from './communities/communities.service';
import { CommunitiesController } from './communities/communities.controller';
import { CommunitiesModule } from './communities/communities.module';
import { Community } from './entity/community.entity';
import { UserCommunity } from './entity/user_community.entity';

@Module({
  imports: [ AuthModule, UsersModule, DatabaseModule,TypeOrmModule.forFeature([User]),
             DatabaseModule,TypeOrmModule.forFeature([Community]),
             DatabaseModule,TypeOrmModule.forFeature([UserCommunity]),
             ConfigModule.forRoot({ 
               isGlobal: true,
             }),
              AuthModule,
              CommunitiesModule,
            ],
  controllers: [ AppController, CommunitiesController,], 
  providers: [UsersService, AppService, AuthService,JwtService, CommunitiesService],

})
export class AppModule {}
