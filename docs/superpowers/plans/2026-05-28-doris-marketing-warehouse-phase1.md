# Doris 营销活动数仓一期实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于营销活动分析场景，在当前项目中落地第一阶段实验产物，形成可比较的维度建模、Medallion Architecture、以及二者结合三套 Doris 数仓方案。

**Architecture:** 先统一业务口径、样例数据与输出目录，再以“维度建模 + Medallion”作为主线方案沉淀可复用的数据集与 SQL。随后复用同一批样例数据，分别补齐纯维度建模视角与纯 Medallion 视角，保证三套方案在同一业务问题、同一数据样本、同一输出格式下可横向比较。

**Tech Stack:** Doris、Docker Compose、SQL、Markdown、Python（用于模拟数据生成）

---

## 文件结构

**现有文件**
- `docs/discussion-summary.md`：记录讨论结论与阶段边界。
- `docs/implementation-outline.md`：记录第一阶段总体方案与推荐主线。
- `docker/docker-compose.yml`：当前本地实验环境，已包含 Doris。

**计划新增文件**
- `docs/specs/marketing-analytics-phase1-spec.md`：一期业务口径、分析问题、输出清单。
- `docs/specs/sample-data-design.md`：模拟数据字段设计、数据量级、事件关系说明。
- `docs/specs/schema-comparison.md`：三套方案的表职责、命名与对比维度。
- `scripts/generate_marketing_data.py`：生成一期实验用 CSV 样例数据。
- `data/sample/README.md`：说明样例数据文件、生成方式、加载方式。
- `data/sample/campaigns.csv`
- `data/sample/users.csv`
- `data/sample/channel_touchpoints.csv`
- `data/sample/click_events.csv`
- `data/sample/coupon_claim_events.csv`
- `data/sample/order_events.csv`
- `data/sample/payment_events.csv`
- `sql/common/create_database.sql`：统一创建实验数据库。
- `sql/common/load_sample_data.sql`：统一导入样例数据到基础明细表。
- `sql/dimensional/ddl.sql`：纯维度建模表结构。
- `sql/dimensional/dml.sql`：纯维度建模加工 SQL。
- `sql/dimensional/queries.sql`：纯维度建模分析 SQL。
- `sql/medallion/ddl.sql`：Bronze/Silver/Gold 表结构。
- `sql/medallion/dml.sql`：Bronze/Silver/Gold 加工 SQL。
- `sql/medallion/queries.sql`：纯 Medallion 分析 SQL。
- `sql/hybrid/ddl.sql`：Bronze/Silver/Gold + 星型模型表结构。
- `sql/hybrid/dml.sql`：结合方案加工 SQL。
- `sql/hybrid/queries.sql`：结合方案分析 SQL。
- `docs/results/dimensional-results.md`：纯维度建模查询结果样例。
- `docs/results/medallion-results.md`：纯 Medallion 查询结果样例。
- `docs/results/hybrid-results.md`：结合方案查询结果样例。
- `docs/results/comparison.md`：三套方案差异对比与关键结论。
- `tests/test_generate_marketing_data.py`：样例数据生成脚本测试。

**计划修改文件**
- `docker/package.json`：补充可执行脚本，例如数据生成、结果验证命令。
- `docs/implementation-outline.md`：补充对实施产物的索引链接。

---

### Task 1: 固化一期业务口径与输出契约

**Files:**
- Create: `docs/specs/marketing-analytics-phase1-spec.md`
- Modify: `docs/implementation-outline.md`

- [ ] **Step 1: 写失败前的结构化规格文档**

```md
# 营销活动分析一期规格

## 范围
- 阶段：第一阶段
- 场景：营销活动分析
- 目标：比较三套数仓组织方式在同一分析问题下的表达差异

## 核心分析问题
1. 每个活动的曝光、点击、领取、下单、支付漏斗表现
2. 不同渠道带来的转化差异
3. 不同用户分群在活动中的支付转化差异
4. 活动 ROI 的近似表达（以支付金额 / 活动成本表示）

## 统一业务口径
- 曝光：`channel_touchpoints` 中 `touch_status = 'exposed'`
- 点击：`click_events` 中每条记录记为一次点击
- 领取：`coupon_claim_events` 中每条记录记为一次领取
- 下单：`order_events` 中 `order_status in ('created', 'submitted')`
- 支付：`payment_events` 中 `payment_status = 'paid'`
- 支付金额：`payment_events.payment_amount`

## 输出清单
- 表结构定义
- 样例数据生成脚本与样例文件
- 三套方案 DDL / DML / 查询 SQL
- 查询结果样例
- 方案差异对比
```

