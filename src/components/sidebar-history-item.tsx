import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

interface ChatItemProps {
  href: string;
  isActive?: boolean;
  onClick?: () => void;
  title: string;
}

export function ChatItem({ title, href, isActive, onClick }: ChatItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href} onClick={onClick}>
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
