import { UserEntity } from "@app/user/user.entity"
import { ArticleEntity } from "./../article/article.entity"
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "comments" })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "" })
  body: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date()
  }

  @ManyToOne(() => ArticleEntity, (article) => article.comments, { onDelete: "CASCADE" })
  article: ArticleEntity

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity
}
