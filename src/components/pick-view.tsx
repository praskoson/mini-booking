import { cn } from "@/lib/utils";
import { Link, useSearch } from "@tanstack/react-router";
import { CalendarIcon, ListIcon } from "lucide-react";

export function PickView() {
  // @ts-expect-error something i dont understand
  const { view } = useSearch({ strict: false });

  return (
    <div className="flex gap-1">
      <Link
        search={{
          view: "calendar",
        }}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded",
          view === "calendar" ? "bg-stone-600 text-gray-50" : "bg-transparent text-gray-200",
        )}
      >
        <CalendarIcon className="size-5" />
      </Link>
      <Link
        search={{
          view: "list",
        }}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded",
          view === "list" ? "bg-stone-600 text-gray-50" : "bg-transparent text-gray-200",
        )}
      >
        <ListIcon className="size-5" />
      </Link>
    </div>
  );
}
