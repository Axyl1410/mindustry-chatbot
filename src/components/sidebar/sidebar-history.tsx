"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChatItem } from "./sidebar-history-item";

const mockChatSections = {
  today: [
    { id: "1", title: "Mindustry basics" },
    { id: "2", title: "Optimizing copper production" },
  ],
  yesterday: [
    { id: "3", title: "Logic processor examples" },
    { id: "4", title: "Surge alloy strategy" },
  ],
  lastWeek: [
    { id: "5", title: "Campaign progression tips" },
    { id: "6", title: "Unit control and routing" },
  ],
  lastMonth: [{ id: "7", title: "Late game power setups" }],
  older: [{ id: "8", title: "Sandbox testing ideas" }],
};

export function SidebarHistory({ user }: { user: unknown }) {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const id = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : null;

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            Login to save and revisit previous chats!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <div className="flex flex-col gap-6">
            {mockChatSections.today.length > 0 && (
              <div>
                <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                  Today
                </div>
                {mockChatSections.today.map((chat) => (
                  <ChatItem
                    href={`/chat/${chat.id}`}
                    isActive={chat.id === id}
                    key={chat.id}
                    onClick={() => setOpenMobile(false)}
                    title={chat.title}
                  />
                ))}
              </div>
            )}

            {mockChatSections.yesterday.length > 0 && (
              <div>
                <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                  Yesterday
                </div>
                {mockChatSections.yesterday.map((chat) => (
                  <ChatItem
                    href={`/chat/${chat.id}`}
                    isActive={chat.id === id}
                    key={chat.id}
                    onClick={() => setOpenMobile(false)}
                    title={chat.title}
                  />
                ))}
              </div>
            )}

            {mockChatSections.lastWeek.length > 0 && (
              <div>
                <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                  Last 7 days
                </div>
                {mockChatSections.lastWeek.map((chat) => (
                  <ChatItem
                    href={`/chat/${chat.id}`}
                    isActive={chat.id === id}
                    key={chat.id}
                    onClick={() => setOpenMobile(false)}
                    title={chat.title}
                  />
                ))}
              </div>
            )}

            {mockChatSections.lastMonth.length > 0 && (
              <div>
                <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                  Last 30 days
                </div>
                {mockChatSections.lastMonth.map((chat) => (
                  <ChatItem
                    href={`/chat/${chat.id}`}
                    isActive={chat.id === id}
                    key={chat.id}
                    onClick={() => setOpenMobile(false)}
                    title={chat.title}
                  />
                ))}
              </div>
            )}

            {mockChatSections.older.length > 0 && (
              <div>
                <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                  Older than last month
                </div>
                {mockChatSections.older.map((chat) => (
                  <ChatItem
                    href={`/chat/${chat.id}`}
                    isActive={chat.id === id}
                    key={chat.id}
                    onClick={() => setOpenMobile(false)}
                    title={chat.title}
                  />
                ))}
              </div>
            )}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
