# Readability Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight readability layer for the project with one static overview page plus focused docs for progress, data dictionary, and table-level lineage.

**Architecture:** Keep the implementation intentionally small. `docs/catalog.html` becomes the single visual entry point, while Markdown remains the source of detail for progress, data dictionary, and lineage. Add one lightweight pytest file that validates the required sections and links so the docs stay trustworthy as the project evolves.

**Tech Stack:** Markdown, static HTML/CSS, pytest, Python standard library

---

## File Structure

**Create**
- `docs/catalog.html`: Static overview page with progress, dataset summary, model comparison, layer/table navigation, and quick links.
- `docs/data-lineage.md`: Table-level lineage for source, dimensional, medallion, and hybrid views.
- `tests/test_readability_catalog.py`: Lightweight content checks for the new readability artifacts.

**Modify**
- `README.md`: Add a clear entry point to the catalog and reading order.
- `docs/project-status.md`: Make the current progress and recommended reading order explicit.
- `docs/data-dictionary.md`: Separate source-table dictionary from model-layer dictionary and link it to lineage usage.
- `docs/specs/schema-comparison.md`: Align model descriptions with the actual tables in `sql/`.

## Task 1: Add lineage documentation with a failing test first

**Files:**
- Create: `docs/data-lineage.md`
- Create: `tests/test_readability_catalog.py`

- [ ] **Step 1: Write the failing lineage test**

```python
from pathlib import Path


def read_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def test_lineage_doc_describes_all_models() -> None:
    text = read_text("docs/data-lineage.md")

    assert "# 数据血缘说明" in text
    assert "## 1. 源数据到模型的总览" in text
    assert "## 2. 维度建模方案血缘" in text
    assert "## 3. Medallion 方案血缘" in text
    assert "## 4. Hybrid 方案血缘" in text
    assert "payment_events -> silver_payments -> gold_campaign_funnel" in text
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pytest tests/test_readability_catalog.py::test_lineage_doc_describes_all_models -q`
Expected: FAIL because `docs/data-lineage.md` does not exist yet.

- [ ] **Step 3: Write the minimal lineage document**

```md
# 数据血缘说明

## 1. 源数据到模型的总览

本项目统一以样例数据表作为源数据入口：

- `campaigns`
- `users`
- `channel_touchpoints`
- `click_events`
- `coupon_claim_events`
- `order_events`
- `payment_events`

这些源表被映射到三种不同的建模视角，用于比较模型表达、分层清晰度和分析使用方式。

## 2. 维度建模方案血缘

维度建模以“源表直接进入维表或事实表”为主：

- `campaigns -> dim_campaign`
- `users -> dim_user`
- `channel_touchpoints -> fact_touchpoint`
- `click_events -> fact_click`
- `coupon_claim_events -> fact_coupon_claim`
- `order_events -> fact_order`
- `payment_events -> fact_payment`

关键说明：

- 维度建模强调主题清晰和查询直接性
- 表级血缘较短，适合快速理解指标归属

## 3. Medallion 方案血缘

Medallion 按 Bronze / Silver / Gold 分层组织：

### Bronze

- `channel_touchpoints -> bronze_touchpoints`
- `click_events -> bronze_clicks`
- `coupon_claim_events -> bronze_claims`
- `order_events -> bronze_orders`
- `payment_events -> bronze_payments`

### Silver

- `bronze_touchpoints -> silver_touchpoints`
- `bronze_clicks -> silver_clicks`
- `bronze_claims -> silver_claims`
- `bronze_orders -> silver_orders`
- `bronze_payments -> silver_payments`

### Gold

- `silver_touchpoints + silver_clicks + silver_claims + silver_orders + silver_payments -> gold_campaign_funnel`
- `silver_touchpoints + silver_payments + dim_user语义 -> gold_channel_segment_metrics`

关键指标映射示例：

- `payment_events -> silver_payments -> gold_campaign_funnel`
- `payment_amount -> paid_amount`

## 4. Hybrid 方案血缘

Hybrid 先保留分层，再把 Gold 侧收敛到星型模型：

### Bronze

- `bronze_touchpoints -> hybrid_bronze_touchpoints`
- `bronze_clicks -> hybrid_bronze_clicks`
- `bronze_claims -> hybrid_bronze_claims`
- `bronze_orders -> hybrid_bronze_orders`
- `bronze_payments -> hybrid_bronze_payments`

### Silver

- `hybrid_bronze_touchpoints -> hybrid_silver_touchpoints`
- `hybrid_bronze_payments -> hybrid_silver_payments`

### Gold / Star Schema

- `campaigns -> hybrid_dim_campaign`
- `users -> hybrid_dim_user`
- `hybrid_silver_payments -> hybrid_fact_payment`

关键说明：

- Hybrid 保留了分层加工路径
- 最终分析层回到 `dim_* + fact_*` 的模型组织

## 5. 如何配合阅读

- 先看 [项目状态](project-status.md)
- 再看 [docs/catalog.html](catalog.html)
- 表字段说明看 [数据字典](data-dictionary.md)
```

