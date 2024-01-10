import { RootRoute, Router } from "@tanstack/react-router";
import { indexRoute } from "./routes/index-route";
import { rootLayout } from "./routes/root-layout";
import { bookingRoute } from "./routes/booking";

export const rootRoute = new RootRoute();

const routeTree = rootRoute.addChildren([rootLayout.addChildren([indexRoute, bookingRoute])]);
export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
