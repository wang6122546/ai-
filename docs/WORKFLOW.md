# Git 协作流程

## 1. 提出需求

创建 GitHub Issue，写明背景、涉及端、事实源、不涉及范围和验收标准。业务规则未明确时，先建立产品决策 Issue，不直接制作原型。

## 2. 创建分支

从最新 `main` 创建任务分支：

```bash
git switch main
git pull --ff-only
git switch -c codex/pc-job-application
```

推荐前缀：`prd-`、`pc-`、`mobile-`、`docs-`、`fix-`。

## 3. 使用 Codex 执行

任务提示必须包含：

- Issue 编号或任务名称。
- 需要读取的事实源。
- 允许和禁止修改的范围。
- 验收标准。
- 是否允许提交、推送和创建 PR。

## 4. 本地验证

按 `ACCEPTANCE.md` 执行对应检查。检查失败时不得声称完成；无法检查的项目必须在 PR 中标明。

## 5. 提交与推送

只暂存任务文件：

```bash
git status --short
git diff -- path/to/file
git add -- path/to/file
git commit -m "PC: 完善作业申请流程"
git push -u origin codex/pc-job-application
```

## 6. Pull Request

- PR 对应一个主题，并关联 Issue。
- PR 中说明影响 PC、移动端还是 PRD。
- 至少由另一位成员审核。
- 业务规则变更必须由产品负责人确认。
- 合并后删除功能分支，Issue 验收完成后关闭。

## 7. 发布版本

- 模块级重大更新增加第二个版本号并将修订号归零。
- 小功能或修正增加第三个版本号。
- 打标签前确认 `main` 已包含目标内容、工作区无意外变更、验收记录完整。
