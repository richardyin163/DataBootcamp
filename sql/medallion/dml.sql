USE marketing_lab;

INSERT INTO bronze_touchpoints SELECT * FROM ods_channel_touchpoints;
INSERT INTO bronze_clicks SELECT * FROM ods_click_events;
INSERT INTO bronze_claims SELECT * FROM ods_coupon_claim_events;
INSERT INTO bronze_orders SELECT * FROM ods_order_events;
INSERT INTO bronze_payments SELECT * FROM ods_payment_events;

INSERT INTO silver_touchpoints
SELECT touch_id, campaign_id, user_id, channel_id, touch_time
FROM bronze_touchpoints
WHERE touch_status = 'exposed';

INSERT INTO silver_clicks
SELECT click_id, touch_id, campaign_id, user_id, click_time
FROM bronze_clicks;

INSERT INTO silver_claims
SELECT claim_id, campaign_id, user_id, claim_time
FROM bronze_claims;

INSERT INTO silver_orders
SELECT order_id, campaign_id, user_id, order_amount, order_time
FROM bronze_orders
WHERE order_status IN ('created', 'submitted');

INSERT INTO silver_payments
SELECT payment_id, order_id, campaign_id, user_id, payment_amount, payment_time
FROM bronze_payments
WHERE payment_status = 'paid';

INSERT INTO gold_campaign_funnel
SELECT
  t.campaign_id,
  COUNT(DISTINCT t.touch_id) AS exposure_uv,
  COUNT(DISTINCT c.click_id) AS click_cnt,
  COUNT(DISTINCT cl.claim_id) AS claim_cnt,
  COUNT(DISTINCT o.order_id) AS order_cnt,
  COUNT(DISTINCT p.payment_id) AS paid_cnt,
  COALESCE(SUM(p.payment_amount), 0) AS paid_amount
FROM silver_touchpoints t
LEFT JOIN silver_clicks c ON t.campaign_id = c.campaign_id
LEFT JOIN silver_claims cl ON t.campaign_id = cl.campaign_id
LEFT JOIN silver_orders o ON t.campaign_id = o.campaign_id
LEFT JOIN silver_payments p ON t.campaign_id = p.campaign_id
GROUP BY t.campaign_id;

INSERT INTO gold_channel_segment_metrics
SELECT
  t.channel_id,
  u.user_segment,
  COUNT(DISTINCT p.payment_id) AS paid_cnt,
  COALESCE(SUM(p.payment_amount), 0) AS paid_amount
FROM silver_touchpoints t
JOIN ods_users u ON t.user_id = u.user_id
LEFT JOIN silver_payments p ON t.campaign_id = p.campaign_id AND t.user_id = p.user_id
GROUP BY t.channel_id, u.user_segment;
