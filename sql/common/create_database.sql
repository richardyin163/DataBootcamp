CREATE DATABASE IF NOT EXISTS marketing_lab;
USE marketing_lab;

CREATE TABLE IF NOT EXISTS ods_campaigns (
  campaign_id VARCHAR(32),
  campaign_name VARCHAR(128),
  campaign_type VARCHAR(64),
  channel_type VARCHAR(64),
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(18,2)
)
DUPLICATE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS ods_users (
  user_id VARCHAR(32),
  register_date DATE,
  city_tier VARCHAR(32),
  user_segment VARCHAR(32)
)
DUPLICATE KEY(user_id)
DISTRIBUTED BY HASH(user_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS ods_channel_touchpoints (
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

CREATE TABLE IF NOT EXISTS ods_click_events (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS ods_coupon_claim_events (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS ods_order_events (
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

CREATE TABLE IF NOT EXISTS ods_payment_events (
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
