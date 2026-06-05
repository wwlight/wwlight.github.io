/**
 * 功能：带 shake 动画的 Label + Input + 校验提示。
 * 关联：EditDialog.tsx、BookmarkEditFields.tsx
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ShakeInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  shakeKey: number;
  invalid?: boolean;
  errorMessage?: string;
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  inputMode?: "url" | "text";
  type?: string;
}

export function ShakeInputField({
  id,
  label,
  value,
  onChange,
  shakeKey,
  invalid,
  errorMessage,
  placeholder,
  ariaLabel,
  autoFocus,
  inputMode,
  type = "text",
}: ShakeInputFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div
        key={invalid ? `${id}-shake-${shakeKey}` : id}
        className={cn(invalid && shakeKey > 0 && "animate-input-shake")}
      >
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          invalid={invalid}
          aria-label={ariaLabel ?? label}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </div>
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
