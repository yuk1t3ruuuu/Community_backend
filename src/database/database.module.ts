import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "src/entity/user.entity";
import { Community } from "src/entity/community.entity";
import { UserCommunity } from "src/entity/user_community.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [".env"],
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        database: configService.get("POSTGRES_DB"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        entities: [User,Community,UserCommunity],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}