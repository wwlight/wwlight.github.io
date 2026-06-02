---
name: wwlight-project
description: Guides development on wwlight.github.io (Astro 6 + Starlight docs, bookmarks module, Mermaid, theme transitions). Use when editing this repo. Read dev-foundation skill (tailwindcss.md, vite-plus.md, docs) and this skill for project-specific paths and scripts.
---

# wwlight.github.io

个人站点：Starlight 文档站 + 书签导航 + 本地管理端。

## 脚本速查

Node.js **24**（`.node-version`）。`vp` / `vpr` 约定见 [dev-foundation/vite-plus.md](../dev-foundation/vite-plus.md)。

| 命令 | 说明 |
| --- | --- |
| `vpr dev` | 本地开发 http://localhost:4321（`/bookmarks/nav/` 与 `/bookmarks/admin/` 同端口） |
| `vpr dev:admin` | 同上，就绪后自动打开管理端 |
| `vpr dev:all` | 同上，就绪后自动打开主站与管理端 |
| `vpr build` / `vpr preview` | 构建与预览 |
| `vpr lint` / `vpr lint:fix` | ESLint |
| `vpr generate:color-themes` | 生成 `color-tokens.css`、`customizer/options.json` |
| `vpr generate:theme-init` | 生成 `scripts/init.inline.js` |

前台与管理端共用同一 Astro dev 进程，通过路径区分。

## 目录结构

| 路径 | 用途 |
| --- | --- |
| `src/content/docs/blog/` | 博客总览；`blog/bookmarks/` 书签系列、`blog/astro/` Astro 使用系列、`blog/theme/` 主题系统系列 |
| `src/content/docs/{memorandum,tools,system,other}/` | 其他文档分区 |
| `src/pages/bookmarks/nav.astro` | 书签导航 → `/bookmarks/nav/`（路由见 [paths.md](./paths.md)） |
| `src/pages/bookmarks/admin.astro` | 管理端 → `/bookmarks/admin/` |
| `src/bookmarks/` | 书签模块（**详读** [`src/bookmarks/README.md`](../../src/bookmarks/README.md)） |
| `src/components/Footer.astro` | Starlight 页脚 + BackToTop |
| `src/theme/` | 主题系统（**详读** [`src/theme/README.md`](../../src/theme/README.md)） |
| `db/data/bookmarks.ts` | 书签数据源（可提交 Git） |
| `scripts/color-themes.data.mjs` | 主题 token 数据源（生成 CSS/JSON） |
| `integrations/bookmarks-admin.ts` | 开发态 API 中间件 |
| `integrations/mermaid-controls.ts` | Mermaid 缩放 / 全屏工具栏 |
| `.cursor/skills/dev-foundation/SKILL.md` | **开发基础** 通用：结构优化、技术说明写法、子文件索引 |
| `.cursor/skills/dev-foundation/vite-plus.md` | `vp` / `vpr` 与 pnpm catalog 通用约定 |
| `.cursor/skills/dev-foundation/tailwindcss.md` | Tailwind v4 方括号与 `bg-(--var)` |
| `.cursor/skills/wwlight-project/paths.md` | **path alias、pages 路由**（本书唯一说明，勿在别处复制） |
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

**改主题相关代码前**：用 Read 读取 [`src/theme/README.md`](../../src/theme/README.md)（子目录职责、生成命令、已知限制、对外入口）。下文仅保留 skill 速查。

| 项 | 路径 / 命令 |
| --- | --- |
| 局部文档 | [`src/theme/README.md`](../../src/theme/README.md) |
| 明暗 + View Transition | `src/theme/color-mode/color-mode.ts`、`src/theme/styles/view-transition.css` |
| 配色状态 | `src/theme/customizer/state.ts`；选项 `options.json`（生成） |
| 全站同步 | `src/theme/site/sync.ts`；键名 `src/lib/site-storage.keys.mjs` |
| UI | `src/theme/components/customizer/`；`ColorThemePicker` / `ColorThemeSelect.astro` |
| 样式入口 | `src/theme/styles/index.css`（`global.css`）；书签 `src/bookmarks/shared/styles/bookmarks-theme-shared.css` |
| 生成 | `vpr generate:color-themes`、`vpr generate:theme-init`（改 `scripts/color-themes.data.mjs` 后必跑） |
| API | `import { … } from '@/theme'` |

