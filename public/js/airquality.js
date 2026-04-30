/**
 * airquality.js — air quality pane
 * --------------------------------
 * Fetches per-city pollutant averages, classifies values into quality levels,
 * and renders pollutant cards plus a station-detail table.
 */

/** EU air-quality bands (μg/m³ except CO which is μg/m³ as 8h average). */
const THRESHOLDS = {
  'PM2.5': [[12,   'good'], [25,   'fair'], [35,   'moderate'], [60,    'poor']],
  'PM10':  [[20,   'good'], [35,   'fair'], [50,   'moderate'], [100,   'poor']],
  'NO2':   [[40,   'good'], [70,   'fair'], [150,  'moderate'], [200,   'poor']],
  'O3':    [[60,   'good'], [120,  'fair'], [180,  'moderate'], [240,   'poor']],
  'SO2':   [[20,   'good'], [80,   'fair'], [250,  'moderate'], [350,   'poor']],
  'CO':    [[4000, 'good'], [8000, 'fair'], [15000,'moderate'], [30000, 'poor']]
};

/** Map a raw pollutant value to a quality level keyword. */
const pollLevel = (substance, value) => {
  const t = THRESHOLDS[substance];
  if (!t || value == null) return 'unknown';
  for (const [limit, level] of t) if (value <= limit) return level;
  return 'very_poor';
};

async function loadAirQuality(city, btn) {
  if (btn) {
    document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  document.getElementById('pollutant-grid').innerHTML =
    '<div class="empty" style="grid-column:1/-1">იტვირთება…</div>';
  document.getElementById('aq-stations-card').style.display = 'none';

  try {
    const j = await fetch(`${API}/api/air-quality/${city}/all-pollutants-average`)
      .then(r => r.json());
    if (!j.success) throw new Error(j.message || 'Error');
    renderAirQuality(j.data);
  } catch (e) {
    document.getElementById('pollutant-grid').innerHTML =
      `<div class="empty" style="grid-column:1/-1;color:var(--red)">${e.message}</div>`;
  }
}

function renderAirQuality(data) {
  const polls = data.pollutants || {};
  const ts    = data.timestamp ? new Date(data.timestamp).toLocaleString('ka') : '';
  document.getElementById('aq-updated').textContent = ts ? 'განახლდა: ' + ts : '';

  document.getElementById('pollutant-grid').innerHTML = Object.entries(polls).map(([name, info]) => {
    const val   = info.average?.value;
    const unit  = info.average?.unit || 'μg/m³';
    const level = info.average?.qualityLevel || pollLevel(name, val);
    return `<div class="poll-card">
      <div class="poll-name">${name}</div>
      <div class="poll-val">${val != null ? val.toFixed(2) : '–'}</div>
      <div class="poll-unit">${unit}</div>
      <span class="poll-level level-${level.replace(/\s/g, '_')}">${level}</span>
    </div>`;
  }).join('');

  const stations = Object.values(polls)[0]?.stations || [];
  if (stations.length) {
    document.getElementById('aq-stations-card').style.display = 'block';
    const cell  = 'padding:.55rem .8rem;border:1px solid var(--border-2);font-size:.79rem';
    const hcell = cell + ';background:var(--bg);font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--text-2)';

    document.getElementById('aq-stations').innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th style="${hcell};text-align:left">სადგური</th>
          <th style="${hcell}">მისამართი</th>
          <th style="${hcell}">მნიშვნელობა</th>
          <th style="${hcell}">ხარისხი</th>
        </tr></thead>
        <tbody>${stations.map(s => `<tr>
          <td style="${cell}">${s.code}</td>
          <td style="${cell}">${s.settlement || s.address || '–'}</td>
          <td style="${cell};text-align:right">${s.pollutantValue != null ? s.pollutantValue.toFixed(2) : '–'}</td>
          <td style="${cell};text-align:center">
            <span class="poll-level level-${(s.qualityLevel || 'unknown').replace(/\s/g, '_')}">${s.qualityLevel || '–'}</span>
          </td>
        </tr>`).join('')}</tbody>
      </table>`;
  }
}
