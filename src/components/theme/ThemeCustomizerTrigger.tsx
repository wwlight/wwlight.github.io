import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeCustomizerPanel } from "@/components/theme/ThemeCustomizerPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  getDocumentPrimaryThemeId,
} from "@/lib/color-theme";
import {
  themeCustomizerPopoverClass,
  themeCustomizerTriggerButtonClass,
  themeCustomizerTriggerLabelClass,
  themeCustomizerTriggerSwatchClass,
} from "@/lib/theme-customizer-trigger-styles";
import { PRIMARY_THEMES } from "@/lib/theme-options";
import { subscribeSiteThemeStorage, syncSiteThemeFromStorage } from "@/lib/site-theme";

interface ThemeCustomizerTriggerProps {
  variant?: "bookmarks" | "starlight";
  className?: string;
}

export function ThemeCustomizerTrigger({
  variant = "bookmarks",
  className,
}: ThemeCustomizerTriggerProps) {
  const [open, setOpen] = useState(false);
  const [primaryId, setPrimaryId] = useState(getDocumentPrimaryThemeId);
  const isStarlight = variant === "starlight";

  useEffect(() => {
    syncSiteThemeFromStorage();

    return subscribeSiteThemeStorage(() => {
      setPrimaryId(getDocumentPrimaryThemeId());
    });
  }, []);

  const selected = PRIMARY_THEMES.find((theme) => theme.id === primaryId) ?? PRIMARY_THEMES[0];

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={themeCustomizerTriggerButtonClass(variant, className)}
          aria-label="主题设置"
        >
          <span
            className={themeCustomizerTriggerSwatchClass(isStarlight ? "starlight" : "bookmarks")}
            style={{ backgroundColor: "var(--primary)" }}
            aria-hidden
          />
          <span className={themeCustomizerTriggerLabelClass()}>{selected.label}</span>
          <Settings2 className="size-3.5 shrink-0 opacity-60" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className={themeCustomizerPopoverClass(variant)}
      >
        <ThemeCustomizerPanel
          variant={variant}
          open={open}
          onUpdated={() => setPrimaryId(getDocumentPrimaryThemeId())}
        />
      </PopoverContent>
    </Popover>
  );
}
