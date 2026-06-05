USE marketing_lab;

CREATE TABLE IF NOT EXISTS bronze_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_status VARCHAR(32),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS gold_campaign_funnel (
  campaign_id VARCHAR(32),
  exposure_uv BIGINT,
  click_cnt BIGINT,
  claim_cnt BIGINT,
  order_cnt BIGINT,
  paid_cnt BIGINT,
  paid_amount DECIMAL(18,2)
)
DUPLICATE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_clicks (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_claims (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_orders (
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  order_amount DECIMAL(18,2),
  order_status VARCHAR(32),
  order_time DATETIME
)
DUPLICATE KEY(order_id)
DISTRIBUTED BY HASH(order_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_payments (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_status VARCHAR(32),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_clicks (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_claims (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_orders (
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  order_amount DECIMAL(18,2),
  order_time DATETIME
)
DUPLICATE KEY(order_id)
DISTRIBUTED BY HASH(order_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_payments (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS gold_channel_segment_metrics (
  channel_id VARCHAR(64),
  user_segment VARCHAR(32),
  paid_cnt BIGINT,
  paid_amount DECIMAL(18,2)
)
DUPLICATE KEY(channel_id, user_segment)
DISTRIBUTED BY HASH(channel_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
