/* utils.js - small helpers used everywhere */

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* localStorage wrapper that never throws (private mode etc.) */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("reboot_" + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("reboot_" + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
};

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* Generic modal */
let lastFocus = null;
function openModal(html, wide) {
  lastFocus = document.activeElement;
  $("#modalBody").innerHTML = html;
  const h = $("#modalBody h2");                 // label the dialog by its heading
  if (h) { h.id = "modalTitle"; $("#modal").setAttribute("aria-labelledby", "modalTitle"); }
  $("#modalCard").classList.toggle("wide", !!wide);
  $("#modal").hidden = false;
  document.body.classList.add("lock");
  $("#modalClose").focus();
}
function closeModal() {
  $("#modal").hidden = true;
  if ($("#cartDrawer").getAttribute("aria-hidden") === "true") document.body.classList.remove("lock");
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  lastFocus = null;
}

function categoryInfo(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[0];
}

/* Product artwork: emoji on a tinted gradient tile */
function artHTML(p, big) {
  const c = categoryInfo(p.category);
  return `<div class="art${big ? " big" : ""}" style="background:linear-gradient(135deg,${c.tint[0]},${c.tint[1]})" aria-hidden="true"><span>${c.icon}</span></div>`;
}

function discountPct(p) {
  return Math.max(0, Math.round((1 - p.price / p.original) * 100));
}

function stars(r) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/* Seller listings have no reviews yet, so show "New" instead of a made-up rating */
function ratingHTML(p) {
  if (!p.reviews) return '<p class="rating"><span class="new-pill">New listing</span></p>';
  return `<p class="rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span> ${p.rating.toFixed(1)} <small>(${p.reviews})</small></p>`;
}