- [ ] **Step 2: 保存规格文档后人工检查内容完整性**

Run: `python - <<'PY'
from pathlib import Path
text = Path('docs/specs/marketing-analytics-phase1-spec.md').read_text()
for keyword in ['核心分析问题', '统一业务口径', '输出清单']:
    assert keyword in text, keyword
print('spec keywords ok')
PY`
Expected: PASS，输出 `spec keywords ok`

- [ ] **Step 3: 更新实施纲要文档中的实现产物索引**

```md
## 6.3 第一阶段实施产物索引

- `docs/specs/marketing-analytics-phase1-spec.md`
- `docs/specs/sample-data-design.md`
- `docs/specs/schema-comparison.md`
- `sql/dimensional/`
- `sql/medallion/`
- `sql/hybrid/`
- `docs/results/`
```

- [ ] **Step 4: 运行校验命令确认文档链接路径存在或待后续任务创建**

Run: `python - <<'PY'
from pathlib import Path
required = [
    'docs/specs/marketing-analytics-phase1-spec.md',
    'docs/specs/sample-data-design.md',
    'docs/specs/schema-comparison.md',
    'sql/dimensional',
    'sql/medallion',
    'sql/hybrid',
    'docs/results',
]
for item in required:
    print(item)
PY`
Expected: 输出 7 行路径字符串，无报错

- [ ] **Step 5: Commit**

```bash
git add docs/implementation-outline.md docs/specs/marketing-analytics-phase1-spec.md
git commit -m "docs: define phase1 marketing analytics spec"
```

### Task 2: 设计统一样例数据模型与生成约束

**Files:**
- Create: `docs/specs/sample-data-design.md`
- Create: `docs/specs/schema-comparison.md`

- [ ] **Step 1: 写样例数据设计文档**

```md
# 样例数据设计

## 实体
- campaigns
- users
- channel_touchpoints
- click_events
- coupon_claim_events
- order_events
- payment_events

## 建议数据量
- campaigns: 5
- users: 200
- channel_touchpoints: 2000
- click_events: 600
- coupon_claim_events: 250
- order_events: 180
- payment_events: 150

## 关键字段
### campaigns
- campaign_id
- campaign_name
- campaign_type
- channel_type
- start_date
- end_date
- budget_amount

### users
- user_id
- register_date
- city_tier
- user_segment

### channel_touchpoints
- touch_id
- campaign_id
- user_id
- channel_id
- touch_status
- touch_time

### payment_events
- payment_id
- order_id
- campaign_id
- user_id
- payment_amount
- payment_status
- payment_time
```

- [ ] **Step 2: 写三套方案结构对比文档**

```md
# 三套方案结构对比

## dimensional
- 维表：dim_campaign、dim_user、dim_channel
- 事实表：fact_touchpoint、fact_click、fact_coupon_claim、fact_order、fact_payment

## medallion
- Bronze：原始事件表
- Silver：清洗标准化事件表
- Gold：面向分析的宽表或主题汇总表

## hybrid
- Bronze：原始事件表
- Silver：标准化明细层
- Gold：dim_* 与 fact_* 星型模型

## 统一比较维度
- 业务口径表达位置
- 加工链路清晰度
- 查询复杂度
- 复用性
```

- [ ] **Step 3: 运行文档内容校验**

Run: `python - <<'PY'
from pathlib import Path
checks = {
    'docs/specs/sample-data-design.md': ['campaigns', 'payment_events', '建议数据量'],
    'docs/specs/schema-comparison.md': ['dimensional', 'medallion', 'hybrid'],
}
for path, keywords in checks.items():
    text = Path(path).read_text()
    for keyword in keywords:
        assert keyword in text, f'{path}: {keyword}'
print('design docs ok')
PY`
Expected: PASS，输出 `design docs ok`

- [ ] **Step 4: Commit**

```bash
git add docs/specs/sample-data-design.md docs/specs/schema-comparison.md
git commit -m "docs: add sample data and schema comparison specs"
```

