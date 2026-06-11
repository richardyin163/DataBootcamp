# Readability Catalog Drilldown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the catalog page from a static overview into a lightweight drilldown page where users can click a model, inspect its layers and tables, and preview field structure plus up to two sample rows without leaving `docs/catalog.html`.

**Architecture:** Keep the page static and local-file friendly. Store the source-table rows, model-table field lists, and short lineage strings in `docs/catalog-data.js`, render the page with a small `docs/catalog.js`, and keep `docs/catalog.html` as the shell. Use `unittest`-based string checks so verification works in the current environment without external dependencies. This plan supersedes the earlier navigation-only plan in `docs/superpowers/plans/2026-06-07-readability-catalog.md`.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, Markdown, Python standard library `unittest`

---

## File Structure

**Create**
- `docs/catalog-data.js`: Static catalog metadata for source tables, model layers, field lists, lineage strings, and up-to-two sample rows.
- `docs/catalog.js`: Small client-side renderer and expand/collapse behavior for dataset, model, layer, and table drilldown.

**Modify**
- `docs/catalog.html`: Replace the navigation-only body with an interactive shell that mounts dataset, model cards, and model details.
- `tests/test_readability_catalog.py`: Add zero-dependency tests that protect the new drilldown data and page structure.

## Task 1: Add drilldown-data coverage first, then create the catalog metadata file

**Files:**
- Create: `docs/catalog-data.js`
- Modify: `tests/test_readability_catalog.py`

- [ ] **Step 1: Add a failing test for drilldown metadata**

Update `tests/test_readability_catalog.py` to:

```python
from pathlib import Path
import unittest


def read_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


class ReadabilityCatalogTest(unittest.TestCase):
    def test_lineage_doc_describes_all_models(self) -> None:
        text = read_text("docs/data-lineage.md")

        self.assertIn("# 数据血缘说明", text)
        self.assertIn("## 1. 源数据到模型的总览", text)
        self.assertIn("## 2. 维度建模方案血缘", text)
        self.assertIn("## 3. Medallion 方案血缘", text)
        self.assertIn("## 4. Hybrid 方案血缘", text)
        self.assertIn("payment_events -> silver_payments -> gold_campaign_funnel", text)

    def test_supporting_docs_cover_progress_dictionary_and_comparison(self) -> None:
        status = read_text("docs/project-status.md")
        dictionary = read_text("docs/data-dictionary.md")
        comparison = read_text("docs/specs/schema-comparison.md")

        self.assertIn("## 2. 当前可直接阅读的内容", status)
        self.assertIn("## 3. 推荐阅读顺序", status)
        self.assertIn("## 1. 源数据字典", dictionary)
        self.assertIn("## 2. 模型层数据字典", dictionary)
        self.assertIn("## 3. 如何结合血缘阅读", dictionary)
        self.assertIn("当前已实现表", comparison)

    def test_catalog_and_readme_expose_primary_entry_points(self) -> None:
        catalog = read_text("docs/catalog.html")
        readme = read_text("README.md")

        self.assertIn("<title>DataBootcamp Readability Catalog</title>", catalog)
        self.assertIn('id="progress"', catalog)
        self.assertIn('id="dataset"', catalog)
        self.assertIn('id="models"', catalog)
        self.assertIn('id="layers"', catalog)
        self.assertIn('id="quick-links"', catalog)
        self.assertIn('href="data-dictionary.md"', catalog)
        self.assertIn('href="data-lineage.md"', catalog)
        self.assertIn("`docs/catalog.html`", readme)

    def test_catalog_data_includes_models_fields_and_samples(self) -> None:
        catalog_data = read_text("docs/catalog-data.js")

        self.assertIn("window.catalogData =", catalog_data)
        self.assertIn('"sourceTables"', catalog_data)
        self.assertIn('"models"', catalog_data)
        self.assertIn('"campaigns"', catalog_data)
        self.assertIn('"dimensional"', catalog_data)
        self.assertIn('"medallion"', catalog_data)
        self.assertIn('"hybrid"', catalog_data)
        self.assertIn('"sampleRows"', catalog_data)
        self.assertIn('"campaign_1"', catalog_data)
        self.assertIn('"paid_amount"', catalog_data)
        self.assertIn('"gold_campaign_funnel"', catalog_data)
```

- [ ] **Step 2: Run the new metadata test to verify it fails**

Run: `python3 -m unittest tests.test_readability_catalog.ReadabilityCatalogTest.test_catalog_data_includes_models_fields_and_samples -q`
Expected: FAIL because `docs/catalog-data.js` does not exist yet.

- [ ] **Step 3: Create the drilldown metadata file**

