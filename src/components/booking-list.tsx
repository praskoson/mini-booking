import { type Booking } from "@/lib/db";
import useLocalStorageState from "@/lib/use-localstorage-state";
import { Link } from "@tanstack/react-router";
import {
  differenceInDays,
  format,
  interval,
  isWithinInterval,
  isAfter,
  compareAsc,
} from "date-fns";
import { hr } from "date-fns/locale";
import { ChevronRightCircle } from "lucide-react";

export function BookingList({ bookings }: { bookings: Booking[] }) {
  const [showOldBookings, setShowOldBookings] = useLocalStorageState("showOldBookings", false);
  if (bookings.length === 0) {
    return <p className="mt-10 text-center align-middle text-lg text-white">Nema rezervacija</p>;
  }

  const filteredBookings = showOldBookings
    ? bookings
    : bookings.filter((b) => isAfter(b.to, new Date()));

  return (
    <div>
      <div className="flex items-center justify-end pb-4">
        <input
          checked={showOldBookings}
          onChange={(e) => setShowOldBookings(e.target.checked)}
          id="show-old"
          type="checkbox"
          className="mr-1.5 accent-emerald-700"
        />
        <label htmlFor="show-old" className="text-sm font-medium tracking-wide">
          Prikaži starije rezervacije
        </label>
      </div>
      <ol className="flex flex-col gap-4 px-1.5 *:w-full">
        {filteredBookings
          .sort((a, b) => compareAsc(a.from, b.from))
          .map((booking) => {
            const dayDuration = differenceInDays(booking.to, booking.from);
            const isActive = isWithinInterval(new Date(), interval(booking.from, booking.to));

            return (
              <li
                key={booking.id}
                className="relative overflow-hidden rounded bg-stone-700 text-white shadow-md ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-white"
              >
                {isActive && (
                  <div aria-hidden="true" className="absolute left-0 h-full w-[4px] bg-green-600" />
                )}
                <Link to="/booking/$slug" search={true} params={{ slug: booking.id.toString() }}>
                  <div className="grid w-full grid-cols-5 gap-2 px-6 py-4">
                    <div className="col-span-2">
                      <span className="mb-1 block truncate font-semibold">{booking.name}</span>
                      <span className="block text-sm text-stone-400">{dayDuration} dana</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-sm min-[425px]:text-base">
                      <span className="block capitalize">
                        {format(booking.from, "ccc, dd.M.yy", { locale: hr })}
                      </span>
                      &rarr;
                      <span className="block capitalize">
                        {format(booking.to, "ccc, dd.M.yy", { locale: hr })}
                      </span>
                    </div>
                    <div className="self-center justify-self-end">
                      <ChevronRightCircle className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
      </ol>
    </div>
  );
}
