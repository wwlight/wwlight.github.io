---
name: dev
description: wwlight.github.io — routes, vpr scripts, refactoring, Tailwind v4, docs. Use when working in this repo.
---

# wwlight 开发

Starlight + `/bookmarks/nav/` + `/bookmarks/admin/`。Node **24**。`vpr` = `vp run`。

| 场景 | Read |
| --- | --- |
| 路由、重构、反模式 | [reference.md](./reference.md) |
| className | [tailwindcss.md](./tailwindcss.md) |
| 主题 / 书签 | [`src/theme/README.md`](../../src/theme/README.md)、[`src/bookmarks/README.md`](../../src/bookmarks/README.md) |

| 命令 | 说明 |
| --- | --- |
| `vpr dev` / `dev:all` | :4321；`dev:all` 开双页 |
| `vpr build` / `preview` / `lint` | |
| `vpr generate:color-themes` | 主题 CSS + `options.json` |
| `vpr generate:theme-init` | `init.inline.js` |
| `vpr generate:bookmark-logos` | `bookmark-logos.json` |

改目录 / 路由：Read [reference.md](./reference.md) → 同步模块 README → `vpr lint` / `vpr build`。React 岛 `client:only="react"`；BackToTop → `document.body`。
