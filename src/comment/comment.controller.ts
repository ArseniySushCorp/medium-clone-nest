import { CreateCommentDTO } from "./dto/createComment.dto"
import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe"
import { AuthGuard } from "@app/user/guards/auth.guard"
import { User } from "@app/user/decorators/user.decorator"

@Controller("articles/:slug/comments")
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get()
  async getComments(@Param("slug") slug: string) {
    const comments = await this.service.findComments(slug)

    return this.service.buildManyResponse(comments)
  }

  @Post()
  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  async createComment(
    @Param("slug") slug: string,
    @User("id") currentUserID: number,
    @Body("comment") createCommentDTO: CreateCommentDTO
  ) {
    const comment = await this.service.createComment(slug, currentUserID, createCommentDTO)

    return this.service.buildSingleResponse(comment)
  }
}
