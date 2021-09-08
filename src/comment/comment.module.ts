import { ArticleEntity } from "./../article/article.entity"
import { CommentEntity } from "@app/comment/comment.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CommentController } from "./comment.controller"
import { CommentService } from "./comment.service"
import { UserEntity } from "@app/user/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, ArticleEntity, UserEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