- [ ] **Step 4: Run the lineage test to verify it passes**

Run: `pytest tests/test_readability_catalog.py::test_lineage_doc_describes_all_models -q`
Expected: PASS

- [ ] **Step 5: Commit the lineage baseline**

```bash
git add docs/data-lineage.md tests/test_readability_catalog.py
git commit -m "docs: add lineage guide for readability catalog"
```

## Task 2: Refresh progress, data dictionary, and model comparison docs

**Files:**
- Modify: `docs/project-status.md`
- Modify: `docs/data-dictionary.md`
- Modify: `docs/specs/schema-comparison.md`
- Modify: `tests/test_readability_catalog.py`

- [ ] **Step 1: Extend the test file with supporting-doc assertions**

```python
from pathlib import Path


def read_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def test_lineage_doc_describes_all_models() -> None:
    text = read_text("docs/data-lineage.md")

    assert "# 数据血缘说明" in text
    assert "## 1. 源数据到模型的总览" in text
    assert "## 2. 维度建模方案血缘" in text
    assert "## 3. Medallion 方案血缘" in text
    assert "## 4. Hybrid 方案血缘" in text
    assert "payment_events -> silver_payments -> gold_campaign_funnel" in text


def test_supporting_docs_cover_progress_dictionary_and_comparison() -> None:
    status = read_text("docs/project-status.md")
    dictionary = read_text("docs/data-dictionary.md")
    comparison = read_text("docs/specs/schema-comparison.md")

    assert "## 2. 当前可直接阅读的内容" in status
    assert "## 3. 推荐阅读顺序" in status

    assert "## 1. 源数据字典" in dictionary
    assert "## 2. 模型层数据字典" in dictionary
    assert "## 3. 如何结合血缘阅读" in dictionary

    assert "## dimensional" in comparison
    assert "## medallion" in comparison
    assert "## hybrid" in comparison
    assert "当前已实现表" in comparison
```

- [ ] **Step 2: Run the new supporting-doc test to verify it fails**

Run: `pytest tests/test_readability_catalog.py::test_supporting_docs_cover_progress_dictionary_and_comparison -q`
Expected: FAIL because the current docs do not yet contain all required sections.

- [ ] **Step 3: Update the progress and comparison docs with the minimum required structure**

Replace `docs/project-status.md` with:

```md
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
```

Replace `docs/data-dictionary.md` with:

