window.catalogData = {
  sourceTables: [
    {
      name: "campaigns",
      description: "营销活动主数据",
      lineage: "campaigns -> dim_campaign / hybrid_dim_campaign",
      fields: [
        "campaign_id",
        "campaign_name",
        "campaign_type",
        "channel_type",
        "start_date",
        "end_date",
        "budget_amount"
      ],
      sampleRows: [
        {
          campaign_id: "C001",
          campaign_name: "campaign_1",
          campaign_type: "bundle",
          channel_type: "app_push",
          start_date: "2026-05-01",
          end_date: "2026-05-31",
          budget_amount: "10500"
        },
        {
          campaign_id: "C002",
          campaign_name: "campaign_2",
          campaign_type: "discount",
          channel_type: "wechat",
          start_date: "2026-05-01",
          end_date: "2026-05-31",
          budget_amount: "11000"
        }
      ]
    },
    {
      name: "users",
      description: "用户主数据",
      lineage: "users -> dim_user / hybrid_dim_user",
      fields: ["user_id", "register_date", "city_tier", "user_segment"],
      sampleRows: [
        {
          user_id: "U0001",
          register_date: "2026-04-01",
          city_tier: "tier_3",
          user_segment: "returning"
        },
        {
          user_id: "U0002",
          register_date: "2026-04-01",
          city_tier: "tier_3",
          user_segment: "new"
        }
      ]
    },
    {
      name: "channel_touchpoints",
      description: "活动触达与曝光记录",
      lineage: "channel_touchpoints -> fact_touchpoint / bronze_touchpoints",
      fields: [
        "touch_id",
        "campaign_id",
        "user_id",
        "channel_id",
        "touch_status",
        "touch_time"
      ],
      sampleRows: [
        {
          touch_id: "T00001",
          campaign_id: "C005",
          user_id: "U0003",
          channel_id: "app_push",
          touch_status: "exposed",
          touch_time: "2026-05-01 09:01:00"
        },
        {
          touch_id: "T00002",
          campaign_id: "C005",
          user_id: "U0077",
          channel_id: "app_push",
          touch_status: "exposed",
          touch_time: "2026-05-01 09:02:00"
        }
      ]
    },
    {
      name: "click_events",
      description: "点击行为记录",
      lineage: "click_events -> fact_click / bronze_clicks",
      fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
      sampleRows: [
        {
          click_id: "CLK00003",
          touch_id: "T00003",
          campaign_id: "C001",
          user_id: "U0035",
          click_time: "2026-05-01 09:06:00"
        },
        {
          click_id: "CLK00006",
          touch_id: "T00006",
          campaign_id: "C005",
          user_id: "U0040",
          click_time: "2026-05-01 09:09:00"
        }
      ]
    },
    {
      name: "coupon_claim_events",
      description: "优惠领取记录",
      lineage: "coupon_claim_events -> fact_coupon_claim / bronze_claims",
      fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
      sampleRows: [
        {
          claim_id: "CLM00008",
          campaign_id: "C005",
          user_id: "U0054",
          claim_time: "2026-05-01 09:13:00"
        },
        {
          claim_id: "CLM00016",
          campaign_id: "C002",
          user_id: "U0164",
          claim_time: "2026-05-01 09:21:00"
        }
      ]
    },
    {
      name: "order_events",
      description: "下单行为记录",
      lineage: "order_events -> fact_order / bronze_orders",
      fields: [
        "order_id",
        "campaign_id",
        "user_id",
        "order_amount",
        "order_status",
        "order_time"
      ],
      sampleRows: [
        {
          order_id: "O00011",
          campaign_id: "C004",
          user_id: "U0065",
          order_amount: "100",
          order_status: "submitted",
          order_time: "2026-05-01 09:21:00"
        },
        {
          order_id: "O00022",
          campaign_id: "C002",
          user_id: "U0140",
          order_amount: "120",
          order_status: "submitted",
          order_time: "2026-05-01 09:32:00"
        }
      ]
    },
    {
      name: "payment_events",
      description: "支付行为记录",
      lineage: "payment_events -> fact_payment / bronze_payments / hybrid_fact_payment",
      fields: [
        "payment_id",
        "order_id",
        "campaign_id",
        "user_id",
        "payment_amount",
        "payment_status",
        "payment_time"
      ],
      sampleRows: [
        {
          payment_id: "P00011",
          order_id: "O00011",
          campaign_id: "C004",
          user_id: "U0065",
          payment_amount: "100",
          payment_status: "paid",
          payment_time: "2026-05-01 09:26:00"
        },
        {
          payment_id: "P00022",
          order_id: "O00022",
          campaign_id: "C002",
          user_id: "U0140",
          payment_amount: "120",
          payment_status: "paid",
          payment_time: "2026-05-01 09:37:00"
        }
      ]
    }
  ],
  models: {
    dimensional: {
      label: "dimensional",
      description: "直接以维表和事实表组织分析主题。",
      layers: [
        {
          name: "dimensions",
          label: "维表",
          tables: [
            {
              name: "dim_campaign",
              description: "活动维表",
              lineage: "campaigns -> dim_campaign",
              fields: [
                "campaign_id",
                "campaign_name",
                "campaign_type",
                "channel_type",
                "start_date",
                "end_date",
                "budget_amount"
              ],
              sampleRows: [
                {
                  campaign_id: "C001",
                  campaign_name: "campaign_1",
                  campaign_type: "bundle",
                  channel_type: "app_push",
                  start_date: "2026-05-01",
                  end_date: "2026-05-31",
                  budget_amount: "10500"
                },
                {
                  campaign_id: "C002",
                  campaign_name: "campaign_2",
                  campaign_type: "discount",
                  channel_type: "wechat",
                  start_date: "2026-05-01",
                  end_date: "2026-05-31",
                  budget_amount: "11000"
                }
              ]
            },
            {
              name: "dim_user",
              description: "用户维表",
              lineage: "users -> dim_user",
              fields: ["user_id", "register_date", "city_tier", "user_segment"],
              sampleRows: [
                {
                  user_id: "U0001",
                  register_date: "2026-04-01",
                  city_tier: "tier_3",
                  user_segment: "returning"
                },
                {
                  user_id: "U0002",
                  register_date: "2026-04-01",
                  city_tier: "tier_3",
                  user_segment: "new"
                }
              ]
            }
          ]
        },
        {
          name: "facts",
          label: "事实表",
          tables: [
            {
              name: "fact_touchpoint",
              description: "触达事实表",
              lineage: "channel_touchpoints -> fact_touchpoint",
              fields: [
                "touch_id",
                "campaign_id",
                "user_id",
                "channel_id",
                "touch_status",
                "touch_time"
              ],
              sampleRows: [
                {
                  touch_id: "T00001",
                  campaign_id: "C005",
                  user_id: "U0003",
                  channel_id: "app_push",
                  touch_status: "exposed",
                  touch_time: "2026-05-01 09:01:00"
                },
                {
                  touch_id: "T00002",
                  campaign_id: "C005",
                  user_id: "U0077",
                  channel_id: "app_push",
                  touch_status: "exposed",
                  touch_time: "2026-05-01 09:02:00"
                }
              ]
            },
            {
              name: "fact_click",
              description: "点击事实表",
              lineage: "click_events -> fact_click",
              fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
              sampleRows: [
                {
                  click_id: "CLK00003",
                  touch_id: "T00003",
                  campaign_id: "C001",
                  user_id: "U0035",
                  click_time: "2026-05-01 09:06:00"
                },
                {
                  click_id: "CLK00006",
                  touch_id: "T00006",
                  campaign_id: "C005",
                  user_id: "U0040",
                  click_time: "2026-05-01 09:09:00"
                }
              ]
            },
            {
              name: "fact_coupon_claim",
              description: "领取事实表",
              lineage: "coupon_claim_events -> fact_coupon_claim",
              fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
              sampleRows: [
                {
                  claim_id: "CLM00008",
                  campaign_id: "C005",
                  user_id: "U0054",
                  claim_time: "2026-05-01 09:13:00"
                },
                {
                  claim_id: "CLM00016",
                  campaign_id: "C002",
                  user_id: "U0164",
                  claim_time: "2026-05-01 09:21:00"
                }
              ]
            },
            {
              name: "fact_order",
              description: "订单事实表",
              lineage: "order_events -> fact_order",
              fields: [
                "order_id",
                "campaign_id",
                "user_id",
                "order_amount",
                "order_status",
                "order_time"
              ],
              sampleRows: [
                {
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  order_amount: "100",
                  order_status: "submitted",
                  order_time: "2026-05-01 09:21:00"
                },
                {
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  order_amount: "120",
                  order_status: "submitted",
                  order_time: "2026-05-01 09:32:00"
                }
              ]
            },
            {
              name: "fact_payment",
              description: "支付事实表",
              lineage: "payment_events -> fact_payment",
              fields: [
                "payment_id",
                "order_id",
                "campaign_id",
                "user_id",
                "payment_amount",
                "payment_status",
                "payment_time"
              ],
              sampleRows: [
                {
                  payment_id: "P00011",
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  payment_amount: "100",
                  payment_status: "paid",
                  payment_time: "2026-05-01 09:26:00"
                },
                {
                  payment_id: "P00022",
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  payment_amount: "120",
                  payment_status: "paid",
                  payment_time: "2026-05-01 09:37:00"
                }
              ]
            }
          ]
        }
      ]
    },
    medallion: {
      label: "medallion",
      description: "按 Bronze / Silver / Gold 展示加工链路。",
      layers: [
        {
          name: "bronze",
          label: "Bronze",
          tables: [
            {
              name: "bronze_touchpoints",
              description: "原始触达层",
              lineage: "channel_touchpoints -> bronze_touchpoints",
              fields: [
                "touch_id",
                "campaign_id",
                "user_id",
                "channel_id",
                "touch_status",
                "touch_time"
              ],
              sampleRows: [
                {
                  touch_id: "T00001",
                  campaign_id: "C005",
                  user_id: "U0003",
                  channel_id: "app_push",
                  touch_status: "exposed",
                  touch_time: "2026-05-01 09:01:00"
                },
                {
                  touch_id: "T00002",
                  campaign_id: "C005",
                  user_id: "U0077",
                  channel_id: "app_push",
                  touch_status: "exposed",
                  touch_time: "2026-05-01 09:02:00"
                }
              ]
            },
            {
              name: "bronze_clicks",
              description: "原始点击层",
              lineage: "click_events -> bronze_clicks",
              fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
              sampleRows: [
                {
                  click_id: "CLK00003",
                  touch_id: "T00003",
                  campaign_id: "C001",
                  user_id: "U0035",
                  click_time: "2026-05-01 09:06:00"
                },
                {
                  click_id: "CLK00006",
                  touch_id: "T00006",
                  campaign_id: "C005",
                  user_id: "U0040",
                  click_time: "2026-05-01 09:09:00"
                }
              ]
            },
            {
              name: "bronze_claims",
              description: "原始领取层",
              lineage: "coupon_claim_events -> bronze_claims",
              fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
              sampleRows: [
                {
                  claim_id: "CLM00008",
                  campaign_id: "C005",
                  user_id: "U0054",
                  claim_time: "2026-05-01 09:13:00"
                },
                {
                  claim_id: "CLM00016",
                  campaign_id: "C002",
                  user_id: "U0164",
                  claim_time: "2026-05-01 09:21:00"
                }
              ]
            },
            {
              name: "bronze_orders",
              description: "原始订单层",
              lineage: "order_events -> bronze_orders",
              fields: [
                "order_id",
                "campaign_id",
                "user_id",
                "order_amount",
                "order_status",
                "order_time"
              ],
              sampleRows: [
                {
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  order_amount: "100",
                  order_status: "submitted",
                  order_time: "2026-05-01 09:21:00"
                },
                {
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  order_amount: "120",
                  order_status: "submitted",
                  order_time: "2026-05-01 09:32:00"
                }
              ]
            },
            {
              name: "bronze_payments",
              description: "原始支付层",
              lineage: "payment_events -> bronze_payments",
              fields: [
                "payment_id",
                "order_id",
                "campaign_id",
                "user_id",
                "payment_amount",
                "payment_status",
                "payment_time"
              ],
              sampleRows: [
                {
                  payment_id: "P00011",
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  payment_amount: "100",
                  payment_status: "paid",
                  payment_time: "2026-05-01 09:26:00"
                },
                {
                  payment_id: "P00022",
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  payment_amount: "120",
                  payment_status: "paid",
                  payment_time: "2026-05-01 09:37:00"
                }
              ]
            }
          ]
        },
        {
          name: "silver",
          label: "Silver",
          tables: [
            {
              name: "silver_touchpoints",
              description: "标准化触达层",
              lineage: "bronze_touchpoints -> silver_touchpoints",
              fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_time"],
              sampleRows: [
                {
                  touch_id: "T00001",
                  campaign_id: "C005",
                  user_id: "U0003",
                  channel_id: "app_push",
                  touch_time: "2026-05-01 09:01:00"
                },
                {
                  touch_id: "T00002",
                  campaign_id: "C005",
                  user_id: "U0077",
                  channel_id: "app_push",
                  touch_time: "2026-05-01 09:02:00"
                }
              ]
            },
            {
              name: "silver_clicks",
              description: "标准化点击层",
              lineage: "bronze_clicks -> silver_clicks",
              fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
              sampleRows: [
                {
                  click_id: "CLK00003",
                  touch_id: "T00003",
                  campaign_id: "C001",
                  user_id: "U0035",
                  click_time: "2026-05-01 09:06:00"
                },
                {
                  click_id: "CLK00006",
                  touch_id: "T00006",
                  campaign_id: "C005",
                  user_id: "U0040",
                  click_time: "2026-05-01 09:09:00"
                }
              ]
            },
            {
              name: "silver_claims",
              description: "标准化领取层",
              lineage: "bronze_claims -> silver_claims",
              fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
              sampleRows: [
                {
                  claim_id: "CLM00008",
                  campaign_id: "C005",
                  user_id: "U0054",
                  claim_time: "2026-05-01 09:13:00"
                },
                {
                  claim_id: "CLM00016",
                  campaign_id: "C002",
                  user_id: "U0164",
                  claim_time: "2026-05-01 09:21:00"
                }
              ]
            },
            {
              name: "silver_orders",
              description: "标准化订单层",
              lineage: "bronze_orders -> silver_orders",
              fields: ["order_id", "campaign_id", "user_id", "order_amount", "order_time"],
              sampleRows: [
                {
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  order_amount: "100",
                  order_time: "2026-05-01 09:21:00"
                },
                {
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  order_amount: "120",
                  order_time: "2026-05-01 09:32:00"
                }
              ]
            },
            {
              name: "silver_payments",
              description: "标准化支付层",
              lineage: "bronze_payments -> silver_payments",
              fields: [
                "payment_id",
                "order_id",
                "campaign_id",
                "user_id",
                "payment_amount",
                "payment_time"
              ],
              sampleRows: [
                {
                  payment_id: "P00011",
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  payment_amount: "100",
                  payment_time: "2026-05-01 09:26:00"
                },
                {
                  payment_id: "P00022",
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  payment_amount: "120",
                  payment_time: "2026-05-01 09:37:00"
                }
              ]
            }
          ]
        },
        {
          name: "gold",
          label: "Gold",
          tables: [
            {
              name: "gold_campaign_funnel",
              description: "活动漏斗汇总表",
              lineage: "silver_touchpoints + silver_clicks + silver_claims + silver_orders + silver_payments -> gold_campaign_funnel",
              fields: [
                "campaign_id",
                "exposure_uv",
                "click_cnt",
                "claim_cnt",
                "order_cnt",
                "paid_cnt",
                "paid_amount"
              ],
              sampleRows: [
                {
                  campaign_id: "C001",
                  exposure_uv: "170",
                  click_cnt: "141",
                  claim_cnt: "55",
                  order_cnt: "36",
                  paid_cnt: "36",
                  paid_amount: "4340.0"
                },
                {
                  campaign_id: "C002",
                  exposure_uv: "173",
                  click_cnt: "116",
                  claim_cnt: "44",
                  order_cnt: "40",
                  paid_cnt: "40",
                  paid_amount: "4860.0"
                }
              ]
            },
            {
              name: "gold_channel_segment_metrics",
              description: "渠道分群指标表",
              lineage: "silver_touchpoints + silver_payments + user segment -> gold_channel_segment_metrics",
              fields: ["channel_id", "user_segment", "paid_cnt", "paid_amount"],
              sampleRows: [
                {
                  channel_id: "app_push",
                  user_segment: "active",
                  paid_cnt: "43",
                  paid_amount: "4980.0"
                },
                {
                  channel_id: "app_push",
                  user_segment: "new",
                  paid_cnt: "52",
                  paid_amount: "6420.0"
                }
              ]
            }
          ]
        }
      ]
    },
    hybrid: {
      label: "hybrid",
      description: "保留分层路径，同时在分析层使用星型模型。",
      layers: [
        {
          name: "bronze",
          label: "Bronze",
          tables: [
            {
              name: "hybrid_bronze_touchpoints",
              description: "Hybrid 原始触达层",
              lineage: "bronze_touchpoints -> hybrid_bronze_touchpoints",
              fields: [
                "touch_id",
                "campaign_id",
                "user_id",
                "channel_id",
                "touch_status",
                "touch_time"
              ],
              sampleRows: [
                {
                  touch_id: "T00001",
                  campaign_id: "C005",
                  user_id: "U0003",
                  channel_id: "app_push",
                  touch_status: "exposed",
                  touch_time: "2026-05-01 09:01:00"
                },
                {
                  touch_id: "T00002",
                  campaign_id: "C005",
                  user_id: "U0077",
                  channel_id: "app_push",
                  touch_status: "exposed",
                  touch_time: "2026-05-01 09:02:00"
                }
              ]
            },
            {
              name: "hybrid_bronze_clicks",
              description: "Hybrid 原始点击层",
              lineage: "bronze_clicks -> hybrid_bronze_clicks",
              fields: ["click_id", "touch_id", "campaign_id", "user_id", "click_time"],
              sampleRows: [
                {
                  click_id: "CLK00003",
                  touch_id: "T00003",
                  campaign_id: "C001",
                  user_id: "U0035",
                  click_time: "2026-05-01 09:06:00"
                },
                {
                  click_id: "CLK00006",
                  touch_id: "T00006",
                  campaign_id: "C005",
                  user_id: "U0040",
                  click_time: "2026-05-01 09:09:00"
                }
              ]
            },
            {
              name: "hybrid_bronze_claims",
              description: "Hybrid 原始领取层",
              lineage: "bronze_claims -> hybrid_bronze_claims",
              fields: ["claim_id", "campaign_id", "user_id", "claim_time"],
              sampleRows: [
                {
                  claim_id: "CLM00008",
                  campaign_id: "C005",
                  user_id: "U0054",
                  claim_time: "2026-05-01 09:13:00"
                },
                {
                  claim_id: "CLM00016",
                  campaign_id: "C002",
                  user_id: "U0164",
                  claim_time: "2026-05-01 09:21:00"
                }
              ]
            },
            {
              name: "hybrid_bronze_orders",
              description: "Hybrid 原始订单层",
              lineage: "bronze_orders -> hybrid_bronze_orders",
              fields: [
                "order_id",
                "campaign_id",
                "user_id",
                "order_amount",
                "order_status",
                "order_time"
              ],
              sampleRows: [
                {
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  order_amount: "100",
                  order_status: "submitted",
                  order_time: "2026-05-01 09:21:00"
                },
                {
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  order_amount: "120",
                  order_status: "submitted",
                  order_time: "2026-05-01 09:32:00"
                }
              ]
            },
            {
              name: "hybrid_bronze_payments",
              description: "Hybrid 原始支付层",
              lineage: "bronze_payments -> hybrid_bronze_payments",
              fields: [
                "payment_id",
                "order_id",
                "campaign_id",
                "user_id",
                "payment_amount",
                "payment_status",
                "payment_time"
              ],
              sampleRows: [
                {
                  payment_id: "P00011",
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  payment_amount: "100",
                  payment_status: "paid",
                  payment_time: "2026-05-01 09:26:00"
                },
                {
                  payment_id: "P00022",
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  payment_amount: "120",
                  payment_status: "paid",
                  payment_time: "2026-05-01 09:37:00"
                }
              ]
            }
          ]
        },
        {
          name: "silver",
          label: "Silver",
          tables: [
            {
              name: "hybrid_silver_touchpoints",
              description: "Hybrid 标准化触达层",
              lineage: "hybrid_bronze_touchpoints -> hybrid_silver_touchpoints",
              fields: ["touch_id", "campaign_id", "user_id", "channel_id", "touch_time"],
              sampleRows: [
                {
                  touch_id: "T00001",
                  campaign_id: "C005",
                  user_id: "U0003",
                  channel_id: "app_push",
                  touch_time: "2026-05-01 09:01:00"
                },
                {
                  touch_id: "T00002",
                  campaign_id: "C005",
                  user_id: "U0077",
                  channel_id: "app_push",
                  touch_time: "2026-05-01 09:02:00"
                }
              ]
            },
            {
              name: "hybrid_silver_payments",
              description: "Hybrid 标准化支付层",
              lineage: "hybrid_bronze_payments -> hybrid_silver_payments",
              fields: [
                "payment_id",
                "order_id",
                "campaign_id",
                "user_id",
                "payment_amount",
                "payment_time"
              ],
              sampleRows: [
                {
                  payment_id: "P00011",
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  payment_amount: "100",
                  payment_time: "2026-05-01 09:26:00"
                },
                {
                  payment_id: "P00022",
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  payment_amount: "120",
                  payment_time: "2026-05-01 09:37:00"
                }
              ]
            }
          ]
        },
        {
          name: "gold",
          label: "Gold",
          tables: [
            {
              name: "hybrid_dim_campaign",
              description: "Hybrid 活动维表",
              lineage: "campaigns -> hybrid_dim_campaign",
              fields: [
                "campaign_id",
                "campaign_name",
                "campaign_type",
                "channel_type",
                "start_date",
                "end_date",
                "budget_amount"
              ],
              sampleRows: [
                {
                  campaign_id: "C001",
                  campaign_name: "campaign_1",
                  campaign_type: "bundle",
                  channel_type: "app_push",
                  start_date: "2026-05-01",
                  end_date: "2026-05-31",
                  budget_amount: "10500"
                },
                {
                  campaign_id: "C002",
                  campaign_name: "campaign_2",
                  campaign_type: "discount",
                  channel_type: "wechat",
                  start_date: "2026-05-01",
                  end_date: "2026-05-31",
                  budget_amount: "11000"
                }
              ]
            },
            {
              name: "hybrid_dim_user",
              description: "Hybrid 用户维表",
              lineage: "users -> hybrid_dim_user",
              fields: ["user_id", "register_date", "city_tier", "user_segment"],
              sampleRows: [
                {
                  user_id: "U0001",
                  register_date: "2026-04-01",
                  city_tier: "tier_3",
                  user_segment: "returning"
                },
                {
                  user_id: "U0002",
                  register_date: "2026-04-01",
                  city_tier: "tier_3",
                  user_segment: "new"
                }
              ]
            },
            {
              name: "hybrid_fact_payment",
              description: "Hybrid 支付事实表",
              lineage: "hybrid_silver_payments -> hybrid_fact_payment",
              fields: [
                "payment_id",
                "order_id",
                "campaign_id",
                "user_id",
                "payment_amount",
                "payment_time"
              ],
              sampleRows: [
                {
                  payment_id: "P00011",
                  order_id: "O00011",
                  campaign_id: "C004",
                  user_id: "U0065",
                  payment_amount: "100",
                  payment_time: "2026-05-01 09:26:00"
                },
                {
                  payment_id: "P00022",
                  order_id: "O00022",
                  campaign_id: "C002",
                  user_id: "U0140",
                  payment_amount: "120",
                  payment_time: "2026-05-01 09:37:00"
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
