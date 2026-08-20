# 安全作业管理

安全作业管理方案原型项目，计划于 **2026-08-28** 完成当前阶段交付。

当前产品基线为 `v2.0.1--product-baseline`。版本规则：模块级重大更新增加第二位并将第三位归零；小范围功能或修正增加第三位。

本仓库收录三套主要产物：

- `Ai产物文件-pc端`：PC 管理端交互原型
- `Ai产物文件-移动端`：移动端高保真交互原型（React + Vite）
- `Ai产物文件-prd文档`：安全作业管理 PRD HTML 文档及配套素材

## 本地查看

- PC 端：进入 `Ai产物文件-pc端` 后运行 `python3 -m http.server 4173`，访问 `http://localhost:4173/`。
- 移动端：进入 `Ai产物文件-移动端`，运行 `npm ci`、`npm run dev`；提交前运行 `npm run build`。
- PRD：进入 `Ai产物文件-prd文档` 后运行 `python3 -m http.server 4174`，访问 `http://localhost:4174/安全作业管理_PRD.html`。

完整检查方法见 [`docs/ACCEPTANCE.md`](docs/ACCEPTANCE.md)。使用 HTTP 服务检查静态页面，可以更早发现资源路径和浏览器安全限制问题。

## 当前产品边界

- PC 端承担完整管理与配置场景，具体范围以正式 PRD 为准。
- 移动端当前只要求支持作业申请和作业监控查看。
- PC 与移动端不要求完全一致，但共享字段、状态和业务规则语义必须一致。

## 团队协作

开始任务前先阅读：

1. [`AGENTS.md`](AGENTS.md)：Codex 和团队必须遵守的仓库规则。
2. [`docs/PROJECT.md`](docs/PROJECT.md)：项目范围与阶段目标。
3. [`docs/WORKFLOW.md`](docs/WORKFLOW.md)：Issue、分支、PR 和版本流程。
4. [`docs/ACCEPTANCE.md`](docs/ACCEPTANCE.md)：PC、移动端和 PRD 验收清单。

所有开发从 `main` 创建 `codex/<类型>-<主题>` 分支，通过 Pull Request 合并。原始制度、表格和参考产品默认只读，不应在原型任务中顺手修改。
