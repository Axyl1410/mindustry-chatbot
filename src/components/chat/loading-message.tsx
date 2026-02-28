"use client";

import { memo } from "react";
import { PulseLoader } from "@/components/ui/loader";
import { Message } from "@/components/ui/message";

export const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0 text-foreground">
        <PulseLoader />
      </div>
    </div>
  </Message>
));

LoadingMessage.displayName = "LoadingMessage";
