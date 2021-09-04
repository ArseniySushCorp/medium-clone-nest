import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common"

import { UserService } from "./user.service"
import { UserResponseInterface } from "./types/UserResponse.interface"

import { CreateUserDTO } from "./dto/createUser.dto"
import { LoginUserDTO } from "./dto/loginUser.dto"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

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
