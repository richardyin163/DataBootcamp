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
- `silver_touchpoints + silver_payments + 用户分群语义 -> gold_channel_segment_metrics`

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
