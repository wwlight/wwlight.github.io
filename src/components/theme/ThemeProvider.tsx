import {
  applyResolvedTheme,
  getResolvedTheme,
  getStoredThemePreference,
  resolveTheme,
  setThemeWithTransition,
  storeThemePreference,
  syncStoredTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";
import { syncSiteThemeFromStorage, subscribeSiteThemeStorage } from "@/lib/site-theme";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
};

type ThemeProviderState = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference, event?: React.MouseEvent) => void;
  toggleTheme: (event: React.MouseEvent) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof localStorage === "undefined") return defaultTheme;
    return getStoredThemePreference();
  });

  const resolvedTheme = resolveTheme(theme);

  useEffect(() => {
    syncSiteThemeFromStorage();
  }, []);

  useEffect(() => {
    return subscribeSiteThemeStorage(() => {
      setThemeState(getStoredThemePreference());
    });
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyResolvedTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback(
    (next: ThemePreference, event?: React.MouseEvent) => {
      storeThemePreference(next);
      const nextResolved = resolveTheme(next);
      if (event) {
        void setThemeWithTransition(nextResolved, event).then(() => {
          setThemeState(next);
        });
        return;
      }
      setThemeState(next);
      applyResolvedTheme(nextResolved);
    },
    [],
  );

  const toggleTheme = useCallback(
    (event: React.MouseEvent) => {
      const nextResolved: ResolvedTheme = getResolvedTheme() === "dark" ? "light" : "dark";
      setTheme(nextResolved, event);
    },
    [setTheme],
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
