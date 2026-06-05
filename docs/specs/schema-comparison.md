# 三套方案结构对比

## dimensional

- 维表：dim_campaign、dim_user、dim_channel
- 事实表：fact_touchpoint、fact_click、fact_coupon_claim、fact_order、fact_payment

## medallion

- Bronze：原始事件表
- Silver：清洗标准化事件表
- Gold：面向分析的宽表或主题汇总表

## hybrid

- Bronze：原始事件表
- Silver：标准化明细层
- Gold：dim_* 与 fact_* 星型模型

## 统一比较维度

- 业务口径表达位置
- 加工链路清晰度
- 查询复杂度
- 复用性
