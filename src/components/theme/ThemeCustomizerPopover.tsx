import { useEffect, useRef, useState } from "react";
import { ThemeCustomizerPanel } from "@/components/theme/ThemeCustomizerPanel";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { syncSiteThemeFromStorage, subscribeSiteThemeStorage } from "@/lib/site-theme";
import {
  THEME_CUSTOMIZER_TRIGGER_SELECTOR,
  themeCustomizerPopoverClass,
} from "@/lib/theme-customizer-trigger-styles";

interface ThemeCustomizerPopoverProps {
  variant?: "bookmarks" | "starlight";
}

function isThemeCustomizerTrigger(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(THEME_CUSTOMIZER_TRIGGER_SELECTOR));
}

export function ThemeCustomizerPopover({ variant = "starlight" }: ThemeCustomizerPopoverProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    syncSiteThemeFromStorage();

    const unsubscribeStorage = subscribeSiteThemeStorage(() => {});

    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      anchorRef.current = event.currentTarget as HTMLElement;
      setOpen((prev) => !prev);
    };

    const triggers = document.querySelectorAll<HTMLElement>(THEME_CUSTOMIZER_TRIGGER_SELECTOR);
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", onClick);
    });

    return () => {
      unsubscribeStorage();
      triggers.forEach((trigger) => {
        trigger.removeEventListener("click", onClick);
      });
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(THEME_CUSTOMIZER_TRIGGER_SELECTOR).forEach((trigger) => {
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor virtualRef={anchorRef} />
      <PopoverContent
        align="end"
        sideOffset={8}
        className={themeCustomizerPopoverClass(variant)}
        onPointerDownOutside={(event) => {
          if (isThemeCustomizerTrigger(event.target))
            event.preventDefault();
        }}
        onFocusOutside={(event) => {
          if (isThemeCustomizerTrigger(event.target))
            event.preventDefault();
        }}
      >
        <ThemeCustomizerPanel variant={variant} open={open} />
      </PopoverContent>
    </Popover>
  );
}
