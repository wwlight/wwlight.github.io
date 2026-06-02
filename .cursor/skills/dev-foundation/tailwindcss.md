# Tailwind v4

项目接入（入口 CSS、scrollbars、theme-r-*）→ **project skill**。

## 规则

- scale 有则用 `p-1`、`gap-2`，勿 `p-[1]`
- CSS 变量：`bg-(--var)`、`text-(--primary)`，勿 `bg-[var(...)]`
- 方括号仅：非 scale 值、`[&>li]:…`、重复 ≥3 次提 `@utility` / `@theme`
- token 优先 `@theme` / 现有 CSS 变量

## 扩展（CSS）

```css
@theme { --color-brand: …; }
@utility …;
@custom-variant …;
```

官方：[Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)
