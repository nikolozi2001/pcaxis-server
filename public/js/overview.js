/**
 * overview.js — overview pane logic + dashboard charts
 * ----------------------------------------------------
 * Loads health data, dataset summary, draws the doughnut + bar charts,
 * and handles the "Clear Cache" action used on the Settings page.
 */

async function loadOverview() {
  setBadge('loading', 'Connecting…');
  await Promise.all([loadHealth(), loadDatasetSummary()]);
  document.getElementById('last-refresh').textContent =
    'Updated ' + new Date().toLocaleTimeString();
}

async function loadHealth() {
  try {
    const j = await fetch(`${API}/api/health/advanced`).then(r => r.json());
    if (!j.data) throw new Error();
    const d = j.data;

    document.getElementById('s-uptime').textContent   = d.uptime.human;
    document.getElementById('s-mem').textContent      = d.memory.used;
    document.getElementById('s-avg-resp').textContent = d.performance.averageResponseTime;

    setSvc('server', 'ok', 'Uptime: ' + d.uptime.human);
    setSvc('node',   'ok', d.system.nodeVersion);
    setSvc('env',    'ok', d.system.environment);
    setSvc('redis',
      d.services?.redis?.connected ? 'ok' : 'warn',
      d.services?.redis?.connected ? 'დაკავშირებულია' : 'მიუწვდომელია — ქეშირება გათიშულია');

    const ok = d.status !== 'degraded';
    setBadge(ok ? 'ok' : 'warn',
      ok ? 'სისტემა დაკავშირებულია'
         : 'შემცირებული მუშაობა' + (d.warnings?.length ? ' — ' + d.warnings.join(', ') : ''));
    document.getElementById('bot-status-text').textContent =
      ok ? 'სისტემა დაკავშირებულია' : 'შემცირებული მუშაობა';
  } catch {
    setBadge('err', 'სერვერი მიუწვდომელია');
    setSvc('server', 'err', 'მიუწვდომელია');
    document.getElementById('bot-status-text').textContent = 'სერვერი მიუწვდომელია';
  }
}

async function clearCache() {
  const btn = document.getElementById('btn-clear-cache');
  const out = document.getElementById('cache-result');
  btn.disabled = true; btn.textContent = '⏳ მიმდინარეობს…'; out.textContent = '';
  try {
    const j = await fetch(`${API}/api/health/cache/clear`, { method: 'POST' }).then(r => r.json());
    out.style.color = j.success ? 'var(--green-2)' : 'var(--red)';
    out.textContent = j.success ? `${j.keysDeleted} ჩანაწერი წაშლილია` : (j.error || 'Failed');
  } catch {
    out.style.color = 'var(--red)';
    out.textContent = 'სერვერი მიუწვდომელია';
  } finally {
    btn.disabled = false;
    btn.textContent = 'ქეშის გასუფთავება';
    setTimeout(() => { out.textContent = ''; }, 4000);
  }
}

async function loadDatasetSummary() {
  try {
    const [dsRes, catRes] = await Promise.all([
      fetch(`${API}/api/datasets`).then(r => r.json()),
      fetch(`${API}/api/navigation/categories`).then(r => r.json())
    ]);
    const datasets    = dsRes.data || [];
    const envCount    = datasets.filter(d => d.category === 'environment').length;
    const genderCount = datasets.filter(d => d.category === 'gender-statistics').length;

    document.getElementById('s-total').textContent = datasets.length;
    setSvc('pxweb', 'ok', `${datasets.length} მონაცემთა ბაზა ჩატვირთულია`);

    drawPie(envCount, genderCount, datasets.length - envCount - genderCount);

    const genderSubs = catRes?.data?.subcategories?.['gender-statistics'] || {};
    const subCounts  = {};
    datasets.filter(d => d.category === 'gender-statistics').forEach(d => {
      if (d.subcategory) subCounts[d.subcategory] = (subCounts[d.subcategory] || 0) + 1;
    });
    drawBar(
      Object.values(genderSubs).map(s => s.georgianName || s.name),
      Object.keys(genderSubs).map(k => subCounts[k] || 0)
    );
    state.subcategoryMap = catRes?.data?.subcategories || {};
    state.allDatasets    = datasets;
  } catch (e) {
    console.error(e);
  }
}

// ── Charts ─────────────────────────────────────────────────

function drawPie(env, gender, other) {
  const ctx = document.getElementById('pie-chart').getContext('2d');
  if (state.pieChart) state.pieChart.destroy();
  state.pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['გარემო', 'გენდერული სტატისტიკა', 'სხვა'],
      datasets: [{
        data: [env, gender, other],
        backgroundColor: ['#047857', '#10b981', '#a7f3d0'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: 11, family: 'Inter' }, padding: 16, color: '#475569' }
        }
      },
      cutout: '65%'
    }
  });
}

function drawBar(labels, data) {
  const canvas = document.getElementById('bar-chart');
  const ctx    = canvas.getContext('2d');
  if (state.barChart) state.barChart.destroy();

  // gradient: dark green → teal
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0,  '#047857');
  grad.addColorStop(.5, '#10b981');
  grad.addColorStop(1,  '#67e8f9');

  state.barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: grad,
        borderColor: 'transparent',
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a', padding: 10,
          titleFont: { family: 'Inter', size: 11 },
          bodyFont:  { family: 'Inter', size: 11 }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { font: { size: 10, family: 'Inter' }, color: '#94a3b8' },
          grid: { color: '#f1f5f9', drawBorder: false }
        },
        y: {
          ticks: { font: { size: 11, family: 'Inter' }, color: '#475569' },
          grid: { display: false, drawBorder: false }
        }
      }
    }
  });
}
