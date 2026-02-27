"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sileo";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "./ui/tooltip";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={(resolvedTheme ?? "system") as "light" | "dark" | "system"}
    />
  );
}

export default function Provider({ children }: { children: React.ReactNode }) {
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
