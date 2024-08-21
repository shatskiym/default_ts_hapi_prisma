import { ServerRoute } from "@hapi/hapi";
import Routes from "./routes.js";
import UsersController from "../controllers/users.controller.js";
import {
  GET_USERS_VALIDATION_SCHEMA,
  GET_USER_SUCCESS_RESPONSE_SCHEMA,
  ERROR_RESPONSE_SCHEMA,
  UPDATE_USER_REQUEST_SCHEMA,
  UPDATE_USER_SUCCESS_RESPONSE_SCHEMA
} from "../validators/users.validators.js";

const usersController = new UsersController();

export default class UserRoutes extends Routes {
  static routes: ServerRoute[] = [
    {
      method: "get",
      path: "/users/me",
      handler: usersController.get,
      options: {
        description: "Get current User info",
        notes: "NOTE: Required JWT header",
        auth: "jwt",
        tags: ["api"],
        validate: GET_USERS_VALIDATION_SCHEMA,
        response: {
          status: {
            200: GET_USER_SUCCESS_RESPONSE_SCHEMA,
            400: ERROR_RESPONSE_SCHEMA,
          },
        },
      },
    },

    {
      method: "put",
      path: "/users",
      handler: usersController.update,
      options: {
        description: "Update User Endpoint",
        notes: "NOTE: Required JWT header",
        auth: "jwt",
        tags: ["api"],
        validate: UPDATE_USER_REQUEST_SCHEMA,
        response: {
          status: {
            201: UPDATE_USER_SUCCESS_RESPONSE_SCHEMA,
            400: ERROR_RESPONSE_SCHEMA,
          },
        },
      },
    },
  ]
}
