import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Layers3,
  Link2,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { OurNavbar } from "@/components/auth/auth-navbar";

const features = [
  {
    title: "Fast links",
    description: "Create short links without digging through extra screens.",
    icon: Link2,
    span: "md:col-span-2",
  },
  {
    title: "Clean dashboard",
    description: "A quiet workspace that keeps the main action obvious.",
    icon: Layers3,
  },
  {
    title: "Reliable by design",
    description: "Simple flows, clear states, and predictable behavior.",
    icon: ShieldCheck,
  },
  {
    title: "Quick insights",
    description: "See the important link details at a glance.",
    icon: Gauge,
  },
  {
    title: "Flexible enough",
    description: "Built to grow into landing content later without rework.",
    icon: WandSparkles,
  },
];

const steps = [
  "Sign in or create an account in a few seconds.",
  "Paste your long URL and generate a short one.",
  "Share it and come back to track what matters.",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <OurNavbar />

      <main className="flex-1">
        <section
          id="hero"
          className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Simple link management
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Short links made clean, fast, and easy.
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Linkify keeps the focus on the task. No noise, no gradients,
                  just a minimal flow for creating and using short links.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/sign-up">
                    Get started
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 rounded-4xl border border-border/60 bg-card p-4 sm:p-5">
              <div className="rounded-3xl border border-border/60 bg-background p-5">
                <p className="text-sm font-medium text-muted-foreground">
                  Recent activity
                </p>
                <div className="mt-3 space-y-3 text-sm text-foreground">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 px-4 py-3">
                    <span>linkify.app/launch</span>
                    <span className="text-muted-foreground">128 clicks</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 px-4 py-3">
                    <span>linkify.app/demo</span>
                    <span className="text-muted-foreground">82 clicks</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 px-4 py-3">
                    <span>linkify.app/docs</span>
                    <span className="text-muted-foreground">61 clicks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="mb-6 max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Features
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Small set of tools, arranged clearly.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className={`rounded-4xl border border-border/60 bg-card p-6 ${feature.span ?? ""}`}
                >
                  <div className="flex size-11 items-center justify-center rounded-3xl bg-muted text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="howitworks"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="max-w-xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                How it works
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Three steps, nothing more.
              </h2>
            </div>

            <div className="grid gap-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-4xl border border-border/60 bg-card p-5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-3xl bg-muted text-sm font-semibold text-foreground">
                    0{index + 1}
                  </div>
                  <p className="pt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="rounded-4xl border border-border/60 bg-card p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Ready to start
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Make your first short link in a minute.
                </h2>
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  Keep it simple now. Add more later when the product needs it.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/sign-up">
                    Create account
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Linkify</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-in">Sign in</Link>
            <Link href="/sign-up">Sign up</Link>
            <Link href="/#features">Features</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
