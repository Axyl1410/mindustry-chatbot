"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="en">
      <body>
        <Empty className="flex h-screen w-full items-center justify-center">
          <EmptyHeader>
            <EmptyTitle>Something went wrong!</EmptyTitle>
            <EmptyDescription>
              {error.message || "Something went wrong. Please try again later."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link
                  href="https://github.com/Axyl1410/mindustry-chatbot/issues/new"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Contact support
                </Link>
              </Button>
              <Button asChild onClick={() => reset()}>
                <button type="button">Try again</button>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </body>
    </html>
  );
}
