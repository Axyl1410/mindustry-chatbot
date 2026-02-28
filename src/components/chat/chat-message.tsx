/** biome-ignore-all lint/suspicious/noExplicitAny: UIMessagePart from ai package uses any for tool types */
import type { UIMessage, UIMessagePart } from "ai";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { Source, SourceContent, SourceTrigger } from "@/components/ui/source";
import { cn } from "@/lib/utils";
import { Tool, type ToolPart } from "../ui/tool";

export interface MessageComponentProps {
  isLastMessage: boolean;
  message: UIMessage;
}

const renderToolPart = (
  part: UIMessagePart<any, any>,
  index: number
): React.ReactNode => {
  if (!part.type?.startsWith("tool-")) {
    return null;
  }

  return <Tool key={`${part.type}-${index}`} toolPart={part as ToolPart} />;
};

const getReasoningParts = (parts: UIMessagePart<any, any>[]) =>
  parts.filter((p) => p.type === "reasoning");

const getSourceUrlParts = (parts: UIMessagePart<any, any>[]) =>
  parts.filter((p) => p.type === "source-url");

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
          <div className="group flex w-full flex-col gap-2">
            <div className="w-full">
              {message?.parts
                .filter((part: any) => part.type?.startsWith("tool-"))
                .map((part: any, index: number) => renderToolPart(part, index))}
            </div>
            {(() => {
              const reasoningParts = getReasoningParts(message.parts);
              const reasoningText = reasoningParts
                .map((p) => (p as { text: string }).text)
                .join("");
              const isReasoningStreaming = reasoningParts.some(
                (p) => (p as { state?: string }).state === "streaming"
              );
              if (reasoningText) {
                return (
                  <Reasoning
                    className="w-full"
                    isStreaming={isReasoningStreaming}
                  >
                    <ReasoningTrigger>Thinking</ReasoningTrigger>
                    <ReasoningContent contentClassName="pt-2" markdown>
                      {reasoningText}
                    </ReasoningContent>
                  </Reasoning>
                );
              }
              return null;
            })()}
            <MessageContent
              className="prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0 text-foreground"
              markdown
            >
              {message.parts
                .map((part) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
            {(() => {
              const sourceParts = getSourceUrlParts(message.parts) as Array<{
                sourceId: string;
                url: string;
                title?: string;
              }>;
              if (sourceParts.length === 0) {
                return null;
              }
              return (
                <div className="flex flex-wrap gap-1.5">
                  {sourceParts.map((part) => {
                    let domain = part.url;
                    try {
                      domain = new URL(part.url).hostname;
                    } catch {
                      domain = part.url.split("/").pop() ?? part.url;
                    }
                    return (
                      <Source href={part.url} key={part.sourceId}>
                        <SourceTrigger
                          className="text-xs"
                          label={part.title ?? domain.replace("www.", "")}
                          showFavicon
                        />
                        <SourceContent
                          description={part.url}
                          title={part.title ?? domain}
                        />
                      </Source>
                    );
                  })}
                </div>
              );
            })()}
            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 transition-opacity duration-150 group-hover:opacity-100 md:opacity-0",
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
                "flex gap-0 transition-opacity duration-150 group-hover:opacity-100 md:opacity-0"
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
