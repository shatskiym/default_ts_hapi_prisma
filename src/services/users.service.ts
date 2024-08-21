import { PrismaClient } from "@prisma/client";
import {
  GetUserResponse,
  UpdateUserPayload,
  UpdateUserResponse
} from "../interfaces/user.interfaces.js";
import AuthenticationService from "./authentication.service.js";

export default class UsersService {
  private prisma: PrismaClient;
  private readonly authenticationService: AuthenticationService;

  constructor() {
    this.prisma = new PrismaClient();
    this.authenticationService = new AuthenticationService();
  }

  public async get(userId: number): Promise<GetUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  public async update(
    userId: number,
    payload: UpdateUserPayload
  ): Promise<UpdateUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    const { refreshToken, authToken } = this.authenticationService.generateTokens(
      payload.email || user.email,
      user.id,
    );
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: payload.email,
        refreshToken,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
    return {
      id: user.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      authToken,
      refreshToken,
    };
  }
}