import { ExpressRequestInterface } from "@app/types/expressRequest.interface"
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<ExpressRequestInterface>()

    if (user) {
      return true
    }

    throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED)
  }
}
