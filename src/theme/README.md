# 主题系统（`src/theme`）

全站明暗模式 + Primary / Neutral / Radius 配色定制。按功能分子目录，生成物与手写代码分开。

- 仓库总览：[README.md](../../README.md#主题系统)
- Agent 约定：`.cursor/skills/wwlight-project/SKILL.md` →「主题切换」

## 目录

| 路径 | 职责 |
| --- | --- |
| `color-mode/` | 亮/暗/跟随系统、`data-theme`、View Transition 切换 |
| `customizer/` | 配色状态、选项清单、`localStorage`、触发器 Tailwind 类 |
| `site/` | 从 storage 同步 DOM、跨标签页 `storage` 事件 |
| `components/` | React / Astro UI（面板、触发器、Provider） |
| `styles/` | CSS token 与工具类（含 `vpr generate:color-themes` 产出）；定制器 chrome 见 `customizer-ui.css` |
| `scripts/` | 首屏内联脚本（`vpr generate:theme-init` 产出） |

## 生成命令

```bash
vpr generate:color-themes   # styles/neutral-scales.css + color-tokens.css + customizer/options.json
vpr generate:theme-init     # scripts/init.inline.js
```

数据源：`scripts/color-themes.data.mjs`（勿手改生成 CSS/JSON）。色值引用 Tailwind `--color-*`：内置五档来自 `tailwindcss/theme.css`；`taupe` / `mauve` / `mist` / `olive` 由生成器写入 `neutral-scales.css`。

## Primary `black`

运行时 `--primary` 亮 `zinc-950` / 暗 `white`（`tailwindPrimaryTokens`）。Panel 与触发器色块用 `--theme-primary-swatch-black`（`customizer-trigger.css`，暗色同为 white）；触发器在已选 black 时走该变量而非 `var(--primary)`。

## 定制器 UI

触发器 / Popover 容器用 `customizer-ui.css` 的 `--theme-ui-*` token（`data-theme-surface`）。Panel 选项 hover / 选中样式在 `surface.ts`（与 `286a2de` 一致：`hover:bg-accent/50`、Starlight `gray-6`）。

## 已知限制

- **legacy `data-color-theme`**：与 `data-color-primary` 同步，供旧选择器；移除前需全库检索。
- **Color Mode 面板**：同页切换靠本地 state；跨标签靠 `subscribeSiteThemeStorage`，无独立 color-mode store。

## 对外入口

- `@/theme` — 常用 API 桶导出
- `@/theme/components/ColorThemePicker` — 书签/管理端触发器别名
- `@/theme/components/ColorThemeSelect.astro` — Starlight 静态触发器 + Popover 挂载点
