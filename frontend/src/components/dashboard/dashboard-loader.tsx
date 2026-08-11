import * as React from "react";
import { Spinner } from "@/components/ui/spinner";

type DashboardLoaderProps = {
  message?: string;
};

export function DashboardLoader({ message = "Loading..." }: DashboardLoaderProps) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
