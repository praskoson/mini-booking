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
          "size-9 rounded inline-flex justify-center items-center",
          view === "calendar" ? "text-gray-50 bg-stone-600" : "text-gray-200 bg-transparent"
        )}
      >
        <CalendarIcon className="size-5" />
      </Link>
      <Link
        search={{
          view: "list",
        }}
        className={cn(
          "size-9 rounded inline-flex justify-center items-center",
          view === "list" ? "text-gray-50 bg-stone-600" : "text-gray-200 bg-transparent"
        )}
      >
        <ListIcon className="size-5" />
      </Link>
    </div>
  );
}
