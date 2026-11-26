/* sell.js - sell form with validation + price helper
   Owner: Member 3 (Ritvik) / shared with Member 1 for listing storage */

const CONDITION_FACTOR = { "Like New": 1, "Excellent": 0.92, "Good": 0.82, "Fair": 0.7 };

/* Suggested price = original * age depreciation * condition factor (never below 12% of original) */
function suggestPrice(original, ageYears, condition) {
  const depreciation = Math.max(0.12, 1 - 0.18 * ageYears);
  const price = original * depreciation * CONDITION_FACTOR[condition];
  return Math.max(Math.round(price / 100) * 100, Math.round(original * 0.12));
}

function setupSell() {
  $("#sCategory").innerHTML = CATEGORIES.map((c) => `<option>${c.name}</option>`).join("");

  $("#estimateBtn").addEventListener("click", () => {
    const original = +$("#estOriginal").value;
    const age = +$("#estAge").value;
    const out = $("#estimateOut");
    if (!original || original < 1000) { out.textContent = "Enter the original price (at least ₹1,000)."; return; }
    if (original > MAX_LISTING_PRICE) { out.textContent = `Original price can't exceed ${fmt(MAX_LISTING_PRICE)}.`; return; }
    if ($("#estAge").value === "" || isNaN(age) || age < 0 || age > 10) { out.textContent = "Age should be between 0 and 10 years."; return; }
    const cond = $("#estCondition").value;
    const price = suggestPrice(original, age, cond);
    out.innerHTML = `Suggested asking price: <b>${fmt(price)}</b>
      <button type="button" class="link-btn" id="useEstimate">Use this</button>`;
    $("#useEstimate").onclick = () => {
      $("#sPrice").value = price; $("#sOriginal").value = original; $("#sCondition").value = cond;
      ["sPrice", "sOriginal"].forEach((id) => setErr(id, ""));
      $("#sellForm").scrollIntoView({ behavior: "smooth", block: "center" });
    };
  });

  $("#sellForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (id) => $("#" + id).value.trim();
    const price = Math.round(+v("sPrice")), original = Math.round(+v("sOriginal"));
    const rules = [
      ["sTitle",    v("sTitle").length >= 8,         "Title should be at least 8 characters"],
      ["sBrand",    v("sBrand").length >= 2,         "Enter the brand"],
      ["sPrice",    price >= 500 && price <= MAX_LISTING_PRICE, `Price must be between ₹500 and ${fmt(MAX_LISTING_PRICE)}`],
      ["sOriginal", original >= price && original <= MAX_LISTING_PRICE, "Original price must be at least the asking price"],
      ["sCity",     v("sCity").length >= 2,          "Enter your city"],
      ["sDesc",     v("sDesc").length >= 15,         "Describe the device (at least 15 characters)"],
      ["sSeller",   v("sSeller").length >= 2,        "Enter your name"]
    ];
    let ok = true;
    rules.forEach(([id, valid, msg]) => { setErr(id, valid ? "" : msg); if (!valid) ok = false; });
    if (!ok) return;

    const mine = store.get("userListings", []);
    // ids only ever go up. Reusing the id of a deleted listing would make a new one show up as "Sold"
    const id = Math.max(store.get("lastId", 1000), ...mine.map((x) => x.id)) + 1;
    store.set("lastId", id);
    const listing = {
      id, mine: true, title: v("sTitle"), brand: v("sBrand"), category: $("#sCategory").value,
      condition: $("#sCondition").value, price, original, warranty: 0, refurbished: false,
      rating: 0, reviews: 0, city: v("sCity"), seller: v("sSeller"),
      specs: { Details: v("sDesc") }, desc: "Listed by the seller. Check it when it arrives; you have 7 days to return it."
    };
    mine.push(listing); store.set("userListings", mine);
    loadProducts(); renderProducts();
    e.target.reset();
    $$("#sellForm .err").forEach((el) => (el.textContent = ""));
    toast("Your listing is live. You can find it in the shop.");
    $("#browse").scrollIntoView({ behavior: "smooth" });
  });
}
