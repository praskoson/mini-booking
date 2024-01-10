import { BookingList } from "@/components/booking-list";
import { Calendar } from "@/components/calendar";
import { ReservationForm } from "@/components/reservation-form";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { deleteAllBookings, getBookings } from "@/lib/db";
import { indexSearchSchema } from "@/lib/schemas";
import { router } from "@/router";
import { Route, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { BedIcon, Trash } from "lucide-react";
import { useState } from "react";
import { rootLayout } from "./root-layout";

export const indexRoute = new Route({
  getParentRoute: () => rootLayout,
  path: "/",
  component: IndexComponent,
  loader: () => getBookings(),
  validateSearch: indexSearchSchema,
});

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function IndexComponent() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const bookings = indexRoute.useLoaderData();
  const { view } = indexRoute.useSearch();
  const navigate = useNavigate({ from: indexRoute.path });

  return (
    <>
      <div className="flex-1 min-h-0">
        <AnimatePresence
          initial={false}
          mode="popLayout"
          onExitComplete={() => setIsAnimating(false)}
        >
          {view === "calendar" && (
            <motion.div
              key="calendar"
              style={{ height: "100%" }}
              custom={-1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag={isAnimating ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ right: 0.1, left: 0.7 }}
              onDragEnd={(_e, { offset, velocity }) => {
                if (isAnimating) return;
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold && offset.x < -100) {
                  setIsAnimating(true);
                  navigate({ search: { view: "list" } });
                }
              }}
            >
              <Calendar bookings={bookings ?? []} />
            </motion.div>
          )}
          {view === "list" && (
            <motion.div
              key="list"
              style={{ height: "100%", overflowY: "auto" }}
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag={isAnimating ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ right: 0.7, left: 0.1 }}
              onDragEnd={(_e, { offset, velocity }) => {
                if (isAnimating) return;
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe > swipeConfidenceThreshold && offset.x > 100) {
                  setIsAnimating(true);
                  navigate({ search: { view: "calendar" } });
                }
              }}
            >
              <BookingList bookings={bookings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="primary"
              className="font-semibold tracking-tighter grid grid-cols-[20px_1fr_20px] px-4 w-full py-0"
            >
              <BedIcon aria-hidden="true" className="inline-block mr-1.5 size-6" />
              <span className="py-3">Nova rezervacija</span>
            </Button>
          </DrawerTrigger>
          <ReservationForm onClose={() => setOpen(false)} />
        </Drawer>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={async () => {
            if (confirm("Sigurno?")) {
              await deleteAllBookings();
              router.invalidate();
            }
          }}
          variant="danger"
          className="font-semibold tracking-tighter grid grid-cols-[20px_1fr_20px] px-4 w-full py-0"
        >
          <Trash className="inline-block mr-1.5 size-5" />
          <span className="py-3">Resetiraj sve rezervacije</span>
        </Button>
      </div>
    </>
  );
}