Create `docs/catalog-data.js` with:

```js
window.catalogData = {
  sourceTables: [
    {
      name: "campaigns",
      description: "营销活动主数据",
      lineage: "campaigns -> dim_campaign / hybrid_dim_campaign",
      fields: [
        "campaign_id",
        "campaign_name",
        "campaign_type",
        "channel_type",
        "start_date",
        "end_date",
        "budget_amount"
      ],
      sampleRows: [
        {
          campaign_id: "C001",
          campaign_name: "campaign_1",
          campaign_type: "bundle",
          channel_type: "app_push",
          start_date: "2026-05-01",
          end_date: "2026-05-31",
          budget_amount: "10500"
        },
        {
          campaign_id: "C002",
          campaign_name: "campaign_2",
          campaign_type: "discount",
          channel_type: "wechat",
          start_date: "2026-05-01",
          end_date: "2026-05-31",
          budget_amount: "11000"
        }
      ]
    },
    {
      name: "users",
      description: "用户主数据",
      lineage: "users -> dim_user / hybrid_dim_user",
      fields: ["user_id", "register_date", "city_tier", "user_segment"],
      sampleRows: [
        {
          user_id: "U0001",
          register_date: "2026-04-01",
          city_tier: "tier_3",
          user_segment: "returning"
        },
        {
          user_id: "U0002",
          register_date: "2026-04-01",
          city_tier: "tier_3",
          user_segment: "new"
        }
      ]
    },
    {
      name: "channel_touchpoints",
      description: "活动触达与曝光记录",
      lineage: "channel_touchpoints -> fact_touchpoint / bronze_touchpoints",
      fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_status", "touch_time"],
      sampleRows: [
        {
          touch_id: "T00001",
          campaign_id: "C005",
          user_id: "U0003",
          channel_id: "app_push",
          touch_status: "exposed",
          touch_time: "2026-05-01 09:01:00"
        },
        {
          touch_id: "T00002",
          campaign_id: "C005",
          user_id: "U0077",
          channel_id: "app_push",
          touch_status: "exposed",
          touch_time: "2026-05-01 09:02:00"
        }
      ]
    },
    {
      name: "click_events",
      description: "点击行为记录",
      lineage: "click_events -> fact_click / bronze_clicks",
      fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
      sampleRows: [
        {
          click_id: "CLK00003",
          touch_id: "T00003",
          campaign_id: "C001",
          user_id: "U0035",
          click_time: "2026-05-01 09:06:00"
        },
        {
          click_id: "CLK00006",
          touch_id: "T00006",
          campaign_id: "C005",
          user_id: "U0040",
          click_time: "2026-05-01 09:09:00"
        }
      ]
    },
    {
      name: "coupon_claim_events",
      description: "优惠领取记录",
      lineage: "coupon_claim_events -> fact_coupon_claim / bronze_claims",
      fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
      sampleRows: [
        {
          claim_id: "CLM00008",
          campaign_id: "C005",
          user_id: "U0054",
          claim_time: "2026-05-01 09:13:00"
        },
        {
          claim_id: "CLM00016",
          campaign_id: "C002",
          user_id: "U0164",
          claim_time: "2026-05-01 09:21:00"
        }
      ]
    },
    {
      name: "order_events",
      description: "下单行为记录",
      lineage: "order_events -> fact_order / bronze_orders",
      fields: ["order_id", "campaign_id", "user_id", "order_amount", "order_status", "order_time"],
      sampleRows: [
        {
          order_id: "O00011",
          campaign_id: "C004",
          user_id: "U0065",
          order_amount: "100",
          order_status: "submitted",
          order_time: "2026-05-01 09:21:00"
        },
        {
          order_id: "O00022",
          campaign_id: "C002",
          user_id: "U0140",
          order_amount: "120",
          order_status: "submitted",
          order_time: "2026-05-01 09:32:00"
        }
      ]
    },
    {
      name: "payment_events",
      description: "支付行为记录",
      lineage: "payment_events -> fact_payment / bronze_payments / hybrid_fact_payment",
      fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_status", "payment_time"],
      sampleRows: [
        {
          payment_id: "P00011",
          order_id: "O00011",
          campaign_id: "C004",
          user_id: "U0065",
          payment_amount: "100",
          payment_status: "paid",
          payment_time: "2026-05-01 09:26:00"
        },
        {
          payment_id: "P00022",
          order_id: "O00022",
          campaign_id: "C002",
          user_id: "U0140",
          payment_amount: "120",
          payment_status: "paid",
          payment_time: "2026-05-01 09:37:00"
        }
      ]
    }
  ],
  models: {
    dimensional: {
      label: "dimensional",
      description: "直接以维表和事实表组织分析主题。",
      layers: [
        {
          name: "dimensions",
          label: "维表",
          tables: [
            {
              name: "dim_campaign",
              description: "活动维表",
              lineage: "campaigns -> dim_campaign",
              fields: ["campaign_id", "campaign_name", "campaign_type", "channel_type", "start_date", "end_date", "budget_amount"],
              sampleRows: [
                {
                  campaign_id: "C001",
                  campaign_name: "campaign_1",
                  campaign_type: "bundle",
                  channel_type: "app_push",
                  start_date: "2026-05-01",
                  end_date: "2026-05-31",
                  budget_amount: "10500"
                },
                {
                  campaign_id: "C002",
                  campaign_name: "campaign_2",
                  campaign_type: "discount",
                  channel_type: "wechat",
                  start_date: "2026-05-01",
                  end_date: "2026-05-31",
                  budget_amount: "11000"
                }
              ]
            },
            {
              name: "dim_user",
              description: "用户维表",
              lineage: "users -> dim_user",
              fields: ["user_id", "register_date", "city_tier", "user_segment"],
              sampleRows: [
                { user_id: "U0001", register_date: "2026-04-01", city_tier: "tier_3", user_segment: "returning" },
                { user_id: "U0002", register_date: "2026-04-01", city_tier: "tier_3", user_segment: "new" }
              ]
            }
          ]
        },
        {
          name: "facts",
          label: "事实表",
          tables: [
            {
              name: "fact_touchpoint",
              description: "触达事实表",
              lineage: "channel_touchpoints -> fact_touchpoint",
              fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_status", "touch_time"],
              sampleRows: [
                { touch_id: "T00001", campaign_id: "C005", user_id: "U0003", channel_id: "app_push", touch_status: "exposed", touch_time: "2026-05-01 09:01:00" },
                { touch_id: "T00002", campaign_id: "C005", user_id: "U0077", channel_id: "app_push", touch_status: "exposed", touch_time: "2026-05-01 09:02:00" }
              ]
            },
            {
              name: "fact_click",
              description: "点击事实表",
              lineage: "click_events -> fact_click",
              fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
              sampleRows: [
                { click_id: "CLK00003", touch_id: "T00003", campaign_id: "C001", user_id: "U0035", click_time: "2026-05-01 09:06:00" },
                { click_id: "CLK00006", touch_id: "T00006", campaign_id: "C005", user_id: "U0040", click_time: "2026-05-01 09:09:00" }
              ]
            },
            {
              name: "fact_coupon_claim",
              description: "领取事实表",
              lineage: "coupon_claim_events -> fact_coupon_claim",
              fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
              sampleRows: [
                { claim_id: "CLM00008", campaign_id: "C005", user_id: "U0054", claim_time: "2026-05-01 09:13:00" },
                { claim_id: "CLM00016", campaign_id: "C002", user_id: "U0164", claim_time: "2026-05-01 09:21:00" }
              ]
            },
            {
              name: "fact_order",
              description: "订单事实表",
              lineage: "order_events -> fact_order",
              fields: ["order_id", "campaign_id", "user_id", "order_amount", "order_status", "order_time"],
              sampleRows: [
                { order_id: "O00011", campaign_id: "C004", user_id: "U0065", order_amount: "100", order_status: "submitted", order_time: "2026-05-01 09:21:00" },
                { order_id: "O00022", campaign_id: "C002", user_id: "U0140", order_amount: "120", order_status: "submitted", order_time: "2026-05-01 09:32:00" }
              ]
            },
            {
              name: "fact_payment",
              description: "支付事实表",
              lineage: "payment_events -> fact_payment",
              fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_status", "payment_time"],
              sampleRows: [
                { payment_id: "P00011", order_id: "O00011", campaign_id: "C004", user_id: "U0065", payment_amount: "100", payment_status: "paid", payment_time: "2026-05-01 09:26:00" },
                { payment_id: "P00022", order_id: "O00022", campaign_id: "C002", user_id: "U0140", payment_amount: "120", payment_status: "paid", payment_time: "2026-05-01 09:37:00" }
              ]
            }
          ]
        }
      ]
    },
    medallion: {
      label: "medallion",
      description: "按 Bronze / Silver / Gold 展示加工链路。",
      layers: [
        {
          name: "bronze",
          label: "Bronze",
          tables: [
            { name: "bronze_touchpoints", description: "原始触达层", lineage: "channel_touchpoints -> bronze_touchpoints", fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_status", "touch_time"], sampleRows: [{ touch_id: "T00001", campaign_id: "C005", user_id: "U0003", channel_id: "app_push", touch_status: "exposed", touch_time: "2026-05-01 09:01:00" }, { touch_id: "T00002", campaign_id: "C005", user_id: "U0077", channel_id: "app_push", touch_status: "exposed", touch_time: "2026-05-01 09:02:00" }] },
            { name: "bronze_clicks", description: "原始点击层", lineage: "click_events -> bronze_clicks", fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"], sampleRows: [{ click_id: "CLK00003", touch_id: "T00003", campaign_id: "C001", user_id: "U0035", click_time: "2026-05-01 09:06:00" }, { click_id: "CLK00006", touch_id: "T00006", campaign_id: "C005", user_id: "U0040", click_time: "2026-05-01 09:09:00" }] },
            { name: "bronze_claims", description: "原始领取层", lineage: "coupon_claim_events -> bronze_claims", fields: ["claim_id", "campaign_id", "user_id", "claim_time"], sampleRows: [{ claim_id: "CLM00008", campaign_id: "C005", user_id: "U0054", claim_time: "2026-05-01 09:13:00" }, { claim_id: "CLM00016", campaign_id: "C002", user_id: "U0164", claim_time: "2026-05-01 09:21:00" }] },
            { name: "bronze_orders", description: "原始订单层", lineage: "order_events -> bronze_orders", fields: ["order_id", "campaign_id", "user_id", "order_amount", "order_status", "order_time"], sampleRows: [{ order_id: "O00011", campaign_id: "C004", user_id: "U0065", order_amount: "100", order_status: "submitted", order_time: "2026-05-01 09:21:00" }, { order_id: "O00022", campaign_id: "C002", user_id: "U0140", order_amount: "120", order_status: "submitted", order_time: "2026-05-01 09:32:00" }] },
            { name: "bronze_payments", description: "原始支付层", lineage: "payment_events -> bronze_payments", fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_status", "payment_time"], sampleRows: [{ payment_id: "P00011", order_id: "O00011", campaign_id: "C004", user_id: "U0065", payment_amount: "100", payment_status: "paid", payment_time: "2026-05-01 09:26:00" }, { payment_id: "P00022", order_id: "O00022", campaign_id: "C002", user_id: "U0140", payment_amount: "120", payment_status: "paid", payment_time: "2026-05-01 09:37:00" }] }
          ]
        },
        {
          name: "silver",
          label: "Silver",
          tables: [
            { name: "silver_touchpoints", description: "标准化触达层", lineage: "bronze_touchpoints -> silver_touchpoints", fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_time"], sampleRows: [{ touch_id: "T00001", campaign_id: "C005", user_id: "U0003", channel_id: "app_push", touch_time: "2026-05-01 09:01:00" }, { touch_id: "T00002", campaign_id: "C005", user_id: "U0077", channel_id: "app_push", touch_time: "2026-05-01 09:02:00" }] },
            { name: "silver_clicks", description: "标准化点击层", lineage: "bronze_clicks -> silver_clicks", fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"], sampleRows: [{ click_id: "CLK00003", touch_id: "T00003", campaign_id: "C001", user_id: "U0035", click_time: "2026-05-01 09:06:00" }, { click_id: "CLK00006", touch_id: "T00006", campaign_id: "C005", user_id: "U0040", click_time: "2026-05-01 09:09:00" }] },
            { name: "silver_claims", description: "标准化领取层", lineage: "bronze_claims -> silver_claims", fields: ["claim_id", "campaign_id", "user_id", "claim_time"], sampleRows: [{ claim_id: "CLM00008", campaign_id: "C005", user_id: "U0054", claim_time: "2026-05-01 09:13:00" }, { claim_id: "CLM00016", campaign_id: "C002", user_id: "U0164", claim_time: "2026-05-01 09:21:00" }] },
            { name: "silver_orders", description: "标准化订单层", lineage: "bronze_orders -> silver_orders", fields: ["order_id", "campaign_id", "user_id", "order_amount", "order_time"], sampleRows: [{ order_id: "O00011", campaign_id: "C004", user_id: "U0065", order_amount: "100", order_time: "2026-05-01 09:21:00" }, { order_id: "O00022", campaign_id: "C002", user_id: "U0140", order_amount: "120", order_time: "2026-05-01 09:32:00" }] },
            { name: "silver_payments", description: "标准化支付层", lineage: "bronze_payments -> silver_payments", fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_time"], sampleRows: [{ payment_id: "P00011", order_id: "O00011", campaign_id: "C004", user_id: "U0065", payment_amount: "100", payment_time: "2026-05-01 09:26:00" }, { payment_id: "P00022", order_id: "O00022", campaign_id: "C002", user_id: "U0140", payment_amount: "120", payment_time: "2026-05-01 09:37:00" }] }
          ]
        },
        {
          name: "gold",
          label: "Gold",
          tables: [
            {
              name: "gold_campaign_funnel",
              description: "活动漏斗汇总表",
              lineage: "silver_touchpoints + silver_clicks + silver_claims + silver_orders + silver_payments -> gold_campaign_funnel",
              fields: ["campaign_id", "exposure_uv", "click_cnt", "claim_cnt", "order_cnt", "paid_cnt", "paid_amount"],
              sampleRows: [
                { campaign_id: "C001", exposure_uv: "170", click_cnt: "141", claim_cnt: "55", order_cnt: "36", paid_cnt: "36", paid_amount: "4340.0" },
                { campaign_id: "C002", exposure_uv: "173", click_cnt: "116", claim_cnt: "44", order_cnt: "40", paid_cnt: "40", paid_amount: "4860.0" }
              ]
            },
            {
              name: "gold_channel_segment_metrics",
              description: "渠道分群指标表",
              lineage: "silver_touchpoints + silver_payments + user segment -> gold_channel_segment_metrics",
              fields: ["channel_id", "user_segment", "paid_cnt", "paid_amount"],
              sampleRows: [
                { channel_id: "app_push", user_segment: "active", paid_cnt: "43", paid_amount: "4980.0" },
                { channel_id: "app_push", user_segment: "new", paid_cnt: "52", paid_amount: "6420.0" }
              ]
            }
          ]
        }
      ]
    },
    hybrid: {
      label: "hybrid",
      description: "保留分层路径，同时在分析层使用星型模型。",
      layers: [
        {
          name: "bronze",
          label: "Bronze",
          tables: [
            { name: "hybrid_bronze_touchpoints", description: "Hybrid 原始触达层", lineage: "bronze_touchpoints -> hybrid_bronze_touchpoints", fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_status", "touch_time"], sampleRows: [{ touch_id: "T00001", campaign_id: "C005", user_id: "U0003", channel_id: "app_push", touch_status: "exposed", touch_time: "2026-05-01 09:01:00" }, { touch_id: "T00002", campaign_id: "C005", user_id: "U0077", channel_id: "app_push", touch_status: "exposed", touch_time: "2026-05-01 09:02:00" }] },
            { name: "hybrid_bronze_clicks", description: "Hybrid 原始点击层", lineage: "bronze_clicks -> hybrid_bronze_clicks", fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"], sampleRows: [{ click_id: "CLK00003", touch_id: "T00003", campaign_id: "C001", user_id: "U0035", click_time: "2026-05-01 09:06:00" }, { click_id: "CLK00006", touch_id: "T00006", campaign_id: "C005", user_id: "U0040", click_time: "2026-05-01 09:09:00" }] },
            { name: "hybrid_bronze_claims", description: "Hybrid 原始领取层", lineage: "bronze_claims -> hybrid_bronze_claims", fields: ["claim_id", "campaign_id", "user_id", "claim_time"], sampleRows: [{ claim_id: "CLM00008", campaign_id: "C005", user_id: "U0054", claim_time: "2026-05-01 09:13:00" }, { claim_id: "CLM00016", campaign_id: "C002", user_id: "U0164", claim_time: "2026-05-01 09:21:00" }] },
            { name: "hybrid_bronze_orders", description: "Hybrid 原始订单层", lineage: "bronze_orders -> hybrid_bronze_orders", fields: ["order_id", "campaign_id", "user_id", "order_amount", "order_status", "order_time"], sampleRows: [{ order_id: "O00011", campaign_id: "C004", user_id: "U0065", order_amount: "100", order_status: "submitted", order_time: "2026-05-01 09:21:00" }, { order_id: "O00022", campaign_id: "C002", user_id: "U0140", order_amount: "120", order_status: "submitted", order_time: "2026-05-01 09:32:00" }] },
            { name: "hybrid_bronze_payments", description: "Hybrid 原始支付层", lineage: "bronze_payments -> hybrid_bronze_payments", fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_status", "payment_time"], sampleRows: [{ payment_id: "P00011", order_id: "O00011", campaign_id: "C004", user_id: "U0065", payment_amount: "100", payment_status: "paid", payment_time: "2026-05-01 09:26:00" }, { payment_id: "P00022", order_id: "O00022", campaign_id: "C002", user_id: "U0140", payment_amount: "120", payment_status: "paid", payment_time: "2026-05-01 09:37:00" }] }
          ]
        },
        {
          name: "silver",
          label: "Silver",
          tables: [
            { name: "hybrid_silver_touchpoints", description: "Hybrid 标准化触达层", lineage: "hybrid_bronze_touchpoints -> hybrid_silver_touchpoints", fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_time"], sampleRows: [{ touch_id: "T00001", campaign_id: "C005", user_id: "U0003", channel_id: "app_push", touch_time: "2026-05-01 09:01:00" }, { touch_id: "T00002", campaign_id: "C005", user_id: "U0077", channel_id: "app_push", touch_time: "2026-05-01 09:02:00" }] },
            { name: "hybrid_silver_payments", description: "Hybrid 标准化支付层", lineage: "hybrid_bronze_payments -> hybrid_silver_payments", fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_time"], sampleRows: [{ payment_id: "P00011", order_id: "O00011", campaign_id: "C004", user_id: "U0065", payment_amount: "100", payment_time: "2026-05-01 09:26:00" }, { payment_id: "P00022", order_id: "O00022", campaign_id: "C002", user_id: "U0140", payment_amount: "120", payment_time: "2026-05-01 09:37:00" }] }
          ]
        },
        {
          name: "gold",
          label: "Gold",
          tables: [
            { name: "hybrid_dim_campaign", description: "Hybrid 活动维表", lineage: "campaigns -> hybrid_dim_campaign", fields: ["campaign_id", "campaign_name", "campaign_type", "channel_type", "start_date", "end_date", "budget_amount"], sampleRows: [{ campaign_id: "C001", campaign_name: "campaign_1", campaign_type: "bundle", channel_type: "app_push", start_date: "2026-05-01", end_date: "2026-05-31", budget_amount: "10500" }, { campaign_id: "C002", campaign_name: "campaign_2", campaign_type: "discount", channel_type: "wechat", start_date: "2026-05-01", end_date: "2026-05-31", budget_amount: "11000" }] },
            { name: "hybrid_dim_user", description: "Hybrid 用户维表", lineage: "users -> hybrid_dim_user", fields: ["user_id", "register_date", "city_tier", "user_segment"], sampleRows: [{ user_id: "U0001", register_date: "2026-04-01", city_tier: "tier_3", user_segment: "returning" }, { user_id: "U0002", register_date: "2026-04-01", city_tier: "tier_3", user_segment: "new" }] },
            { name: "hybrid_fact_payment", description: "Hybrid 支付事实表", lineage: "hybrid_silver_payments -> hybrid_fact_payment", fields: ["payment_id", "order_id", "campaign_id", "user_id", "payment_amount", "payment_time"], sampleRows: [{ payment_id: "P00011", order_id: "O00011", campaign_id: "C004", user_id: "U0065", payment_amount: "100", payment_time: "2026-05-01 09:26:00" }, { payment_id: "P00022", order_id: "O00022", campaign_id: "C002", user_id: "U0140", payment_amount: "120", payment_time: "2026-05-01 09:37:00" }] }
          ]
        }
      ]
    }
  }
};
```

