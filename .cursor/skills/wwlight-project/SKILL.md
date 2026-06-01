---
name: wwlight-project
description: Guides development on wwlight.github.io (Astro 6 + Starlight docs, bookmarks module, Mermaid, theme transitions). Use when editing this repo, writing or revising blog MDX under src/content/docs/blog, bookmarks admin, Mermaid, site navigation, or theme switching. Blog prose must be implementation-focused (see 博客 section). For Tailwind, read tailwindcss skill.
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
| `src/content/docs/blog/` | 博客总览；`blog/bookmarks/` 书签系列、`blog/starlight/` Starlight 系列、`blog/theme/` 主题系统系列 |
| `src/content/docs/{memorandum,tools,system,other}/` | 其他文档分区 |
| `src/pages/bookmarks/` | 公开书签页（独立布局，非 Starlight） |
| `src/pages/admin/bookmarks.astro` | 管理端入口 |
| `src/components/bookmarks/public/` | 公开页 React |
| `src/components/admin/` | 管理端 React |
| `src/components/Footer.astro` | Starlight 页脚 + BackToTop |
| `src/theme/` | 主题系统（**详读** [`src/theme/README.md`](../../src/theme/README.md)） |
| `db/data/bookmarks.ts` | 书签数据源（可提交 Git） |
| `scripts/color-themes.data.mjs` | 主题 token 数据源（生成 CSS/JSON） |
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

**改主题相关代码前**：用 Read 读取 [`src/theme/README.md`](../../src/theme/README.md)（子目录职责、生成命令、已知限制、对外入口）。下文仅保留 skill 速查。

| 项 | 路径 / 命令 |
| --- | --- |
| 局部文档 | [`src/theme/README.md`](../../src/theme/README.md) |
| 明暗 + View Transition | `src/theme/color-mode/color-mode.ts`、`src/theme/styles/view-transition.css` |
| 配色状态 | `src/theme/customizer/state.ts`；选项 `options.json`（生成） |
| 全站同步 | `src/theme/site/sync.ts`；键名 `src/lib/site-storage.keys.mjs` |
| UI | `src/theme/components/customizer/`；`ColorThemePicker` / `ColorThemeSelect.astro` |
| 样式入口 | `src/theme/styles/index.css`（`global.css`、书签 `bookmarks-theme-shared.css` 引入） |
| 生成 | `vpr generate:color-themes`、`vpr generate:theme-init`（改 `scripts/color-themes.data.mjs` 后必跑） |
| API | `import { … } from '@/theme'` |

