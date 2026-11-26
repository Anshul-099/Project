/* products.js - catalogue, filters, sorting, product detail, wishlist
   Owner: Member 1 (Anshul) */

let products = [];                       // seed + user listings
let wishlist = store.get("wishlist", []);
const filters = { q: "", category: "All", condition: "all", maxPrice: 150000, warrantyOnly: false, savedOnly: false, sort: "featured" };

let priceCeiling = 150000;

function loadProducts() {
  const mine = store.get("userListings", []);
  const sold = store.get("sold", []);
  products = SEED_PRODUCTS.concat(mine).map((p) => Object.assign({}, p, { sold: sold.includes(p.id) }));
  // drop saved / cart / compare ids that no longer exist
  const ids = products.map((p) => p.id);
  wishlist = wishlist.filter((id) => ids.includes(id));
  store.set("wishlist", wishlist);
  if (typeof cart !== "undefined") {
    cart = cart.filter((c) => ids.includes(c.id) && !products.find((p) => p.id === c.id).sold);
    saveCart();
  }
  updatePriceCeiling();
}

/* The price slider always reaches the dearest listing, so no listing is ever hidden by default */
function updatePriceCeiling() {
  const oldCeiling = priceCeiling;
  priceCeiling = Math.max(150000, Math.ceil(Math.max(...products.map((p) => p.price)) / 10000) * 10000);
  const range = $("#priceRange");
  if (!range) return;
  range.max = priceCeiling;
  if (filters.maxPrice >= oldCeiling) filters.maxPrice = priceCeiling;
  filters.maxPrice = Math.min(filters.maxPrice, priceCeiling);
  range.value = filters.maxPrice;
  $("#priceLabel").textContent = fmt(filters.maxPrice);
}

