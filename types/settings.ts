import type { User } from "./user";

export type UserSettings = Pick<User, "name" | "email" | "image">;
