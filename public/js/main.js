/**
 * main.js — boot, tab switching, auto-refresh
 * -------------------------------------------
 * Loaded last. Wires up sidebar navigation, the auto-refresh toggle, and kicks
 * off the initial overview load on DOMContentLoaded.
 */

const PAGE_TITLES = {
  overview:   'სტატისტიკის მიმოხილვა',
  datasets:   'მონაცემთა ბაზები',
  airquality: 'ჰაერის ხარისხი',
  services:   'სერვისები',
  settings:   'პარამეტრები'
};

/** Switch the visible pane and update the page title. */
function switchTab(name, btn) {
  document.querySelectorAll('.sb-item').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-' + name).classList.add('active');
  document.getElementById('page-title').textContent = PAGE_TITLES[name] || '';

  if (name === 'datasets') {
    state.allDatasets.length === 0 ? loadDatasets() : filterDatasets();
  }
  if (name === 'airquality') {
    loadAirQuality('tbilisi', document.querySelector('.city-btn.active'));
  }
}

/** Toggle the 60-second auto-refresh interval. */
function setAutoRefresh(enabled) {
  if (state.autoRefreshTimer) {
    clearInterval(state.autoRefreshTimer);
    state.autoRefreshTimer = null;
  }
  if (enabled) {
    state.autoRefreshTimer = setInterval(loadOverview, 60_000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadOverview();
  setAutoRefresh(true);
  document
    .getElementById('auto-refresh')
    .addEventListener('change', e => setAutoRefresh(e.target.checked));
});
