import { ArticleQueryType } from "./types/query.type"
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
  Query,
  UseGuards,
  UsePipes
} from "@nestjs/common"
import { ArticleService } from "./article.service"
import { AuthGuard } from "./../user/guards/auth.guard"
import { User } from "@app/user/decorators/user.decorator"
import { ArticleEntity } from "./article.entity"
import { UpdateArticleDTO } from "./dto/updateArticle.dto"
import { ArticlesResponseInterface } from "./types/articlesResponse.interface"
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe"

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User("id") currentUserID: number,
    @Query() query: ArticleQueryType
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserID, query)
  }

  @Get("/feed")
  @UseGuards(AuthGuard)
  async getFeed(
    @User("id") currentUserID: number,
    @Query() query: ArticleQueryType
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserID, query)
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
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
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User("id") currentUserID: UserEntity["id"],
    @Param("slug") slug: ArticleEntity["slug"],
    @Body("article") updateArticleDTO: UpdateArticleDTO
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(updateArticleDTO, slug, currentUserID)

    return this.articleService.buildArticleResponse(article)
  }

  @Post(":slug/favorite")
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User("id") currentUserID: number,
    @Param("slug") slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(slug, currentUserID)

    return this.articleService.buildArticleResponse(article)
  }

  @Delete(":slug/favorite")
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User("id") currentUserID: number,
    @Param("slug") slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(slug, currentUserID)

    return this.articleService.buildArticleResponse(article)
  }
}
