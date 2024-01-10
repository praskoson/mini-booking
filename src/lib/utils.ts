import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colorList = [
  "rgb(171 188 133 / 0.7)",
  "rgb(71 139 162 / 0.7)",
  "rgb(222 91 109 / 0.7)",
  "rgb(233 118 91 / 0.7)",
  "rgb(242 164 144 / 0.7)",
];