- [ ] **Step 4: Run the metadata test to verify it passes**

Run: `python3 -m unittest tests.test_readability_catalog.ReadabilityCatalogTest.test_catalog_data_includes_models_fields_and_samples -q`
Expected: PASS

- [ ] **Step 5: Commit the metadata baseline**

```bash
git add docs/catalog-data.js tests/test_readability_catalog.py
git commit -m "docs: add catalog drilldown metadata"
```

## Task 2: Add shell-level coverage, then upgrade the catalog HTML to mount the interactive page

**Files:**
- Modify: `docs/catalog.html`
- Modify: `tests/test_readability_catalog.py`

- [ ] **Step 1: Add a failing test for the interactive shell**

Extend `tests/test_readability_catalog.py` with:

```python
    def test_catalog_html_mounts_drilldown_sections(self) -> None:
        catalog = read_text("docs/catalog.html")

        self.assertIn('id="dataset-browser"', catalog)
        self.assertIn('id="model-selector"', catalog)
        self.assertIn('id="model-detail"', catalog)
        self.assertIn('src="catalog-data.js"', catalog)
        self.assertIn('src="catalog.js"', catalog)
        self.assertIn("点击表名展开字段与前 2 行样例", catalog)
```

- [ ] **Step 2: Run the shell test to verify it fails**

