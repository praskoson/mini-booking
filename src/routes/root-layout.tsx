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
    <div className="mx-auto flex h-full w-[min(100%,512px)] flex-col gap-y-6 px-[4%] pb-10 pt-8 min-[425px]:px-8">
      <Header />
      <Outlet />
    </div>
  );
}
