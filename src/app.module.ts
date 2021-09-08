import { AuthMiddleware } from "./user/middleware/auth.middleware"
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common"
import ormconfig from "@app/ormconfig"
import { AppController } from "@app/app.controller"

import { TypeOrmModule } from "@nestjs/typeorm"
import { AppService } from "@app/app.service"
import { TagModule } from "@app/tag/tag.module"
import { UserModule } from "@app/user/user.module"
import { CommentModule } from "./comment/comment.module"
import { ProfileModule } from "./profile/profile.module"
import { ArticleModule } from "./article/article.module"

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL
    })
  }
}