```md
# 数据字典

## 1. 源数据字典

### campaigns
- 业务含义：营销活动主数据
- `campaign_id`：活动唯一标识
- `campaign_name`：活动名称
- `campaign_type`：活动类型
- `channel_type`：投放渠道类型
- `start_date`：活动开始日期
- `end_date`：活动结束日期
- `budget_amount`：活动预算金额

### users
- 业务含义：用户主数据
- `user_id`：用户唯一标识
- `register_date`：注册日期
- `city_tier`：城市级别
- `user_segment`：用户分群

### channel_touchpoints
- 业务含义：活动触达和曝光记录
- `touch_id`：触达记录唯一标识
- `campaign_id`：活动 ID
- `user_id`：用户 ID
- `channel_id`：渠道 ID
- `touch_status`：触达状态
- `touch_time`：触达时间

### click_events
- 业务含义：点击行为记录
- `click_id`：点击记录唯一标识
- `touch_id`：关联触达记录 ID
- `campaign_id`：活动 ID
- `user_id`：用户 ID
- `click_time`：点击时间

### coupon_claim_events
- 业务含义：优惠领取记录
- `claim_id`：领取记录唯一标识
- `campaign_id`：活动 ID
- `user_id`：用户 ID
- `claim_time`：领取时间

### order_events
- 业务含义：下单行为记录
- `order_id`：订单唯一标识
- `campaign_id`：活动 ID
- `user_id`：用户 ID
- `order_amount`：订单金额
- `order_status`：订单状态
- `order_time`：下单时间

### payment_events
- 业务含义：支付行为记录
- `payment_id`：支付记录唯一标识
- `order_id`：关联订单 ID
- `campaign_id`：活动 ID
- `user_id`：用户 ID
- `payment_amount`：支付金额
- `payment_status`：支付状态
- `payment_time`：支付时间

## 2. 模型层数据字典

### dimensional
- `dim_campaign`：活动维表，关键字段 `campaign_id`、`campaign_name`、`campaign_type`、`channel_type`
- `dim_user`：用户维表，关键字段 `user_id`、`register_date`、`city_tier`、`user_segment`
- `fact_touchpoint`：触达事实表，关键字段 `touch_id`、`campaign_id`、`user_id`、`touch_status`
- `fact_click`：点击事实表，关键字段 `click_id`、`touch_id`、`campaign_id`、`user_id`
- `fact_coupon_claim`：领取事实表，关键字段 `claim_id`、`campaign_id`、`user_id`
- `fact_order`：订单事实表，关键字段 `order_id`、`campaign_id`、`user_id`、`order_amount`
- `fact_payment`：支付事实表，关键字段 `payment_id`、`order_id`、`campaign_id`、`payment_amount`

### medallion
- Bronze：保留原始事件字段，包含 `bronze_touchpoints`、`bronze_clicks`、`bronze_claims`、`bronze_orders`、`bronze_payments`
- Silver：保留标准化后的关键分析字段，包含 `silver_touchpoints`、`silver_clicks`、`silver_claims`、`silver_orders`、`silver_payments`
- Gold：分析主题表，包含 `gold_campaign_funnel`、`gold_channel_segment_metrics`

### hybrid
- Bronze：保留分层入口，包含 `hybrid_bronze_touchpoints`、`hybrid_bronze_clicks`、`hybrid_bronze_claims`、`hybrid_bronze_orders`、`hybrid_bronze_payments`
- Silver：标准化明细层，包含 `hybrid_silver_touchpoints`、`hybrid_silver_payments`
- Gold：分析模型层，包含 `hybrid_dim_campaign`、`hybrid_dim_user`、`hybrid_fact_payment`

## 3. 如何结合血缘阅读

- 先看源数据表的业务含义
- 再看模型层里的目标表属于哪一层
- 最后去 `docs/data-lineage.md` 查看该表从哪里来
```

Replace `docs/specs/schema-comparison.md` with:

```md
# 三套方案结构对比

## dimensional

- 模型目标：直接用维表和事实表支撑分析
- 分层方式：无显式 Bronze / Silver / Gold，直接组织主题模型
- 当前已实现表：`dim_campaign`、`dim_user`、`fact_touchpoint`、`fact_click`、`fact_coupon_claim`、`fact_order`、`fact_payment`

## medallion

- 模型目标：强调原始数据到分析主题表的加工链路
- 分层方式：Bronze / Silver / Gold
- 当前已实现表：`bronze_touchpoints`、`bronze_clicks`、`bronze_claims`、`bronze_orders`、`bronze_payments`、`silver_touchpoints`、`silver_clicks`、`silver_claims`、`silver_orders`、`silver_payments`、`gold_campaign_funnel`、`gold_channel_segment_metrics`

## hybrid

- 模型目标：保留分层治理路径，同时在分析层使用星型模型
- 分层方式：Bronze / Silver / Gold + `dim_*` / `fact_*`
- 当前已实现表：`hybrid_bronze_touchpoints`、`hybrid_bronze_clicks`、`hybrid_bronze_claims`、`hybrid_bronze_orders`、`hybrid_bronze_payments`、`hybrid_silver_touchpoints`、`hybrid_silver_payments`、`hybrid_dim_campaign`、`hybrid_dim_user`、`hybrid_fact_payment`

## 统一比较维度

- 业务口径表达位置
- 加工链路清晰度
- 查询复杂度
- 复用性
```