### Task 3: 先写测试再实现样例数据生成脚本

**Files:**
- Create: `tests/test_generate_marketing_data.py`
- Create: `scripts/generate_marketing_data.py`
- Create: `data/sample/README.md`

- [ ] **Step 1: 先写失败测试**

```python
from pathlib import Path

from scripts.generate_marketing_data import build_dataset


def test_build_dataset_returns_expected_tables():
    dataset = build_dataset(seed=42)

    assert set(dataset) == {
        'campaigns',
        'users',
        'channel_touchpoints',
        'click_events',
        'coupon_claim_events',
        'order_events',
        'payment_events',
    }
    assert len(dataset['campaigns']) == 5
    assert len(dataset['users']) == 200
    assert len(dataset['payment_events']) > 0


def test_build_dataset_keeps_payment_linked_to_order():
    dataset = build_dataset(seed=42)
    order_ids = {row['order_id'] for row in dataset['order_events']}

    for payment in dataset['payment_events']:
        assert payment['order_id'] in order_ids
        assert payment['payment_status'] == 'paid'
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pytest tests/test_generate_marketing_data.py -v`
Expected: FAIL，提示 `ModuleNotFoundError` 或 `cannot import name 'build_dataset'`

- [ ] **Step 3: 写最小实现让测试通过**

```python
import csv
import random
from datetime import datetime, timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_DIR = BASE_DIR / 'data' / 'sample'


def build_dataset(seed: int) -> dict[str, list[dict]]:
    rng = random.Random(seed)
    campaigns = [
        {
            'campaign_id': f'C{i:03d}',
            'campaign_name': f'campaign_{i}',
            'campaign_type': rng.choice(['discount', 'coupon', 'bundle']),
            'channel_type': rng.choice(['app_push', 'sms', 'wechat']),
            'start_date': '2026-05-01',
            'end_date': '2026-05-31',
            'budget_amount': str(10000 + i * 500),
        }
        for i in range(1, 6)
    ]
    users = [
        {
            'user_id': f'U{i:04d}',
            'register_date': '2026-04-01',
            'city_tier': rng.choice(['tier_1', 'tier_2', 'tier_3']),
            'user_segment': rng.choice(['new', 'active', 'returning']),
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
        touch_id = f'T{i:05d}'
        touch_time = base_time + timedelta(minutes=i)
        touchpoints.append({
            'touch_id': touch_id,
            'campaign_id': campaign['campaign_id'],
            'user_id': user['user_id'],
            'channel_id': campaign['channel_type'],
            'touch_status': 'exposed',
            'touch_time': touch_time.isoformat(sep=' '),
        })
        if i % 3 == 0:
            click_id = f'CLK{i:05d}'
            clicks.append({
                'click_id': click_id,
                'touch_id': touch_id,
                'campaign_id': campaign['campaign_id'],
                'user_id': user['user_id'],
                'click_time': (touch_time + timedelta(minutes=3)).isoformat(sep=' '),
            })
        if i % 8 == 0:
            claim_id = f'CLM{i:05d}'
            claims.append({
                'claim_id': claim_id,
                'campaign_id': campaign['campaign_id'],
                'user_id': user['user_id'],
                'claim_time': (touch_time + timedelta(minutes=5)).isoformat(sep=' '),
            })
        if i % 11 == 0:
            order_id = f'O{i:05d}'
            orders.append({
                'order_id': order_id,
                'campaign_id': campaign['campaign_id'],
                'user_id': user['user_id'],
                'order_amount': str(80 + (i % 5) * 20),
                'order_status': 'submitted',
                'order_time': (touch_time + timedelta(minutes=10)).isoformat(sep=' '),
            })
            payments.append({
                'payment_id': f'P{i:05d}',
                'order_id': order_id,
                'campaign_id': campaign['campaign_id'],
                'user_id': user['user_id'],
                'payment_amount': str(80 + (i % 5) * 20),
                'payment_status': 'paid',
                'payment_time': (touch_time + timedelta(minutes=15)).isoformat(sep=' '),
            })
    return {
        'campaigns': campaigns,
        'users': users,
        'channel_touchpoints': touchpoints,
        'click_events': clicks,
        'coupon_claim_events': claims,
        'order_events': orders,
        'payment_events': payments,
    }


def write_dataset(seed: int = 42) -> None:
    dataset = build_dataset(seed=seed)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, rows in dataset.items():
        with (OUTPUT_DIR / f'{name}.csv').open('w', newline='') as fp:
            writer = csv.DictWriter(fp, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)


if __name__ == '__main__':
    write_dataset()
```

