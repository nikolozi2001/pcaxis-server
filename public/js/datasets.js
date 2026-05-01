/**
 * datasets.js — dataset browser + preview modal
 * ---------------------------------------------
 * Powers the Datasets pane: filtering, grouping by subcategory, dataset cards,
 * and the chart+table preview modal opened by clicking a card.
 */

async function loadDatasets() {
  if (!state.allDatasets.length) {
    state.allDatasets = (await fetch(`${API}/api/datasets`)
      .then(r => r.json()).catch(() => ({}))).data || [];
  }
  if (!Object.keys(state.subcategoryMap).length) {
    state.subcategoryMap = (await fetch(`${API}/api/navigation/categories`)
      .then(r => r.json()).catch(() => ({})))?.data?.subcategories || {};
  }
  filterDatasets();
}

function filterDatasets() {
  const cat  = document.getElementById('f-category').value;
  const sub  = document.getElementById('f-subcategory').value;
  const srch = document.getElementById('f-search').value.toLowerCase();

  // Sync the subcategory dropdown with the chosen category
  const subSel  = document.getElementById('f-subcategory');
  const prevSub = subSel.value;
  while (subSel.options.length > 1) subSel.remove(1);
  if (cat && state.subcategoryMap[cat]) {
    Object.values(state.subcategoryMap[cat]).forEach(s =>
      subSel.add(new Option(s.georgianName || s.name, s.id)));
  }
  subSel.value = prevSub;

  const ds = state.allDatasets.filter(d => {
    if (cat  && d.category    !== cat)  return false;
    if (sub  && d.subcategory !== sub)  return false;
    if (srch && !d.name.toLowerCase().includes(srch) &&
               !d.description?.toLowerCase().includes(srch) &&
               !d.id.toLowerCase().includes(srch)) return false;
    return true;
  });

  document.getElementById('ds-count').textContent = ds.length + ' შედეგი';

  // Group by subcategory (or category if none)
  const groups = {};
  ds.forEach(d => {
    const key = d.subcategory || d.category || 'other';
    (groups[key] = groups[key] || []).push(d);
  });

  const labelFor = key => {
    for (const ck of Object.keys(state.subcategoryMap)) {
      const s = state.subcategoryMap[ck]?.[key];
      if (s) return s.georgianName || s.name;
    }
    return key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const container = document.getElementById('ds-groups');
  container.innerHTML = '';
  if (!ds.length) {
    container.innerHTML = '<div class="empty">შედეგი არ მოიძებნა</div>';
    return;
  }
  Object.entries(groups).forEach(([gk, items]) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="ds-group-hd">
        <div class="ds-group-name">${labelFor(gk)}</div>
        <div class="ds-group-cnt">${items.length}</div>
      </div>
      <div class="ds-grid">${items.map(dsCard).join('')}</div>`;
    container.appendChild(wrap);
  });
}

function dsCard(d) {
  const cls = d.category === 'environment'         ? 'env'
            : d.category === 'gender-statistics'   ? 'gender'
            : 'geo';
  const lbl = d.category === 'environment'         ? 'გარემო'
            : d.category === 'gender-statistics'   ? 'გენდერი'
            : d.category;
  return `<div class="ds-card" onclick="openPreview('${d.id}')">
    <div class="ds-card-name">${d.name}</div>
    <div class="ds-card-desc">${d.description || ''}</div>
    <div class="ds-card-footer">
      <span class="badge ${cls}">${lbl}</span>
      <button class="preview-btn" onclick="event.stopPropagation();openPreview('${d.id}')">ნახვა →</button>
    </div>
  </div>`;
}

// ── Preview modal ──────────────────────────────────────────

async function openPreview(id) {
  document.getElementById('modal-bg').classList.add('open');
  document.getElementById('modal-content').innerHTML =
    '<div class="modal-loading"><span class="spinner">⏳</span> იტვირთება…</div>';
  try {
    const resp = await fetch(`${API}/api/datasets/${id}/data?lang=ka`);
    const j    = await resp.json();
    if (!j.success) {
      if (resp.status === 502) throw new Error('გარე API მიუწვდომელია (geostat.ge). სცადეთ მოგვიანებით.');
      throw new Error(j.message);
    }
    renderModal(j.data);
  } catch (e) {
    document.getElementById('modal-content').innerHTML =
      `<div class="modal-loading" style="color:var(--red)">⚠ ${e.message}</div>`;
  }
}

function renderModal(d) {
  const rows = d.data || [];
  const cats = d.categories || [];
  const has  = cats.length > 1;
  const yk   = rows.length ? Object.keys(rows[0])[0] : 'year';
  const labels = rows.map(r => r[yk]);
  const COLORS = ['#1a56db', '#7c3aed', '#10b981', '#0891b2', '#d97706', '#db2777', '#65a30d', '#ea580c'];

  const datasets = has
    ? cats.map((c, i) => ({
        label: c, data: rows.map(r => r[c] ?? null),
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: COLORS[i % COLORS.length] + '18',
        tension: .3, fill: false, pointRadius: 2, pointHoverRadius: 4
      }))
    : (() => {
        const vk = Object.keys(rows[0] || {}).find(k => k !== yk) || 'value';
        return [{
          label: d.name, data: rows.map(r => r[vk] ?? null),
          borderColor: '#1a56db', backgroundColor: '#1a56db14',
          tension: .3, fill: true, pointRadius: 2, pointHoverRadius: 4
        }];
      })();

  const ck   = has ? cats : [Object.keys(rows[0] || {}).find(k => k !== yk) || 'value'];
  const head = `<tr><th>${yk}</th>${ck.map(c => `<th>${c}</th>`).join('')}</tr>`;
  const body = rows.slice().reverse().map(r =>
    `<tr><td>${r[yk]}</td>${ck.map(c =>
      `<td>${r[c] != null ? Number(r[c]).toLocaleString() : '–'}</td>`).join('')}</tr>`
  ).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-title">${d.name || d.id}</div>
    <div class="modal-desc">${d.description || ''}</div>
    <div class="modal-sec">გრაფიკი</div>
    <div class="modal-chart"><canvas id="modal-canvas"></canvas></div>
    <div class="modal-sec">მონაცემთა ცხრილი</div>
    <div class="modal-table"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;

  if (state.previewChart) state.previewChart.destroy();
  state.previewChart = new Chart(document.getElementById('modal-canvas').getContext('2d'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11, family: 'Inter' }, padding: 14 } }
      },
      scales: {
        y: { beginAtZero: false, grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter' } } },
        x: { ticks: { maxRotation: 45, font: { family: 'Inter' } }, grid: { display: false } }
      }
    }
  });
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-bg') &&
           !e.target.classList.contains('modal-close')) return;
  document.getElementById('modal-bg').classList.remove('open');
  if (state.previewChart) { state.previewChart.destroy(); state.previewChart = null; }
}
