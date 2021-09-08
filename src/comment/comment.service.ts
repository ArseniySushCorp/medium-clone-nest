import { Injectable } from "@nestjs/common"

@Injectable()
export class CommentService {
  async findComments(slug: string) {
    return "FFFOOO"
  }
}
