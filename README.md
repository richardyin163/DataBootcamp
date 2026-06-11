# DataBootcamp

这是一个基于营销活动分析场景的 Doris 数仓实验项目，旨在验证不同建模与分层方案在分析表达上的差异。

## 快速入口

- `docs/catalog.html`：项目总览入口，一页查看进展、数据集和模型结构
- `docs/project-status.md`：当前进展与推荐阅读顺序
- `docs/data-dictionary.md`：源数据和模型层数据字典
- `docs/data-lineage.md`：三种模型的表级血缘说明
- `docs/specs/schema-comparison.md`：三种模型结构对比

## 当前项目定位

- 目标：通过可执行 SQL、表结构和查询结果对比，验证以下三类方案的优劣与适用场景
  1. 纯维度建模
  2. 纯 Medallion Architecture（Bronze / Silver / Gold）
  3. 维度建模 + Medallion Architecture 结合
- 重点：实验验证、模型表达能力、对比分析
- 暂不优先：大规模数据、复杂脏数据治理、完整实时链路

## 当前进度

- `docs/discussion-summary.md`：已有讨论结论，明确了项目目标、阶段划分和当前边界
- `docs/implementation-outline.md`：已有实现方案路线，说明当前阶段要做的内容和落地策略
- `sql/`：已按 `dimensional`、`medallion`、`hybrid` 组织不同建模方案的 SQL 脚本
- `data/sample/`：包含项目模拟数据样例
- `docker/`：包含 docker-compose 和监控配置等容器相关内容

## 目录说明

- `docs/`：项目说明与设计文档
  - `discussion-summary.md`：项目讨论和决策总结
  - `implementation-outline.md`：当前实施方案与阶段目标
  - `results/`：实验结果输出
  - `specs/`：方案规格说明
- `sql/`：不同建模策略的 DDL/DML/查询脚本
- `data/sample/`：样例数据
- `docker/`：容器与运行环境相关配置

## 下一步建议

1. 先把当前阶段的核心实验产物补齐至 `sql/` 和 `docs/results/`
2. 在 `docs/` 中补充一个“当前状态与待办”页面，方便快速查看进展
3. 优先完成“维度建模 + Medallion 结合”主线，再补充对比方案

## 如何快速查看当前进展

- 阅读 `docs/discussion-summary.md`：了解已达成的项目共识
- 阅读 `docs/implementation-outline.md`：了解当前方案和阶段目标
- 进入 `sql/`：查看已实现的 SQL 结构和分析脚本
- 查看 `data/sample/`：确认当前模拟数据范围和字段

> 当前项目处于第一阶段实验验证阶段，建议继续把文档、SQL 和结果产物补齐，形成一个“可对比、可验证、可复现”的项目输出。