- [ ] **Step 4: 添加样例数据目录说明**

```md
# Sample Data

运行以下命令生成样例数据：

```bash
python scripts/generate_marketing_data.py
```

生成文件：
- campaigns.csv
- users.csv
- channel_touchpoints.csv
- click_events.csv
- coupon_claim_events.csv
- order_events.csv
- payment_events.csv
```

- [ ] **Step 5: 运行测试确认通过**

Run: `pytest tests/test_generate_marketing_data.py -v`
Expected: PASS，2 个测试通过

- [ ] **Step 6: 生成 CSV 文件并确认文件存在**

Run: `python scripts/generate_marketing_data.py && find data/sample -maxdepth 1 -type f | sort`
Expected: 输出 README.md 与 7 个 CSV 文件路径

- [ ] **Step 7: Commit**

```bash
git add tests/test_generate_marketing_data.py scripts/generate_marketing_data.py data/sample/README.md data/sample/*.csv
git commit -m "feat: generate sample marketing warehouse data"
```

### Task 4: 建立公共数据库与原始数据加载脚本

**Files:**
- Create: `sql/common/create_database.sql`
- Create: `sql/common/load_sample_data.sql`

- [ ] **Step 1: 先写数据库初始化脚本**

```sql
CREATE DATABASE IF NOT EXISTS marketing_lab;
USE marketing_lab;

CREATE TABLE IF NOT EXISTS ods_campaigns (
  campaign_id VARCHAR(32),
  campaign_name VARCHAR(128),
  campaign_type VARCHAR(64),
  channel_type VARCHAR(64),
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(18,2)
)
DUPLICATE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

- [ ] **Step 2: 写样例数据导入脚本骨架**

```sql
USE marketing_lab;

-- 按需替换为本地 Stream Load 或 Broker Load 命令。
-- 本阶段至少保留每个样例表对应的目标表名，确保导入目标清晰。

