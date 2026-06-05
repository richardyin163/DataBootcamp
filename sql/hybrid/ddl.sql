USE marketing_lab;

CREATE TABLE IF NOT EXISTS hybrid_bronze_touchpoints AS SELECT * FROM bronze_touchpoints;
CREATE TABLE IF NOT EXISTS hybrid_bronze_clicks AS SELECT * FROM bronze_clicks;
CREATE TABLE IF NOT EXISTS hybrid_bronze_claims AS SELECT * FROM bronze_claims;
CREATE TABLE IF NOT EXISTS hybrid_bronze_orders AS SELECT * FROM bronze_orders;
CREATE TABLE IF NOT EXISTS hybrid_bronze_payments AS SELECT * FROM bronze_payments;

CREATE TABLE IF NOT EXISTS hybrid_silver_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS hybrid_silver_payments (
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

CREATE TABLE IF NOT EXISTS hybrid_dim_campaign (
  campaign_id VARCHAR(32),
  campaign_name VARCHAR(128),
  campaign_type VARCHAR(64),
  channel_type VARCHAR(64),
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(18,2)
)
UNIQUE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS hybrid_dim_user (
  user_id VARCHAR(32),
  register_date DATE,
  city_tier VARCHAR(32),
  user_segment VARCHAR(32)
)
UNIQUE KEY(user_id)
DISTRIBUTED BY HASH(user_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS hybrid_fact_payment (
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
