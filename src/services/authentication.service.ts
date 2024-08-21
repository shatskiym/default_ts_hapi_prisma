import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import { RefreshTokenPayload, SignUpPayload, UserResponse } from "../interfaces/user.interfaces.js";

export default class AuthenticationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.refresh = this.refresh.bind(this);
    this.generateTokens = this.generateTokens.bind(this);
    this.decodeToken = this.decodeToken.bind(this);
  }

  public async signUp(payload: SignUpPayload): Promise<UserResponse> {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(payload.password, salt);
    const refreshToken = crypto.randomBytes(64).toString("hex");

    const newUser: User = await this.prisma.user.create({
      data: {
        email: payload.email,
        encryptedPassword,
        refreshToken,
      },
    });

    const authToken = jwt.sign(
      { email: newUser.email, id: newUser.id },
      process.env.JWT_SECRET_USER as string,
      { algorithm: "HS256" },
    );
    return {
      email: newUser.email,
      authToken,
      refreshToken,
    };
  };

  public async signIn(payload: SignUpPayload): Promise<UserResponse> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user ||
        !(await bcrypt.compare(payload.password, user.encryptedPassword))
      ) {
      throw new Error("Email/Password is invalid");
    }
    const { refreshToken, authToken } = this.generateTokens(
      user.email, 
      user.id,
    );
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });
    return {
      email: user.email,
      authToken,
      refreshToken,
    };
  };

  public async refresh(payload: RefreshTokenPayload): Promise<UserResponse> {
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        refreshToken: payload.refreshToken,
      },
    });
    if (!user) {
      throw new Error("Refresh token is invalid");
    }
    const { refreshToken, authToken } = this.generateTokens(
      user.email, 
      user.id,
    );
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });
    return {
      email: user.email,
      authToken,
      refreshToken,
    };
  };  

  public generateTokens(email: string, id: number) {
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const authToken = jwt.sign(
      { email, id },
      process.env.JWT_SECRET_USER as string,
      { algorithm: "HS256" },
    );
    return { refreshToken, authToken };
  };

  public decodeToken(token: string) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_USER as string);
    return decodedToken;
  }
}