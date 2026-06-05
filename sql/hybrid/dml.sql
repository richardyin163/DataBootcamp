USE marketing_lab;

INSERT INTO hybrid_silver_touchpoints
SELECT touch_id, campaign_id, user_id, channel_id, touch_time
FROM ods_channel_touchpoints
WHERE touch_status = 'exposed';

INSERT INTO hybrid_silver_payments
SELECT payment_id, order_id, campaign_id, user_id, payment_amount, payment_time
FROM ods_payment_events
WHERE payment_status = 'paid';

INSERT INTO hybrid_dim_campaign
SELECT campaign_id, campaign_name, campaign_type, channel_type, start_date, end_date, budget_amount
FROM ods_campaigns;

INSERT INTO hybrid_dim_user
SELECT user_id, register_date, city_tier, user_segment
FROM ods_users;

INSERT INTO hybrid_fact_payment
SELECT payment_id, order_id, campaign_id, user_id, payment_amount, payment_time
FROM hybrid_silver_payments;
