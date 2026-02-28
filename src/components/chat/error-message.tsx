"use client";

import { memo } from "react";
import { Message } from "@/components/ui/message";
import { SystemMessage } from "@/components/ui/system-message";

export const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <SystemMessage className="w-full" fill variant="error">
      {error.message}
    </SystemMessage>
  </Message>
));

ErrorMessage.displayName = "ErrorMessage";
