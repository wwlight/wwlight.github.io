# Vite+（vp / vpr）

## 使用场景

**先判断是否启用本 skill**，再决定安装 / 跑脚本用什么命令。

| 启用（满足任一） | 说明 |
| --- | --- |
| `package.json` 含 `viteplus` 或 `@viteplus/*` | 在 `dependencies` / `devDependencies` 中 |
| 仓库根有 Vite+ 配置 | 如 `viteplus.config.ts`、`viteplus.config.mjs` |
| **project skill** 或根 `README.md` 约定 `vp` / `vpr` | 未写进 package 但团队/global 已装 [Vite+](https://viteplus.dev) 的项目 |

**不启用**：以上皆无 → 按该仓库既有方式（`pnpm install`、`npm run` 等），**不要**强行套用 `vp` / `vpr`。

**Agent**：安装依赖、跑 dev/build/lint、改 catalog 前，先 Read 当前仓库 `package.json`（及 project skill）；命中上表则读本文件并遵守下文规则；具体 script 名仍以 `package.json` → `scripts` 为准。

---

[Vite+](https://viteplus.dev) 封装包管理器与 `package.json` scripts，作为跨项目的统一安装与脚本入口。

## 命令

| 命令 | 作用 |
| --- | --- |
| `vp i` | 安装依赖（遵循项目 `packageManager`，如 pnpm） |
| `vpr <script>` | 运行 `package.json` → `scripts` 中的 `<script>` |

示例：`vpr dev`、`vpr build`、`vpr lint`。**具体 script 名以当前仓库 `package.json` 为准**；CLI 透传（如 `vpr astro check`）同理。

## Agent 规则

- **安装**：用 `vp i`，不要裸跑 `pnpm install` / `npm install` / `yarn`
- **脚本**：用 `vpr <name>`，不要裸跑 `pnpm run` / `npm run`
- **新增 / 修改 script**：改 `package.json` 的 `scripts`；各项目 skill 可维护本书常用命令速查，通用约定不在本文列全表
- **验证**：lint / build 等用 `vpr …`，与项目 CI 保持一致

## pnpm catalog（若项目采用）

部分仓库用 `pnpm-workspace.yaml` 的 `catalogs` 集中管版本：

- 版本号只写在 yaml 的 `catalogs`；`package.json` 用 `catalog:<组名>`，不写 `^x.y.z`
- 改 catalog 或 overrides 后执行 `vp i`
- catalog 分组表、overrides 策略写在**该项目 skill**
