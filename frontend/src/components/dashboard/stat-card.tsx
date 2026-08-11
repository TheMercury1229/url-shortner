import * as React from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
};

export function StatCard({ label, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
