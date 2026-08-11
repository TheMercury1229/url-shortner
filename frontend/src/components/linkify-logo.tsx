import { Link2, MousePointerIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";

type LinkifyLogoProps = {
  className?: string;
  showLabel?: boolean;
};

export function LinkifyLogo({ className, showLabel = true }: LinkifyLogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className={cn("flex items-center gap-3", className)}>
        <MousePointerIcon className="size-5" />
        {showLabel && (
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Linkify
          </span>
        )}
      </div>
    </Link>
  );
}
