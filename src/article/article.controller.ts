import { ArticleResponseInterface } from "./types/articleResponse.interface"
import { CreateArticleDTO } from "./dto/createArticle.dto"
import { UserEntity } from "@app/user/user.entity"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common"
import { ArticleService } from "./article.service"
import { AuthGuard } from "./../user/guards/auth.guard"
import { User } from "@app/user/decorators/user.decorator"
import { ArticleEntity } from "./article.entity"
import { UpdateArticleDTO } from "./dto/updateArticle.dto"

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createArticle(
    @User() currentUser: UserEntity,
    @Body("article") createArticleDTO: CreateArticleDTO
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(currentUser, createArticleDTO)

    return this.articleService.buildArticleResponse(article)
  }

  @Get(":slug")
  async getSingleArticle(
    @Param("slug") slug: ArticleEntity["slug"]
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findOneBySlug(slug)

    return this.articleService.buildArticleResponse(article)
  }

  @Delete(":slug")
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User("id") currentUserID: UserEntity["id"],
    @Param("slug") slug: ArticleEntity["slug"]
  ): Promise<void> {
    await this.articleService.deleteArticle(slug, currentUserID)
  }

  @Put(":slug")
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User("id") currentUserID: UserEntity["id"],
    @Param("slug") slug: ArticleEntity["slug"],
    @Body("article") updateArticleDTO: UpdateArticleDTO
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      updateArticleDTO,
      slug,
      currentUserID
    )

    return this.articleService.buildArticleResponse(article)
  }
}
