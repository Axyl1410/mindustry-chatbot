"use client";

import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppInfoTrigger } from "../app-info/app-info-trigger";
import { PlusIcon } from "../icons";
import { useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ChatHeader() {
  const router = useRouter();
  const { open } = useSidebar();

  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || isMobile) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              // className="order-2 ml-auto md:order-1 md:ml-0"
              className="order-1 ml-0"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              size={isMobile ? "default" : "icon"}
              variant="outline"
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="hidden md:block">New Chat</TooltipContent>
        </Tooltip>
      )}

      <AppInfoTrigger
        trigger={
          <Button
            // className="order-3 hidden md:ml-auto md:flex"
            className="order-3 ml-auto flex"
            size="icon"
            variant="ghost"
          >
            <InfoIcon />
          </Button>
        }
      />
    </header>
  );
}
