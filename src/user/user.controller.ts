import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common"

import { UserService } from "./user.service"
import { UserResponseInterface } from "./types/UserResponse.interface"

import { CreateUserDTO } from "./dto/createUser.dto"
import { LoginUserDTO } from "./dto/loginUser.dto"
import { ExpressRequestInterface } from "@app/types/expressRequest.interface"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user")
  async currentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user)
  }

  @Post("users")
  @UsePipes(new ValidationPipe())
  async createUser(@Body("user") createUserDTO: CreateUserDTO): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDTO)

    return this.userService.buildUserResponse(user)
  }

  @Post("users/login")
  @UsePipes(new ValidationPipe())
  async login(@Body("user") loginUserDTO: LoginUserDTO): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDTO)

    return this.userService.buildUserResponse(user)
  }
}
