import { FollowEntity } from "./../profile/follow.entity"
import { ArticleQueryType } from "./types/query.type"
import { UpdateArticleDTO } from "./dto/updateArticle.dto"
import { ArticleResponseInterface } from "./types/articleResponse.interface"
import { DeleteResult, getRepository, Repository } from "typeorm"
import { ArticleEntity } from "./article.entity"
import { CreateArticleDTO } from "./dto/createArticle.dto"
import { UserEntity } from "@app/user/user.entity"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import sligufy from "slugify"
import { ArticlesResponseInterface } from "./types/articlesResponse.interface"
import { find, findIndex, isEmpty, propEq } from "ramda"

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async findAll(
    currentUserID: number,
    query: ArticleQueryType
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author")
      .orderBy("articles.createdAt", "DESC")
      .limit(query.limit || 20)

    const articlesCount = await queryBuilder.getCount()

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        {
          username: query.favorited
        },
        { relations: ["favorites"] }
      )

      const ids = author.favorites.map((el) => el.id)

      if (ids.length >= 0) {
        queryBuilder.andWhere("articles.id IN (:...ids)", { ids })
      } else {
        queryBuilder.andWhere("1=0")
      }
    }

    if (query.tag) {
      queryBuilder.andWhere("articles.tagList LIKE :tag", { tag: `%${query.tag}%` })
    }

    if (query.author) {
      const author = await this.userRepository.findOne({ username: query.author })
      queryBuilder.andWhere("articles.authorId = :id", { id: author.id })
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }

    let favoriteIds: number[] = []

    if (currentUserID) {
      const currentUser = await this.userRepository.findOne(currentUserID, {
        relations: ["favorites"]
      })

      favoriteIds = currentUser.favorites.map((favorite) => favorite.id)
    }

    const articles = await queryBuilder.getMany()
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id)

      return { ...article, favorited }
    })

    return { articles: articlesWithFavorites, articlesCount }
  }

  async getFeed(
    currentUserID: number,
    query: ArticleQueryType
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({ followerId: currentUserID })

    if (isEmpty(follows)) {
      return { articles: [], articlesCount: 0 }
    }

    const followingIds = follows.map((follow) => follow.followingId)

    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author")
      .where("articles.author.id IN (:...ids)", { ids: followingIds })
      .orderBy("articles.createdAt", "DESC")

    const articlesCount = await queryBuilder.getCount()

    if (query.limit) {
      queryBuilder.limit(query.limit)
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }

    const articles = await queryBuilder.getMany()

    return { articles, articlesCount }
  }

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

  async deleteArticle(
    slug: ArticleEntity["slug"],
    currentUserID: UserEntity["id"]
  ): Promise<DeleteResult> {
    const article = await this.findOneBySlug(slug)

    if (!article) {
      throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND)
    }

    if (article.author.id !== currentUserID) {
      throw new HttpException("You are not an author", HttpStatus.FORBIDDEN)
    }

    return await this.articleRepository.delete({ slug })
  }

  async updateArticle(
    updateArticleDTO: UpdateArticleDTO,
    slug: ArticleEntity["slug"],
    currentUserID: UserEntity["id"]
  ): Promise<ArticleEntity> {
    const article = await this.findOneBySlug(slug)

    if (!article) {
      throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND)
    }

    if (article.author.id !== currentUserID) {
      throw new HttpException("You are not an author", HttpStatus.FORBIDDEN)
    }

    const newSlug =
      updateArticleDTO.title !== article.title
        ? this.getSlug(updateArticleDTO.title)
        : article.title

    Object.assign(article, updateArticleDTO)

    return await this.articleRepository.save({ ...article, slug: newSlug })
  }

  async addArticleToFavorites(slug: string, currentUserID: number): Promise<ArticleEntity> {
    const article = await this.findOneBySlug(slug)

    if (!article) throw new HttpException("Article not found", HttpStatus.NOT_FOUND)

    const user = await this.userRepository.findOne(currentUserID, {
      relations: ["favorites"]
    })

    const isNotFavorited = !find(propEq("id", article.id))(user.favorites)

    if (isNotFavorited) {
      user.favorites.push(article)
      article.favoritesCount++

      await this.userRepository.save(user)
      await this.articleRepository.save(article)
    }

    return article
  }

  async deleteArticleFromFavorites(slug: string, currentUserID: number): Promise<ArticleEntity> {
    const article = await this.findOneBySlug(slug)

    if (!article) throw new HttpException("Article not found", HttpStatus.NOT_FOUND)

    const user = await this.userRepository.findOne(currentUserID, {
      relations: ["favorites"]
    })

    const articleIndex = findIndex(propEq("id", article.id))(user.favorites)

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1)
      article.favoritesCount--

      await this.userRepository.save(user)
      await this.articleRepository.save(article)
    }

    return article
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article }
  }

  private getSlug(title: string): string {
    return sligufy(title, { lower: true }) + "-" + ((Math.random() * 36 ** 6) | 0).toString(36)
  }
}
