import { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import AuthenticationService from "../services/authentication.service.js";
import { RefreshTokenPayload, SignUpPayload } from "../interfaces/user.interfaces.js";

export default class AuthenticationController {
  private authenticationService: AuthenticationService;

  constructor() {
    this.authenticationService = new AuthenticationService();
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  public async signUp(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    try {
      const payload = request.payload as SignUpPayload;
      const user = await this.authenticationService.signUp(payload);
      return h.response(user).code(201);
    } catch (err) {
      console.log(err);
      return h.response({ error: err.message }).code(500);
    }
  }

  public async signIn(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    try {
      const payload = request.payload as SignUpPayload;
      const user = await this.authenticationService.signIn(payload);
      return h.response(user).code(201);
    } catch (err) {
      console.log(err);
      return h.response({ error: err.message }).code(500);
    }
  }

  public async refresh(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    try {
      const payload = request.payload as RefreshTokenPayload;
      const user = await this.authenticationService.refresh(payload);
      return h.response(user).code(201);
    } catch (err) {
      console.log(err);
      return h.response({ error: err.message }).code(500);
    }
  }
}