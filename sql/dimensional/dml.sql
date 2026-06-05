USE marketing_lab;

INSERT INTO dim_campaign
SELECT campaign_id, campaign_name, campaign_type, channel_type, start_date, end_date, budget_amount
FROM ods_campaigns;

INSERT INTO dim_user
SELECT user_id, register_date, city_tier, user_segment
FROM ods_users;

INSERT INTO fact_touchpoint
SELECT touch_id, campaign_id, user_id, channel_id, touch_status, touch_time
FROM ods_channel_touchpoints;

INSERT INTO fact_click
SELECT click_id, touch_id, campaign_id, user_id, click_time
FROM ods_click_events;

INSERT INTO fact_coupon_claim
SELECT claim_id, campaign_id, user_id, claim_time
FROM ods_coupon_claim_events;

INSERT INTO fact_order
SELECT order_id, campaign_id, user_id, order_amount, order_status, order_time
FROM ods_order_events;

INSERT INTO fact_payment
SELECT payment_id, order_id, campaign_id, user_id, payment_amount, payment_status, payment_time
FROM ods_payment_events;
