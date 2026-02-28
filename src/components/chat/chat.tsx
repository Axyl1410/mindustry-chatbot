import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import {
  AlertTriangle,
  ArrowUp,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { memo, useState } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { PulseLoader } from "@/components/ui/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { cn } from "@/lib/utils";

interface MessageComponentProps {
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

const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0 text-foreground">
        <PulseLoader />
      </div>
    </div>
  </Message>
));

LoadingMessage.displayName = "LoadingMessage";

const ErrorMessage = memo(({ error }: { error: Error }) => (
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

export function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat();

  const handleSubmit = () => {
    if (!input.trim()) {
      return;
    }

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col bg-background">
      <ChatHeader />

      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">
        <ChatContainerContent
          className="space-y-12 px-4 py-12"
          scrollClassName="scrollbar-hide"
        >
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;

            return (
              <MessageComponent
                isLastMessage={isLastMessage}
                key={message.id}
                message={message}
              />
            );
          })}

          {status === "submitted" && <LoadingMessage />}
          {status === "error" && error && <ErrorMessage error={error} />}
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
        <PromptInput
          className="relative z-10 w-full rounded-3xl border border-input bg-popover p-0 pt-1 shadow-xs"
          isLoading={status !== "ready"}
          onSubmit={handleSubmit}
          onValueChange={setInput}
          value={input}
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
              placeholder="Ask anything"
            />

            <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 p-2">
              <div />
              <div className="flex items-center gap-2">
                <Button
                  className="size-9 rounded-full"
                  disabled={
                    !input.trim() || (status !== "ready" && status !== "error")
                  }
                  onClick={handleSubmit}
                  size="icon"
                >
                  {status === "ready" || status === "error" ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
