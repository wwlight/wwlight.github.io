# 与光同行

个人学习笔记与书签导航站点，基于 [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) 构建。

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## 功能

- **文档笔记** — Starlight 文档站，收录备忘录、工具集、系统相关等 Markdown 笔记
- **书签导航** — `/bookmarks/` 公开书签页，按分区展示常用链接
- **书签管理** — `/admin/bookmarks/` 本地管理端，支持增删改、拖拽排序、版本历史

## 技术栈

| 类别   | 选型                                                       |
| ------ | ---------------------------------------------------------- |
| 框架   | Astro 6、Starlight                                         |
| UI     | React 19、Tailwind CSS 4、Radix UI / shadcn 风格组件       |
| 数据   | Astro DB（书签数据）                                       |
| 工具链 | [Vite+](https://viteplus.dev)（`vp` / `vpr`）、pnpm 11.4.0 |

## 快速开始

需安装 [Vite+](https://viteplus.dev)（提供 `vp` / `vpr` 命令）。

```bash
vp i              # 安装依赖
vpr dev           # 主站，http://localhost:4321
vpr dev:admin     # 管理端，http://localhost:4325（首次运行创建 .env 并设置密码）
vpr dev:all       # 同时启动主站与管理端
vpr build         # 构建到 dist/
vpr lint          # ESLint 检查
```

## 书签管理端

:::tip[本地使用]

本地编辑 `/admin/bookmarks/`，保存至 `db/data/bookmarks.ts`。首次 `vpr dev:admin` 从 `.env.example` 生成 `.env` 并设置密码。

:::

| 变量                          | 说明                                            |
| ----------------------------- | ----------------------------------------------- |
| `PUBLIC_BOOKMARKS_ADMIN_HASH` | 登录密码 SHA-256 哈希（必填，首次启动自动写入） |
| `PUBLIC_BOOKMARKS_ADMIN_NAME` | 登录显示名，默认 `admin`                        |
| `BOOKMARKS_ADMIN_PORT`        | 端口，默认 `4325`                               |

| 能力                 | 本地 | 线上 |
| -------------------- | :--: | :--: |
| 登录                 |  ✅  |  ✅  |
| 增删改 / 排序 / 版本 |  ✅  |  ❌  |

:::danger[注意]

哈希打进前端 bundle，仅作门控，非服务端鉴权。

:::

:::note[部署与流程]

- 线上配置 `PUBLIC_BOOKMARKS_ADMIN_HASH`（同本地 `.env`）：GitHub Secrets、Vercel / Netlify Environment Variables
- 静态站点不可保存，数据随 `pnpm build` 发布
- 流程：`vpr dev:admin` → commit `db/data/bookmarks.ts` → push

:::

## 项目结构

```
├── src/
│   ├── content/docs/          # Starlight 文档（memorandum / tools / system / other）
│   ├── pages/
│   │   ├── bookmarks/         # 公开书签页
│   │   └── admin/bookmarks/   # 书签管理端
│   ├── components/            # Astro / React（admin、bookmarks、ui）
│   ├── lib/bookmarks/         # 书签逻辑、查询、管理端 API
│   └── styles/                # 全局与页面样式
├── db/
│   ├── config.ts              # Astro DB 配置
│   └── data/bookmarks.ts      # 书签数据源
├── integrations/              # Astro 集成（管理端 dev middleware）
├── scripts/                   # `dev-admin.mjs`、`dev-all.mjs` 等
├── public/                    # 静态资源
├── astro.config.mjs           # Astro / Starlight 配置
├── netlify.toml               # Netlify 构建设置
├── pnpm-workspace.yaml        # pnpm overrides（如 `vite` 版本）
└── .github/workflows/         # GitHub Pages 部署
```

## 在线预览

| 访问地址 | 部署 | 状态 |
| :--: | :--: | :--: |
| [![GitHub Pages](https://img.shields.io/badge/github%20pages-wwlight.github.io-brightgreen)](https://wwlight.github.io/) | — | [![Deploy](https://github.com/wwlight/wwlight.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/wwlight/wwlight.github.io/actions/workflows/deploy.yml) |
| [![Vercel](https://img.shields.io/badge/vercel-wwlight.vercel.app-brightgreen)](https://wwlight.vercel.app/) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwwlight%2Fwwlight.github.io) | — |
| [![Netlify](https://img.shields.io/badge/netlify-wwlight.netlify.app-brightgreen)](https://wwlight.netlify.app/) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/wwlight/wwlight.github.io) | [![Netlify Status](https://api.netlify.com/api/v1/badges/27a45be0-dc5e-47fd-93ef-9ff0e484df69/deploy-status)](https://app.netlify.com/projects/wwlight/deploys) |
