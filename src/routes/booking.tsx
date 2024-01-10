import { SmallCalendar } from "@/components/small-calendar";
import { Button } from "@/components/ui/button";
import { deleteBookingById, getBookingById } from "@/lib/db";
import { Link, Route, useNavigate } from "@tanstack/react-router";
import { format, getDay } from "date-fns";
import { ChevronLeft, Trash } from "lucide-react";
import { rootLayout } from "./root-layout";
import { router } from "@/router";

const dayToString: Record<number, string> = {
  0: "ponedjeljka",
  1: "utorka",
  2: "srijede",
  3: "četvrtka",
  4: "petka",
  5: "subote",
  6: "nedjelje",
};

export const bookingRoute = new Route({
  getParentRoute: () => rootLayout,
  path: "booking/$slug",
  component: Booking,
  loader: ({ params }) => getBookingById(Number(params.slug)),
});

export function Booking() {
  const navigate = useNavigate();
  const booking = bookingRoute.useLoaderData();
  if (!booking) return "Not found";

  return (
    <div>
      <dl className="flex flex-col gap-6">
        <SmallCalendar from={booking.from} to={booking.to} id={booking.id} />
        <div className="flex justify-between gap-3">
          <dd className="font-semibold">Trajanje</dd>
          <dt className="text-stone-300">
            Od {dayToString[getDay(booking.from)]}, {format(booking.from, "dd.M.")} do{" "}
            {dayToString[getDay(booking.to)]}, {format(booking.to, "dd.M.")}
          </dt>
        </div>
        <div className="flex justify-between gap-6">
          <dd className="font-semibold">Ime</dd>
          <dt className="text-stone-300">{booking?.name}</dt>
        </div>
        {booking.contact && (
          <div className="flex justify-between gap-6">
            <dd className="font-semibold">Kontakt</dd>
            <dt className="text-stone-300">{booking?.contact}</dt>
          </div>
        )}
        {booking.notes && (
          <div className="flex justify-between gap-6">
            <dd className="font-semibold">Napomene</dd>
            <dt className="text-stone-300 text-right">{booking?.notes}</dt>
          </div>
        )}
      </dl>
      <div className="py-8 space-y-4">
        <Button
          onClick={async () => {
            if (confirm("Sigurno?")) {
              await deleteBookingById(booking.id);
              router.invalidate();
              navigate({ to: "/", search: true });
            }
          }}
          variant="danger"
          className="font-semibold tracking-tighter grid grid-cols-[20px_1fr_20px] px-4 w-full py-0"
        >
          <Trash className="inline-block mr-1.5 size-5" />
          <span className="py-3">Obriši rezervaciju</span>
        </Button>
        <Link
          to="/"
          search={true}
          className="border border-stone-100 rounded-xl text-center h-[44px] items-center justify-center tracking-tighter grid grid-cols-[20px_1fr_20px] px-4 py-0 w-full"
        >
          <ChevronLeft className="size-5" />
          Natrag
        </Link>
      </div>
    </div>
  );
}
