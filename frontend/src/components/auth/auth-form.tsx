"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

type AuthMode = "sign-in" | "sign-up";

type AuthValues = {
  username: string;
  email?: string;
  password: string;
};

const copy: Record<
  AuthMode,
  { title: string; description: string; submitLabel: string }
> = {
  "sign-in": {
    title: "Welcome back",
    description: "Jump back in and keep your links moving.",
    submitLabel: "Sign in",
  },
  "sign-up": {
    title: "Create your account",
    description: "Start with a clean workspace for your short links.",
    submitLabel: "Sign up",
  },
};

import { toast } from "sonner";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuthStore();

  const form = useForm<AuthValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const isSignUp = mode === "sign-up";
  const redirectHref = isSignUp ? "/sign-in" : "/sign-up";
  const redirectLabel = isSignUp ? "Sign in" : "Sign up";

  const onSubmit = async (values: AuthValues) => {
    setAuthError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await register(values.username, values.email || "", values.password);
        toast.success("Account created successfully!");
      } else {
        await login(values.username, values.password);
        toast.success("Welcome back!");
      }

      const destination = searchParams.get("next") || "/home";
      router.push(destination);
    } catch (err: any) {
      const msg = err?.message || "An authentication error occurred.";
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {copy[mode].title}
        </CardTitle>
        <CardDescription className="text-base leading-7 text-muted-foreground">
          {copy[mode].description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {authError && (
            <div
              role="alert"
              className="text-sm font-medium text-destructive bg-destructive/10 rounded-lg p-3 text-center border border-destructive/20"
            >
              {authError}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor={`${mode}-username`}>Username</FieldLabel>
            <FieldContent>
              <Input
                id={`${mode}-username`}
                autoComplete="username"
                placeholder="Your username"
                disabled={loading}
                {...form.register("username", { required: true })}
              />
            </FieldContent>
          </Field>

          {isSignUp && (
            <Field>
              <FieldLabel htmlFor={`${mode}-email`}>Email</FieldLabel>
              <FieldContent>
                <Input
                  id={`${mode}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  {...form.register("email", { required: true })}
                />
              </FieldContent>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor={`${mode}-password`}>Password</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  id={`${mode}-password`}
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="Enter your password"
                  className="pr-11"
                  disabled={loading}
                  {...form.register("password", { required: true })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </FieldContent>
          </Field>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin size-4" />
                {mode === "sign-in" ? "Signing in..." : "Signing up..."}
              </>
            ) : (
              <>
                {copy[mode].submitLabel}
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pt-0 text-sm text-muted-foreground">
        {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
        <Link href={redirectHref} className="font-medium text-foreground">
          {redirectLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}

