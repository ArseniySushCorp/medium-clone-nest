import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppController } from "@app/app.controller"
import { AppService } from "@app/app.service"
import { TagModule } from "@app/tag/tag.module"
import { UserModule } from "@app/user/user.module"
import { configService } from "./config.service"

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), TagModule, UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
