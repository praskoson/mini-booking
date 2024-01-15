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
            <dt className="text-right text-stone-300">{booking?.notes}</dt>
          </div>
        )}
      </dl>
      <div className="space-y-4 py-8">
        <Button
          onClick={async () => {
            if (confirm("Sigurno?")) {
              await deleteBookingById(booking.id);
              router.invalidate();
              navigate({ to: "/", search: true });
            }
          }}
          variant="danger"
          className="grid w-full grid-cols-[20px_1fr_20px] px-4 py-0 font-semibold tracking-tighter"
        >
          <Trash className="mr-1.5 inline-block size-5" />
          <span className="py-3">Obriši rezervaciju</span>
        </Button>
        <Link
          to="/"
          search={true}
          className="grid h-[44px] w-full grid-cols-[20px_1fr_20px] items-center justify-center rounded-xl border border-stone-100 px-4 py-0 text-center tracking-tighter"
        >
          <ChevronLeft className="size-5" />
          Natrag
        </Link>
      </div>
    </div>
  );
}
