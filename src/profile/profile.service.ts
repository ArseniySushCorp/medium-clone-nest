import { FollowEntity } from "./follow.entity"
import { ProfileType } from "./types/Profile.type"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { Repository } from "typeorm"
import { UserEntity } from "@app/user/user.entity"
import { UserType } from "@app/user/types/User.type"
import { ProfileResponse } from "./types/profileResponse.interface"
import { pick } from "ramda"

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepo: Repository<FollowEntity>
  ) {}

  async findProfile(username: string): Promise<ProfileType> {
    const user = await this.userRepo.findOne({ username })

    if (!user) throw new HttpException("Profile does not exist", HttpStatus.NOT_FOUND)

    return { ...user, following: false }
  }

  async followProfile(username: string, currentUserId: number): Promise<ProfileType> {
    const profile = await this.findProfile(username)

    if (currentUserId === profile.id) {
      throw new HttpException("Follower and following cont be equal", HttpStatus.BAD_REQUEST)
    }

    const follow = await this.followRepo.findOne({
      followerId: currentUserId,
      followingId: profile.id
    })

    if (!follow) {
      const followToCreate = new FollowEntity()
      followToCreate.followerId = currentUserId
      followToCreate.followingId = profile.id

      this.followRepo.save(followToCreate)
    }

    profile.following = true

    return profile
  }

  buildResponse(profile: ProfileType): ProfileResponse {
    const responseProfile = pick(["id", "username", "bio", "image", "following"], profile)
    return { profile: responseProfile }
  }
}
