import { Link, useRouterState } from "@tanstack/react-router";
import { PickView } from "./pick-view";

export function Header() {
  const pathname = useRouterState().location.pathname;

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-3">
      <Link to="/" search={{ view: "list" }} className="flex">
        <div
          style={{ borderRadius: "50% 50% 5% 95% / 50% 80% 20% 50%" }}
          className="mr-2.5 size-9 bg-gradient-to-br from-sky-500 to-lime-500"
        />
        <h1 className="hidden text-nowrap text-3xl font-bold tracking-tighter text-white min-[300px]:block">
          <span className="hidden min-[400px]:inline">MINI </span>
          <span>BOOKING</span>
        </h1>
      </Link>
      {!pathname.startsWith("/booking") && (
        <div className="ml-auto">
          <PickView />
        </div>
      )}
    </header>
  );
}
