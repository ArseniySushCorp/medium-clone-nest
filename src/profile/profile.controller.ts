import { ProfileResponse } from "./types/ProfileResponse.interface"
import { ProfileService } from "./profile.service"
import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@app/user/guards/auth.guard"
import { User } from "@app/user/decorators/user.decorator"

@Controller("profiles")
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get(":username")
  @UseGuards(AuthGuard)
  async getProfile(@Param("username") username: string): Promise<ProfileResponse> {
    const profile = await this.service.findProfile(username)

    return this.service.buildResponse(profile)
  }

  @Post(":username/follow")
  @UseGuards(AuthGuard)
  async followProfile(
    @User("id") currentUserID: number,
    @Param("username") username: string
  ): Promise<ProfileResponse> {
    const profile = await this.service.followProfile(username, currentUserID)

    return this.service.buildResponse(profile)
  }
}
