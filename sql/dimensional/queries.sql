USE marketing_lab;

SELECT
  c.campaign_id,
  c.campaign_name,
  COUNT(DISTINCT t.touch_id) AS exposure_uv,
  COUNT(DISTINCT clk.click_id) AS click_cnt,
  COUNT(DISTINCT clm.claim_id) AS claim_cnt,
  COUNT(DISTINCT o.order_id) AS order_cnt,
  COUNT(DISTINCT p.payment_id) AS paid_cnt,
  COALESCE(SUM(p.payment_amount), 0) AS paid_amount
FROM dim_campaign c
LEFT JOIN fact_touchpoint t ON c.campaign_id = t.campaign_id AND t.touch_status = 'exposed'
LEFT JOIN fact_click clk ON c.campaign_id = clk.campaign_id
LEFT JOIN fact_coupon_claim clm ON c.campaign_id = clm.campaign_id
LEFT JOIN fact_order o ON c.campaign_id = o.campaign_id AND o.order_status IN ('created', 'submitted')
LEFT JOIN fact_payment p ON c.campaign_id = p.campaign_id AND p.payment_status = 'paid'
GROUP BY c.campaign_id, c.campaign_name
ORDER BY c.campaign_id;

SELECT
  c.channel_type,
  u.user_segment,
  COUNT(DISTINCT p.payment_id) AS paid_users,
  COALESCE(SUM(p.payment_amount), 0) AS paid_amount
FROM fact_payment p
JOIN dim_campaign c ON p.campaign_id = c.campaign_id
JOIN dim_user u ON p.user_id = u.user_id
WHERE p.payment_status = 'paid'
GROUP BY c.channel_type, u.user_segment
ORDER BY c.channel_type, u.user_segment;
