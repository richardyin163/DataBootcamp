import csv
import random
from datetime import datetime, timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_DIR = BASE_DIR / "data" / "sample"


def build_dataset(seed: int) -> dict[str, list[dict]]:
    rng = random.Random(seed)
    campaigns = [
        {
            "campaign_id": f"C{i:03d}",
            "campaign_name": f"campaign_{i}",
            "campaign_type": rng.choice(["discount", "coupon", "bundle"]),
            "channel_type": rng.choice(["app_push", "sms", "wechat"]),
            "start_date": "2026-05-01",
            "end_date": "2026-05-31",
            "budget_amount": str(10000 + i * 500),
        }
        for i in range(1, 6)
    ]
    users = [
        {
            "user_id": f"U{i:04d}",
            "register_date": "2026-04-01",
            "city_tier": rng.choice(["tier_1", "tier_2", "tier_3"]),
            "user_segment": rng.choice(["new", "active", "returning"]),
        }
        for i in range(1, 201)
    ]

    base_time = datetime(2026, 5, 1, 9, 0, 0)
    touchpoints = []
    clicks = []
    claims = []
    orders = []
    payments = []

    for i in range(1, 2001):
        campaign = rng.choice(campaigns)
        user = rng.choice(users)
        touch_id = f"T{i:05d}"
        touch_time = base_time + timedelta(minutes=i)
        touchpoints.append(
            {
                "touch_id": touch_id,
                "campaign_id": campaign["campaign_id"],
                "user_id": user["user_id"],
                "channel_id": campaign["channel_type"],
                "touch_status": "exposed",
                "touch_time": touch_time.isoformat(sep=" "),
            }
        )
        if i % 3 == 0:
            clicks.append(
                {
                    "click_id": f"CLK{i:05d}",
                    "touch_id": touch_id,
                    "campaign_id": campaign["campaign_id"],
                    "user_id": user["user_id"],
                    "click_time": (touch_time + timedelta(minutes=3)).isoformat(
                        sep=" "
                    ),
                }
            )
        if i % 8 == 0:
            claims.append(
                {
                    "claim_id": f"CLM{i:05d}",
                    "campaign_id": campaign["campaign_id"],
                    "user_id": user["user_id"],
                    "claim_time": (touch_time + timedelta(minutes=5)).isoformat(
                        sep=" "
                    ),
                }
            )
        if i % 11 == 0:
            order_id = f"O{i:05d}"
            amount = str(80 + (i % 5) * 20)
            orders.append(
                {
                    "order_id": order_id,
                    "campaign_id": campaign["campaign_id"],
                    "user_id": user["user_id"],
                    "order_amount": amount,
                    "order_status": "submitted",
                    "order_time": (touch_time + timedelta(minutes=10)).isoformat(
                        sep=" "
                    ),
                }
            )
            payments.append(
                {
                    "payment_id": f"P{i:05d}",
                    "order_id": order_id,
                    "campaign_id": campaign["campaign_id"],
                    "user_id": user["user_id"],
                    "payment_amount": amount,
                    "payment_status": "paid",
                    "payment_time": (touch_time + timedelta(minutes=15)).isoformat(
                        sep=" "
                    ),
                }
            )

    return {
        "campaigns": campaigns,
        "users": users,
        "channel_touchpoints": touchpoints,
        "click_events": clicks,
        "coupon_claim_events": claims,
        "order_events": orders,
        "payment_events": payments,
    }


def write_dataset(seed: int = 42) -> None:
    dataset = build_dataset(seed=seed)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, rows in dataset.items():
        with (OUTPUT_DIR / f"{name}.csv").open("w", newline="", encoding="utf-8") as fp:
            writer = csv.DictWriter(fp, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)


if __name__ == "__main__":
    write_dataset()
