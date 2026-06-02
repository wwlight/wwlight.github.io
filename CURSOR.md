# Cursor

Rules 与 Skills 均在 `.cursor/`（Skills：`.cursor/skills/`）。

```
.cursor/
├── rules/wwlight-project.mdc      # alwaysApply：先读 project skill
├── rules/karpathy-guidelines.mdc  # alwaysApply：最小改动
└── skills/
    ├── wwlight-project/SKILL.md   # 入口（含路径/路由）
    ├── dev-foundation/            # 重构、Tailwind、vp/vpr
    └── karpathy-guidelines/       # 与 rule 同步用；运行时读 rule
```

| Skill | 何时 |
| --- | --- |
| `wwlight-project/SKILL.md` | 每轮首选；alias / URL 见 **路径/路由** |
| `dev-foundation/SKILL.md` | 重构、博客写法 |
| `dev-foundation/tailwindcss.md` | className |
| `dev-foundation/vite-plus.md` | 安装与脚本 |

模块细节：`src/theme/README.md`、`src/bookmarks/README.md`。详见 [README → Vibe Coding](README.md#vibe-coding)。
