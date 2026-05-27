"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const schema = z
  .object({
    full_name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_pass: z.string(),
    role: z.enum(["retail", "wholesale"]),
    gstin: z.string().optional(),
    company_name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_pass, {
    message: "Passwords must match",
    path: ["confirm_pass"],
  });

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"retail" | "wholesale">("retail");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "retail" },
  });

  const selectAccountType = (type: "retail" | "wholesale") => {
    setAccountType(type);
    setValue("role", type);
  };

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
          gstin: data.gstin,
          company_name: data.company_name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (authData.user && authData.session) {
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        role: data.role,
        gstin: data.role === "wholesale" ? data.gstin : null,
        company_name: data.role === "wholesale" ? data.company_name : null,
      }).eq("id", authData.user.id);

      if (profileError) {
        toast.error(profileError.message);
        return;
      }
    }

    toast.success(authData.session ? "Account created!" : "Check your email to confirm your account.");
    router.push(authData.session ? "/" : "/auth/login");
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-surface-2 p-5 shadow-sm sm:p-8">
        <p className="text-center font-display text-xl tracking-[0.14em] text-primary sm:text-2xl sm:tracking-[0.2em]">
          MODERN HOMES
        </p>
        <p className="mt-2 text-center text-sm text-text-muted">Create your account</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {(["retail", "wholesale"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => selectAccountType(type)}
              className={cn(
                "rounded-xl border-2 p-4 text-left capitalize transition",
                accountType === type
                  ? "border-accent bg-accent/5"
                  : "border-border bg-white hover:border-accent/50",
              )}
            >
              <p className="font-semibold text-primary">{type}</p>
              <p className="mt-1 text-xs text-text-muted">
                {type === "retail"
                  ? "Individual & home use"
                  : "Trade & bulk buyers"}
              </p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <input type="hidden" {...register("role")} />

          <input
            {...register("full_name")}
            placeholder="Full Name *"
            className={inputClass}
          />
          {errors.full_name ? (
            <p className="text-sm text-red-600">{errors.full_name.message}</p>
          ) : null}

          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="Email *"
            className={inputClass}
          />
          {errors.email ? (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          ) : null}

          <input
            {...register("phone")}
            placeholder="Phone *"
            className={inputClass}
          />
          {errors.phone ? (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          ) : null}

          <input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="Password *"
            className={inputClass}
          />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}

          <input
            {...register("confirm_pass")}
            type="password"
            autoComplete="new-password"
            placeholder="Confirm Password *"
            className={inputClass}
          />
          {errors.confirm_pass ? (
            <p className="text-sm text-red-600">{errors.confirm_pass.message}</p>
          ) : null}

          {accountType === "wholesale" ? (
            <>
              <input {...register("gstin")} placeholder="GSTIN" className={inputClass} />
              <input
                {...register("company_name")}
                placeholder="Company Name"
                className={inputClass}
              />
            </>
          ) : null}

          <Button type="submit" loading={isSubmitting} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
