import { UserType } from "./../../user/types/User.type"

export type ProfileType = UserType & { following: boolean }
