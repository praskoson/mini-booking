import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./ui/drawer";
import { addBooking } from "@/lib/db";
import { router } from "@/router";
import { cn } from "@/lib/utils";

const inputClasses =
  "flex h-9 w-full rounded-md border border-stone-700 bg-transparent px-3 py-1 text-base shadow-sm transition-colors";

export function ReservationForm({ onClose }: { onClose: () => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addBooking({ from: new Date(from), to: new Date(to), name, contact, notes });
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
            <label htmlFor="from" className="font-medium text-sm self-center">
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
            <label htmlFor="to" className="font-medium text-sm self-center">
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
            <label htmlFor="name" className="font-medium text-sm self-center">
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
            <label htmlFor="contact" className="font-medium text-sm self-center">
              Kontakt
            </label>
            <input
              className={inputClasses}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              id="contact"
            />
            <label htmlFor="notes" className="font-medium text-sm self-start mt-2">
              Napomene
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              id="notes"
              className="w-full rounded-md border border-stone-700 bg-transparent px-3 py-2"
            />
          </div>
        </div>
        <DrawerFooter className="mt-4 items-center">
          <Button variant="primary" className="text-sm w-full max-w-lg">
            Dodaj
          </Button>
          <DrawerClose
            type="button"
            className="text-sm ring-1 rounded-xl ring-stone-700 py-3 px-6 w-full max-w-lg"
          >
            Poništi
          </DrawerClose>
        </DrawerFooter>
      </form>
    </DrawerContent>
  );
}
