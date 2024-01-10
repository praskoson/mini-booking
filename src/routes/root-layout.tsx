import { Header } from "@/components/header";
import { indexSearchSchema } from "@/lib/schemas";
import { rootRoute } from "@/router";
import { Outlet, Route } from "@tanstack/react-router";

export const rootLayout = new Route({
  id: "rootLayout",
  getParentRoute: () => rootRoute,
  component: RootComponent,
  validateSearch: indexSearchSchema,
});

export function RootComponent() {
  return (
    <div className="px-8 w-[min(100%,512px)] mx-auto flex flex-col gap-y-6 h-full pt-8 pb-10">
      <Header />
      <Outlet />
    </div>
  );
}
