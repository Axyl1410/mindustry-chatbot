"use client";

import { InfoIcon } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppInfoContent } from "./app-info-content";

interface AppInfoTriggerProps {
  trigger?: React.ReactNode;
}

export function AppInfoTrigger({ trigger }: AppInfoTriggerProps) {
  const isMobile = useIsMobile();

  const defaultTrigger = (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <InfoIcon className="size-4" />
      About Mindustry Chatbot
    </DropdownMenuItem>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
        <DrawerContent className="border-border bg-background">
          <DrawerHeader>
            <Image
              alt="Mindustry Chatbot"
              className="h-32 w-full object-cover"
              draggable={false}
              height={128}
              src="/mindustry.webp"
              width={400}
            />
            <DrawerTitle className="hidden">Mindustry Chatbot</DrawerTitle>
            <DrawerDescription className="hidden">
              Your minimalist AI chat companion
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <AppInfoContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-3xl p-0 shadow-xs sm:max-w-md [&>button:last-child]:rounded-full [&>button:last-child]:bg-background [&>button:last-child]:p-1">
        <DialogHeader className="p-0">
          <Image
            alt="Mindustry Chatbot"
            className="h-32 w-full object-cover"
            draggable={false}
            height={128}
            src="/mindustry.webp"
            width={400}
          />
          <DialogTitle className="hidden">Mindustry Chatbot</DialogTitle>
          <DialogDescription className="hidden">
            Your minimalist AI chat companion
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <AppInfoContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
