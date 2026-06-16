# 开发细节

## 路径/路由

`@/*`→`src/*`（`tsconfig` + `tsconfigPaths`）。跨目录 `@/`、同目录 `./`。`db/`、`scripts/`、`integrations/` 无 `@/`。

| URL | 注册 | 目录 |
| --- | --- | --- |
| `/bookmarks/nav/` | `injectRoute` | `src/bookmarks/nav/` |
| `/bookmarks/admin/` | `injectRoute` | `src/bookmarks/admin/` |

无 `src/pages/`（Starlight + `src/content/`；书签 API `integrations/bookmarks-admin.ts`）。改路由同步 `site-nav.ts`、导航 MDX、NavPageActions、BookmarksAdminApp。

关键路径：`astro.config.mjs`（`mermaid()` 在 `starlight()` 前）、`src/lib/site-nav.ts`、`src/theme/`、`src/bookmarks/`、`db/data/bookmarks.ts`。

**维护**：alias/URL 只在本节；改路由 grep `/bookmarks/`、`site-nav` → 更新模块 README → `vpr build`。

**redirect**：`/bookmarks` → `/bookmarks/nav/`。Astro 6 同路径只写一条 redirect，双写 `[router]` collision。

## 模块

- **主题** → `src/theme/README.md`（默认 green/slate/0.25/system；`.bookmark-card` 勿 `border-border/50`）
- **书签** → `src/bookmarks/README.md`（数据流、AdminApp、URL 元数据、`PUBLIC_BOOKMARKS_ADMIN_HASH`）

## Starlight / Mermaid

`mermaid({ autoTheme: true })`；`integrations/mermaid-controls.ts`。flowchart 含 `?` 须引号：`B{"DEV?"}`。

## Tailwind 入口

`src/styles/global.css` · `bookmarks/shared/styles/bookmarks-theme-shared.css` · `shadcn-theme.css`。className → [tailwindcss.md](./tailwindcss.md)。滚动 `app-scrollbar` + `min-h-0`；`html` 有 `scrollbar-gutter: stable`。

## 博客 MDX

系列 `blog/bookmarks|astro|theme/`。技术文：真实路径与数据流，禁教程套话。根 README Alert：类型 `[!NOTE]` 等五种全大写；标题与类型同行；正文下一行 `>` 起。

## 重构

`glob` → `git mv` → 修 `@/` import → 删 orphan re-export → 同步本节 + 模块 README → `vpr lint` / `vpr build`。用 `vp i` / `vpr`，非裸 `pnpm`。

**体量**：组件/hook ~400 行、页面壳 ~300 行；超出按功能拆；源文件顶注释 `功能 / 关联`。

## 反模式

- 多处 alias 表；只改代码不 grep 文档；Lucide 可用手绘/叠拼 icon
- **弹层锁滚动**：先查谁在滚、`scrollbar-gutter`、Radix 是否已锁。本站多用 `html { overflow: hidden }`（`admin-dialog-scroll-lock`，`AdminDialogLayer`），勿抄 `body fixed + scrollTo`。`color-mode.ts` 的 `fixed body` 仅 View Transition，与弹层无关
- Radix Dialog 已锁时勿再叠自建锁