- [ ] **Step 4: Run the supporting-doc test to verify it passes**

Run: `pytest tests/test_readability_catalog.py::test_supporting_docs_cover_progress_dictionary_and_comparison -q`
Expected: PASS

- [ ] **Step 5: Commit the supporting-doc refresh**

```bash
git add docs/project-status.md docs/data-dictionary.md docs/specs/schema-comparison.md tests/test_readability_catalog.py
git commit -m "docs: clarify progress dictionary and model comparison"
```

## Task 3: Add the catalog page and README entry point

**Files:**
- Create: `docs/catalog.html`
- Modify: `README.md`
- Modify: `tests/test_readability_catalog.py`

- [ ] **Step 1: Extend the test file with catalog-page assertions**

```python
from pathlib import Path


def read_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def test_lineage_doc_describes_all_models() -> None:
    text = read_text("docs/data-lineage.md")

    assert "# 数据血缘说明" in text
    assert "## 1. 源数据到模型的总览" in text
    assert "## 2. 维度建模方案血缘" in text
    assert "## 3. Medallion 方案血缘" in text
    assert "## 4. Hybrid 方案血缘" in text
    assert "payment_events -> silver_payments -> gold_campaign_funnel" in text


def test_supporting_docs_cover_progress_dictionary_and_comparison() -> None:
    status = read_text("docs/project-status.md")
    dictionary = read_text("docs/data-dictionary.md")
    comparison = read_text("docs/specs/schema-comparison.md")

    assert "## 2. 当前可直接阅读的内容" in status
    assert "## 3. 推荐阅读顺序" in status
    assert "## 1. 源数据字典" in dictionary
    assert "## 2. 模型层数据字典" in dictionary
    assert "## 3. 如何结合血缘阅读" in dictionary
    assert "当前已实现表" in comparison


def test_catalog_and_readme_expose_primary_entry_points() -> None:
    catalog = read_text("docs/catalog.html")
    readme = read_text("README.md")

    assert "<title>DataBootcamp Readability Catalog</title>" in catalog
    assert 'id="progress"' in catalog
    assert 'id="dataset"' in catalog
    assert 'id="models"' in catalog
    assert 'id="layers"' in catalog
    assert 'id="quick-links"' in catalog
    assert 'href="data-dictionary.md"' in catalog
    assert 'href="data-lineage.md"' in catalog
    assert "`docs/catalog.html`" in readme
```

- [ ] **Step 2: Run the catalog test to verify it fails**

Run: `pytest tests/test_readability_catalog.py::test_catalog_and_readme_expose_primary_entry_points -q`
Expected: FAIL because `docs/catalog.html` does not exist yet and `README.md` does not reference it.

- [ ] **Step 3: Create the catalog page and update the README**

