import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChatbotError, type ErrorCode } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = (await response.json()) as {
      code: ErrorCode;
      cause: string;
    };
    throw new ChatbotError(code, cause);
  }

  return response.json();
};
