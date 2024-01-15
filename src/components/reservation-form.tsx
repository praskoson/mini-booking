import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./ui/drawer";
import { addBooking } from "@/lib/db";
import { router } from "@/router";
import { cn } from "@/lib/utils";

const inputClasses =
  "flex h-9 w-full rounded-md border border-stone-600 bg-transparent px-3 py-1 text-base shadow-sm transition-colors";

export function ReservationForm({ onClose }: { onClose: () => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addBooking({
        from: new Date(from),
        to: new Date(to),
        name,
        contact,
        notes,
      });
      router.invalidate();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DrawerContent>
      <form onSubmit={handleAddTodo} className="py-4 text-stone-50">
        <DrawerHeader>
          <DrawerTitle>Nova rezervacija</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-y-4 px-8">
          {/* {format} */}
          <div className="grid grid-cols-[72px_1fr] gap-4">
            <label htmlFor="from" className="self-center text-sm font-medium">
              Od
            </label>
            <input
              className={cn(inputClasses)}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              type="date"
              id="from"
              required
            />
            <label htmlFor="to" className="self-center text-sm font-medium">
              Do
            </label>
            <input
              className={inputClasses}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              type="date"
              id="to"
              required
            />
            <label htmlFor="name" className="self-center text-sm font-medium">
              Ime
            </label>
            <input
              className={inputClasses}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              required
            />
            <label htmlFor="contact" className="self-center text-sm font-medium">
              Kontakt
            </label>
            <input
              className={inputClasses}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              id="contact"
            />
            <label htmlFor="notes" className="mt-2 self-start text-sm font-medium">
              Napomene
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              id="notes"
              className="w-full rounded-md border border-stone-600 bg-transparent px-3 py-2"
            />
          </div>
        </div>
        <DrawerFooter className="mt-4 items-center">
          <Button variant="primary" className="w-full max-w-lg text-sm">
            Dodaj
          </Button>
          <DrawerClose
            type="button"
            className="w-full max-w-lg rounded-xl px-6 py-3 text-sm ring-1 ring-stone-600"
          >
            Poništi
          </DrawerClose>
        </DrawerFooter>
      </form>
    </DrawerContent>
  );
}
