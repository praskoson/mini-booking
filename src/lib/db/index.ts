import { openDB, DBSchema } from "idb";

export type Booking = {
  id: number;
  from: Date;
  to: Date;
  name: string;
  contact: string;
  notes: string;
};

export interface BookingDb extends DBSchema {
  "favourite-number": {
    key: string;
    value: number;
  };
  bookings: {
    value: Booking;
    key: string;
    // indexes: { "by-price": number };
  };
}

const DATABASE_NAME = "booking_db";
const VERSION = 1;

async function initDb() {
  const db = await openDB<BookingDb>(DATABASE_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("bookings")) {
        db.createObjectStore("bookings", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
}

export const addBooking = async (booking: Omit<Booking, "id">) => {
  const db = await initDb();
  const tx = db.transaction("bookings", "readwrite");
  const store = tx.objectStore("bookings");
  // @ts-expect-error id is autoincremented
  store.add(booking);
  await tx.done;
};

export const getBookingById = async (id: number) => {
  const db = await initDb();
  const tx = db.transaction("bookings", "readonly");
  const store = tx.objectStore("bookings");
  // @ts-expect-error autoincrement is weird
  return store.get(id);
};

export const getBookings = async () => {
  const db = await initDb();
  const tx = db.transaction("bookings", "readonly");
  const store = tx.objectStore("bookings");
  return store.getAll();
};

export const deleteBookingById = async (id: number) => {
  const db = await initDb();
  const tx = db.transaction("bookings", "readwrite");
  const store = tx.objectStore("bookings");
  // @ts-expect-error autoincrement is weird
  store.delete(id);
  await tx.done;
};

export const deleteAllBookings = async () => {
  const db = await initDb();
  const tx = db.transaction("bookings", "readwrite");
  const store = tx.objectStore("bookings");
  store.clear();
  await tx.done;
};
