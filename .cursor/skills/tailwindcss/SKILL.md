---
name: tailwindcss
description: Tailwind CSS v4 utilities, arbitrary values, and wwlight styling conventions. Use when writing or reviewing className, @apply, @theme, scrollbars, Starlight/shadcn surfaces, or migrating bracket-heavy classes.
---

# Tailwind CSS（本仓库 · v4）

官方文档：[Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)、[Theme variables](https://tailwindcss.com/docs/theme)。

## 本仓库接入

| 项 | 路径 |
| --- | --- |
| 版本 | Tailwind **4**（`@tailwindcss/vite`） |
| Starlight | `src/styles/global.css` — `@import 'tailwindcss/theme.css'` / `utilities.css` |
| 书签 | `src/styles/bookmarks-theme-shared.css` — `@import 'tailwindcss'` |
| shadcn 语义色 | `src/styles/shadcn-theme.css` — `@theme inline` 映射 `--primary`、`--border` 等 |
| 暗色变体 | `@custom-variant dark`（`.dark` + `[data-theme='dark']`） |
| 主题圆角工具类 | `theme-r-sm` … `theme-r-xl`（`src/theme/styles/radius.css`） |

改 token 优先 `@theme` / 现有 CSS 变量，不要为已有 scale 重复造 utility。

---

## 何时不用方括号（优先）

**设计 scale 内建的 utility 直接写类名，不要写成 arbitrary。**

| ❌ 多余 | ✅ 推荐 |
| --- | --- |
| `p-[1]`、`m-[4]`、`gap-[2]` | `p-1`、`m-4`、`gap-2` |
| `text-[14px]`（可用 scale 时） | `text-sm` / `text-base` |
| `rounded-[0.25rem]`（已有 token） | `rounded-md` 或 `theme-r-lg`（跟 `--radius`） |
| `w-full`、`flex-1` | 同样不要用 `w-[100%]` |

方括号留给 **scale 没有的值**（如 `top-[117px]`、`max-h-[min(85vh,720px)]`、`text-[11px]` 非标准字号）。

---

## 何时用方括号（arbitrary）

1. **任意长度/颜色/比例**：`w-[19.5rem]`、`min-h-[calc(4rem+2.5rem+1px)]`
2. **任意属性**：`[mask-type:luminance]`、`[--scroll-offset:56px]`
3. **任意变体**：`[&>li]:py-2`、`lg:[&:nth-child(-n+3)]:hover:underline`
4. **空格**：用 `_` — `grid-cols-[1fr_500px_2fr]`
5. **calc**：空格改 `_` — `w-[calc(100%_-_2rem)]`

重复出现 ≥3 次的 `[&…]` 模式，考虑 `@custom-variant` 或 `@utility`（写在 CSS，勿复制一长串 class）。

---

## CSS 变量：v4 简写（优先于 `[var(...)]`）

引用自定义属性时，用 **括号简写**，不必写 `var()`：

| ❌ 冗长 | ✅ v4 |
| --- | --- |
| `bg-[var(--sl-color-gray-5)]` | `bg-(--sl-color-gray-5)` |
| `text-[var(--primary)]` | `text-(--primary)` 或语义类 `text-primary` |
| `border-[var(--border)]` | `border-border`（已在 `@theme inline`） |

类型歧义时加 hint（官方 [Resolving ambiguities](https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities)）：

- 字号：`text-(length:--my-var)`
- 颜色：`text-(color:--my-var)`

Starlight 变量（`--sl-color-*`）无 shadcn 别名时用 `bg-(--sl-color-black)` 等；书签页优先 `bg-card`、`text-foreground`、`border-border`。

---

## 扩展方式（CSS 内）

```css
@theme { --color-brand: #0ea5e9; }          /* 新 token → 自动生成 bg-brand 等 */
@utility content-auto { content-visibility: auto; }
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
@layer components { .card { … } }            /* 可被 utility 覆盖的组件类 */
```

功能性 utility 用 `@utility name-*` + `--value()` / `--modifier()`（见官方 Adding custom utilities）。

---

## 本仓库固定约定

### 滚动条

可滚动区：**`app-scrollbar`** + `overflow-*` + 限高；flex 子项滚动加 **`min-h-0`**。

```tsx
<div className="app-scrollbar max-h-96 min-h-0 flex-1 overflow-y-auto p-3" />
```

横向 Tab 隐藏滚动条：`overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden`（见 `SectionTabsNav.tsx`）。

**禁止**：在组件里写 `<style>` / CSS 模块 / 内联样式定制 `::-webkit-scrollbar`；不要复制 `scrollbars.css` 里 `@apply` 组合。

定义见 `src/styles/scrollbars.css`；书签/管理端入口已 `@import`；Starlight 新区域不生效时在 `global.css` 补 `scrollbars.css`。

### 主题相关样式

- 配色 token、圆角：`src/theme/styles/`（见 `src/theme/README.md`）
- 通用布局/Starlight：`src/styles/`

### 写法习惯

- React/Astro：**`className` + `cn()`**，与现有组件一致
- 避免无意义的 `!`（除非覆盖第三方，如 Hero 对齐 Starlight）
- 新 UI 优先语义色 + spacing scale；仅像素级微调再用 arbitrary

---

## 快速对照（Agent 自检）

1. 能用 `p-3`、`gap-1.5`、`size-2.5` 吗？→ 去掉 `p-[12px]` 类写法  
2. 用的是 `--sl-*` / `--primary` 吗？→ 试 `bg-(--sl-color-gray-5)`，别 `bg-[var(...)]`  
3. 是可滚动面板吗？→ `app-scrollbar` + `min-h-0`  
4. 同一 arbitrary 重复多次吗？→ 提到 `@theme` 或 `@utility`

---

## 参考

- wwlight 总览：`.cursor/skills/wwlight-project/SKILL.md`
- 主题系统：`src/theme/README.md`
