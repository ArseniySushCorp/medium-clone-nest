import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { omit, pick } from "ramda"

import { UserEntity } from "./user.entity"
import { UserResponseInterface } from "./types/UserResponse.interface"
import { CreateUserDTO } from "./dto/createUser.dto"
import { LoginUserDTO } from "./dto/loginUser.dto"

import { sign } from "jsonwebtoken"
import { compare } from "bcrypt"

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDTO.email
    })

    const userByUsername = await this.userRepository.findOne({
      username: createUserDTO.username
    })

    if (userByEmail || userByUsername) {
      throw new HttpException("Email or username are taken", HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const newUser = new UserEntity()
    Object.assign(newUser, createUserDTO)

    return await this.userRepository.save(newUser)
  }

  async login(LoginUserDTO: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: LoginUserDTO.email
      },
      { select: ["id", "username", "email", "bio", "image", "password"] }
    )

    if (!user) {
      throw new HttpException("Credentials are not valid", HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const isPasswordCorrect = await compare(LoginUserDTO.password, user.password)

    if (!isPasswordCorrect) {
      throw new HttpException("Credentials are not valid", HttpStatus.UNPROCESSABLE_ENTITY)
    }

    delete user.password

    return user
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user)
      }
    }
  }

  private generateJWT(user: UserEntity): string {
    const JWT_DATA = pick(["id", "username", "email"], user)

    return sign(JWT_DATA, process.env.JWT_SALT)
  }
}
