import { CommentEntity } from "@app/comment/comment.entity"

export interface CommentResponse {
  comment: CommentEntity
}

export interface CommentsResponse {
  comments: CommentEntity[]
}

export type DeleteParams = {
  slug: string
  id: number
}
