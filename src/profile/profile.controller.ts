import { ProfileResponse } from "./types/ProfileResponse.interface"
import { ProfileService } from "./profile.service"
import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@app/user/guards/auth.guard"

@Controller("profiles")
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get(":username")
  @UseGuards(AuthGuard)
  async getProfile(@Param("username") username: string): Promise<ProfileResponse> {
    const profile = await this.service.findProfile(username)

    return this.service.buildResponse(profile)
  }
}
