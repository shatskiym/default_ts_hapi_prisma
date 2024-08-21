import { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import UsersService from "../services/users.service.js";
import { UpdateUserPayload } from "../interfaces/user.interfaces.js";

export default class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
  }

  public async get(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    try {
      const userId = request.auth.credentials.id as number;
      const user = await this.usersService.get(userId);
      return h.response(user).code(200);
    } catch (err) {
      console.log(err);
      return h.response({ error: err.message }).code(500);
    }
  }

  public async update(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    try {
      const userId = request.auth.credentials.id as number;
      const payload = request.payload as UpdateUserPayload;
      const updatedUser = await this.usersService.update(userId, payload);
      return h.response(updatedUser).code(201);
    } catch (err) {
      console.log(err);
      return h.response({ error: err.message }).code(500);
    }
  }
}