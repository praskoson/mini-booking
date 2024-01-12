import { Link, useRouterState } from "@tanstack/react-router";
import { PickView } from "./pick-view";

export function Header() {
  const pathname = useRouterState().location.pathname;

  return (
    <header className="flex items-center justify-between flex-wrap gap-y-3">
      <Link to="/" search={{ view: "list" }} className="flex">
        <div
          style={{ borderRadius: "50% 50% 5% 95% / 50% 80% 20% 50%" }}
          className="size-9 mr-2.5 bg-gradient-to-br from-sky-500 to-lime-500"
        />
        <h1 className="hidden min-[300px]:block font-bold text-3xl tracking-tighter text-white text-nowrap">
          <span className="hidden min-[400px]">MINI </span>
          <span>BOOKING</span>
        </h1>
      </Link>
      {!pathname.startsWith("/booking") && (
        <div className="ml-auto">
          <PickView />
        </div>
      )}
      {/* <Link to="/" search={{ view: "list" }} className="flex items-center text-lg">
          <ChevronLeft className="size-6 mr-1.5" />
          Natrag
        </Link> */}
    </header>
  );
}
