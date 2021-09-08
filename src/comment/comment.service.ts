import { UserEntity } from "@app/user/user.entity"
import { CreateCommentDTO } from "./dto/createComment.dto"
import { BackendValidationErrors } from "./../types/BackendValidationErrors.type"
import { ArticleEntity } from "./../article/article.entity"
import { Repository } from "typeorm"
import { CommentEntity } from "@app/comment/comment.entity"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class CommentService {
  articleError: BackendValidationErrors
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,

    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {
    this.articleError = { article: ["Does not exit"] }
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
