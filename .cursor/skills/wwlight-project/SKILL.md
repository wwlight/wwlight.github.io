---
name: wwlight-project
description: Guides development on wwlight.github.io (Astro 6 + Starlight docs, bookmarks module, Mermaid, theme transitions). Use when editing this repo, Starlight docs/blog, bookmarks admin, Mermaid diagrams, site navigation, or theme switching.
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
| `integrations/mermaid.ts` | Mermaid 按需客户端加载入口 |
| `pnpm-workspace.yaml` | pnpm catalog 版本源 + overrides / trustPolicy |
| `.node-version` | Node.js 24 |
| `scripts/dev-bootstrap.mjs` | dev 环境初始化与启动 |
| `scripts/dev-admin.mjs` | 启动 dev 并打开管理端 |
| `scripts/dev-all.mjs` | 启动 dev 并打开主站 + 管理端 |
| `scripts/open-browser.mjs` | 解析 Local URL 并打开浏览器 |

## Starlight 定制

配置在 `astro.config.mjs`：

- `mermaid()` 在 `starlight()` **之前**
- `credits: false`
- `customCss`: `custom.css` + `global.css`（后者引入 shadcn 变量，供 BackToTop 等）

顶栏模块导航：`src/lib/site-nav.ts` + `ModuleNavLinks.astro`。新增文档分区时同步改 `sidebar` 与 `siteModuleNav`。

## Mermaid

Starlight 用 Expressive Code 高亮 ` ```mermaid `，不会直接输出 `pre.mermaid`。

- `integrations/mermaid.ts` — `injectScript('page')` 导入 `mermaid-expressive.ts`
- `src/scripts/mermaid-expressive.ts` — 从 EC 块提取源码（保留 `.ec-line` 换行），转为 `pre.mermaid`，按需 `import('mermaid-controls.ts')`
- `src/scripts/mermaid-controls.ts` + `mermaid-controls.css` — 渲染、主题重绘、缩放/全屏工具栏

注意：flowchart 节点含 `?` 等特殊字符时需加引号，如 `B{"DEV?"}`。不要用 remark 阶段转 HTML（会破坏 MDX 构建）。

## 主题切换

- 逻辑：`src/lib/theme.ts` — View Transition 圆形揭示
- 样式：`src/styles/view-transition-theme.css`
- 组件：`src/components/ThemeSelect.astro`
- 存储键：`starlight-theme`

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

## 编码约定

- 遵循 `.cursor/rules/karpathy-guidelines.mdc`
- 博客 MDX 用 Starlight 内置 prev/next，正文不写「下一篇」链接
- 文档页 React 岛屿用 `client:only="react"`；BackToTop 用 Portal 挂到 `document.body`
- 只在你明确要求时创建 git commit

## 常见任务

**新增博客文章**：在 `src/content/docs/blog/` 建 MDX，设置 `sidebar.order`。

**改 Mermaid**：`mermaid-expressive.ts`（EC 转换）+ `mermaid-controls.ts/css`（渲染与工具栏）。

**改 dev 启动**：`scripts/dev-bootstrap.mjs`、`dev-all.mjs`、`dev-admin.mjs`、`open-browser.mjs`。

**升级依赖**：只改 `pnpm-workspace.yaml` 的 `catalogs`，然后 `vp i`。
