# 营销活动分析一期规格

## 范围

- 阶段：第一阶段
- 场景：营销活动分析
- 目标：比较三套数仓组织方式在同一分析问题下的表达差异

## 核心分析问题

1. 每个活动的曝光、点击、领取、下单、支付漏斗表现
2. 不同渠道带来的转化差异
3. 不同用户分群在活动中的支付转化差异
4. 活动 ROI 的近似表达（以支付金额 / 活动成本表示）

## 统一业务口径

- 曝光：`channel_touchpoints` 中 `touch_status = 'exposed'`
- 点击：`click_events` 中每条记录记为一次点击
- 领取：`coupon_claim_events` 中每条记录记为一次领取
- 下单：`order_events` 中 `order_status in ('created', 'submitted')`
- 支付：`payment_events` 中 `payment_status = 'paid'`
- 支付金额：`payment_events.payment_amount`

## 输出清单

- 表结构定义
- 样例数据生成脚本与样例文件
- 三套方案 DDL / DML / 查询 SQL
- 查询结果样例
- 方案差异对比