Run: `python3 -m unittest tests.test_readability_catalog.ReadabilityCatalogTest.test_catalog_html_mounts_drilldown_sections -q`
Expected: FAIL because the current HTML does not yet mount the new containers or scripts.

- [ ] **Step 3: Replace the catalog HTML shell**

Replace `docs/catalog.html` with:

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
        --accent-soft: #f5dfd8;
      }

      body {
        margin: 0;
        font-family: Georgia, "Noto Serif SC", serif;
        color: var(--ink);
        background: linear-gradient(180deg, #f6efe4 0%, #fbf8f2 100%);
      }

      main {
        max-width: 1180px;
        margin: 0 auto;
        padding: 32px 20px 72px;
      }

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
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      .model-card,
      .table-card {
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 16px;
        background: #fffefb;
      }

      .model-card.is-active {
        background: var(--accent-soft);
      }

      .layer-block {
        margin-top: 18px;
        border-top: 1px solid var(--line);
        padding-top: 18px;
      }

      .table-detail {
        margin-top: 12px;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid var(--line);
        background: #fffdf8;
      }

      button {
        font: inherit;
        cursor: pointer;
      }

      .ghost-button {
        background: transparent;
        border: none;
        color: var(--accent);
        padding: 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th,
      td {
        border-bottom: 1px solid var(--line);
        text-align: left;
        padding: 8px;
        vertical-align: top;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p>DataBootcamp / Readability Catalog</p>
        <h1>用一页看清项目进展、数据集、模型层级与表结构</h1>
        <p>点击模型卡片查看层级结构，点击表名展开字段与前 2 行样例。</p>
      </section>

      <section id="progress" class="panel">
        <h2>项目进展</h2>
        <ul>
          <li>当前阶段：第一阶段实验验证</li>
          <li>已具备：样例数据、三套 SQL、结果文档、结构说明</li>
          <li>当前增强点：模型下钻、表字段说明、前 2 行样例预览</li>
        </ul>
      </section>

      <section id="dataset" class="panel">
        <h2>Dataset 总览</h2>
        <p>点击源表查看字段结构和前 2 行样例。</p>
        <div id="dataset-browser" class="grid"></div>
      </section>

      <section id="models" class="panel">
        <h2>模型对比</h2>
        <p>点击模型卡片切换当前查看的模型详情。</p>
        <div id="model-selector" class="grid"></div>
      </section>

      <section id="layers" class="panel">
        <h2>模型详情</h2>
        <div id="model-detail"></div>
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
    <script src="catalog-data.js"></script>
    <script src="catalog.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Run the shell test to verify it passes**

Run: `python3 -m unittest tests.test_readability_catalog.ReadabilityCatalogTest.test_catalog_html_mounts_drilldown_sections -q`
Expected: PASS

- [ ] **Step 5: Commit the interactive shell**

```bash
git add docs/catalog.html tests/test_readability_catalog.py
git commit -m "docs: add interactive catalog shell"
```

## Task 3: Add renderer coverage, then implement the lightweight JavaScript drilldown

**Files:**
- Create: `docs/catalog.js`
- Modify: `tests/test_readability_catalog.py`

- [ ] **Step 1: Add a failing test for the page renderer**

Extend `tests/test_readability_catalog.py` with:

```python
    def test_catalog_renderer_supports_dataset_and_model_drilldown(self) -> None:
        catalog_js = read_text("docs/catalog.js")

        self.assertIn("renderSourceTables()", catalog_js)
        self.assertIn("renderModelCards()", catalog_js)
        self.assertIn("renderModelDetail()", catalog_js)
        self.assertIn("toggleTableDetail", catalog_js)
        self.assertIn("activeModelKey", catalog_js)
```

- [ ] **Step 2: Run the renderer test to verify it fails**

Run: `python3 -m unittest tests.test_readability_catalog.ReadabilityCatalogTest.test_catalog_renderer_supports_dataset_and_model_drilldown -q`
Expected: FAIL because `docs/catalog.js` does not exist yet.

- [ ] **Step 3: Create the renderer script**

Create `docs/catalog.js` with:

```js
const state = {
  activeModelKey: "dimensional",
  openSourceTables: new Set(),
  openModelTables: new Set()
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildFieldsHtml(fields) {
  return `
    <div>
      <strong>字段结构</strong>
      <ul>${fields.map((field) => `<li><code>${escapeHtml(field)}</code></li>`).join("")}</ul>
    </div>
  `;
}

function buildSampleTable(rows) {
  if (!rows.length) {
    return "<p>当前没有可展示的样例行。</p>";
  }

  const columns = Object.keys(rows[0]);
  return `
    <div>
      <strong>前 2 行样例</strong>
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>${columns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildTableDetail(table) {
  return `
    <div class="table-detail">
      <p><strong>业务含义：</strong>${escapeHtml(table.description)}</p>
      <p><strong>血缘：</strong><code>${escapeHtml(table.lineage)}</code></p>
      ${buildFieldsHtml(table.fields)}
      ${buildSampleTable(table.sampleRows)}
    </div>
  `;
}

function toggleSourceTable(tableName) {
  if (state.openSourceTables.has(tableName)) {
    state.openSourceTables.delete(tableName);
  } else {
    state.openSourceTables.add(tableName);
  }
  renderSourceTables();
}

function toggleTableDetail(tableName) {
  if (state.openModelTables.has(tableName)) {
    state.openModelTables.delete(tableName);
  } else {
    state.openModelTables.add(tableName);
  }
  renderModelDetail();
}

function setActiveModel(modelKey) {
  state.activeModelKey = modelKey;
  state.openModelTables = new Set();
  renderModelCards();
  renderModelDetail();
}

function renderSourceTables() {
  const root = document.getElementById("dataset-browser");
  root.innerHTML = window.catalogData.sourceTables
    .map((table) => {
      const isOpen = state.openSourceTables.has(table.name);
      return `
        <article class="table-card">
          <h3>${escapeHtml(table.name)}</h3>
          <p>${escapeHtml(table.description)}</p>
          <button class="ghost-button" type="button" data-source-table="${escapeHtml(table.name)}">
            ${isOpen ? "收起详情" : "查看字段与样例"}
          </button>
          ${isOpen ? buildTableDetail(table) : ""}
        </article>
      `;
    })
    .join("");

  root.querySelectorAll("[data-source-table]").forEach((button) => {
    button.addEventListener("click", () => toggleSourceTable(button.dataset.sourceTable));
  });
}

function renderModelCards() {
  const root = document.getElementById("model-selector");
  root.innerHTML = Object.entries(window.catalogData.models)
    .map(([key, model]) => {
      const isActive = key === state.activeModelKey;
      return `
        <button class="model-card ${isActive ? "is-active" : ""}" type="button" data-model-key="${escapeHtml(key)}">
          <h3>${escapeHtml(model.label)}</h3>
          <p>${escapeHtml(model.description)}</p>
          <p>层数：${model.layers.length}</p>
        </button>
      `;
    })
    .join("");

  root.querySelectorAll("[data-model-key]").forEach((button) => {
    button.addEventListener("click", () => setActiveModel(button.dataset.modelKey));
  });
}

function renderModelDetail() {
  const root = document.getElementById("model-detail");
  const model = window.catalogData.models[state.activeModelKey];

  root.innerHTML = `
    <header>
      <h3>${escapeHtml(model.label)}</h3>
      <p>${escapeHtml(model.description)}</p>
    </header>
    ${model.layers
      .map(
        (layer) => `
          <section class="layer-block">
            <h4>${escapeHtml(layer.label)}</h4>
            <div class="grid">
              ${layer.tables
                .map((table) => {
                  const isOpen = state.openModelTables.has(table.name);
                  return `
                    <article class="table-card">
                      <h5>${escapeHtml(table.name)}</h5>
                      <p>${escapeHtml(table.description)}</p>
                      <button class="ghost-button" type="button" data-model-table="${escapeHtml(table.name)}">
                        ${isOpen ? "收起详情" : "查看字段与样例"}
                      </button>
                      ${isOpen ? buildTableDetail(table) : ""}
                    </article>
                  `;
                })
                .join("")}
            </div>
          </section>
        `
      )
      .join("")}
  `;

  root.querySelectorAll("[data-model-table]").forEach((button) => {
    button.addEventListener("click", () => toggleTableDetail(button.dataset.modelTable));
  });
}

renderSourceTables();
renderModelCards();
renderModelDetail();
```

- [ ] **Step 4: Run the renderer test to verify it passes**

Run: `python3 -m unittest tests.test_readability_catalog.ReadabilityCatalogTest.test_catalog_renderer_supports_dataset_and_model_drilldown -q`
Expected: PASS

- [ ] **Step 5: Commit the drilldown renderer**

```bash
git add docs/catalog.js tests/test_readability_catalog.py
git commit -m "docs: add catalog drilldown renderer"
```

## Task 4: Run full verification and finish with the revised catalog behavior

**Files:**
- Verify: `tests/test_readability_catalog.py`
- Verify: `tests/test_generate_marketing_data.py`

- [ ] **Step 1: Run the catalog coverage**

Run: `python3 -m unittest tests.test_readability_catalog -q`
Expected: PASS

- [ ] **Step 2: Run the existing data-generation tests**

Run: `python3 -m unittest tests.test_generate_marketing_data -q`
Expected: PASS

- [ ] **Step 3: Run the full test suite**

Run: `python3 -m unittest discover -s tests -q`
Expected: PASS

- [ ] **Step 4: Commit the final verified state**

```bash
git add docs/catalog-data.js docs/catalog.js docs/catalog.html tests/test_readability_catalog.py
git commit -m "docs: add catalog model drilldown and sample previews"
```
