# wwlight.github.io

Astro 7 + Starlight 0.40。GitHub Pages。Node 24。`vpr` = `vp run`。

## Top-level

- `astro.config.mjs` — `mermaid()` 必须在 `starlight()` 之前。`injectRoute` 注册 bookmarks。redirect `/bookmarks` → `/bookmarks/nav/`。
- `pnpm-workspace.yaml` — pnpm catalogs + overrides
- `package.json` — `packageManager: pnpm@11.8.0`
- `netlify.toml` — Netlify 部署

## Source (`src/`)

- 无 `src/pages/`。路由由 Starlight + `injectRoute` 注册。
- `content/` — blog、memorandum、tools、system、other
- `bookmarks/` — `/bookmarks/nav/` 导航 + `/bookmarks/admin/` 管理。React 根在模块根；UI 在 `components/<功能>/`。详见 `src/bookmarks/README.md`
- `theme/` — 明暗主题、配色定制、surface、token 生成。详见 `src/theme/README.md`
- `components/` — 全站共享组件（Header、Footer、BackToTop）
- `styles/` — global.css、custom.css、mermaid-controls.css、shadcn-theme.css、tailwind-utilities.css。Tailwind 入口含 `bookmarks/shared/styles/bookmarks-theme-shared.css`
- `lib/` — site-nav.ts 等

## 路由

| URL | 注册 | 目录 |
|---|---|---|
| `/bookmarks/nav/` | `injectRoute` | `src/bookmarks/nav/` |
| `/bookmarks/admin/` | `injectRoute` | `src/bookmarks/admin/` |

- `@/*` → `src/*`（tsconfigPaths）。跨目录 `@/`，同目录 `./`。`db/`、`scripts/`、`integrations/` 不用 `@/`。
- redirect 同路径只写一条，双写会 `[router]` collision。
- 改路由同步 `site-nav.ts`、导航 MDX、NavPageActions、BookmarksAdminApp。

## 命令

- `vpr dev` / `vpr dev:all` — 开发 :4321；`dev:all` 双页
- `vpr build` — 先 `generate:bookmark-logos`，再 `astro build`
- `vpr lint` / `vpr lint:fix`
- `vpr generate:color-themes` — 主题 CSS + options.json
- `vpr generate:theme-init` — init.inline.js
- `vpr generate:bookmark-logos` — bookmark-logos.json
- `vp i` / `vp add` / `vp remove` — 依赖管理

## 数据

- `db/data/bookmarks.ts` — 唯一可提交数据源
- `db/config.ts` / `db/seed.ts` — Astro DB 表 + seed
- `scripts/` — color-themes、theme-init、bookmark-logos、dev-admin
- `integrations/` — bookmarks-admin.ts、mermaid-controls.ts

Tailwind v4 规范、组件约定、滚动、Blog MDX、重构、反模式 → `mem:conventions`