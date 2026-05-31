import {
  SITE_STORAGE_KEYS,
  migrateAllLegacyStorageKeys,
} from "@/lib/site-storage";
import { syncSiteFavicon } from "@/lib/generated-logo";

export type ResolvedTheme = "dark" | "light";
export type ThemePreference = ResolvedTheme | "system";

const THEME_PREFERENCES: ThemePreference[] = ["dark", "light", "system"];

function parseThemePreference(stored: string | null): ThemePreference {
  if (stored === "dark" || stored === "light" || stored === "system")
    return stored;
  return "system";
}

function persistThemePreference(stored: string | null, preference: ThemePreference) {
  if (typeof localStorage === "undefined")
    return;
  if (stored !== preference)
    localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export const THEME_STORAGE_KEY = SITE_STORAGE_KEYS.colorMode;
export const THEME_TRANSITION_DURATION = 400;
export const THEME_TRANSITION_EASING = "ease-in-out";

const ANIMATION = { fill: "both" as const, easing: THEME_TRANSITION_EASING };

function raf() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function clipPaths(x: number, y: number, radius: number) {
  const at = `${x}px ${y}px`;
  return {
    grow: [`circle(0px at ${at})`, `circle(${radius}px at ${at})`] as [string, string],
    shrink: [`circle(${radius}px at ${at})`, `circle(0px at ${at})`] as [string, string],
  };
}

function animatePseudo(
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  pseudoElement: string,
  duration: number,
) {
  return document.documentElement.animate(keyframes, { ...ANIMATION, duration, pseudoElement })
    .finished;
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof localStorage === "undefined") return "system";
  migrateAllLegacyStorageKeys();
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const preference = parseThemePreference(stored);
  persistThemePreference(stored, preference);
  return preference;
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return getSystemTheme();
  return preference;
}

export function getResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  const root = document.documentElement;
  if (root.classList.contains("dark") || root.dataset.theme === "dark") return "dark";
  if (root.classList.contains("light") || root.dataset.theme === "light") return "light";
  return resolveTheme(getStoredThemePreference());
}

export function syncStoredTheme() {
  applyThemePreference(getStoredThemePreference());
}

/** shadcn class 策略 + data-theme（控制 View Transition 伪元素层级） */
export function applyResolvedTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  syncSiteFavicon();
}

export function applyThemePreference(preference: ThemePreference) {
  applyResolvedTheme(resolveTheme(preference));
}

export function storeThemePreference(preference: ThemePreference) {
  if (typeof localStorage === "undefined") return;
  if (!THEME_PREFERENCES.includes(preference))
    return;
  localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export function setThemePreference(preference: ThemePreference) {
  storeThemePreference(preference);
  applyThemePreference(preference);
}

export async function setThemePreferenceWithTransition(
  preference: ThemePreference,
  event: { clientX: number; clientY: number },
) {
  storeThemePreference(preference);
  await setThemeWithTransition(resolveTheme(preference), event);
}

/** 圆形揭示：切 dark 时 old 内收，切 light 时 new 外扩 */
export async function setThemeWithTransition(
  next: ResolvedTheme,
  event: { clientX: number; clientY: number },
) {
  const canTransition =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canTransition || getResolvedTheme() === next) {
    applyResolvedTheme(next);
    return;
  }

  const { clientX: x, clientY: y } = event;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  try {
    const transition = document.startViewTransition(() => applyResolvedTheme(next));
    await transition.ready;
    await raf();

    const { grow, shrink } = clipPaths(x, y, endRadius);

    if (next === "dark") {
      await animatePseudo(
        { clipPath: shrink },
        "::view-transition-old(root)",
        THEME_TRANSITION_DURATION,
      );
    } else {
      await animatePseudo(
        { clipPath: grow },
        "::view-transition-new(root)",
        THEME_TRANSITION_DURATION,
      );
    }
  } catch {
    applyResolvedTheme(next);
  }
}

export function toggleThemeWithTransition(event: { clientX: number; clientY: number }) {
  const next = getResolvedTheme() === "dark" ? "light" : "dark";
  storeThemePreference(next);
  void setThemeWithTransition(next, event);
  return next;
}
