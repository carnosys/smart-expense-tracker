import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({
  children,
  className = "",
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={`glass-panel rounded-[2rem] ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
