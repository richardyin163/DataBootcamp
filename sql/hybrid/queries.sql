USE marketing_lab;

SELECT
  c.campaign_id,
  c.campaign_name,
  COUNT(DISTINCT t.touch_id) AS exposure_uv,
  COUNT(DISTINCT p.payment_id) AS paid_cnt,
  COALESCE(SUM(p.payment_amount), 0) AS paid_amount,
  CASE
    WHEN c.budget_amount = 0 THEN 0
    ELSE ROUND(COALESCE(SUM(p.payment_amount), 0) / c.budget_amount, 4)
  END AS roi
FROM hybrid_dim_campaign c
LEFT JOIN hybrid_silver_touchpoints t ON c.campaign_id = t.campaign_id
LEFT JOIN hybrid_fact_payment p ON c.campaign_id = p.campaign_id
GROUP BY c.campaign_id, c.campaign_name, c.budget_amount
ORDER BY c.campaign_id;

SELECT
  c.channel_type,
  u.user_segment,
  COUNT(DISTINCT p.payment_id) AS paid_cnt,
  COALESCE(SUM(p.payment_amount), 0) AS paid_amount
FROM hybrid_fact_payment p
JOIN hybrid_dim_campaign c ON p.campaign_id = c.campaign_id
JOIN hybrid_dim_user u ON p.user_id = u.user_id
GROUP BY c.channel_type, u.user_segment
ORDER BY c.channel_type, u.user_segment;
