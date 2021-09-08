import { CreateCommentDTO } from "./dto/createComment.dto"
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe"
import { AuthGuard } from "@app/user/guards/auth.guard"
import { User } from "@app/user/decorators/user.decorator"
import { CommentResponse, CommentsResponse, DeleteParams } from "./types"

@Controller("articles/:slug/comments")
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Get()
  async getComments(@Param("slug") slug: string): Promise<CommentsResponse> {
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
  ): Promise<CommentResponse> {
    const comment = await this.service.createComment(slug, currentUserID, createCommentDTO)

    return this.service.buildSingleResponse(comment)
  }

  @Delete(":id")
  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  async deleteComment(@Param() params: DeleteParams, @User("id") currentUserID: number) {
    return await this.service.deleteComment(params, currentUserID)
  }
}
