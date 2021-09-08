import { FollowEntity } from "./../profile/follow.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserEntity } from "./../user/user.entity"
import { ArticleEntity } from "./article.entity"

import { ArticleService } from "./article.service"
import { ArticleController } from "./article.controller"

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule {}
