import { ArticleResponseInterface } from "./types/articleResponse.interface"
import { CreateArticleDTO } from "./dto/createArticle.dto"
import { UserEntity } from "@app/user/user.entity"
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { ArticleService } from "./article.service"
import { AuthGuard } from "./../user/guards/auth.guard"
import { User } from "@app/user/decorators/user.decorator"
import { ArticleEntity } from "./article.entity"

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
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
  ): Promise<any> {
    return await this.articleService.deleteArticle(slug, currentUserID)
  }
}
