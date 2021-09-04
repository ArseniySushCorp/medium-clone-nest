import { UserType } from "./User.type"

export interface UserResponseInterface {
  user: UserType & { token: string }
}