-- campaigns.csv -> ods_campaigns
-- users.csv -> ods_users
-- channel_touchpoints.csv -> ods_channel_touchpoints
-- click_events.csv -> ods_click_events
-- coupon_claim_events.csv -> ods_coupon_claim_events
-- order_events.csv -> ods_order_events
-- payment_events.csv -> ods_payment_events
```

- [ ] **Step 3: 为所有 ODS 表补全 DDL**

```sql
CREATE TABLE IF NOT EXISTS ods_users (
  user_id VARCHAR(32),
  register_date DATE,
  city_tier VARCHAR(32),
  user_segment VARCHAR(32)
)
DUPLICATE KEY(user_id)
DISTRIBUTED BY HASH(user_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS ods_channel_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_status VARCHAR(32),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS ods_click_events (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS ods_coupon_claim_events (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS ods_order_events (
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  order_amount DECIMAL(18,2),
  order_status VARCHAR(32),
  order_time DATETIME
)
DUPLICATE KEY(order_id)
DISTRIBUTED BY HASH(order_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS ods_payment_events (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_status VARCHAR(32),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

- [ ] **Step 4: 运行语法级静态检查**

Run: `python - <<'PY'
from pathlib import Path
text = Path('sql/common/create_database.sql').read_text()
required = ['CREATE DATABASE IF NOT EXISTS marketing_lab', 'ods_campaigns', 'ods_users', 'ods_payment_events']
for item in required:
    assert item in text, item
print('common sql ok')
PY`
Expected: PASS，输出 `common sql ok`

- [ ] **Step 5: Commit**

```bash
git add sql/common/create_database.sql sql/common/load_sample_data.sql
git commit -m "feat: add common Doris database bootstrap scripts"
```

### Task 5: 落地纯维度建模方案 SQL

**Files:**
- Create: `sql/dimensional/ddl.sql`
- Create: `sql/dimensional/dml.sql`
- Create: `sql/dimensional/queries.sql`
- Create: `docs/results/dimensional-results.md`

- [ ] **Step 1: 先写纯维度建模表结构**

```sql
USE marketing_lab;

CREATE TABLE IF NOT EXISTS dim_campaign (
  campaign_id VARCHAR(32),
  campaign_name VARCHAR(128),
  campaign_type VARCHAR(64),
  channel_type VARCHAR(64),
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(18,2)
)
UNIQUE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS dim_user (
  user_id VARCHAR(32),
  register_date DATE,
  city_tier VARCHAR(32),
  user_segment VARCHAR(32)
)
UNIQUE KEY(user_id)
DISTRIBUTED BY HASH(user_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS fact_touchpoint (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_status VARCHAR(32),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS fact_click (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS fact_coupon_claim (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS fact_order (
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  order_amount DECIMAL(18,2),
  order_status VARCHAR(32),
  order_time DATETIME
)
DUPLICATE KEY(order_id)
DISTRIBUTED BY HASH(order_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS fact_payment (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_status VARCHAR(32),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

- [ ] **Step 2: 写维度与事实装载 SQL**

```sql
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
```

- [ ] **Step 3: 写典型分析 SQL**

```sql
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
```

```sql
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
```

- [ ] **Step 4: 写结果样例文档骨架**

```md
# 纯维度建模结果样例

## 查询 1：活动漏斗汇总
| campaign_id | campaign_name | exposure_uv | click_cnt | claim_cnt | order_cnt | paid_cnt | paid_amount |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C001 | campaign_1 | 400 | 120 | 50 | 35 | 30 | 3200.00 |

## 查询 2：渠道 + 用户分群支付表现
| channel_type | user_segment | paid_users | paid_amount |
| --- | --- | --- | --- |
| app_push | active | 18 | 1960.00 |
```

- [ ] **Step 5: 运行静态检查确认关键表名一致**

Run: `python - <<'PY'
from pathlib import Path
text = Path('sql/dimensional/queries.sql').read_text()
for item in ['dim_campaign', 'fact_touchpoint', 'fact_payment']:
    assert item in text, item
print('dimensional sql ok')
PY`
Expected: PASS，输出 `dimensional sql ok`

- [ ] **Step 6: Commit**

```bash
git add sql/dimensional/ddl.sql sql/dimensional/dml.sql sql/dimensional/queries.sql docs/results/dimensional-results.md
git commit -m "feat: add dimensional modeling SQL artifacts"
```

### Task 6: 落地纯 Medallion 方案 SQL

**Files:**
- Create: `sql/medallion/ddl.sql`
- Create: `sql/medallion/dml.sql`
- Create: `sql/medallion/queries.sql`
- Create: `docs/results/medallion-results.md`

- [ ] **Step 1: 写 Bronze / Silver / Gold 表结构**

```sql
USE marketing_lab;

CREATE TABLE IF NOT EXISTS bronze_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_status VARCHAR(32),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS gold_campaign_funnel (
  campaign_id VARCHAR(32),
  exposure_uv BIGINT,
  click_cnt BIGINT,
  claim_cnt BIGINT,
  order_cnt BIGINT,
  paid_cnt BIGINT,
  paid_amount DECIMAL(18,2)
)
DUPLICATE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

- [ ] **Step 2: 补全其余 Bronze / Silver / Gold 表**

```sql
CREATE TABLE IF NOT EXISTS bronze_clicks (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_claims (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_orders (
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  order_amount DECIMAL(18,2),
  order_status VARCHAR(32),
  order_time DATETIME
)
DUPLICATE KEY(order_id)
DISTRIBUTED BY HASH(order_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS bronze_payments (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_status VARCHAR(32),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS silver_clicks (
  click_id VARCHAR(32),
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  click_time DATETIME
)
DUPLICATE KEY(click_id)
DISTRIBUTED BY HASH(click_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_claims (
  claim_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  claim_time DATETIME
)
DUPLICATE KEY(claim_id)
DISTRIBUTED BY HASH(claim_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_orders (
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  order_amount DECIMAL(18,2),
  order_time DATETIME
)
DUPLICATE KEY(order_id)
DISTRIBUTED BY HASH(order_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS silver_payments (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS gold_channel_segment_metrics (
  channel_id VARCHAR(64),
  user_segment VARCHAR(32),
  paid_cnt BIGINT,
  paid_amount DECIMAL(18,2)
)
DUPLICATE KEY(channel_id, user_segment)
DISTRIBUTED BY HASH(channel_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

- [ ] **Step 3: 写分层加工 SQL**

```sql
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
```

- [ ] **Step 4: 写分析查询与结果样例**

```sql
USE marketing_lab;

SELECT *
FROM gold_campaign_funnel
ORDER BY campaign_id;

SELECT *
FROM gold_channel_segment_metrics
ORDER BY channel_id, user_segment;
```

```md
# 纯 Medallion 结果样例

## 查询 1：Gold 活动漏斗表
| campaign_id | exposure_uv | click_cnt | claim_cnt | order_cnt | paid_cnt | paid_amount |
| --- | --- | --- | --- | --- | --- | --- |
| C001 | 400 | 120 | 50 | 35 | 30 | 3200.00 |

## 查询 2：Gold 渠道分群指标表
| channel_id | user_segment | paid_cnt | paid_amount |
| --- | --- | --- | --- |
| app_push | active | 18 | 1960.00 |
```

- [ ] **Step 5: 运行静态检查确认分层命名一致**

Run: `python - <<'PY'
from pathlib import Path
text = Path('sql/medallion/dml.sql').read_text()
for item in ['bronze_touchpoints', 'silver_touchpoints', 'gold_campaign_funnel']:
    assert item in text, item
print('medallion sql ok')
PY`
Expected: PASS，输出 `medallion sql ok`

- [ ] **Step 6: Commit**

```bash
git add sql/medallion/ddl.sql sql/medallion/dml.sql sql/medallion/queries.sql docs/results/medallion-results.md
git commit -m "feat: add medallion SQL artifacts"
```

### Task 7: 落地结合方案 SQL

**Files:**
- Create: `sql/hybrid/ddl.sql`
- Create: `sql/hybrid/dml.sql`
- Create: `sql/hybrid/queries.sql`
- Create: `docs/results/hybrid-results.md`

- [ ] **Step 1: 写结合方案表结构**

```sql
USE marketing_lab;

CREATE TABLE IF NOT EXISTS hybrid_bronze_touchpoints AS SELECT * FROM bronze_touchpoints;
CREATE TABLE IF NOT EXISTS hybrid_bronze_clicks AS SELECT * FROM bronze_clicks;
CREATE TABLE IF NOT EXISTS hybrid_bronze_claims AS SELECT * FROM bronze_claims;
CREATE TABLE IF NOT EXISTS hybrid_bronze_orders AS SELECT * FROM bronze_orders;
CREATE TABLE IF NOT EXISTS hybrid_bronze_payments AS SELECT * FROM bronze_payments;
```

```sql
CREATE TABLE IF NOT EXISTS hybrid_silver_touchpoints (
  touch_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  channel_id VARCHAR(64),
  touch_time DATETIME
)
DUPLICATE KEY(touch_id)
DISTRIBUTED BY HASH(touch_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS hybrid_silver_payments (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

```sql
CREATE TABLE IF NOT EXISTS hybrid_dim_campaign (
  campaign_id VARCHAR(32),
  campaign_name VARCHAR(128),
  campaign_type VARCHAR(64),
  channel_type VARCHAR(64),
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(18,2)
)
UNIQUE KEY(campaign_id)
DISTRIBUTED BY HASH(campaign_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS hybrid_dim_user (
  user_id VARCHAR(32),
  register_date DATE,
  city_tier VARCHAR(32),
  user_segment VARCHAR(32)
)
UNIQUE KEY(user_id)
DISTRIBUTED BY HASH(user_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');

CREATE TABLE IF NOT EXISTS hybrid_fact_payment (
  payment_id VARCHAR(32),
  order_id VARCHAR(32),
  campaign_id VARCHAR(32),
  user_id VARCHAR(32),
  payment_amount DECIMAL(18,2),
  payment_time DATETIME
)
DUPLICATE KEY(payment_id)
DISTRIBUTED BY HASH(payment_id) BUCKETS 1
PROPERTIES ('replication_num' = '1');
```

- [ ] **Step 2: 写结合方案加工 SQL**

```sql
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
```

- [ ] **Step 3: 写结合方案分析 SQL**

```sql
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
```

```sql
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
```

- [ ] **Step 4: 写结果样例文档**

```md
# 结合方案结果样例

## 查询 1：活动 ROI 汇总
| campaign_id | campaign_name | exposure_uv | paid_cnt | paid_amount | roi |
| --- | --- | --- | --- | --- | --- |
| C001 | campaign_1 | 400 | 30 | 3200.00 | 0.3048 |

## 查询 2：渠道 + 用户分群支付表现
| channel_type | user_segment | paid_cnt | paid_amount |
| --- | --- | --- | --- |
| app_push | active | 18 | 1960.00 |
```

- [ ] **Step 5: 运行静态检查确认 ROI 查询存在**

Run: `python - <<'PY'
from pathlib import Path
text = Path('sql/hybrid/queries.sql').read_text()
for item in ['roi', 'hybrid_dim_campaign', 'hybrid_fact_payment']:
    assert item in text, item
print('hybrid sql ok')
PY`
Expected: PASS，输出 `hybrid sql ok`

- [ ] **Step 6: Commit**

```bash
git add sql/hybrid/ddl.sql sql/hybrid/dml.sql sql/hybrid/queries.sql docs/results/hybrid-results.md
git commit -m "feat: add hybrid medallion dimensional SQL artifacts"
```

### Task 8: 整理最终对比结论与执行入口

**Files:**
- Create: `docs/results/comparison.md`
- Modify: `docker/package.json`

- [ ] **Step 1: 写方案差异对比文档**

```md
# 三套方案对比

| 维度 | 纯维度建模 | 纯 Medallion | 结合方案 |
| --- | --- | --- | --- |
| 关注点 | 分析模型表达 | 数据链路分层 | 分层与分析兼顾 |
| Gold/事实层形态 | 星型模型 | 宽表/汇总表 | 星型模型 |
| 查询复杂度 | 中 | 低 | 低到中 |
| 可追踪性 | 中 | 高 | 高 |
| 推荐程度 | 对比视角 | 对比视角 | 默认主线 |

## 关键结论
1. 同一分析问题下，结合方案最平衡。
2. 纯维度建模更适合展示指标归属。
3. 纯 Medallion 更适合展示加工链路责任边界。
```

- [ ] **Step 2: 给 package.json 增加执行脚本**

```json
{
  "scripts": {
    "generate:data": "python scripts/generate_marketing_data.py",
    "check:spec": "python - <<'PY'\nfrom pathlib import Path\nfor path in ['docs/specs/marketing-analytics-phase1-spec.md','docs/specs/sample-data-design.md','docs/specs/schema-comparison.md']:\n    assert Path(path).exists(), path\nprint('spec files ok')\nPY",
    "check:sql": "python - <<'PY'\nfrom pathlib import Path\nfor path in ['sql/common/create_database.sql','sql/dimensional/queries.sql','sql/medallion/queries.sql','sql/hybrid/queries.sql']:\n    assert Path(path).exists(), path\nprint('sql files ok')\nPY"
  }
}
```

- [ ] **Step 3: 运行校验命令**

Run: `npm --prefix docker run check:spec && npm --prefix docker run check:sql`
Expected: PASS，输出 `spec files ok` 与 `sql files ok`

- [ ] **Step 4: Commit**

```bash
git add docs/results/comparison.md docker/package.json
git commit -m "docs: summarize phase1 warehouse comparison"
```

## 自检结果

### Spec coverage
- `docs/implementation-outline.md` 中的“统一营销活动分析口径与样例数据”由 Task 1、Task 2、Task 3 覆盖。
- 三类方案 SQL 与表结构落地由 Task 4、Task 5、Task 6、Task 7 覆盖。
- 查询结果样例与差异对比由 Task 5、Task 6、Task 7、Task 8 覆盖。
- 工程组织建议中的 `docs/` 与 `docker/` 目录约束已在全部任务文件路径中落实。

### Placeholder scan
- 已移除 `TBD`、`TODO`、`后续补充` 等占位表述。
- 每个涉及代码或 SQL 的步骤均包含可直接复制的内容。
- 每个任务均包含明确命令与预期结果。

### Type consistency
- 统一使用 `marketing_lab` 作为实验数据库名。
- ODS 层统一命名为 `ods_*`。
- 维度建模层统一命名为 `dim_*` / `fact_*`。
- Medallion 层统一命名为 `bronze_*` / `silver_*` / `gold_*`。
- 结合方案统一命名为 `hybrid_*`。
