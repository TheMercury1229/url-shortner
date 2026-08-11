"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Link2, LogOut } from "lucide-react";

import { LinkifyLogo } from "@/components/linkify-logo";
import { useAuthStore } from "@/store/auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "All Links", href: "/all-links", icon: Link2 },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    router.push("/sign-in");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-1 py-2">
          <LinkifyLogo showLabel={state !== "collapsed"} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
