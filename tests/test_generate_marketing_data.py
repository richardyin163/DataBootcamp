import unittest

from scripts.generate_marketing_data import build_dataset


class GenerateMarketingDataTest(unittest.TestCase):
    def test_build_dataset_returns_expected_tables(self) -> None:
        dataset = build_dataset(seed=42)

        self.assertEqual(
            set(dataset),
            {
                "campaigns",
                "users",
                "channel_touchpoints",
                "click_events",
                "coupon_claim_events",
                "order_events",
                "payment_events",
            },
        )
        self.assertEqual(len(dataset["campaigns"]), 5)
        self.assertEqual(len(dataset["users"]), 200)
        self.assertGreater(len(dataset["payment_events"]), 0)

    def test_build_dataset_keeps_payment_linked_to_order(self) -> None:
        dataset = build_dataset(seed=42)
        order_ids = {row["order_id"] for row in dataset["order_events"]}

        for payment in dataset["payment_events"]:
            self.assertIn(payment["order_id"], order_ids)
            self.assertEqual(payment["payment_status"], "paid")


if __name__ == "__main__":
    unittest.main()
