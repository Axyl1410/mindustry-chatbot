import type { UIMessage } from "ai";
import { AlertTriangle, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { PulseLoader } from "@/components/ui/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import { cn } from "@/lib/utils";

export interface MessageComponentProps {
  isLastMessage: boolean;
  message: UIMessage;
}

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message.role === "assistant";

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0">
            <MessageContent
              className="prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0 text-foreground"
              markdown
            >
              {message.parts
                .map((part) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100"
              )}
            >
              <MessageAction delayDuration={100} tooltip="Copy">
                <Button className="rounded-full" size="icon" variant="ghost">
                  <Copy />
                </Button>
              </MessageAction>
              <MessageAction delayDuration={100} tooltip="Upvote">
                <Button className="rounded-full" size="icon" variant="ghost">
                  <ThumbsUp />
                </Button>
              </MessageAction>
              <MessageAction delayDuration={100} tooltip="Downvote">
                <Button className="rounded-full" size="icon" variant="ghost">
                  <ThumbsDown />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="max-w-[85%] whitespace-pre-wrap rounded-3xl bg-muted px-5 py-2.5 text-primary sm:max-w-[75%]">
              {message.parts
                .map((part) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              )}
            >
              <MessageAction delayDuration={100} tooltip="Copy">
                <Button className="rounded-full" size="icon" variant="ghost">
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    );
  }
);

MessageComponent.displayName = "MessageComponent";

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

export const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1 text-primary">
        <AlertTriangle className="text-red-500" size={16} />
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  </Message>
));

ErrorMessage.displayName = "ErrorMessage";
