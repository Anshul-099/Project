/* compare.js - side-by-side comparison of up to 3 devices
   Owner: Member 3 (Ritvik) */

let compareIds = [];
const MAX_COMPARE = 3;

function toggleCompare(id, checkbox) {
  if (compareIds.includes(id)) {
    compareIds = compareIds.filter((x) => x !== id);
  } else {
    if (compareIds.length >= MAX_COMPARE) {
      if (checkbox) checkbox.checked = false;
      toast(`You can compare up to ${MAX_COMPARE} devices`);
      return;
    }
    compareIds.push(id);
  }
  renderTray();
}

function renderTray() {
  const tray = $("#compareTray");
  tray.hidden = compareIds.length === 0;
  document.body.classList.toggle("has-tray", compareIds.length > 0);
  $("#trayItems").innerHTML = compareIds.map((id) => {
    const p = products.find((x) => x.id === id); if (!p) return "";
    return `<span class="tray-chip">${esc(p.title.slice(0, 26))}${p.title.length > 26 ? "…" : ""}
      <button data-rm="${id}" aria-label="Remove ${esc(p.title)} from comparison">✕</button></span>`;
  }).join("");
  $("#compareBtn").disabled = compareIds.length < 2;
  $("#compareBtn").textContent = compareIds.length < 2 ? "Pick at least 2" : `Compare (${compareIds.length})`;
  $$("#productGrid [data-act=compare]").forEach((cb) => {
    cb.checked = compareIds.includes(+cb.closest(".card").dataset.id);
  });
}

function openCompare() {
  const items = compareIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  if (items.length < 2) return;
  const cheapest = Math.min(...items.map((p) => p.price));
  const bestCond = Math.max(...items.map((p) => CONDITIONS[p.condition].rank));
  const bestWar = Math.max(...items.map((p) => p.warranty));
  const bestRate = Math.max(...items.filter((p) => p.reviews).map((p) => p.rating));   // new listings have no rating yet
  const bestSave = Math.max(...items.map(discountPct));

  const row = (label, fn, best) => `<tr><th>${label}</th>${items.map((p) => {
    const hl = best && best(p) ? ' class="best"' : "";
    return `<td${hl}>${fn(p)}</td>`;
  }).join("")}</tr>`;

  const specKeys = [...new Set(items.flatMap((p) => Object.keys(p.specs)))];
  const specRows = specKeys.map((k) => row(esc(k), (p) => (p.specs[k] ? esc(p.specs[k]) : "—"))).join("");

  openModal(`
    <h2>Compare devices</h2>
    <div class="table-wrap">
    <table class="cmp-table">
      <thead><tr><th></th>${items.map((p) => `<th>${artHTML(p)}<span>${esc(p.title)}</span></th>`).join("")}</tr></thead>
      <tbody>
        ${row("Price", (p) => `<b>${fmt(p.price)}</b>`, (p) => p.price === cheapest)}
        ${row("You save", (p) => `${discountPct(p)}%`, (p) => discountPct(p) === bestSave)}
        ${row("Condition", (p) => esc(p.condition), (p) => CONDITIONS[p.condition].rank === bestCond)}
        ${row("Warranty", (p) => (p.warranty ? p.warranty + " months" : "None"), (p) => p.warranty === bestWar && bestWar > 0)}
        ${row("Rating", (p) => (p.reviews ? p.rating.toFixed(1) + " ★" : "No reviews yet"), (p) => p.reviews && p.rating === bestRate)}
        ${row("Location", (p) => esc(p.city))}
        ${specRows}
        <tr><th></th>${items.map((p) => `<td><button class="btn btn-primary sm" data-cmp-add="${p.id}">Add to cart</button></td>`).join("")}</tr>
      </tbody>
    </table></div>
    <p class="hint">Green cells mark the best value in each row.</p>`, true);
}

function setupCompare() {
  $("#compareBtn").addEventListener("click", openCompare);
  $("#clearCompare").addEventListener("click", () => { compareIds = []; renderTray(); });
  $("#trayItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rm]"); if (!b) return;
    compareIds = compareIds.filter((x) => x !== +b.dataset.rm);
    renderTray();
  });
  $("#modalBody").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cmp-add]"); if (!b) return;
    addToCart(+b.dataset.cmpAdd);
  });
}