function getFiltered() {
  const q = filters.q.trim().toLowerCase();
  let list = products.filter((p) => {
    if (filters.category !== "All" && p.category !== filters.category) return false;
    if (filters.condition !== "all" && p.condition !== filters.condition) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.warrantyOnly && !p.warranty) return false;
    if (filters.savedOnly && !wishlist.includes(p.id)) return false;
    if (q) {
      const hay = (p.title + " " + p.brand + " " + p.category + " " + Object.values(p.specs).join(" ")).toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const sorters = {
    featured:  (a, b) => (b.refurbished - a.refurbished) || (b.rating - a.rating),
    priceAsc:  (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    discount:  (a, b) => discountPct(b) - discountPct(a),
    rating:    (a, b) => b.rating - a.rating
  };
  // sold devices always sink to the bottom
  return list.sort((a, b) => (a.sold - b.sold) || sorters[filters.sort](a, b));
}

function cardHTML(p) {
  const saved = wishlist.includes(p.id);
  const inCmp = compareIds.includes(p.id);
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media">
      ${artHTML(p)}
      <button class="heart${saved ? " on" : ""}" data-act="wish" aria-label="Save ${esc(p.title)}" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
      <span class="tag cond-${p.condition.replace(" ", "")}">${esc(p.condition)}</span>
      ${p.mine ? '<span class="tag mine">Your listing</span>' : ""}
      ${p.sold ? '<span class="sold-ribbon">Sold</span>' : ""}
    </div>
    <div class="card-body">
      <p class="brand">${esc(p.brand)} · ${esc(p.category)}</p>
      <h3 class="card-title"><button class="title-btn" data-act="view">${esc(p.title)}</button></h3>
      ${ratingHTML(p)}
      <p class="price"><b>${fmt(p.price)}</b> <s>${fmt(p.original)}</s> <span class="off">${discountPct(p)}% off</span></p>
      <p class="meta">${p.warranty ? p.warranty + " mo warranty" : "No warranty"} · ${esc(p.city)}</p>
      <div class="card-actions">
        <button class="btn btn-primary sm" data-act="add" ${p.sold ? "disabled" : ""}>${p.sold ? "Sold out" : "Add to cart"}</button>
        <label class="cmp"><input type="checkbox" data-act="compare" ${inCmp ? "checked" : ""}> Compare</label>
      </div>
    </div>
  </article>`;
}

function renderProducts() {
  const list = getFiltered();
  $("#productGrid").innerHTML = list.map(cardHTML).join("");
  $("#emptyState").hidden = list.length > 0;
  $("#resultCount").textContent = `${list.length} device${list.length === 1 ? "" : "s"} found`;
  $("#statCount").textContent = products.filter((p) => !p.sold).length;
  $("#wishCount").textContent = wishlist.length;
}

function toggleWish(id) {
  const i = wishlist.indexOf(id);
  if (i > -1) { wishlist.splice(i, 1); toast("Removed from saved"); }
  else { wishlist.push(id); toast("Saved"); }
  store.set("wishlist", wishlist);
  renderProducts();
}

function openDetail(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const specs = Object.entries(p.specs).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");
  const save = p.original - p.price;
  openModal(`
    <div class="detail">
      ${artHTML(p, true)}
      <div>
        <p class="brand">${esc(p.brand)} · ${esc(p.category)}</p>
        <h2 id="detailTitle">${esc(p.title)}</h2>
        ${ratingHTML(p)}
        <p class="price big"><b>${fmt(p.price)}</b> <s>${fmt(p.original)}</s> <span class="off">Save ${fmt(save)} (${discountPct(p)}%)</span></p>
        <p>${esc(p.desc)}</p>
        <div class="grade-note"><b class="tag cond-${p.condition.replace(" ", "")}">${esc(p.condition)}</b> ${esc(CONDITIONS[p.condition].text)}</div>
        <table class="spec">${specs}</table>
        <ul class="assure">
          <li>${p.warranty ? p.warranty + "-month " + (p.refurbished ? "ReBoot" : "seller") + " warranty" : "Sold as-is, no warranty"}</li>
          <li>7-day return window</li>
          <li>Sold by ${esc(p.seller)}, ${esc(p.city)}</li>
        </ul>
        <div class="detail-actions">
          <button class="btn btn-primary" id="detailAdd" ${p.sold ? "disabled" : ""}>${p.sold ? "Sold out" : "Add to cart"}</button>
          <button class="btn btn-ghost" id="detailWish">${wishlist.includes(p.id) ? "♥ Saved" : "♡ Save"}</button>
          ${p.mine ? '<button class="btn btn-danger" id="detailDelete">Remove listing</button>' : ""}
        </div>
      </div>
    </div>`, true);
  $("#detailAdd").onclick = () => { addToCart(p.id); closeModal(); };
  $("#detailWish").onclick = () => { toggleWish(p.id); $("#detailWish").textContent = wishlist.includes(p.id) ? "♥ Saved" : "♡ Save"; };
  const del = $("#detailDelete");
  if (del) del.onclick = () => deleteListing(p.id);
}

function deleteListing(id) {
  const mine = store.get("userListings", []).filter((x) => x.id !== id);
  store.set("userListings", mine);
  compareIds = compareIds.filter((c) => c !== id);
  loadProducts();                       // also prunes cart + wishlist
  renderProducts(); renderCart(); renderTray();
  closeModal(); toast("Listing removed");
}

function setupFilters() {
  $("#categoryChips").innerHTML = ["All"].concat(CATEGORIES.map((c) => c.name))
    .map((n) => `<button type="button" class="chip${n === "All" ? " on" : ""}" data-cat="${n}">${n}</button>`).join("");

  $("#categoryChips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    filters.category = b.dataset.cat;
    $$(".chip").forEach((c) => c.classList.toggle("on", c === b));
    renderProducts();
  });
  $("#searchInput").addEventListener("input", (e) => { filters.q = e.target.value; renderProducts(); });
  $("#conditionSelect").addEventListener("change", (e) => { filters.condition = e.target.value; renderProducts(); });
  $("#priceRange").addEventListener("input", (e) => {
    filters.maxPrice = +e.target.value;
    $("#priceLabel").textContent = fmt(filters.maxPrice);
    renderProducts();
  });
  $("#warrantyOnly").addEventListener("change", (e) => { filters.warrantyOnly = e.target.checked; renderProducts(); });
  $("#savedOnly").addEventListener("change", (e) => { filters.savedOnly = e.target.checked; renderProducts(); });
  $("#sortSelect").addEventListener("change", (e) => { filters.sort = e.target.value; renderProducts(); });
  $("#resetFilters").addEventListener("click", resetFilters);
  $("#emptyReset").addEventListener("click", resetFilters);

  $("#wishBtn").addEventListener("click", () => {
    const box = $("#savedOnly");
    box.checked = !box.checked;
    filters.savedOnly = box.checked;
    renderProducts();
    location.hash = "#browse";
    if (box.checked && !wishlist.length) toast("You have no saved items yet");
  });

  $("#productGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    const id = +card.dataset.id;
    const act = e.target.closest("[data-act]");
    if (!act) return;
    if (act.dataset.act === "view") openDetail(id);
    else if (act.dataset.act === "wish") toggleWish(id);
    else if (act.dataset.act === "add") addToCart(id);
  });
  $("#productGrid").addEventListener("change", (e) => {
    if (e.target.dataset.act === "compare") toggleCompare(+e.target.closest(".card").dataset.id, e.target);
  });
}

function resetFilters() {
  Object.assign(filters, { q: "", category: "All", condition: "all", maxPrice: priceCeiling, warrantyOnly: false, savedOnly: false, sort: "featured" });
  $("#searchInput").value = ""; $("#conditionSelect").value = "all"; $("#priceRange").value = priceCeiling;
  $("#priceLabel").textContent = fmt(priceCeiling); $("#warrantyOnly").checked = false; $("#savedOnly").checked = false;
  $("#sortSelect").value = "featured";
  $$(".chip").forEach((c) => c.classList.toggle("on", c.dataset.cat === "All"));
  renderProducts();
}
