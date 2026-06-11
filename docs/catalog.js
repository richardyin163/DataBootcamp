const FIELD_LABELS = {
  campaign_id: "活动唯一标识",
  campaign_name: "活动名称",
  campaign_type: "活动类型",
  channel_type: "投放渠道类型",
  start_date: "开始日期",
  end_date: "结束日期",
  budget_amount: "预算金额",
  user_id: "用户唯一标识",
  register_date: "注册日期",
  city_tier: "城市级别",
  user_segment: "用户分群",
  touch_id: "触达记录唯一标识",
  channel_id: "渠道标识",
  touch_status: "触达状态",
  touch_time: "触达时间",
  click_id: "点击记录唯一标识",
  click_time: "点击时间",
  claim_id: "领取记录唯一标识",
  claim_time: "领取时间",
  order_id: "订单唯一标识",
  order_amount: "订单金额",
  order_status: "订单状态",
  order_time: "下单时间",
  payment_id: "支付记录唯一标识",
  payment_amount: "支付金额",
  payment_status: "支付状态",
  payment_time: "支付时间",
  exposure_uv: "曝光用户数",
  click_cnt: "点击次数",
  claim_cnt: "领取次数",
  paid_cnt: "支付次数",
  paid_amount: "支付金额汇总"
};

const state = {
  activeModelKey: "dimensional",
  selectedSourceTable: null,
  selectedModelTable: null
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getFieldLabel(fieldName) {
  return FIELD_LABELS[fieldName] || "字段说明待补充";
}

function buildFieldsHtml(fields) {
  return `
    <div>
      <strong>字段结构</strong>
      <table>
        <thead>
          <tr>
            <th>字段名</th>
            <th>中文含义</th>
          </tr>
        </thead>
        <tbody>
          ${fields
            .map(
              (field) => `
                <tr>
                  <td><code>${escapeHtml(field)}</code></td>
                  <td>${escapeHtml(getFieldLabel(field))}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildSampleTable(rows) {
  if (!rows.length) {
    return "<p>当前没有可展示的样例行。</p>";
  }

  const columns = Object.keys(rows[0]);
  return `
    <div>
      <strong>前 2 行样例</strong>
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>${columns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildTableDetail(table) {
  return `
    <p><strong>表名：</strong><code>${escapeHtml(table.name)}</code></p>
    <p><strong>业务含义：</strong>${escapeHtml(table.description)}</p>
    <p><strong>血缘：</strong><code>${escapeHtml(table.lineage)}</code></p>
    ${buildFieldsHtml(table.fields)}
    ${buildSampleTable(table.sampleRows)}
  `;
}

function findSelectedModelTable() {
  if (!state.selectedModelTable) {
    return null;
  }

  const model = window.catalogData.models[state.activeModelKey];
  for (const layer of model.layers) {
    const matched = layer.tables.find((table) => table.name === state.selectedModelTable);
    if (matched) {
      return matched;
    }
  }
  return null;
}

function toggleSourceTable(tableName) {
  state.selectedSourceTable = state.selectedSourceTable === tableName ? null : tableName;
  renderSourceTables();
  renderSelectedSourceTable();
}

function toggleTableDetail(tableName) {
  state.selectedModelTable = state.selectedModelTable === tableName ? null : tableName;
  renderModelDetail();
  renderSelectedModelTable();
}

function setActiveModel(modelKey) {
  state.activeModelKey = modelKey;
  state.selectedModelTable = null;
  renderModelCards();
  renderModelDetail();
  renderSelectedModelTable();
}

function renderSourceTables() {
  const root = document.getElementById("dataset-browser");
  root.innerHTML = window.catalogData.sourceTables
    .map((table) => {
      const isActive = state.selectedSourceTable === table.name;
      return `
        <article class="table-card ${isActive ? "is-active" : ""}">
          <h3>${escapeHtml(table.name)}</h3>
          <p>${escapeHtml(table.description)}</p>
          <button class="ghost-button" type="button" data-source-table="${escapeHtml(table.name)}">
            ${isActive ? "收起详情" : "查看字段与样例"}
          </button>
        </article>
      `;
    })
    .join("");

  root.querySelectorAll("[data-source-table]").forEach((button) => {
    button.addEventListener("click", () => toggleSourceTable(button.dataset.sourceTable));
  });
}

function renderSelectedSourceTable() {
  const panel = document.getElementById("dataset-detail-panel");
  const table = window.catalogData.sourceTables.find((item) => item.name === state.selectedSourceTable);

  panel.innerHTML = table
    ? buildTableDetail(table)
    : "<p>请选择一个源表查看字段中文含义和前 2 行样例。</p>";
}

function renderModelCards() {
  const root = document.getElementById("model-selector");
  root.innerHTML = Object.entries(window.catalogData.models)
    .map(([key, model]) => {
      const isActive = key === state.activeModelKey;
      return `
        <button class="model-card ${isActive ? "is-active" : ""}" type="button" data-model-key="${escapeHtml(key)}">
          <h3>${escapeHtml(model.label)}</h3>
          <p>${escapeHtml(model.description)}</p>
          <p>层数：${model.layers.length}</p>
        </button>
      `;
    })
    .join("");

  root.querySelectorAll("[data-model-key]").forEach((button) => {
    button.addEventListener("click", () => setActiveModel(button.dataset.modelKey));
  });
}

function renderModelDetail() {
  const root = document.getElementById("model-detail");
  const model = window.catalogData.models[state.activeModelKey];

  root.innerHTML = `
    <header>
      <h3>${escapeHtml(model.label)}</h3>
      <p>${escapeHtml(model.description)}</p>
    </header>
    ${model.layers
      .map(
        (layer) => `
          <section class="layer-block">
            <h4>${escapeHtml(layer.label)}</h4>
            <div class="grid">
              ${layer.tables
                .map((table) => {
                  const isActive = state.selectedModelTable === table.name;
                  return `
                    <article class="table-card ${isActive ? "is-active" : ""}">
                      <h5>${escapeHtml(table.name)}</h5>
                      <p>${escapeHtml(table.description)}</p>
                      <button class="ghost-button" type="button" data-model-table="${escapeHtml(table.name)}">
                        ${isActive ? "收起详情" : "查看字段与样例"}
                      </button>
                    </article>
                  `;
                })
                .join("")}
            </div>
          </section>
        `
      )
      .join("")}
  `;

  root.querySelectorAll("[data-model-table]").forEach((button) => {
    button.addEventListener("click", () => toggleTableDetail(button.dataset.modelTable));
  });
}

function renderSelectedModelTable() {
  const panel = document.getElementById("model-table-detail-panel");
  const table = findSelectedModelTable();

  panel.innerHTML = table
    ? buildTableDetail(table)
    : "<p>请选择当前模型中的一张表查看字段中文含义和前 2 行样例。</p>";
}

renderSourceTables();
renderSelectedSourceTable();
renderModelCards();
renderModelDetail();
renderSelectedModelTable();
