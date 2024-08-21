import { ServerRoute } from "@hapi/hapi";
import Routes from "./routes.js";
import AuthenticationController from "../controllers/authentication.controller.js";
import {
  AUTH_SCHEMA,
  REFRESH_SCHEMA,
  SUCCESS_AUTH_SCHEMA,
  ERROR_RESPONSE_SCHEMA
} from "../validators/authentication.validators.js";

const authenticationController = new AuthenticationController();

export default class AuthenticationRoutes extends Routes {
  static routes: ServerRoute[] = [
    {
      method: "post",
      path: "/auth/sign_up",
      handler: authenticationController.signUp,
      options: {
        description: "Sign up for users.",
        notes: "NOTE: Required JWT header",
        tags: ["api"],
        validate: AUTH_SCHEMA,
        response: {
          status: {
            201: SUCCESS_AUTH_SCHEMA,
            400: ERROR_RESPONSE_SCHEMA,
          },
        },
      },
    },

    {
      method: "post",
      path: "/auth/sign_in",
      handler: authenticationController.signIn,
      options: {
        description: "Sign in for users.",
        notes: "Sign in endpoint for users.",
        tags: ["api"],
        validate: AUTH_SCHEMA,
        response: {
          status: {
            201: SUCCESS_AUTH_SCHEMA,
            400: ERROR_RESPONSE_SCHEMA,
          },
        },
      },
    },

    {
      method: "post",
      path: "/auth/refresh",
      handler: authenticationController.refresh,
      options: {
        description: "Refresh JWT token endpoint.",
        notes: "Refresh token endpoint for users.",
        tags: ["api"],
        validate: REFRESH_SCHEMA,
        response: {
          status: {
            201: SUCCESS_AUTH_SCHEMA,
            400: ERROR_RESPONSE_SCHEMA,
          },
        },
      },
    },
  ]
}
