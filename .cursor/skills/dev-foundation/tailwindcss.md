# Tailwind v4

项目接入（入口 CSS、scrollbars、theme-r-*）→ **project skill**。

## 按 v4 最新要求书写

- **新代码与改 className 时**：用 Tailwind **v4 现行工具类**，勿抄 v3 / 旧文档里的 legacy 名；IDE（Tailwind IntelliSense / ESLint）提示 “can be written as …” 时优先采纳。
- **渐变**：线性渐变用 `bg-linear-to-{方向}`（如 `bg-linear-to-br`、`bg-linear-to-r`），勿 `bg-gradient-to-*`（v3 旧名，v4 仍可能编译但会告警）。
- 下表与 [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide) 对齐；未列出的仍按官方 v4 文档与 IntelliSense 为准。

## 规则

- scale 有则用 `p-1`、`gap-2`、`min-h-15`、`min-w-32`、`z-60`，勿 `p-[1]`、`min-h-[60px]`、`min-w-[8rem]`
- CSS 变量：`bg-(--primary)`、`text-(--sl-color-text)`、`h-(--radix-select-trigger-height)`，勿 `bg-[var(--primary)]`、`h-[var(--x)]`
- 长度变量：`text-(length:--sl-text-sm)`，勿 `text-[length:var(--sl-text-sm)]`
- Radix / 组件 `data-*`：`data-state-open:`、`data-state-active:`、`data-disabled:`、`data-side-bottom:`；组合用 `group-data-state-open:`
- 关键字：`rounded-inherit`、`cursor-inherit`；`!` 后置：`gap-0.5em!`、`size-em!`
- 方括号保留：渐变 / `color-mix` / `min()` / `calc()` / `grid-cols-[repeat(...)]`、复杂 `shadow-[...]`、单次非 scale 尺寸
- 重复 ≥3 次 → `src/styles/tailwind-utilities.css` 的 `@utility`（如 `text-badge`、`stroke-icon`），并在 `global.css` + 书签 `bookmarks-theme-shared.css` 引入该文件
- token 优先 `@theme` / 现有 CSS 变量

## 常见替换

| 旧 | 新 |
| --- | --- |
| `min-w-[8rem]` | `min-w-32` |
| `min-h-[60px]` | `min-h-15` |
| `z-[1]` / `z-[100]` | `z-1` / `z-100` |
| `data-[state=open]:` | `data-state-open:` |
| `data-[disabled]:` | `data-disabled:` |
| `data-[side=bottom]:` | `data-side-bottom:` |
| `group-data-[state=open]:` | `group-data-state-open:` |
| `text-[var(--sl-color-text)]` | `text-(--sl-color-text)` |
| `text-[10px]`（多处） | `text-badge` |
| `[&_svg]:stroke-[1.85]` | `[&_svg]:stroke-icon` |
| `cursor-[inherit]` | `cursor-inherit` |
| `rounded-[inherit]` | `rounded-inherit` |
| `bg-gradient-to-br` / `bg-gradient-to-r` / `bg-gradient-to-tr` / `bg-gradient-to-l` | `bg-linear-to-br` / `bg-linear-to-r` / `bg-linear-to-tr` / `bg-linear-to-l` |

## 扩展（CSS）

```css
@utility text-badge {
  font-size: 0.625rem;
  line-height: 0.875rem;
}

@theme { --color-brand: …; }
@custom-variant …;
```

## 校验

改 className 后：`vpr lint`、`vpr build`。全库可 `rg 'bg-gradient-to-'` 排查遗留 v3 渐变类名。

官方：[Upgrade guide](https://tailwindcss.com/docs/upgrade-guide) · [Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)
