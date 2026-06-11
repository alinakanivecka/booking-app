import { User } from "../../../models/user.model";

export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}