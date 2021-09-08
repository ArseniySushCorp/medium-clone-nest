import { UpdateUserDTO } from "./dto/updateUser.dto"
import { AuthGuard } from "./guards/auth.guard"
import { UserEntity } from "./user.entity"
import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes } from "@nestjs/common"

import { UserService } from "./user.service"
import { UserResponseInterface } from "./types/UserResponse.interface"

import { CreateUserDTO } from "./dto/createUser.dto"
import { LoginUserDTO } from "./dto/loginUser.dto"
import { ExpressRequestInterface } from "@app/types/expressRequest.interface"
import { User } from "./decorators/user.decorator"
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user")
  @UseGuards(AuthGuard)
  async currentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user)
  }

  @Put("user")
  @UseGuards(AuthGuard)
  async updateUser(
    @Body("user") updateUserDTO: UpdateUserDTO,
    @User("id") id: number
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(updateUserDTO, id)

    return this.userService.buildUserResponse(user)
  }

  @Post("users")
  @UsePipes(new BackendValidationPipe())
  async createUser(@Body("user") createUserDTO: CreateUserDTO): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDTO)

    return this.userService.buildUserResponse(user)
  }

  @Post("users/login")
  @UsePipes(new BackendValidationPipe())
  async login(@Body("user") loginUserDTO: LoginUserDTO): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDTO)

    return this.userService.buildUserResponse(user)
  }
}
