/**
 * api.js — shared configuration, state, and UI helpers
 * ----------------------------------------------------
 * Loaded first; exposes `API`, `state`, `setBadge`, `setSvc` as globals
 * to the rest of the dashboard scripts.
 */

/** Base URL for API calls. Falls back to localhost when opened via file://. */
const API = window.location.protocol === 'file:'
  ? 'http://localhost:3000'
  : `${window.location.protocol}//${window.location.host}`;

/** Shared mutable state across modules. */
const state = {
  allDatasets:      [],
  subcategoryMap:   {},
  pieChart:         null,
  barChart:         null,
  previewChart:     null,
  autoRefreshTimer: null
};

/** Update the connection status badge in the top bar. */
function setBadge(type, text) {
  const el = document.getElementById('srv-badge');
  el.className = type;
  el.innerHTML = `<div class="badge-dot"></div>${text}`;
}

/**
 * Update a service status row (overview + dedicated services pane share keys).
 * @param {string} key     — service key (server, pxweb, redis, node, env)
 * @param {string} status  — one of 'ok' | 'warn' | 'err'
 * @param {string} detail  — detail text shown in the rightmost column
 */
function setSvc(key, status, detail) {
  const labels = { ok: 'ONLINE', warn: 'DEGRADED', err: 'OFFLINE' };
  ['svc', 'svc2'].forEach(prefix => {
    const b = document.getElementById(`${prefix}-${key}-b`);
    if (b) {
      b.className = 'pill ' + status;
      b.textContent = labels[status] || '–';
    }
    const d = document.getElementById(`${prefix}-${key}-d`);
    if (d) d.textContent = detail;
  });
}
