import { useChat } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageComponent } from "@/components/chat/chat-message";
import { ChatSuggestions } from "@/components/chat/chat-suggestions";
import { ErrorMessage } from "@/components/chat/error-message";
import { LoadingMessage } from "@/components/chat/loading-message";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { ScrollButton } from "../ui/scroll-button";

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

      <ChatContainerRoot className="scrollbar-hide relative flex-1 space-y-0 overflow-y-auto">
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
        <div className="absolute inset-x-0 bottom-2">
          <div className="relative mx-auto flex max-w-4xl justify-end px-2 md:px-4">
            <ScrollButton variant={"default"} />
          </div>
        </div>
      </ChatContainerRoot>

      <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl flex-col gap-3 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
        <ChatSuggestions
          onSuggestionClick={setInput}
          show={messages.length === 0}
        />
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
