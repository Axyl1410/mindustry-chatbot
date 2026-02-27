"use client";

import Image from "next/image";
import { sileo } from "sileo";
import { ChatHeader } from "@/components/chat-header";
import { Button } from "@/components/ui/button";

export function Chat() {
  const handleClick = () => {
    sileo.info({
      title: "Changes saved",
      description: "Changes saved successfully",
    });
  };

  return (
    <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
      <ChatHeader />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
          <Image
            alt="Next.js logo"
            className="dark:invert"
            height={38}
            priority
            src="/next.svg"
            width={180}
          />
          <ol className="list-inside list-decimal text-center text-sm/6 sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">
                src/app/page.tsx
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly.
            </li>
          </ol>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button onClick={handleClick}>Read our docs</Button>
          </div>
        </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="File icon"
              aria-hidden
              height={16}
              src="/file.svg"
              width={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="Globe icon"
              aria-hidden
              height={16}
              src="/globe.svg"
              width={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4" />
    </div>
  );
}