默认：Primary `green`、Neutral `slate`、Radius `0.25`、Color Mode `system`（对齐 [Nuxt UI](https://ui.nuxt.com/docs/getting-started/theme/design-system)）。Primary 亮 `500` / 暗 `400`；**Black**：`--primary` 亮 `zinc-950` / 暗 `white`（生成）；Panel 预览色块用 `--theme-primary-swatch-black`（`customizer-trigger.css`）；触发器色块用 `var(--primary)`。View Transition 长页已滚动时会 `lockDocumentScroll`（`color-mode.ts`），并加 `html.theme-transitioning` 暂停子元素 transition。

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

**改 className、`@apply`、组件样式前**：读取 [`.cursor/skills/tailwindcss/SKILL.md`](../tailwindcss/SKILL.md)（v4 方括号规则、`bg-(--var)` 简写、`app-scrollbar`、与本仓库 `@theme` 约定）。

要点速记：scale 内建值用 `p-1`、`gap-2`，勿写 `p-[1]`；CSS 变量优先 `text-(--sl-color-text)` 而非 `text-[var(...)]`；可滚动区见 tailwindcss skill 的滚动条一节。

## 博客（技术笔记）

`src/content/docs/blog/` 下 MDX 是**按仓库真实代码路径写的技术说明**，不是教程体、宣传体。写或改博客前对照本节。

### 目录（勿混系列）

| 路径 | 内容 |
| --- | --- |
| `blog/index.mdx` | 总览：各系列 `LinkCard` 即可，少写导读废话 |
| `blog/bookmarks/` | 书签 `/bookmarks/`、管理端、Astro DB、dev API |
| `blog/starlight/` | Starlight 配置、导航、Hero 覆盖等文档站壳 |
| `blog/theme/` | `src/theme/` 明暗、配色 token、双表面集成 |

新文章放进对应子目录；`sidebar.order` 在**该目录内**连续编号。系列 `index.mdx` 设 `sidebar.hidden: true`（侧栏只列正文，索引仍可通过 `/blog/bookmarks/` 等访问）。侧栏分组见 `astro.config.mjs` → 博客 →「书签导航与管理端搭建」「Astro Starlight 使用」两组 + `autogenerate`。

### 写什么（稳扎、可核对）

- **具体路径**：`src/…`、`astro.config.mjs`、`db/…`，用 ``FileTree`` / 表格 / 代码块
- **机制**：数据流、调用链、frontmatter 字段、配置项含义；需要时链 [Starlight](https://starlight.astro.build/) / [Astro](https://docs.astro.build/) 官方文档
- **本仓库取舍**：为何用某文件、某 API、某约束（静态部署、dev-only 等）
- **图示**：Mermaid 流程/结构图优先于空泛段落
- 系列索引页结构：**范围**（技术要点列表）→ **架构**（可选）→ **文章列表**（`LinkCard`）

### 不要写什么（禁止套话）

- 「从 0 到 1」「不是抽象讲概念」「你会学到什么」「建议按顺序阅读」「怎么读」
- 解释「为何把 A 和 B 分目录」之类元叙述（目录结构在 skill 里约定即可，正文不重复说教）
- 「业务 / 壳层」「高大上」概括代替实现细节
- 「系列完结」「若你要在此基础上…」等教程收尾、展望口语
- 正文手动「上一篇 / 下一篇」链接（用 Starlight prev/next）
- 与实现无关的「前置要求」「快速体验」长段（命令一行带过即可，且放在正文仅当该篇主题需要）

### 文风

- 句子短、陈述事实；用「`路径` 负责 …」而不是「带你走进 …」
- 标题用「01 · 主题」+ `description` 一句话技术摘要
- Q&A、延伸仅保留**可落地的技术选项**（如换 middleware、接 GitHub API），不写鼓动性结语

### 格式

- Starlight MDX：`:::note` / `:::tip` 等（见下文 **写 README** 与 Starlight 指令的区别）
- 组件：`@astrojs/starlight/components` 的 `Steps`、`FileTree`、`LinkCard` 等，服务于步骤与路径说明

## 编码约定

- 遵循 `.cursor/rules/karpathy-guidelines.mdc`
- 可滚动自研组件：见上文 **Tailwind CSS → 滚动条**
- 博客：见上文 **博客（技术笔记）**；正文不写「下一篇」链接
- 文档页 React 岛屿用 `client:only="react"`；BackToTop 用 Portal 挂到 `document.body`
- 只在你明确要求时创建 git commit

## 常见任务

**新增或修订博客**：先定系列（`bookmarks` / `starlight` / `theme`），再建 MDX；遵守 **博客（技术笔记）** 禁止套话与索引页结构；更新同系列 `index.mdx` 的 `LinkCard`（若有）。`autogenerate.directory` 路径相对 `src/content/docs/`（如 `blog/bookmarks`）。

**改 Mermaid**：`astro.config.mjs` 的 `mermaid()` 选项；工具栏见 `mermaid-controls.ts` / `mermaid-controls.css`。

**改 dev 启动**：`scripts/dev-bootstrap.mjs`、`dev-all.mjs`、`dev-admin.mjs`、`open-browser.mjs`。

**改主题**：先读 [`src/theme/README.md`](../../src/theme/README.md)；改 `scripts/color-themes.data.mjs` 后 `vpr generate:color-themes`（必要时 `vpr generate:theme-init`）；勿手改 `color-tokens.css` / `options.json` / `init.inline.js`。

**升级依赖**：只改 `pnpm-workspace.yaml` 的 `catalogs`，然后 `vp i`。

**写 README**：`src/content/docs/` 内 Starlight 文档用 `:::note` / `:::tip` 等指令；**仅写 README.md**（及 Issue/PR 等 GitHub 原生 GFM）时可用 GitHub Alerts：

```markdown
> [!TYPE]
> 正文每一行都以 > 开头。
```

- `TYPE`：`NOTE` | `TIP` | `IMPORTANT` | `WARNING` | `CAUTION`（不区分大小写）
- 可选标题：`> [!TIP] 自定义标题`（`]` 后的文字会替换默认英文标题；**GitHub 上有效**）
- Cursor / VS Code 内置 Markdown 预览不支持同行自定义标题：`> [!TYPE] 标题` 会整段退化为普通 blockquote。本地预览要么只用 `> [!TYPE]` 接受默认标题，要么正文首行用 `**粗体**` 作强调

| 类型 | 适用场景 |
| --- | --- |
| NOTE | 补充说明、背景信息 |
| TIP | 更好或更省力的做法 |
| IMPORTANT | 达成目标必须知道的关键信息 |
| WARNING | 需立刻注意的紧急信息 |
| CAUTION | 行为可能带来的风险或负面后果 |

不要在 Starlight MDX 里改用 `[!TYPE]`，除非用户明确要求且确认构建链支持。
