---
name: wwlight-project
description: wwlight.github.io — Astro 6 + Starlight + bookmarks + theme. Entry skill; module READMEs for depth.
---

# wwlight.github.io

Starlight 文档 + `/bookmarks/nav/` + `/bookmarks/admin/`。Node **24**。

## 何时读

| 场景 | Read |
| --- | --- |
| 默认 | 本文 |
| 重构 / `git mv` | [dev-foundation/SKILL.md](../dev-foundation/SKILL.md) → **路径/路由**、**源文件体量**、**Git commit** |
| className | [tailwindcss.md](../dev-foundation/tailwindcss.md) |
| `vp` / `vpr` / catalog | [vite-plus.md](../dev-foundation/vite-plus.md) |
| 主题 | [`src/theme/README.md`](../../src/theme/README.md) |
| 书签 | [`src/bookmarks/README.md`](../../src/bookmarks/README.md) |
| 博客 MDX | dev-foundation **技术说明** |

## 命令

| 命令 | 说明 |
| --- | --- |
| `vpr dev` | :4321（nav + admin 同端口） |
| `vpr dev:admin` / `dev:all` | 就绪后开管理端 / 双页 |
| `vpr build` / `preview` / `lint` | |
| `vpr generate:color-themes` | `neutral-scales.css` + `color-tokens.css` + `options.json` |
| `vpr generate:theme-init` | `init.inline.js` |
| `vpr generate:bookmark-logos` | `shared/data/bookmark-logos.json`（指纹未变则跳过） |

`vp i` 装依赖。版本只改 `pnpm-workspace.yaml` → `catalogs`；`package.json` 用 `catalog:<组>`。

## 路径/路由

**Alias**：`tsconfig` `@/*`→`src/*`；`astro.config.mjs` `tsconfigPaths: true`。跨目录 `@/`、同目录 `./`。例外：integrations 相对进 `src/`；`db/`、`scripts/` 根路径无 `@/`。

| URL | 路由注册 | 实现 |
| --- | --- | --- |
| `/bookmarks/nav/` | `injectRoute` → `src/bookmarks/nav/entry.astro` | `src/bookmarks/nav/` |
| `/bookmarks/admin/` | `injectRoute` → `src/bookmarks/admin/entry.astro` | `src/bookmarks/admin/` |

本站 **无 `src/pages/`**（文档 Starlight + `src/content/`；书签见 `integrations/bookmarks-admin.ts`）。

非 pages：`/admin/api/*`（dev）；`/blog/bookmarks/*`（文档）。改路由同步 `site-nav.ts`、`index.mdx`、NavPageActions、BookmarksAdminApp。

| 路径 | 用途 |
| --- | --- |
| `astro.config.mjs` | Starlight；`mermaid()` **在** `starlight()` 前 |
| `src/lib/site-nav.ts` | 顶栏模块 nav |
| `src/theme/` | 明暗 + Primary/Neutral/Radius（源：`scripts/color-themes.data.mjs`） |
| `src/bookmarks/` | shared / nav / admin |
| `db/data/bookmarks.ts` | 书签数据 |
| `integrations/bookmarks-admin.ts` | dev API |

重构后：grep `/bookmarks/`、`site-nav`、相对 import → 更新模块 README → `vpr build`。

### `redirects`（`astro.config.mjs`）

| from | to | 用途 |
| --- | --- | --- |
| `/bookmarks` | `/bookmarks/nav/` | 短链进导航页（`injectRoute` 无 `/bookmarks` 页） |

Astro 6：同一路径**只写一条** redirect（带或不带 `/` 二选一），双写报 `[router]` collision。改后 grep `site-nav`、`/bookmarks` → `vpr build`。

## 主题（速查）

改代码前读 `src/theme/README.md`。默认 green / slate / 0.25 / system。

- Primary 亮 `500` / 暗 `400`；Neutral 9 项（扩展见 `CUSTOM_NEUTRAL_SCALE_CONFIG` → `neutral-scales.css`）
- 暗色表面：`--background` 950、`--card` 900、`--border` 700
- 定制器 UI：`customizer-ui.css` + `surface.ts`；Black 色块：`--theme-primary-swatch-black`
- 书签卡片：`.bookmark-card`（`bookmarks/shared/styles/bookmarks-card.css`），勿 `border-border/50`

