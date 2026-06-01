# Tailwind CSS（v4）

官方文档：[Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)、[Theme variables](https://tailwindcss.com/docs/theme)。

改 token 优先 `@theme` / 现有 CSS 变量，不要为已有 scale 重复造 utility。

**项目接入**（框架入口、`@theme` 映射、滚动条约定等）：见**该仓库 project skill** 的 Tailwind 章节，不在本文重复。

---

## 何时不用方括号（优先）

**设计 scale 内建的 utility 直接写类名，不要写成 arbitrary。**

| ❌ 多余 | ✅ 推荐 |
| --- | --- |
| `p-[1]`、`m-[4]`、`gap-[2]` | `p-1`、`m-4`、`gap-2` |
| `text-[14px]`（可用 scale 时） | `text-sm` / `text-base` |
| `rounded-[0.25rem]`（已有 token） | `rounded-md` 或项目圆角 token 类 |
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
| `bg-[var(--my-color)]` | `bg-(--my-color)` |
| `text-[var(--primary)]` | `text-(--primary)` 或语义类（若已在 `@theme inline` 映射） |

类型歧义时加 hint（官方 [Resolving ambiguities](https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities)）：

- 字号：`text-(length:--my-var)`
- 颜色：`text-(color:--my-var)`

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

## 写法习惯

- React/Astro：**`className` + `cn()`**（或项目等价工具）
- 避免无意义的 `!`（除非覆盖第三方）
- 新 UI 优先语义色 + spacing scale；仅像素级微调再用 arbitrary

---

## 快速对照（Agent 自检）

1. 能用 `p-3`、`gap-1.5`、`size-2.5` 吗？→ 去掉 `p-[12px]` 类写法  
2. 引用 CSS 变量吗？→ 试 `bg-(--my-var)`，别 `bg-[var(...)]`  
3. 同一 arbitrary 重复多次吗？→ 提到 `@theme` 或 `@utility`  
4. 项目有滚动条 / 主题 / 框架集成约定吗？→ 读**该项目 skill**，不在本文假设
