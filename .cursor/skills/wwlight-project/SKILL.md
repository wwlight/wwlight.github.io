---
name: wwlight-project
description: Guides development on wwlight.github.io (Astro 6 + Starlight docs, bookmarks module, Mermaid, theme transitions, Tailwind CSS). Use when editing this repo, Starlight docs/blog, bookmarks admin, Mermaid diagrams, site navigation, theme switching, scrollable UI, or writing README.md.
---

# wwlight.github.io

个人站点：Starlight 文档站 + 书签公开页 + 本地管理端。

## 命令

Node.js **24**（`.node-version`）。

```bash
vp i              # 安装依赖（pnpm 11.4.0）
vpr dev           # 本地开发 http://localhost:4321（/bookmarks/ 与 /admin/bookmarks/）
vpr dev:admin     # 同上，就绪后自动打开管理端
vpr dev:all       # 同上，就绪后自动打开主站与管理端
vpr build
vpr lint
```

前台与管理端共用同一 Astro dev 进程，通过路径区分。

## 目录结构

| 路径 | 用途 |
| --- | --- |
| `src/content/docs/blog/` | 博客系列 MDX（sidebar autogenerate） |
| `src/content/docs/{memorandum,tools,system,other}/` | 其他文档分区 |
| `src/pages/bookmarks/` | 公开书签页（独立布局，非 Starlight） |
| `src/pages/admin/bookmarks.astro` | 管理端入口 |
| `src/components/bookmarks/public/` | 公开页 React |
| `src/components/admin/` | 管理端 React |
| `src/components/Footer.astro` | Starlight 页脚 + BackToTop |
| `db/data/bookmarks.ts` | 书签数据源（可提交 Git） |
| `integrations/bookmarks-admin.ts` | 开发态 API 中间件 |
| `integrations/mermaid-controls.ts` | Mermaid 缩放 / 全屏工具栏 |
| `pnpm-workspace.yaml` | pnpm catalog 版本源 + overrides / trustPolicy |
| `.node-version` | Node.js 24 |
| `scripts/dev-bootstrap.mjs` | dev 环境初始化与启动 |
| `scripts/dev-admin.mjs` | 启动 dev 并打开管理端 |
| `scripts/dev-all.mjs` | 启动 dev 并打开主站 + 管理端 |
| `scripts/open-browser.mjs` | 解析 Local URL 并打开浏览器 |

## Starlight 定制

配置在 `astro.config.mjs`：

