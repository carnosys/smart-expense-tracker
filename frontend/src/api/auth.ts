import { apiRequest } from "./client";
import type { LoginPayload, RegisterPayload, TokenResponse, UserProfile } from "../types/auth";

export function login(payload: LoginPayload) {
  return apiRequest<TokenResponse>("/users/login", { method: "POST", body: payload });
}

export function register(payload: RegisterPayload) {
  return apiRequest<UserProfile>("/users/register", { method: "POST", body: payload });
}

export function getProfile(token: string) {
  return apiRequest<UserProfile>("/users/me", { token });
}
