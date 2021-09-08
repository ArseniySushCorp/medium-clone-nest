import { ProfileModule } from "./profile/profile.module"
import { ArticleModule } from "./article/article.module"
import { AuthMiddleware } from "./user/middleware/auth.middleware"
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import ormconfig from "@app/ormconfig"
import { AppController } from "@app/app.controller"
import { AppService } from "@app/app.service"
import { TagModule } from "@app/tag/tag.module"
import { UserModule } from "@app/user/user.module"

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
    ProfileModule
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
