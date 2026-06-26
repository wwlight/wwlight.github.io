# 主题系统（`src/theme`）

全站明暗模式 + Primary / Neutral / Radius 配色定制。页面入口在 `components/`；逻辑在 `lib/`（无 JSX）。

- 仓库总览：[README.md](../../README.md#主题系统)
- 技术文档：博客 [主题系列](/blog/theme/)（定制器与偏好 → Token 生成 → 色彩模式 → 双 Surface）
- Agent 约定：本文；路由与规范见 `.serena/memories/core.md` 及 `mem:conventions`

## 目录

| 路径 | 职责 |
| --- | --- |
| `lib/color-mode/` | 亮/暗逻辑（`color-mode.ts`） |
| `lib/customizer/` | 配色 state、`options` + `options.json`、`trigger-classes`、`surface` |
| `lib/site/` | storage → DOM 同步、跨标签 `storage` 事件、`data-attributes` |
| `components/color-mode/` | 书签页 `Provider.tsx` |
| `components/customizer/` | Panel、Trigger、Popover、Starlight 触发器 |
| `components/hero/` | Starlight Hero 随机主题按钮 |
| `styles/` | CSS token 与工具类（含 `vpr generate:color-themes` 产出） |
| `scripts/` | 首屏内联脚本（`vpr generate:theme-init` 产出） |
| `index.ts` | 公共 API 桶导出（`@/theme`） |

## 生成命令

```bash
vpr generate:color-themes   # styles/neutral-scales.css + color-tokens.css + lib/customizer/options.json
vpr generate:theme-init     # scripts/init.inline.js
```

数据源：`scripts/color-themes.data.mjs`（勿手改生成 CSS/JSON）。

## Primary `black`

运行时 `--primary` 亮 `zinc-950` / 暗 `white`。Panel 与触发器色块用 `--theme-primary-swatch-black`（`customizer-trigger.css`）。

## 定制器 UI

触发器 / Popover 用 `customizer-ui.css` 的 `--theme-ui-*`。Panel 选项样式在 `lib/customizer/surface.ts`。

## 已知限制

- **legacy `data-color-theme`**：与 `data-color-primary` 同步，供旧选择器；移除前需全库检索。
- **Color Mode 面板**：同页本地 state；跨标签靠 `subscribeSiteThemeStorage`。
- **`lockDocumentScroll`**（`lib/color-mode/color-mode.ts`）：仅 View Transition 切换主题时用，勿照搬为弹层锁滚动（见 `mem:conventions` 反模式）。

## 对外入口

- `@/theme` — **桶导出**（color-mode、customizer、site/sync 等）；模块外与 `components/*` 优先从此导入，勿写 `@/theme/lib/.../file`
- `@/theme/components/customizer/ColorThemePicker` — 书签/管理端触发器
- `@/theme/components/customizer/ColorThemeSelect.astro` — Starlight 静态触发器

`lib/` 内部互相用相对路径，避免经 `@/theme` 回环。
