import { UserResponseInterface } from "./types/UserResponse.interface"
import { Repository } from "typeorm"
import { UserEntity } from "./user.entity"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { CreateUserDto } from "./dto/createUser.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { sign } from "jsonwebtoken"
import { pick } from "ramda"
@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email
    })

    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username
    })

    if (userByEmail || userByUsername) {
      throw new HttpException("Email or username are taken", HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const newUser = new UserEntity()
    Object.assign(newUser, createUserDto)

    return await this.userRepository.save(newUser)
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
