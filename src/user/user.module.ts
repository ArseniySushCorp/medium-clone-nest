import { AuthGuard } from "./guards/auth.guard"
import { UserEntity } from "./user.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Module } from "@nestjs/common"

import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService]
})
export class UserModule {}
