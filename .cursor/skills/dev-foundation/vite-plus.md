# Vite+（vp / vpr）

本仓库启用：`package.json` 用 `vpr` / README 约定 → 用本文。

| 命令 | 作用 |
| --- | --- |
| `vp i` | 安装（勿裸 `pnpm install`） |
| `vpr <script>` | 跑 `package.json` scripts（勿裸 `pnpm run`） |

## catalog（本仓库）

- 版本只在 `pnpm-workspace.yaml` → `catalogs`
- `package.json`：`catalog:<组名>`
- 改 catalog 后 `vp i`
- 分组表见 `wwlight-project/SKILL.md`
