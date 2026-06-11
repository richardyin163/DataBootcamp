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
