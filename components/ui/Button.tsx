import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const baseClasses =
  "inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-60 [&>svg]:shrink-0";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-[0_10px_30px_rgba(184,150,46,0.35)] hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(184,150,46,0.45)]",
  secondary:
    "border border-accent/70 text-accent hover:bg-accent/10 hover:translate-y-[-1px] hover:shadow-[0_10px_30px_rgba(184,150,46,0.2)]",
  ghost: "bg-transparent text-white/90 hover:bg-white/10",
  danger:
    "bg-red-600 text-white hover:bg-red-700 hover:translate-y-[-1px] shadow-[0_10px_25px_rgba(220,38,38,0.35)]",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1fc75c] hover:translate-y-[-1px] shadow-[0_10px_25px_rgba(37,211,102,0.35)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm md:px-6 md:text-base",
  lg: "h-12 px-5 text-sm md:px-7 md:text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size={18} className="shrink-0 text-current" /> : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
