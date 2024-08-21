import Hapi from "@hapi/hapi";
import { UserCredentials } from "@hapi/hapi";

export interface UserResponse {
  authToken: string;
  refreshToken: string;
  email: string;
};

export interface GetUserResponse {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export interface UpdateUserPayload {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export interface UpdateUserResponse {
  id: number;
  authToken: string;
  refreshToken: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export interface SignUpPayload {
  email: string;
  password: string;
};

export interface RefreshTokenPayload {
  refreshToken: string;
};

export interface CustomAuth extends Hapi.Auth {
  credentials: UserCredentials;
}