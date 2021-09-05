import { ArticleResponseInterface } from "./types/articleResponse.interface"
import { Repository } from "typeorm"
import { ArticleEntity } from "./article.entity"
import { CreateArticleDTO } from "./dto/createArticle.dto"
import { UserEntity } from "@app/user/user.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import sligufy from "slugify"

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDTO: CreateArticleDTO
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticleDTO)

    if (!article.tagList) {
      article.tagList = []
    }

    article.author = currentUser

    article.slug = this.getSlug(createArticleDTO.title)

    return await this.articleRepository.save(article)
  }

  async findOneBySlug(slug: ArticleEntity["slug"]): Promise<ArticleEntity> {
    return this.articleRepository.findOne({ slug })
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article }
  }

  private getSlug(title: string): string {
    return (
      sligufy(title, { lower: true }) + "-" + ((Math.random() * 36 ** 6) | 0).toString(36)
    )
  }
}
