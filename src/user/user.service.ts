import { UpdateUserDTO } from "./dto/updateUser.dto"
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
import { BackendValidationErrors } from "@app/types/BackendValidationErrors.type"

@Injectable()
export class UserService {
  createUserErrors: BackendValidationErrors
  loginErrorResponse: { errors: BackendValidationErrors }
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
    this.createUserErrors = {}
    this.loginErrorResponse = {
      errors: {
        "email or password": ["is invalid"]
      }
    }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDTO.email
    })

    const userByUsername = await this.userRepository.findOne({
      username: createUserDTO.username
    })

    if (userByEmail) {
      this.createUserErrors["email"] = ["has alread been taken"]
    }

    if (userByUsername) {
      this.createUserErrors["username"] = ["has alread been taken"]
    }

    if (userByEmail || userByUsername) {
      throw new HttpException({ errors: this.createUserErrors }, HttpStatus.UNPROCESSABLE_ENTITY)
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
      throw new HttpException(this.loginErrorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const isPasswordCorrect = await compare(LoginUserDTO.password, user.password)

    if (!isPasswordCorrect) {
      throw new HttpException(this.loginErrorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    delete user.password

    return user
  }

  async updateUser(UpdateUserDTO: UpdateUserDTO, userID: number): Promise<UserEntity> {
    await this.userRepository.update(userID, UpdateUserDTO)

    return this.findByID(userID)
  }

  findByID(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id)
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
