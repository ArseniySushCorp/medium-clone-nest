import { UserService } from "./../user.service"
import { ExpressRequestInterface } from "@app/types/expressRequest.interface"
import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Response } from "express"
import { verify } from "jsonwebtoken"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly UserService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null
      next()

      return
    }

    const token = req.headers.authorization.split(" ")[1]

    const decode = verify(token, process.env.JWT_SALT)
    const user = await this.UserService.findByID(decode.id)
    req.user = user

    next()
  }
}