Create `docs/catalog.html` with:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DataBootcamp Readability Catalog</title>
    <style>
      :root {
        --bg: #f7f2e8;
        --card: #fffaf1;
        --ink: #1f2933;
        --muted: #52606d;
        --line: #d9cbb3;
        --accent: #8c3b2a;
      }

      body {
        margin: 0;
        font-family: Georgia, "Noto Serif SC", serif;
        color: var(--ink);
        background: linear-gradient(180deg, #f6efe4 0%, #fbf8f2 100%);
      }

      main {
        max-width: 1080px;
        margin: 0 auto;
        padding: 32px 20px 64px;
      }

      nav a,
      a {
        color: var(--accent);
      }

      .hero,
      .panel {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 12px 30px rgba(140, 59, 42, 0.08);
      }

      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      h1,
      h2,
      h3 {
        margin-top: 0;
      }

      code {
        background: #f1e4cf;
        padding: 2px 6px;
        border-radius: 6px;
      }

      ul {
        padding-left: 18px;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p>DataBootcamp / Readability Catalog</p>
        <h1>用一页看清项目进展、数据集和模型结构</h1>
        <p>这个页面只负责导航和对比，详细字段与血缘说明继续落在 Markdown 文档中。</p>
        <nav>
          <a href="#progress">项目进展</a>
          <a href="#dataset">Dataset</a>
          <a href="#models">模型对比</a>
          <a href="#layers">分层与表</a>
          <a href="#quick-links">快速入口</a>
        </nav>
      </section>

      <section id="progress" class="panel">
        <h2>项目进展</h2>
        <ul>
          <li>当前阶段：第一阶段实验验证</li>
          <li>已具备：样例数据、三套 SQL、结果文档、结构说明</li>
          <li>当前增强点：统一入口、数据字典、表级血缘</li>
        </ul>
      </section>

      <section id="dataset" class="panel">
        <h2>Dataset 总览</h2>
        <div class="grid">
          <article>
            <h3><code>campaigns</code></h3>
            <p>营销活动主数据</p>
          </article>
          <article>
            <h3><code>users</code></h3>
            <p>用户主数据</p>
          </article>
          <article>
            <h3><code>channel_touchpoints</code></h3>
            <p>活动触达与曝光记录</p>
          </article>
          <article>
            <h3><code>payment_events</code></h3>
            <p>支付行为记录</p>
          </article>
        </div>
        <p>完整字段说明见 <a href="data-dictionary.md">docs/data-dictionary.md</a>。</p>
      </section>

      <section id="models" class="panel">
        <h2>三种模型对比</h2>
        <div class="grid">
          <article>
            <h3>dimensional</h3>
            <p>直接以维表和事实表组织分析主题。</p>
            <p>目录：<code>sql/dimensional/</code></p>
          </article>
          <article>
            <h3>medallion</h3>
            <p>按 Bronze / Silver / Gold 展示加工链路。</p>
            <p>目录：<code>sql/medallion/</code></p>
          </article>
          <article>
            <h3>hybrid</h3>
            <p>保留分层路径，同时在分析层使用星型模型。</p>
            <p>目录：<code>sql/hybrid/</code></p>
          </article>
        </div>
      </section>

      <section id="layers" class="panel">
        <h2>分层与表导航</h2>
        <h3>dimensional</h3>
        <p>表：<code>dim_campaign</code>、<code>dim_user</code>、<code>fact_payment</code> 等。</p>
        <h3>medallion</h3>
        <p>层级：Bronze、Silver、Gold，对应原始、标准化、分析主题表。</p>
        <h3>hybrid</h3>
        <p>层级：Bronze、Silver、Gold，其中 Gold 侧为 <code>dim_*</code> 与 <code>fact_*</code>。</p>
        <p>表级来源关系见 <a href="data-lineage.md">docs/data-lineage.md</a>。</p>
      </section>

      <section id="quick-links" class="panel">
        <h2>快速入口</h2>
        <ul>
          <li><a href="project-status.md">项目状态</a></li>
          <li><a href="data-dictionary.md">数据字典</a></li>
          <li><a href="data-lineage.md">数据血缘</a></li>
          <li><a href="specs/schema-comparison.md">结构对比</a></li>
        </ul>
      </section>
    </main>
  </body>
</html>
```

Update the top half of `README.md` to:

```md
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
```

- [ ] **Step 4: Run the catalog test to verify it passes**

Run: `pytest tests/test_readability_catalog.py::test_catalog_and_readme_expose_primary_entry_points -q`
Expected: PASS

- [ ] **Step 5: Commit the entry-point page**

```bash
git add docs/catalog.html README.md tests/test_readability_catalog.py
git commit -m "docs: add readability catalog entry page"
```

## Task 4: Run full verification and finalize

**Files:**
- Verify: `tests/test_readability_catalog.py`
- Verify: `tests/test_generate_marketing_data.py`

- [ ] **Step 1: Run the focused readability test file**

Run: `pytest tests/test_readability_catalog.py -q`
Expected: PASS with 3 passing tests.

- [ ] **Step 2: Run the existing data-generation tests to catch accidental breakage**

Run: `pytest tests/test_generate_marketing_data.py -q`
Expected: PASS

- [ ] **Step 3: Run the full test suite**

Run: `pytest -q`
Expected: PASS

- [ ] **Step 4: Commit the final verified state**

```bash
git add README.md docs/catalog.html docs/data-dictionary.md docs/data-lineage.md docs/project-status.md docs/specs/schema-comparison.md tests/test_readability_catalog.py
git commit -m "docs: improve project readability entry points"
```