默认：Primary `green`、Neutral `slate`、Radius `0.25`、Color Mode `system`（对齐 [Nuxt UI](https://ui.nuxt.com/docs/getting-started/theme/design-system)）。色值均引用 Tailwind `--color-*`：Primary 亮 `500` / 暗 `400`；Neutral 9 项（五档 + 扩展 taupe/mauve/mist/olive 独立 oklch 色阶）。View Transition 长页已滚动时会 `lockDocumentScroll`（`color-mode.ts`），并加 `html.theme-transitioning` 暂停子元素 transition。

## 书签模块要点

**改书签相关代码前**：用 Read 读取 [`src/bookmarks/README.md`](../../src/bookmarks/README.md)（shared / nav / admin 职责、数据流、对外入口）。**整模块重组**见 [dev-foundation/SKILL.md](../dev-foundation/SKILL.md)（必先读）。

| 项 | 路径 |
| --- | --- |
| 局部文档 | [`src/bookmarks/README.md`](../../src/bookmarks/README.md) |
| 数据源 | `db/data/bookmarks.ts` → `db/seed.ts` → Astro DB |
| 查询 / 注水 | `src/bookmarks/shared/data/queries.ts`、`page-data.ts` |
| 管理端鉴权 | `src/bookmarks/admin/lib/admin-auth.ts`（客户端）、`admin-auth.server.ts`（API） |
| dev API | `integrations/bookmarks-admin.ts` → `admin/lib/admin-api.server.ts` |
| 导航 | `src/pages/bookmarks/nav.astro`、`src/bookmarks/nav/` |
| 管理端 | `src/pages/bookmarks/admin.astro`、`src/bookmarks/admin/` |

- 数据流：`db/data/bookmarks.ts` → `db/seed.ts` → Astro DB → 导航页/管理端
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

升级依赖：改 yaml 里对应 catalog 条目 → `vp i`（见 [vite-plus.md](../dev-foundation/vite-plus.md)）。`overrides` 也优先用 `catalog:astro` / `catalog:build`，避免 yaml 与 override 两处各写一遍版本。

## Tailwind CSS

**改 className、`@apply`、组件样式前**：先读 [dev-foundation/tailwindcss.md](../dev-foundation/tailwindcss.md)。**本仓库**接入与滚动条见下文。

### 本仓库接入

| 项 | 路径 |
| --- | --- |
| 版本 | Tailwind **4**（`@tailwindcss/vite`） |
| Starlight | `src/styles/global.css` — `@import 'tailwindcss/theme.css'` / `utilities.css` |
| 书签 | `src/bookmarks/shared/styles/bookmarks-theme-shared.css` — `@import 'tailwindcss'` |
| shadcn 语义色 | `src/styles/shadcn-theme.css` — `@theme inline` 映射 `--primary`、`--border` 等 |
| 暗色变体 | `@custom-variant dark`（`.dark` + `[data-theme='dark']`） |
| 主题圆角工具类 | `theme-r-sm` … `theme-r-xl`（`src/theme/styles/radius.css`） |

Starlight 变量（`--sl-color-*`）无 shadcn 别名时用 `bg-(--sl-color-black)` 等；书签页优先 `bg-card`、`text-foreground`、`border-border`。

### 滚动条

可滚动区：**`app-scrollbar`** + `overflow-*` + 限高；flex 子项滚动加 **`min-h-0`**。

```tsx
<div className="app-scrollbar max-h-96 min-h-0 flex-1 overflow-y-auto p-3" />
```

横向 Tab 隐藏滚动条：`overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden`（见 `SectionTabsNav.tsx`）。

**禁止**：在组件里写 `<style>` / CSS 模块 / 内联样式定制 `::-webkit-scrollbar`；不要复制 `scrollbars.css` 里 `@apply` 组合。

定义见 `src/styles/scrollbars.css`；书签/管理端入口已 `@import`；Starlight 新区域不生效时在 `global.css` 补 `scrollbars.css`。

### 主题相关样式

- 配色 token、圆角：`src/theme/styles/`（见 `src/theme/README.md`）
- 通用布局/Starlight：`src/styles/`

要点速记：scale 内建值用 `p-1`、`gap-2`，勿写 `p-[1]`；CSS 变量优先 `text-(--sl-color-text)` 而非 `text-[var(...)]`。

## 博客（技术笔记）

`src/content/docs/blog/` 下 MDX 按仓库真实路径写技术说明。写或改前先读 [dev-foundation/SKILL.md](../dev-foundation/SKILL.md) 的 **技术说明写法**。

### 目录（勿混系列）

| 路径 | 内容 |
| --- | --- |
| `blog/index.mdx` | 总览：各系列 `LinkCard` 即可，少写导读废话 |
| `blog/bookmarks/` | 书签 `/bookmarks/nav/`、管理端、Astro DB、dev API |
| `blog/astro/` | Astro 配置与 Starlight 文档站壳（导航、Hero、MPA 优化等） |
| `blog/theme/` | `src/theme/` 明暗、配色 token、双表面集成 |

新文章放进对应子目录；`sidebar.order` 在**该目录内**连续编号。系列 `index.mdx` 设 `sidebar.hidden: true`（侧栏只列正文，索引仍可通过 `/blog/bookmarks/` 等访问）。侧栏分组见 `astro.config.mjs` → 博客 →「书签导航与管理端搭建」「Astro 使用」两组 + `autogenerate`。

### 格式（本书 Starlight）

- MDX：`:::note` / `:::tip` 等（见下文 **写 README** 与 Starlight 指令的区别）
- 组件：`@astrojs/starlight/components` 的 `Steps`、`FileTree`、`LinkCard` 等
- 官方参考：[Starlight](https://starlight.astro.build/) / [Astro](https://docs.astro.build/)

## 编码约定

- 遵循 `.cursor/rules/karpathy-guidelines.mdc`
- 可滚动自研组件：见上文 **Tailwind CSS → 滚动条**
- 博客：见 [dev-foundation](../dev-foundation/SKILL.md) 技术说明写法 + 上文 **博客（技术笔记）** 目录与 Starlight 格式
- 文档页 React 岛屿用 `client:only="react"`；BackToTop 用 Portal 挂到 `document.body`
- 跨目录 import / CSS `@import`、**pages 路由与 URL 对齐**：见 [paths.md](./paths.md)（alias 只在该文件维护）
- 只在你明确要求时创建 git commit

## 常见任务

**新增或修订博客**：先读 [dev-foundation](../dev-foundation/SKILL.md)；定系列（`bookmarks` / `astro` / `theme`），再建 MDX；更新同系列 `index.mdx` 的 `LinkCard`（若有）。`autogenerate.directory` 路径相对 `src/content/docs/`（如 `blog/bookmarks`）。

**改 Mermaid**：`astro.config.mjs` 的 `mermaid()` 选项；工具栏见 `mermaid-controls.ts` / `mermaid-controls.css`。

**改 dev 启动**：`scripts/dev-bootstrap.mjs`、`dev-all.mjs`、`dev-admin.mjs`、`open-browser.mjs`。

**改主题**：先读 [`src/theme/README.md`](../../src/theme/README.md)；改 `scripts/color-themes.data.mjs` 后 `vpr generate:color-themes`（必要时 `vpr generate:theme-init`）；勿手改 `color-tokens.css` / `options.json` / `init.inline.js`。

**模块重构 / 结构优化**（含书签、主题或任意 `src/` 功能模块的目录重组、路由迁移、`git mv`）：

1. Read [dev-foundation/SKILL.md](../dev-foundation/SKILL.md) — 检查清单、原则、反模式、文档同步表
2. Read [paths.md](./paths.md) — alias、pages 路由、例外
3. Read 目标模块 `src/<module>/README.md`（若有）
4. 理解后再改代码；`vpr lint` / 必要时 `vpr build`

**日常改书签**（非整模块重组）：先读 [`src/bookmarks/README.md`](../../src/bookmarks/README.md) 即可；若动 pages 或跨目录路径，仍须对照 paths.md。

**升级依赖**：只改 `pnpm-workspace.yaml` 的 `catalogs`，然后 `vp i`（见 dev-foundation/vite-plus.md）。

**写 README**：`src/content/docs/` 内 Starlight 文档用 `:::note` / `:::tip` 等指令；**仅写 README.md**（及 Issue/PR 等 GitHub 原生 GFM）时可用 GitHub Alerts：

```markdown
> [!TIP] 自定义标题
> 正文第一行紧接在下一行，每一行都以 > 开头。
> 第二行正文。
```

- `TYPE`：`NOTE` | `TIP` | `IMPORTANT` | `WARNING` | `CAUTION`（不区分大小写）
- 自定义标题：写在 `]` 后同一行（如 `> [!NOTE] 部署与流程`），**GitHub 上会替换默认英文标题**
- **不要**在标题行与正文之间插入空行或单独的 `>` 行，否则 alert 断块、标题不生效（见 [GitHub Alerts 语法](https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)）
- Cursor / VS Code 内置 Markdown 预览对同行自定义标题支持不完整，可能退化为普通 blockquote；以 GitHub 渲染为准

| 类型 | 适用场景 |
| --- | --- |
| NOTE | 补充说明、背景信息 |
| TIP | 更好或更省力的做法 |
| IMPORTANT | 达成目标必须知道的关键信息 |
| WARNING | 需立刻注意的紧急信息 |
| CAUTION | 行为可能带来的风险或负面后果 |

不要在 Starlight MDX 里改用 `[!TYPE]`，除非用户明确要求且确认构建链支持。
