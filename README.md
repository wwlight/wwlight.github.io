# 与光同行

个人学习笔记与书签导航站点，基于 [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) 构建。

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## 功能

- **文档笔记** — Starlight 文档站，收录备忘录、工具集、系统相关等 Markdown 笔记
- **书签导航** — `/bookmarks/` 公开书签页，按分区展示常用链接
- **书签管理** — `/admin/bookmarks/` 本地管理端，支持增删改、拖拽排序、版本历史

## 技术栈

| 类别 | 选型 |
| ---- | ---- |
| 框架 | Astro 6、Starlight |
| UI | React 19、Tailwind CSS 4、Radix UI / shadcn 风格组件 |
| 数据 | Astro DB（书签数据） |
| 图表 | Mermaid 11（自研 Starlight 集成，按需加载） |
| 工具链 | [Vite+](https://viteplus.dev)（`vp` / `vpr`）、Node.js 24、pnpm 11.4.0 |

## 快速开始

```bash
vp i                      # 安装依赖
vpr dev                   # 本地开发，http://localhost:4321（/bookmarks/ 与 /admin/bookmarks/ 同端口）
vpr dev:admin             # 同上，就绪后自动打开管理端（首次运行创建 .env 并设置密码）
vpr dev:all               # 同上，就绪后自动打开主站与管理端两个标签页
vpr build                 # 构建到 dist/
vpr preview               # 预览构建产物
vpr astro                 # Astro CLI（如 vpr astro check）
vpr generate:color-themes # 生成 src/styles/color-themes.css、src/lib/theme-options.json
vpr generate:theme-init   # 生成 src/scripts/theme-init.inline.js
vpr lint                  # ESLint 检查
vpr lint:fix              # ESLint 检查并自动修复
vpr lint-staged           # 对暂存文件运行 lint（pre-commit 调用）
vpr prepare               # 安装 Git hooks（pnpm install 时自动执行）
```

前台书签页与管理端共用同一 dev 进程，通过路径区分（`/bookmarks/`、`/admin/bookmarks/`）。

## 书签管理端

> [!TIP] 本地使用
>
> 本地编辑 `/admin/bookmarks/`，保存至 `db/data/bookmarks.ts`。首次 `vpr dev:admin` 从 `.env.example` 生成 `.env` 并设置密码。

| 变量 | 说明 |
| ---- | ---- |
| `PUBLIC_BOOKMARKS_ADMIN_HASH` | 登录密码 SHA-256 哈希（必填，首次启动自动写入） |

| 能力               | 本地 | 线上 |
| ----------------- | :--: | :--: |
| 登录               |  ✅  |  ✅  |
| 增删改 / 排序 / 版本 |  ✅  |  ❌  |

> [!CAUTION] 注意
>
> 哈希打进前端 bundle，仅作门控，非服务端鉴权。

> [!NOTE] 部署与流程
>
> - 线上配置 `PUBLIC_BOOKMARKS_ADMIN_HASH`（同本地 `.env`）：GitHub Secrets、Vercel / Netlify Environment Variables
> - 静态站点不可保存，数据随 `vpr build` 发布
> - 流程：`vpr dev:admin` → commit `db/data/bookmarks.ts` → push

## 项目结构

```
├── src/
│   ├── content/docs/          # Starlight 文档（memorandum / tools / system / other）
│   ├── pages/
│   │   ├── bookmarks/         # 公开书签页
│   │   └── admin/bookmarks.astro  # 书签管理端
│   ├── components/            # Astro / React（admin、bookmarks、ui）
│   ├── lib/bookmarks/         # 书签逻辑、查询、管理端 API
│   └── styles/                # 全局与页面样式
├── db/
│   ├── config.ts              # Astro DB 配置
│   └── data/bookmarks.ts      # 书签数据源
├── integrations/              # Astro 集成（管理端 dev middleware）
├── scripts/                   # `dev-bootstrap.mjs`、`dev-admin.mjs`、`dev-all.mjs` 等
├── public/                    # 静态资源
├── astro.config.mjs           # Astro / Starlight 配置
├── netlify.toml               # Netlify 构建设置
├── pnpm-workspace.yaml        # pnpm catalog 版本源 + overrides / trustPolicy
└── .github/workflows/         # GitHub Pages 部署
```

## 在线预览

| 访问地址 | 部署 | 状态 |
| :--: | :--: | :--: |
| [![GitHub Pages](https://img.shields.io/badge/github%20pages-wwlight.github.io-brightgreen)](https://wwlight.github.io/) | — | [![Deploy](https://github.com/wwlight/wwlight.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/wwlight/wwlight.github.io/actions/workflows/deploy.yml) |
| [![Vercel](https://img.shields.io/badge/vercel-wwlight.vercel.app-brightgreen)](https://wwlight.vercel.app/) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwwlight%2Fwwlight.github.io) | — |
| [![Netlify](https://img.shields.io/badge/netlify-wwlight.netlify.app-brightgreen)](https://wwlight.netlify.app/) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/wwlight/wwlight.github.io) | [![Netlify Status](https://api.netlify.com/api/v1/badges/27a45be0-dc5e-47fd-93ef-9ff0e484df69/deploy-status)](https://app.netlify.com/projects/wwlight/deploys) |

## Vibe Coding

本仓库用 [Cursor](https://cursor.com) 做 AI 辅助开发（Vibe Coding）。`.cursor/` 里放了 **Rules** 与 **Skills**，让 Agent 改代码前先对齐项目约定，减少「猜架构、改过头」。

| 路径 | 用途 |
| ---- | ---- |
| `.cursor/rules/wwlight-project.mdc` | 每轮任务先读项目 skill；脚本用 `vp` / `vpr`；依赖走 pnpm catalog |
| `.cursor/rules/karpathy-guidelines.mdc` | 编码行为准则：先想清楚、最小改动、可验证目标 |
| `.cursor/skills/wwlight-project/SKILL.md` | 目录结构、Tailwind、Starlight / 书签 / Mermaid / 主题、写 README 等 |
| `.cursor/skills/karpathy-guidelines/SKILL.md` | 上述准则的完整版 |

**本地使用：** 用 Cursor 打开仓库即可；Rules 会自动生效，Skills 在相关任务时由 Agent 按需读取。

**协作提示：** 大改前可在对话里 `@` 引用 skill 或说明范围；只有明确要求时才提交 commit。博客系列 [`src/content/docs/blog/`](/src/content/docs/blog/) 记录了书签模块从 0 到 1 的实现过程，可与 Agent 对照使用。
