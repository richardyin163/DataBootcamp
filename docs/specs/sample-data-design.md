# 样例数据设计

## 实体

- campaigns
- users
- channel_touchpoints
- click_events
- coupon_claim_events
- order_events
- payment_events

## 建议数据量

- campaigns: 5
- users: 200
- channel_touchpoints: 2000
- click_events: 600
- coupon_claim_events: 250
- order_events: 180
- payment_events: 150

## 关键字段

### campaigns

- campaign_id
- campaign_name
- campaign_type
- channel_type
- start_date
- end_date
- budget_amount

### users

- user_id
- register_date
- city_tier
- user_segment

### channel_touchpoints

- touch_id
- campaign_id
- user_id
- channel_id
- touch_status
- touch_time

### payment_events

- payment_id
- order_id
- campaign_id
- user_id
- payment_amount
- payment_status
- payment_time
