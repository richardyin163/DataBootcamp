from scripts.generate_marketing_data import build_dataset


def test_build_dataset_returns_expected_tables():
    dataset = build_dataset(seed=42)

    assert set(dataset) == {
        "campaigns",
        "users",
        "channel_touchpoints",
        "click_events",
        "coupon_claim_events",
        "order_events",
        "payment_events",
    }
    assert len(dataset["campaigns"]) == 5
    assert len(dataset["users"]) == 200
    assert len(dataset["payment_events"]) > 0


def test_build_dataset_keeps_payment_linked_to_order():
    dataset = build_dataset(seed=42)
    order_ids = {row["order_id"] for row in dataset["order_events"]}

    for payment in dataset["payment_events"]:
        assert payment["order_id"] in order_ids
        assert payment["payment_status"] == "paid"
