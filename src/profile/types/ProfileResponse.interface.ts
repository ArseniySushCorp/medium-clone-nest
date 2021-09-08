import { ProfileType } from "./Profile.type"

export interface ProfileResponse {
  profile: Pick<ProfileType, "id" | "username" | "bio" | "image" | "following">
}
