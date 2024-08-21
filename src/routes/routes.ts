import { ServerRoute, Server, ServerApplicationState } from "@hapi/hapi";

export default class Routes {
  protected static routes: ServerRoute[];

  public static initializRoutes(server: Server<ServerApplicationState>): void {
    server.route(this.routes);
  }
}