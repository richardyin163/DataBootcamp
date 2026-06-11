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
