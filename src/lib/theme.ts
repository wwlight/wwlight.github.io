export type ResolvedTheme = "dark" | "light";
export type ThemePreference = ResolvedTheme | "system";

export const THEME_STORAGE_KEY = "starlight-theme";
/** 视口高度页面时的基准过渡时长（ms） */
export const THEME_TRANSITION_DURATION = 400;
export const THEME_TRANSITION_EASING = "ease-in-out";

/** 长页面（如管理端）延长后的时长上限（ms） */
const DURATION_MAX = 1000;
/** 超出视口高度对时长的影响系数，越小增长越慢 */
const HEIGHT_FACTOR = 0;
const ANIMATION = { fill: "both" as const, easing: THEME_TRANSITION_EASING };

/** 等待下一帧，确保 View Transition 伪元素已挂载再启动 WAAPI */
function raf() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

/** 等待若干帧，让 theme-transition-freeze 样式完成布局后再截图 */
async function waitFrames(count: number) {
  for (let i = 0; i < count; i++) await raf();
}

/** 强制同步布局，避免 View Transition 仍按切换前的整页高度截图 */
function flushFreezeLayout() {
  void document.documentElement.getBoundingClientRect();
  void document.body.getBoundingClientRect();
}

function pageExceedsViewport() {
  return document.documentElement.scrollHeight > window.innerHeight + 1;
}

/**
 * 按页面高度阻尼计算过渡时长。
 * 管理端书签列表页面很高，整页快照会导致默认 400ms 不够用；
 * 仅将超出视口的部分按 HEIGHT_FACTOR 计入，避免时长暴涨。
 */
function transitionDuration() {
  const scale = document.documentElement.scrollHeight / window.innerHeight;
  if (scale <= 1) return THEME_TRANSITION_DURATION;
  const damped = 1 + (scale - 1) * HEIGHT_FACTOR;
  return Math.round(Math.min(DURATION_MAX, THEME_TRANSITION_DURATION * damped));
}

/** 以点击位置为圆心，生成外扩（切到 light）与内收（切到 dark）的 clip-path 关键帧 */
function clipPaths(x: number, y: number, radius: number) {
  const at = `${x}px ${y}px`;
  return {
    grow: [`circle(0px at ${at})`, `circle(${radius}px at ${at})`] as [string, string],
    shrink: [`circle(${radius}px at ${at})`, `circle(0px at ${at})`] as [string, string],
  };
}

/** 在 View Transition 伪元素上执行 Web Animations API 动画 */
function animatePseudo(
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  pseudoElement: string,
  duration: number,
) {
  return document.documentElement.animate(keyframes, { ...ANIMATION, duration, pseudoElement })
    .finished;
}

/** lockViewport 返回的滚动位置，用于过渡结束后还原 */
type ScrollLock = { scrollX: number; scrollY: number };

/**
 * 切换前锁定当前视口。
 * root 快照默认按整页高度截图，长页面会导致 clip-path 失效；
 * 固定 body 并写入 CSS 变量，配合 view-transition-theme.css 只过渡可见区域。
 */
function lockViewport(duration: number): ScrollLock {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const root = document.documentElement;
  root.classList.add("theme-transition-freeze");
  root.style.setProperty("--theme-transition-duration", `${duration}ms`);
  root.style.setProperty("--theme-scroll-lock-x", `${-scrollX}px`);
  root.style.setProperty("--theme-scroll-lock-y", `${-scrollY}px`);
  return { scrollX, scrollY };
}

/** 过渡结束：移除锁定样式并恢复滚动位置 */
function unlockViewport({ scrollX, scrollY }: ScrollLock) {
  const root = document.documentElement;
  root.classList.remove("theme-transition-freeze");
  root.style.removeProperty("--theme-transition-duration");
  root.style.removeProperty("--theme-scroll-lock-x");
  root.style.removeProperty("--theme-scroll-lock-y");
  window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
}

function setTransitionDuration(duration: number) {
  document.documentElement.style.setProperty("--theme-transition-duration", `${duration}ms`);
}

function clearTransitionDuration() {
  document.documentElement.style.removeProperty("--theme-transition-duration");
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "system";
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

/** 将 localStorage 偏好同步到 class + data-theme（Starlight 首屏可能只有 data-theme） */
export function syncStoredTheme() {
  applyThemePreference(getStoredThemePreference());
}

/** shadcn class 策略 + data-theme（控制 View Transition 伪元素层级） */
export function applyResolvedTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function applyThemePreference(preference: ThemePreference) {
  applyResolvedTheme(resolveTheme(preference));
}

/**
 * 圆形揭示主题切换：以点击位置为圆心。
 * - 切到 dark：old 层内收
 * - 切到 light：new 层外扩
 */
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
  const duration = transitionDuration();
  const needsViewportLock = pageExceedsViewport();
  const scroll = needsViewportLock ? lockViewport(duration) : null;
  setTransitionDuration(duration);

  if (needsViewportLock) {
    flushFreezeLayout();
    await waitFrames(2);
  }

  try {
    const transition = document.startViewTransition(() => applyResolvedTheme(next));
    await transition.ready;
    await raf();

    const { grow, shrink } = clipPaths(x, y, endRadius);

    if (next === "dark") {
      await Promise.all([
        animatePseudo(
          { clipPath: shrink, opacity: [1, 0.82] },
          "::view-transition-old(root)",
          duration,
        ),
        animatePseudo({ opacity: [0.82, 1] }, "::view-transition-new(root)", duration),
      ]);
    } else {
      await animatePseudo({ clipPath: grow }, "::view-transition-new(root)", duration);
    }
  } catch {
    applyResolvedTheme(next);
  } finally {
    if (scroll) unlockViewport(scroll);
    clearTransitionDuration();
  }
}

export function toggleThemeWithTransition(event: { clientX: number; clientY: number }) {
  const next = getResolvedTheme() === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  void setThemeWithTransition(next, event);
  return next;
}
