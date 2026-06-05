USE marketing_lab;

-- 按需替换为本地 Stream Load 或 Broker Load 命令。
-- 本阶段至少保留每个样例表对应的目标表名，确保导入目标清晰。

-- campaigns.csv -> ods_campaigns
-- users.csv -> ods_users
-- channel_touchpoints.csv -> ods_channel_touchpoints
-- click_events.csv -> ods_click_events
-- coupon_claim_events.csv -> ods_coupon_claim_events
-- order_events.csv -> ods_order_events
-- payment_events.csv -> ods_payment_events

-- 示例：
-- curl --location-trusted -u root: \
--   -H "column_separator:," \
--   -H "skip_header:1" \
--   -T data/sample/campaigns.csv \
--   http://localhost:8030/api/marketing_lab/ods_campaigns/_stream_load

-- curl --location-trusted -u root: \
--   -H "column_separator:," \
--   -H "skip_header:1" \
--   -T data/sample/users.csv \
--   http://localhost:8030/api/marketing_lab/ods_users/_stream_load

-- 其余样例文件按同样方式导入：
-- data/sample/channel_touchpoints.csv -> ods_channel_touchpoints
-- data/sample/click_events.csv -> ods_click_events
-- data/sample/coupon_claim_events.csv -> ods_coupon_claim_events
-- data/sample/order_events.csv -> ods_order_events
-- data/sample/payment_events.csv -> ods_payment_events
