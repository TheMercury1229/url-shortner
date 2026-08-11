import type { ReactNode } from "react";

import { OurNavbar } from "@/components/auth/auth-navbar";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <OurNavbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
