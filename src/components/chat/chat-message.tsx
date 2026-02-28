/** biome-ignore-all lint/suspicious/noExplicitAny: UIMessagePart from ai package uses any for tool types */
import type { UIMessage, UIMessagePart } from "ai";
import { memo } from "react";
import { Message, MessageContent } from "@/components/ui/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { Source, SourceContent, SourceTrigger } from "@/components/ui/source";
import { cn } from "@/lib/utils";
import { Tool, type ToolPart } from "../ui/tool";
import { AssistantMessageActions, UserMessageActions } from "./message-actions";

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

const getMessageText = (parts: UIMessagePart<any, any>[]) =>
  parts
    .map((part) => (part.type === "text" ? part.text : null))
    .filter(Boolean)
    .join("");

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message.role === "assistant";
    const messageText = getMessageText(message.parts);

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
              {messageText}
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
            <AssistantMessageActions
              isLastMessage={isLastMessage}
              textToCopy={messageText}
            />
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="max-w-[85%] whitespace-pre-wrap rounded-3xl bg-muted px-5 py-2.5 text-primary sm:max-w-[75%]">
              {messageText}
            </MessageContent>
            <UserMessageActions textToCopy={messageText} />
          </div>
        )}
      </Message>
    );
  }
);

MessageComponent.displayName = "MessageComponent";
