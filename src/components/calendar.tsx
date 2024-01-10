import { type Booking } from "@/lib/db";
import { cn, colorList } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  interval,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { hr } from "date-fns/locale";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import useMeasure from "react-use-measure";

export function Calendar({ bookings }: { bookings: Booking[] }) {
  let [monthString, setMonthString] = useState(format(new Date(), "yyyy-MM"));
  let [direction, setDirection] = useState(0);
  let [isAnimating, setIsAnimating] = useState(false);
  let month = parse(monthString, "yyyy-MM", new Date());

  function nextMonth() {
    if (isAnimating) return;

    let next = addMonths(month, 1);

    setMonthString(format(next, "yyyy-MM"));
    setDirection(1);
    setIsAnimating(true);
  }

  function previousMonth() {
    if (isAnimating) return;

    let previous = subMonths(month, 1);

    setMonthString(format(previous, "yyyy-MM"));
    setDirection(-1);
    setIsAnimating(true);
  }

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  const thisMonthBookings = bookings.filter((b) =>
    isWithinInterval(b.from, { start: days[0], end: days[days.length - 1] })
  );

  let daysWithIntervals = days.map((day) => {
    let bookingIds: number[] = [];
    for (const booking of thisMonthBookings) {
      const inter = interval(booking.from, booking.to);
      if (isWithinInterval(day, inter) || isSameDay(day, inter.start)) {
        bookingIds.push(booking.id);
      }
    }
    return { day, bookingIds };
  });

  return (
    <MotionConfig transition={transition}>
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white text-stone-900">
        <div className="py-8">
          <div className="flex flex-col justify-center rounded text-center">
            <ResizablePanel>
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
                onExitComplete={() => setIsAnimating(false)}
              >
                <motion.div key={monthString} initial="enter" animate="middle" exit="exit">
                  <header className="relative flex justify-between px-8">
                    <motion.button
                      variants={removeImmediately}
                      className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                      onClick={previousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                    <motion.p
                      variants={variants}
                      custom={direction}
                      className="absolute capitalize inset-0 flex items-center justify-center font-semibold"
                    >
                      {format(month, "LLLL yyyy", { locale: hr })}
                    </motion.p>
                    <motion.button
                      variants={removeImmediately}
                      className="z-10 rounded-full p-1.5 hover:bg-stone-100"
                      onClick={nextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, white 15%, transparent 30%, transparent 70%, white 85%)",
                      }}
                    />
                  </header>
                  <motion.div
                    variants={removeImmediately}
                    className="mt-6 grid grid-cols-7 gap-y-6 px-8"
                  >
                    <span className="font-medium text-stone-500">Ne</span>
                    <span className="font-medium text-stone-500">Po</span>
                    <span className="font-medium text-stone-500">Ut</span>
                    <span className="font-medium text-stone-500">Sr</span>
                    <span className="font-medium text-stone-500">Če</span>
                    <span className="font-medium text-stone-500">Pe</span>
                    <span className="font-medium text-stone-500">Su</span>
                  </motion.div>
                  <motion.div
                    variants={variants}
                    custom={direction}
                    className="mt-6 grid grid-cols-7 gap-y-6 px-8"
                  >
                    {daysWithIntervals.map(({ day, bookingIds }) => (
                      <DrawDay
                        day={day}
                        month={month}
                        intervals={bookingIds}
                        key={format(day, "yyyy-MM-dd")}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </ResizablePanel>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

function DrawDay({ day, month, intervals }: { day: Date; month: Date; intervals: number[] }) {
  const classes = [
    "relative isolate font-semibold overflow-hidden",
    isSameDay(day, new Date()) && "ring-2 ring-stone-600",
    !isSameMonth(day, month) && "text-stone-300",
    !isSameMonth(day, month) && intervals.length > 0 && "text-stone-50",
  ];

  if (intervals.length > 0) {
    return (
      <Link
        to="/booking/$slug"
        search={true}
        params={{ slug: intervals[0].toString() }}
        className={cn(classes, "has-[+span]:rounded-r-md")}
      >
        {intervals.length > 0 && <ColorMarker intervals={intervals} />}
        <span>{format(day, "d")}</span>
      </Link>
    );
  }

  return <span className={cn(classes, "[&+a]:rounded-l-md")}>{format(day, "d")}</span>;
}

function ColorMarker({ intervals }: { intervals: number[] }) {
  const colors = intervals.map((i) => colorList[i % colorList.length]);
  const gradientStops = colors
    .map((color, index, array) => {
      const position = (100 / array.length) * index;
      return `${color} ${position}%, ${color} ${position + 100 / array.length}%`;
    })
    .join(", ");

  return (
    <div
      style={{ background: `linear-gradient(to bottom, ${gradientStops})` }}
      className="absolute -z-10 inset-0"
    />
  );
}

function ResizablePanel({ children }: { children: ReactNode }) {
  let [ref, bounds] = useMeasure();

  return (
    <motion.div animate={{ height: bounds.height > 0 ? bounds.height : undefined }}>
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}

let transition = { type: "spring", bounce: 0, duration: 0.25 };

let variants = {
  enter: (direction: number) => {
    return { x: `${100 * direction}%`, opacity: 0 };
  },
  middle: { x: "0%", opacity: 1 },
  exit: (direction: number) => {
    return { x: `${-100 * direction}%`, opacity: 0 };
  },
};

let removeImmediately = {
  exit: { visibility: "hidden" },
} satisfies Variants;
