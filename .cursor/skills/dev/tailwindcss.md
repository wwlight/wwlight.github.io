# Tailwind v4

v4 现行写法；IDE 提示 “can be written as …” 时采纳。官方：[Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)。

- scale：`p-1`、`min-h-15`、`min-w-32`、`z-60`，勿 `p-[1]`、`min-h-[60px]`
- CSS 变量：`bg-(--primary)`、`text-(--sl-color-text)`，勿 `bg-[var(--primary)]`
- data：`data-state-open:`、`data-disabled:`、`group-data-state-open:`，勿 `data-[state=open]:`
- 渐变：`bg-linear-to-*`，勿 `bg-gradient-to-*`
- 重复 ≥3 次 → `src/styles/tailwind-utilities.css` `@utility`，并在 `global.css` + `bookmarks-theme-shared.css` 引入
- 方括号保留：`color-mix`、`calc()`、复杂 `shadow-[...]`

校验：`vpr lint` / `vpr build`；`rg 'bg-gradient-to-'` 查遗留。
