# 与光同行

个人学习笔记与书签导航站点，基于 [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) 构建。

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## 功能

- **文档笔记** — Starlight 文档站，收录备忘录、工具集、系统相关等 Markdown 笔记
- **书签导航** — `/bookmarks/` 公开书签页，按分区展示常用链接
- **书签管理** — `/admin/bookmarks/` 本地管理端，支持增删改、拖拽排序、版本历史；数据写入 `db/data/bookmarks.ts`

## 技术栈

| 类别    | 选型                                                       |
| ------- | ---------------------------------------------------------- |
| 框架    | Astro 6、Starlight                                         |
| UI      | React 19、Tailwind CSS 4、Radix UI / shadcn 风格组件       |
| 数据    | Astro DB（书签数据）                                       |
| 工具链  | [Vite+](https://viteplus.dev)（`vp` / `vpr`）、pnpm 11.4.0 |
| Node.js | 22（见 `.node-version`）                                   |

## 快速开始

### 环境要求

- Node.js 22
- [Vite+](https://viteplus.dev)（推荐，提供 `vp` / `vpr` 命令）

### 安装与开发

```bash
# 安装依赖
vp i

# 启动主站（默认 http://localhost:4321）
vpr dev

# 书签管理端（首次启动会创建 .env 并设置密码，端口 4325）
vpr dev:admin

# 同时启动主站 + 管理端
vpr dev:all
```

未安装 Vite+ 时，也可使用 pnpm：

```bash
pnpm install
pnpm dev
```

### 常用命令

| 命令            | 说明                                             |
| --------------- | ------------------------------------------------ |
| `vpr dev`       | 启动 Astro 开发服务器                            |
| `vpr dev:admin` | 启动书签管理端（首次运行创建 `.env` 并设置密码） |
| `vpr dev:all`   | 并行启动主站与管理端                             |
| `vpr build`     | 构建静态站点到 `dist/`                           |
| `vpr preview`   | 预览构建结果                                     |
| `vpr lint`      | ESLint 检查                                      |
| `vpr lint:fix`  | ESLint 自动修复                                  |

## 书签管理端

管理端用于本地编辑书签，保存后会更新 `db/data/bookmarks.ts`，需自行 commit 并部署。

### 1. 配置 `PUBLIC_BOOKMARKS_ADMIN_HASH`

该变量是**登录密码的 SHA-256 哈希**（64 位十六进制，非明文），构建时注入前端用于登录校验。`.env` 已在 `.gitignore` 中，不会提交到 Git。

**方式 A：自动配置（推荐）**

首次启动时从 `.env.example` 创建 `.env`，并交互设置密码：

```bash
vpr dev:admin
```

**方式 B：非交互**

```bash
BOOKMARKS_ADMIN_PASSWORD=你的密码 vpr dev:admin
```

**方式 C：手动写入 `.env`**

生成哈希：

```bash
node -e "import crypto from 'node:crypto'; console.log(crypto.createHash('sha256').update('你的密码').digest('hex'))"
```

写入项目根目录 `.env`：

```env
PUBLIC_BOOKMARKS_ADMIN_NAME=admin
PUBLIC_BOOKMARKS_ADMIN_HASH=上面生成的哈希值
```

改密码时需重新生成哈希，并更新 `.env` 与各部署平台的环境变量。

### 2. 环境变量

| 变量                          | 必填 | 说明                                |
| ----------------------------- | ---- | ----------------------------------- |
| `PUBLIC_BOOKMARKS_ADMIN_HASH` | 是   | 管理端密码的 SHA-256 哈希（非明文） |
| `PUBLIC_BOOKMARKS_ADMIN_NAME` | 否   | 登录页显示名称，默认 `admin`        |
| `BOOKMARKS_ADMIN_PORT`        | 否   | 管理端端口，默认 `4325`             |

> 管理端为个人站点访问门控，密码哈希暴露在客户端 bundle 中，**不能替代服务端鉴权**。请勿用于高敏感场景。

### 3. 生产部署

静态部署（GitHub Pages / Netlify / Vercel）上管理端 API 不可用，线上 `/admin/bookmarks/` 仅保留登录与 UI；书签数据随构建产物发布。本地开发时管理端可读写 `db/data/bookmarks.ts`。

#### 仓库内的部署配置

| 文件                           | 平台         | 作用                       |
| ------------------------------ | ------------ | -------------------------- |
| `.github/workflows/deploy.yml` | GitHub Pages | CI 构建与发布              |
| `vercel.json`                  | Vercel       | 构建命令、输出目录         |
| `netlify.toml`                 | Netlify      | 构建命令、Node / pnpm 版本 |

以上文件只负责**怎么构建**，不含密码。`PUBLIC_BOOKMARKS_ADMIN_HASH` **不能**写进这些文件，必须在各平台控制台单独配置（见下节）。

#### 配置 `PUBLIC_BOOKMARKS_ADMIN_HASH`（各平台控制台）

从本地 `.env` 复制 `PUBLIC_BOOKMARKS_ADMIN_HASH=` 后面的哈希值，填入对应平台：

**GitHub Pages**

1. 打开 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `PUBLIC_BOOKMARKS_ADMIN_HASH`，Value: 哈希值
4. 保存后 push 到 `main` 触发 `.github/workflows/deploy.yml` 重新构建

**Vercel**

1. 进入项目 → 左侧 **Environment Variables**
2. 添加 `PUBLIC_BOOKMARKS_ADMIN_HASH` = 本地 `.env` 中的哈希值，Environment 选 **Production** → **Save**
3. 保存后重新部署（push 到 `main`，或在 **Deployments** 里 Redeploy）

首次接入：Dashboard **Add New… → Project** → 选 GitHub 仓库即可，构建设置读 `vercel.json`。

**Netlify**

1. 进入站点 → **Project configuration** → **Environment variables**
2. **Add a variable** → Key: `PUBLIC_BOOKMARKS_ADMIN_HASH`，Value: 哈希值（可勾选 **Contains secret values**）→ Save
3. 保存后重新部署（push 触发，或在 **Deploys** 页手动部署）

也可 **Add a variable → Import from a .env file**，粘贴本地 `.env` 内容。

首次接入：**Add new project → Import from Git** → 选仓库即可，构建设置读 `netlify.toml`。

#### 工作流

本地 `vpr dev:admin` 编辑书签 → commit `db/data/bookmarks.ts` → push → 各平台自动重新构建。

## 项目结构

```
├── src/
│   ├── content/docs/         # Starlight 文档内容
│   ├── pages/
│   │   ├── bookmarks/        # 公开书签页
│   │   └── admin/bookmarks/  # 书签管理端
│   ├── components/           # Astro / React 组件
│   └── lib/bookmarks/        # 书签逻辑与 API
├── db/data/bookmarks.ts      # 书签数据源
├── integrations/             # Astro 集成（管理端 dev API 等）
├── scripts/                  # 开发辅助脚本
├── vercel.json               # Vercel 构建设置
├── netlify.toml              # Netlify 构建设置
└── .github/workflows/        # CI / GitHub Pages 部署
```

## 在线预览

| 地址                                                | 部署         |
| --------------------------------------------------- | ------------ |
| [wwlight.github.io](https://wwlight.github.io/)     | GitHub Pages |
| [wwlight.vercel.app](https://wwlight.vercel.app/)   | Vercel       |
| [wwlight.netlify.app](https://wwlight.netlify.app/) | Netlify      |

## 开发说明

- **Git Hooks** — `prepare` 脚本通过 `simple-git-hooks` 注册 pre-commit，提交前自动运行 `lint-staged` + ESLint
- **跳过 Hook** — `SKIP_SIMPLE_GIT_HOOKS=1 git commit ...`
- **同时开发主站与管理端** — 使用 `vpr dev:all`

## License

Private — 个人项目。
