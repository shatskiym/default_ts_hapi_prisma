import Hapi from "@hapi/hapi";
import Qs from "qs";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import { PrismaClient } from '@prisma/client';
import hapiAuthJwt2 from "hapi-auth-jwt2";
import { CustomAuth } from "./interfaces/user.interfaces.js";
import AuthenticationRoutes from "./routes/authentication.routes.js";
import UserRoutes from "./routes/users.routes.js";
import HAPIWebSocket from "hapi-plugin-websocket";

const prisma = new PrismaClient();

const swaggerOptions = {
  info: {
    title: "default_ts_hapi_prisma API Documentation",
    version: "1.0.0",
  },
};

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => {
          // if (err.isJoi) {
            throw err;
          // }
        },
      },
      response: {
        failAction: async (request, h, err) => {
          // if (err.isJoi) {
            // const errorResponse = {
            //   error: err.details[0].message,
            // };
            // return h.response(errorResponse).code(400);
          // }
          console.log("Error: ",err);
          throw err;
        },
      },
    },
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  await server.register(HAPIWebSocket);

  await server.register(hapiAuthJwt2);

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET_USER,
    validate: async (decoded: any, request, h) => {
      // const createdAtMs = decoded.iat * 1000;
      // const now = (new Date()).getTime();
      // if (((now - createdAtMs) / 1000 / 60 / 60) >= 1) {
      //   return { isValid: false };
      // }
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      if (user) {
        (request.auth as unknown as CustomAuth).credentials = user;
        return { isValid: true };
      } else {
        return { isValid: false };
      }
    },
    verifyOptions: { algorithms: ["HS256"] },
  });

  AuthenticationRoutes.initializRoutes(server);
  UserRoutes.initializRoutes(server);

  await server.start();

  console.log("Server is running!!!");
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();