- `mermaid()`（[astro-mermaid](https://github.com/joesaby/astro-mermaid)）在 `starlight()` **之前**
- `credits: false`
- `customCss`: `custom.css` + `global.css`（后者引入 shadcn 变量，供 BackToTop 等）

顶栏模块导航：`src/lib/site-nav.ts` + `ModuleNavLinks.astro`。新增文档分区时同步改 `sidebar` 与 `siteModuleNav`。

## Mermaid

使用 [astro-mermaid](https://github.com/joesaby/astro-mermaid) 集成：remark/rehype 在构建时将 ` ```mermaid ` 转为 `<pre class="mermaid">`，客户端按需渲染；`autoTheme: true` 跟随 `data-theme` 切换。

- `astro.config.mjs`：`mermaid({ autoTheme: true })` 置于 `starlight()` 之前
- `integrations/mermaid-controls.ts` + `src/scripts/mermaid-controls.ts` — 渲染完成后挂载缩放 / 全屏工具栏
- `markdown.syntaxHighlight.excludeLangs` 含 `mermaid`，避免 Shiki/Expressive Code 干扰

注意：flowchart 节点含 `?` 等特殊字符时需加引号，如 `B{"DEV?"}`。

## 主题切换

### 明暗模式

- 逻辑：`src/lib/theme.ts` — View Transition 圆形揭示
- 样式：`src/styles/view-transition-theme.css`
- 存储键：`SITE_STORAGE_KEYS.colorMode`（`wwlight:color-mode`，见 `src/lib/site-storage.keys.mjs`）

### 配色主题（shadcn Theme）

- 数据：`scripts/color-themes.data.mjs` → `vpr generate:color-themes` 生成 `src/styles/color-themes.css` 与 `src/lib/theme-options.json`
- 默认（对齐 [Nuxt UI](https://ui.nuxt.com/docs/getting-started/theme/design-system)）：Primary `green`、Neutral `slate`、Radius `0.25`、Color Mode `system`；面板内「重置」恢复上述值
- Primary 色值直接引用 Tailwind 色阶（亮 `500` / 暗 `400`，与 Nuxt `--ui-primary` 一致）；各 primary 统一用 `html[data-color-primary]` 选择器，含默认 green；shadcn 仍用 `--primary` / `--ring`，表面 token 不变
- 逻辑：`src/lib/color-theme.ts` — `data-color-primary` / `data-color-neutral` / `data-radius` + localStorage
- 存储：`src/lib/site-storage.keys.mjs` — 前缀 `SITE_STORAGE_PREFIX`（默认 `wwlight`），键如 `wwlight:color-primary`；改前缀后运行 `vpr generate:theme-init`
- 全站 localStorage（含管理端草稿 `wwlight:bookmarks-admin-draft`）共用 `src/lib/site-storage.ts` 迁移逻辑
- Starlight accent / gray：`--color-accent-*`、`--color-gray-*`（`@astrojs/starlight-tailwind` 官方映射）
- shadcn primary：同 CSS 内 `--primary` / `--ring` 明暗两套
- 面板：`ThemeCustomizerPanel.tsx`（Primary / Neutral / Radius / Color Mode；无 Font、Icons）
- 触发器：`ThemeCustomizerTrigger.tsx`（文档站 `ColorThemeSelect.astro`、书签/管理端 `ColorThemePicker`）
- 首屏：`theme-init.inline.js` 写入上述 data 属性

## 书签模块要点

- 数据流：`db/data/bookmarks.ts` → `db/seed.ts` → Astro DB → 公开页/管理端
- 管理端 API 仅 dev 可用
- 鉴权：`PUBLIC_BOOKMARKS_ADMIN_HASH`

## 依赖管理（pnpm catalog）

版本号**只**写在 `pnpm-workspace.yaml` 的 `catalogs` 里；`package.json` 用 `catalog:<组名>` 引用，不写 `^x.y.z`。

| catalog | 用途 |
| --- | --- |
| `astro` | Astro / Starlight / MDX |
| `frontend` | React、Tailwind、Radix、UI 工具 |
| `content` | Mermaid、rehype、sharp |
| `devtools` | ESLint、lint-staged、simple-git-hooks |
| `types` | `@types/*` |
| `build` | 构建链 pin（如 `vite`，供 `overrides` 引用） |

升级依赖：改 yaml 里对应 catalog 条目 → `vp i`。`overrides` 也优先用 `catalog:astro` / `catalog:build`，避免 yaml 与 override 两处各写一遍版本。

安装与脚本一律走 Vite+（`vp i`、`vpr build` 等），不要直接裸跑 `pnpm` / `npm install`。

## Tailwind CSS

UI 基于 **Tailwind CSS 4**（`@tailwindcss/vite`）。自研 React/Astro 组件优先用 utility class，样式封装在 `src/styles/`，不要在组件里重复写 webkit 伪元素。

### 滚动条

可滚动区域（对话框、面板、下拉、Tab 等）统一用 Tailwind + **`app-scrollbar`**（`src/styles/scrollbars.css` 内 `@apply` 封装 `scrollbar-thin` 等 utility）：

1. 容器加 `app-scrollbar`
2. 加 `overflow-y-auto` / `overflow-x-auto` / `overflow-auto`
3. 限高用 `max-h-*`、`h-*`；flex 子项滚动必加 `min-h-0`

```tsx
<div className="app-scrollbar max-h-96 overflow-y-auto p-3">{children}</div>
<div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 app-scrollbar">…</div>
```

隐藏滚动条（横向 Tab）：`overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden`（见 `SectionTabsNav.tsx`）。

**CSS 入口：** 书签公开页 `bookmarks-public-app.css`、管理端 `bookmarks-app.css` 已引入；Starlight/React 新区域类不生效时在 `global.css` 补 `@import './scrollbars.css'`。

**禁止：** 组件 `<style>` / CSS 模块 / 内联 `style` 写 `::-webkit-scrollbar`；不要复制 `app-scrollbar` 内的 utility 组合。

## 编码约定

- 遵循 `.cursor/rules/karpathy-guidelines.mdc`
- 可滚动自研组件：见上文 **Tailwind CSS → 滚动条**
- 博客 MDX 用 Starlight 内置 prev/next，正文不写「下一篇」链接
- 文档页 React 岛屿用 `client:only="react"`；BackToTop 用 Portal 挂到 `document.body`
- 只在你明确要求时创建 git commit

## 常见任务

**新增博客文章**：在 `src/content/docs/blog/` 建 MDX，设置 `sidebar.order`。

**改 Mermaid**：`astro.config.mjs` 的 `mermaid()` 选项；工具栏见 `mermaid-controls.ts` / `mermaid-controls.css`。

**改 dev 启动**：`scripts/dev-bootstrap.mjs`、`dev-all.mjs`、`dev-admin.mjs`、`open-browser.mjs`。

**升级依赖**：只改 `pnpm-workspace.yaml` 的 `catalogs`，然后 `vp i`。

**写 README**：`src/content/docs/` 内 Starlight 文档用 `:::note` / `:::tip` 等指令；**仅写 README.md**（及 Issue/PR 等 GitHub 原生 GFM）时可用 GitHub Alerts：

```markdown
> [!TYPE]
> 正文每一行都以 > 开头。
```

- `TYPE`：`NOTE` | `TIP` | `IMPORTANT` | `WARNING` | `CAUTION`（不区分大小写）
- 可选标题：`> [!TIP] 自定义标题`

| 类型 | 适用场景 |
| --- | --- |
| NOTE | 补充说明、背景信息 |
| TIP | 更好或更省力的做法 |
| IMPORTANT | 达成目标必须知道的关键信息 |
| WARNING | 需立刻注意的紧急信息 |
| CAUTION | 行为可能带来的风险或负面后果 |

不要在 Starlight MDX 里改用 `[!TYPE]`，除非用户明确要求且确认构建链支持。
