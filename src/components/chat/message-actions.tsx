"use client";

import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { memo } from "react";
import { sileo } from "sileo";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  MessageAction,
  MessageActions as MessageActionsRoot,
} from "@/components/ui/message";
import { cn } from "@/lib/utils";

const actionsClass =
  "flex gap-0 transition-opacity duration-150 group-hover:opacity-100 md:opacity-0";

export interface AssistantMessageActionsProps {
  isLastMessage: boolean;
  textToCopy: string;
}

export const AssistantMessageActions = memo(
  ({ isLastMessage, textToCopy }: AssistantMessageActionsProps) => {
    const [, copy] = useCopyToClipboard();

    const handleCopy = () => {
      copy(textToCopy)
        .then(() => sileo.success({ title: "Copied!" }))
        .catch(() => sileo.error({ title: "Failed to copy" }));
    };

    return (
      <MessageActionsRoot
        className={cn(
          "-ml-2.5",
          actionsClass,
          isLastMessage && "group-hover:opacity-100 md:opacity-100"
        )}
      >
        <MessageAction delayDuration={100} tooltip="Copy">
          <Button
            className="rounded-full"
            onClick={handleCopy}
            size="icon"
            variant="ghost"
          >
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
      </MessageActionsRoot>
    );
  }
);

AssistantMessageActions.displayName = "AssistantMessageActions";

export interface UserMessageActionsProps {
  textToCopy: string;
}

export const UserMessageActions = memo(
  ({ textToCopy }: UserMessageActionsProps) => {
    const [, copy] = useCopyToClipboard();

    const handleCopy = () => {
      copy(textToCopy)
        .then(() => sileo.success({ title: "Copied!" }))
        .catch(() => sileo.error({ title: "Failed to copy" }));
    };

    return (
      <MessageActionsRoot className={actionsClass}>
        <MessageAction delayDuration={100} tooltip="Copy">
          <Button
            className="rounded-full"
            onClick={handleCopy}
            size="icon"
            variant="ghost"
          >
            <Copy />
          </Button>
        </MessageAction>
      </MessageActionsRoot>
    );
  }
);

UserMessageActions.displayName = "UserMessageActions";
