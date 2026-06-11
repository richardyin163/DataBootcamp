from pathlib import Path
import unittest


def read_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


class ReadabilityCatalogTest(unittest.TestCase):
    def test_lineage_doc_describes_all_models(self) -> None:
        text = read_text("docs/data-lineage.md")

        self.assertIn("# 数据血缘说明", text)
        self.assertIn("## 1. 源数据到模型的总览", text)
        self.assertIn("## 2. 维度建模方案血缘", text)
        self.assertIn("## 3. Medallion 方案血缘", text)
        self.assertIn("## 4. Hybrid 方案血缘", text)
        self.assertIn("payment_events -> silver_payments -> gold_campaign_funnel", text)

    def test_supporting_docs_cover_progress_dictionary_and_comparison(self) -> None:
        status = read_text("docs/project-status.md")
        dictionary = read_text("docs/data-dictionary.md")
        comparison = read_text("docs/specs/schema-comparison.md")

        self.assertIn("## 2. 当前可直接阅读的内容", status)
        self.assertIn("## 3. 推荐阅读顺序", status)

        self.assertIn("## 1. 源数据字典", dictionary)
        self.assertIn("## 2. 模型层数据字典", dictionary)
        self.assertIn("## 3. 如何结合血缘阅读", dictionary)

        self.assertIn("## dimensional", comparison)
        self.assertIn("## medallion", comparison)
        self.assertIn("## hybrid", comparison)
        self.assertIn("当前已实现表", comparison)

    def test_catalog_and_readme_expose_primary_entry_points(self) -> None:
        catalog = read_text("docs/catalog.html")
        readme = read_text("README.md")

        self.assertIn("<title>DataBootcamp Readability Catalog</title>", catalog)
        self.assertIn('id="progress"', catalog)
        self.assertIn('id="dataset"', catalog)
        self.assertIn('id="models"', catalog)
        self.assertIn('id="layers"', catalog)
        self.assertIn('id="quick-links"', catalog)
        self.assertIn('href="data-dictionary.md"', catalog)
        self.assertIn('href="data-lineage.md"', catalog)
        self.assertIn("`docs/catalog.html`", readme)

    def test_catalog_data_includes_models_fields_and_samples(self) -> None:
        catalog_data = read_text("docs/catalog-data.js")

        self.assertIn("window.catalogData =", catalog_data)
        self.assertIn("sourceTables", catalog_data)
        self.assertIn("models", catalog_data)
        self.assertIn("campaigns", catalog_data)
        self.assertIn("dimensional", catalog_data)
        self.assertIn("medallion", catalog_data)
        self.assertIn("hybrid", catalog_data)
        self.assertIn("sampleRows", catalog_data)
        self.assertIn("campaign_1", catalog_data)
        self.assertIn("paid_amount", catalog_data)
        self.assertIn("gold_campaign_funnel", catalog_data)

    def test_catalog_html_mounts_drilldown_sections(self) -> None:
        catalog = read_text("docs/catalog.html")

        self.assertIn('id="dataset-browser"', catalog)
        self.assertIn('id="dataset-detail-panel"', catalog)
        self.assertIn('id="model-selector"', catalog)
        self.assertIn('id="model-detail"', catalog)
        self.assertIn('id="model-table-detail-panel"', catalog)
        self.assertIn('src="catalog-data.js"', catalog)
        self.assertIn('src="catalog.js"', catalog)
        self.assertIn("点击表卡片查看字段与前 2 行样例", catalog)

    def test_catalog_renderer_supports_dataset_and_model_drilldown(self) -> None:
        catalog_js = read_text("docs/catalog.js")

        self.assertIn("renderSourceTables()", catalog_js)
        self.assertIn("renderModelCards()", catalog_js)
        self.assertIn("renderModelDetail()", catalog_js)
        self.assertIn("toggleTableDetail", catalog_js)
        self.assertIn("activeModelKey", catalog_js)

    def test_catalog_renderer_uses_fixed_detail_panels_with_field_labels(self) -> None:
        catalog_js = read_text("docs/catalog.js")

        self.assertIn("selectedSourceTable: null", catalog_js)
        self.assertIn("selectedModelTable: null", catalog_js)
        self.assertIn("renderSelectedSourceTable()", catalog_js)
        self.assertIn("renderSelectedModelTable()", catalog_js)
        self.assertIn("FIELD_LABELS", catalog_js)
        self.assertIn("活动唯一标识", catalog_js)


if __name__ == "__main__":
    unittest.main()
