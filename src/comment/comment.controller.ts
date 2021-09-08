import { Controller, Get, Param } from "@nestjs/common"
import { CommentService } from "./comment.service"

@Controller("articles/:slug/comments")
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get()
  async getComments(@Param("slug") slug: string) {
    return this.service.findComments(slug)
  }
}