## Starlight / Mermaid

`mermaid({ autoTheme: true })`；工具栏 `integrations/mermaid-controls.ts`。flowchart 节点含 `?` 等须引号：`B{"DEV?"}`。

## 书签（速查）

`bookmarks.ts` → seed → DB → 页面注水。API 仅 dev。鉴权 `PUBLIC_BOOKMARKS_ADMIN_HASH`。站点图标 → `blog/bookmarks/06-bookmark-logo-design/`、`PUBLIC_LOGO_DEV_TOKEN`、`generate:bookmark-logos`。目录细节 → [`src/bookmarks/README.md`](../../src/bookmarks/README.md)。

### AdminApp（`components/editor/`）

| 文件 | 职责 |
| --- | --- |
| `AdminApp.tsx` | 壳：草稿 hook + 三子 hook + 布局 |
| `useAdminTransferStation.ts` | 中转站状态、dock、拖入/拖出 |
| `useAdminGridDrag.ts` | 网格 DnD、`handleDrop` |
| `useAdminEditorActions.ts` | 编辑/保存/离开/删除/导入导出/版本 |
| `AdminAppSectionGrid.tsx` | 模块 Tab 下卡片网格 UI |
| `AdminAppDialogs.tsx` | 弹层集合 |
| `admin-app-constants.ts` | 中转站动画常量 |

### 链接元数据识别

`EditDialog` → `useBookmarkUrlMetadata` → `resolveBookmarkMetadata`（dev API → 直连 → 代理 → 域名回退）。shared：`bookmark-url-metadata.ts`、`parse-page-metadata.ts`。

- **标题**：`titleTouched` 为 true 不自动覆盖；提交空标题用 `titleFallbackForSubmit`
- **描述**：建议区点「填入」；识别失败 `hook.error` 提示，不阻断提交

## Tailwind（本仓库）

| 入口 | 用途 |
| --- | --- |
| `src/styles/global.css` | Starlight |
| `src/bookmarks/shared/styles/bookmarks-theme-shared.css` | 书签 |
| `src/styles/shadcn-theme.css` | `--primary` 等 |

滚动：`app-scrollbar` + `min-h-0`（`scrollbars.css`）；`html` 有 `scrollbar-gutter: stable`。蒙层锁滚动见 dev-foundation **反模式**（`AdminDialogLayer` / Radix Dialog）。className 按 **v4 现行写法**（见 dev-foundation [tailwindcss.md](../dev-foundation/tailwindcss.md)）：`p-1` 非 `p-[1]`；`bg-(--x)` 非 `bg-[var(...)]`；`bg-linear-to-*` 非 `bg-gradient-to-*`。

## 博客

系列：`blog/bookmarks/`、`blog/astro/`、`blog/theme/`。Starlight 用 `:::note[标题]` 等；根 README 用 GitHub Alert（见下）。

**根 README · GitHub Alert**（[官方](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)）：

- 类型仅五种、**全大写**：`[!NOTE]` `[!TIP]` `[!IMPORTANT]` `[!WARNING]` `[!CAUTION]`；不能写 `[!注意]` 等新类型
- **自定义标题**（可选）：与类型**同一行**、空格后写标题，如 `> [!NOTE] 部署与流程` → 渲染标题为「部署与流程」而非 Note（部分预览器不支持，正文内 **加粗** 更稳）
- 正文从**下一行** `>` 紧接，类型行与正文之间**勿**插空行 `>`
- 列表每项仍须 `>` 前缀

## Git commit

→ dev-foundation **Git commit**（本仓库：`feat(bookmarks): …` 单行 subject，无 body）

## 约定

- 行为准则：`.cursor/rules/karpathy-guidelines.mdc`（alwaysApply，**勿改** — 见 dev-foundation **勿改**）
- `frontend-design` skill **勿改**（同上）
- **勿擅自新增** `wwlight-project/` 下子 skill 文件；要点并入本文，新增前先向用户确认
- 源文件体量 / 顶注释 → dev-foundation **源文件体量**
- React 岛：`client:only="react"`；BackToTop → `document.body`
