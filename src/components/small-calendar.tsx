import { cn, colorList } from "@/lib/utils";
import {
  type NormalizedInterval,
  eachDayOfInterval,
  format,
  interval,
  isWithinInterval,
  isSameDay,
  addDays,
  subDays,
} from "date-fns";
import { hr } from "date-fns/locale";
import { CSSProperties } from "react";

const groupBy = <T,>(array: T[], getKey: (item: T) => string) => {
  return array.reduce(
    (result, currentValue) => {
      (result[getKey(currentValue)] ??= []).push(currentValue);
      return result;
    },
    {} as Record<string, T[]>,
  );
};

export function SmallCalendar({ from, to, id }: { from: Date; to: Date; id: number }) {
  const stayInterval = interval(from, to);
  const allDays = eachDayOfInterval({
    start: subDays(from, 8),
    end: addDays(to, 8),
  });
  const allDaysByMonths = groupBy(allDays, (date) => format(date, "LLLL, yyyy.", { locale: hr }));

  return (
    <div className="relative mx-auto max-h-[280px] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl bg-white py-6 text-stone-900">
      {Object.keys(allDaysByMonths).map((val) => (
        <div className="px-8" key={val}>
          <span className="mb-1 text-xs uppercase text-stone-500">{val}</span>
          <div className="grid grid-cols-7 gap-y-3">
            {allDaysByMonths[val].map((day) => (
              <DrawDay key={format(day, "yyyy-MM-dd")} day={day} interval={stayInterval} id={id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DrawDay({
  day,
  interval,
  id,
}: {
  day: Date;
  id: number;
  interval: NormalizedInterval<Date>;
}) {
  const isInterval = isWithinInterval(day, interval);
  const isStart = isSameDay(day, interval.start);
  const isEnd = isSameDay(day, interval.end);
  const color = colorList[id % colorList.length];

  return (
    <span
      style={{ "--marker-bg": color } as CSSProperties}
      className={cn("text-center font-semibold text-stone-950", {
        "bg-[--marker-bg]": isInterval || isStart,
        "rounded-l-md": isStart,
        "rounded-r-md": isEnd,
      })}
    >
      {format(day, "d")}
    </span>
  );
}
