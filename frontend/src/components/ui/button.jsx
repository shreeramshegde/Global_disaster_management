import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-400 shadow-glow",
    secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
    ghost: "bg-transparent text-slate-200 hover:bg-white/10"
  };

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
