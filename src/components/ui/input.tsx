import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  ref,
  className,
  type,
  hint,
  value,
  invalid,
  unwrapped = false,
  ...props
}: React.ComponentProps<"input"> & {
  ref?: React.RefObject<HTMLInputElement | null>;
  hint?: string;
  invalid?: boolean;
  /** 供 InputGroup 使用，跳过 hint 外层容器 */
  unwrapped?: boolean;
}) {
  const showHint = Boolean(hint) && !String(value ?? "");

  const input = (
    <input
      type={type}
      value={value}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        hint ? "placeholder:text-transparent" : "placeholder:text-muted-foreground",
        "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_hsl(--background)] [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(--foreground)]",
        invalid &&
          "border-destructive bg-destructive/5 focus-visible:ring-destructive aria-invalid:border-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  );

  if (unwrapped) return input;

  return (
    <div className={cn(hint && "relative")}>
      {input}
      {showHint ? (
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground",
            invalid && "text-destructive/70",
          )}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export { Input };
