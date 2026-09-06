import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SpinnerIcon } from "./icons";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-stone-900 text-white hover:bg-stone-800 focus-visible:outline-stone-900",
  secondary:
    "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand",
  outline:
    "border border-stone-300 text-stone-900 hover:border-stone-900 hover:bg-stone-50 focus-visible:outline-stone-900",
  ghost:
    "text-stone-700 hover:bg-stone-100 focus-visible:outline-stone-400",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

const BASE =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", loading, fullWidth, className, children, ...props },
    ref,
  ) {
    const classes = cn(
      BASE,
      VARIANTS[variant],
      SIZES[size],
      fullWidth && "w-full",
      className,
    );

    const content = (
      <>
        {loading && <SpinnerIcon className="h-4 w-4" />}
        {children}
      </>
    );

    if ("href" in props && props.href !== undefined) {
      const { href, ...rest } = props as ButtonAsLink;
      return (
        <Link
          href={href}
          ref={ref}
          className={classes}
          {...rest}
        >
          {content}
        </Link>
      );
    }

    const { disabled, ...rest } = props as ButtonAsButton;
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...rest}
      >
        {content}
      </button>
    );
  },
);
