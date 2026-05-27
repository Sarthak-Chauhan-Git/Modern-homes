"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();
    const { data: authData, error } =
      await supabase.auth.signInWithPassword(data);

    if (error) {
      const message = error.message?.toLowerCase() ?? "";
      if (
        message.includes("email not confirmed") ||
        message.includes("confirm your email")
      ) {
        toast.error(
          "Please check your email and confirm your account before logging in.",
        );
      } else {
        toast.error(error.message);
      }
      return;
    }

    const fullName = authData?.user?.user_metadata?.full_name as
      | string
      | undefined;
    const fallback = authData?.user?.email?.split("@")[0];
    const firstName = fullName?.split(" ")[0];
    const greetName = firstName || fullName || fallback;
    toast.success(greetName ? `Welcome back, ${greetName}!` : "Welcome back!");
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface-2 p-5 shadow-sm sm:p-8">
      <p className="text-center font-display text-xl tracking-[0.14em] text-primary sm:text-2xl sm:tracking-[0.2em]">
        MODERN HOMES
      </p>
      <p className="mt-2 text-center text-sm text-text-muted">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="Email"
            className={inputClass}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password"
            className={inputClass}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-text-muted hover:text-accent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <p className="text-right text-sm">
          <span className="text-text-muted">Forgot password?</span>
        </p>

        <Button type="submit" loading={isSubmitting} className="w-full">
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        New customer?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-accent hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Suspense
        fallback={<div className="text-center text-text-muted">Loading...</div>}
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
