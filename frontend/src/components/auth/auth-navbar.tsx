"use client";
import Link from "next/link";
import { Menu } from "lucide-react";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LinkifyLogo } from "@/components/linkify-logo";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const landingLinks = [
  { href: "/#hero", label: "Hero" },
  { href: "/#features", label: "Features" },
  { href: "/#howitworks", label: "How it works" },
  { href: "/#cta", label: "CTA" },
];

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

export function OurNavbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <LinkifyLogo />

        <nav className="hidden flex-1 justify-center gap-2 md:flex">
          {landingLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/home">Dashboard</Link>
              </Button>
              <UserAvatar />
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(22rem,100vw)]">
              <SheetHeader className="border-b border-border/60 px-6 py-5">
                <SheetTitle>
                  <LinkifyLogo />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-2 px-6 py-5">
                {landingLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </div>

              <SheetFooter className="border-t border-border/60 px-6 py-5 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-1 mb-2">
                      <UserAvatar />
                      <span className="font-semibold text-sm">{user.username}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/home">Go to Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
