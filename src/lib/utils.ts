import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
function isPlainObject(value: any): value is object {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function omitEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];

    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (isPlainObject(value) && Object.keys(value).length === 0);

    if (!isEmpty) {
      result[key] = value;
    }
  }

  return result;
}

export function showErrors(error: Error, fallback: string) {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    // If backend returns the errors object
    if (data?.errors) {
      const allMessages = Object.values(data.errors).flat(); // array of strings
      console.log("👉 ~ onError ~ allMessages:", allMessages);

      allMessages.forEach((msg: any) => {
        toast.error(msg); // show each error separately
      });

      return;
    }

    // If no errors object, show single message
    toast.error(data?.message || fallback);
  } else {
    toast.error("Something went wrong.");
  }
}
