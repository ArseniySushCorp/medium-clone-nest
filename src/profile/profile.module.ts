import { FollowEntity } from "./follow.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProfileService } from "./profile.service"
import { Module } from "@nestjs/common"
import { ProfileController } from "./profile.controller"
import { UserEntity } from "@app/user/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
