import { UserEntity } from "@app/user/user.entity"
import { CreateCommentDTO } from "./dto/createComment.dto"
import { BackendValidationErrors } from "./../types/BackendValidationErrors.type"
import { ArticleEntity } from "./../article/article.entity"
import { getRepository, Repository } from "typeorm"
import { CommentEntity } from "@app/comment/comment.entity"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DeleteParams } from "./types"

@Injectable()
export class CommentService {
  articleError: BackendValidationErrors
  commentError: BackendValidationErrors
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,

    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {
    this.articleError = { article: ["Does not exit"] }
    this.commentError = { comment: ["Not found or not owned by user"] }
  }

  async createComment(
    slug: string,
    currentUserID: number,
    { body }: CreateCommentDTO
  ): Promise<CommentEntity> {
    const article = await this.findArticle(slug)
    const author = await this.userRepo.findOne(currentUserID)

    const newComment = new CommentEntity()
    Object.assign(newComment, { body, author })

    article.comments.push(newComment)

    this.articleRepo.save(article)

    return await this.commentRepo.save(newComment)
  }

  async findComments(slug: string) {
    const article = await this.findArticle(slug)

    return article.comments
  }

  async deleteComment({ slug, id }: DeleteParams, currentUserID: number) {
    const comment = await this.commentRepo.findOne(id, { relations: ["article"] })

    if (comment && comment.article.slug === slug && comment.author.id === currentUserID) {
      await this.commentRepo.delete(comment.id)
    } else {
      throw new HttpException({ error: this.commentError }, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    return comment
  }

  buildSingleResponse(comment: CommentEntity): any {
    return { comment }
  }

  buildManyResponse(comments: CommentEntity[]): any {
    return { comments }
  }

  private async findArticle(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne({ slug }, { relations: ["comments"] })

    if (!article)
      throw new HttpException({ error: this.articleError }, HttpStatus.UNPROCESSABLE_ENTITY)

    return article
  }
}
