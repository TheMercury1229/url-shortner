"use client";

import { LinkifyLogo } from "@/components/linkify-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";

export function DashboardHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Mobile sidebar trigger — only visible on mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <LinkifyLogo />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right-side controls */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserAvatar />
      </div>
    </header>
  );
}

function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  const initial = user?.username?.[0]?.toUpperCase() ?? "U";

  return (
    <Avatar>
      <AvatarImage src="" alt={user?.username ?? "User"} />
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );
}
