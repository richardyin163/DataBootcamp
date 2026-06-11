# 项目当前状态与待办

## 1. 当前状态快照

- 当前阶段：第一阶段实验验证
- 已有核心资产：样例数据、三种模型 SQL、方案文档、结果文档
- 当前主要缺口：统一入口、清晰血缘、可快速浏览的数据字典

## 2. 当前可直接阅读的内容

- `README.md`：项目定位与入口
- `docs/catalog.html`：一页总览项目进展、数据集和模型结构
- `docs/project-status.md`：当前进展和阅读顺序
- `docs/data-dictionary.md`：字段与业务含义
- `docs/data-lineage.md`：表级血缘
- `docs/specs/schema-comparison.md`：模型差异

## 3. 推荐阅读顺序

1. 先读 `README.md`
2. 再看 `docs/catalog.html`
3. 然后阅读 `docs/project-status.md`
4. 需要看字段时进入 `docs/data-dictionary.md`
5. 需要看来源关系时进入 `docs/data-lineage.md`

## 4. 已完成内容

- 已有统一营销活动分析场景
- 已有样例数据文件和生成脚本
- 已有 `dimensional`、`medallion`、`hybrid` 三套 SQL
- 已有结果文档与对比文档

## 5. 当前待补齐内容

- 增加总览页入口
- 补齐三种模型的表级血缘说明
- 把数据字典从“表列表”提升为“源数据 + 模型层”两段式说明
