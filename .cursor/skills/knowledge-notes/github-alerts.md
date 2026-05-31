# GitHub Alerts

GitHub-flavored **callouts**（也称 admonitions、alerts）。用 blockquote + 类型标签写，在 GitHub、多数 GFM 渲染器里会显示为带色块与图标的提示框。

## 语法

```markdown
> [!TYPE]
> 正文第一行。
> 正文第二行。
```

- `TYPE`：`NOTE` | `TIP` | `IMPORTANT` | `WARNING` | `CAUTION`（GitHub 上不区分大小写）
- 正文每一行（含块内空行）都要以 `> ` 开头
- 可选标题：`> [!TIP] 自定义标题`（标题写在 `]` 后，同一行或下一行 `>` 正文）

## 五种类型

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## 选用建议

| 类型 | 适用场景 |
| --- | --- |
| NOTE | 补充说明、背景信息，略读也应看到 |
| TIP | 更好或更省力的做法 |
| IMPORTANT | 达成目标必须知道的关键信息 |
| WARNING | 需立刻注意的紧急信息，避免出问题 |
| CAUTION | 行为可能带来的风险或负面后果 |

## 与本仓库

- **Starlight 文档**（`src/content/docs/`）：现有内容多用 Starlight 指令 `:::note` / `:::tip` 等，改文档时优先沿用该写法，与 sidebar 主题一致。
- **GitHub Alerts**：适合 README、Issue/PR 描述、外部 GFM 文档等 GitHub 原生渲染场景；用户明确要求时再在 MDX 里改用 `[!TYPE]` 并确认构建链支持。
