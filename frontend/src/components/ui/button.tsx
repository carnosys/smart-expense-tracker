import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Link, type LinkProps } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "ghost";

function getButtonClassName(variant: ButtonVariant) {
  const base =
    "inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

  if (variant === "secondary") {
    return `${base} glass-panel text-slate-900 hover:bg-white/90`;
  }

  if (variant === "ghost") {
    return `${base} bg-transparent text-slate-700 hover:bg-slate-900/5`;
  }

  return `${base} bg-blue-600 text-white shadow-[0_16px_35px_-20px_rgba(37,99,235,0.9)] hover:bg-blue-700`;
}

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={`${getButtonClassName(variant)} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = PropsWithChildren<
  LinkProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      variant?: ButtonVariant;
    }
>;

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${getButtonClassName(variant)} ${className}`.trim()} {...props}>
      {children}
    </Link>
  );
}
