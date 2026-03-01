"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sileo";
import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "./theme-provider";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={(resolvedTheme ?? "system") as "light" | "dark" | "system"}
    />
  );
}

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <TooltipProvider>
        <ThemedToaster />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
