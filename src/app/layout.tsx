import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/provider/client-provider";

export const metadata: Metadata = {
  title: "Mindustry Chatbot",
  description: "A chatbot for the game Mindustry",
  openGraph: {
    title: "Mindustry Chatbot",
    description: "A chatbot for the game Mindustry",
    images: ["/images/mindustry.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindustry Chatbot",
    description: "A chatbot for the game Mindustry",
    images: ["/images/mindustry.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          fetchPriority="high"
          href="https://fonts.cdnfonts.com/css/pp-neue-montreal"
          rel="stylesheet"
        />
      </head>
      <body className={"antialiased"}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
