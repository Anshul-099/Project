/* cart.js - cart drawer, coupons, checkout and order confirmation
   Owner: Member 2 (Granth)
   Each second-hand device is a single unit, so an item can only be added once. */

let cart = store.get("cart", []);          // [{ id }]
let appliedCoupon = store.get("coupon", null);

function saveCart() { store.set("cart", cart); store.set("coupon", appliedCoupon); }

function addToCart(id) {
  const prod = products.find((p) => p.id === id);
  if (!prod || prod.sold) { toast("Sorry, this device is no longer available"); return; }
  if (cart.some((c) => c.id === id)) { toast("Already in your cart. There is only one of each device."); return; }
  cart.push({ id });
  saveCart(); renderCart(); toast("Added to cart");
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart(); renderCart();
}

function cartTotals() {
  const items = cart.map((c) => products.find((p) => p.id === c.id)).filter(Boolean);
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  let discount = appliedCoupon && COUPONS[appliedCoupon] ? COUPONS[appliedCoupon].calc(subtotal) : 0;
  if (appliedCoupon && discount === 0) { appliedCoupon = null; store.set("coupon", null); }  // cart no longer qualifies
  const delivery = items.length === 0 || subtotal - discount >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  return { items, subtotal, discount, delivery, total: subtotal - discount + delivery };
}

function renderCart() {
  const t = cartTotals();
  $("#cartCount").textContent = t.items.length;

  if (!t.items.length) {
    $("#cartItems").innerHTML = `<div class="empty"><p>Your cart is empty.</p><a href="#browse" class="btn btn-ghost" data-close-cart>Start shopping</a></div>`;
    $("#cartFoot").innerHTML = "";
    return;
  }

  $("#cartItems").innerHTML = t.items.map((p) => `
    <div class="cart-row">
      ${artHTML(p)}
      <div class="cart-info">
        <b>${esc(p.title)}</b>
        <small>${esc(p.condition)}, ${p.warranty ? p.warranty + " mo warranty" : "no warranty"}</small>
        <span>${fmt(p.price)}</span>
      </div>
      <button class="icon-btn" data-remove="${p.id}" aria-label="Remove ${esc(p.title)}">🗑</button>
    </div>`).join("");

  const coupon = appliedCoupon
    ? `<div class="coupon applied">Coupon <b>${esc(appliedCoupon)}</b> applied <button class="link-btn" id="removeCoupon">Remove</button></div>`
    : `<form class="coupon" id="couponForm"><input id="couponInput" placeholder="Coupon code" aria-label="Coupon code"><button class="btn btn-ghost sm" type="submit">Apply</button></form>`;

  const toFree = FREE_DELIVERY_ABOVE - (t.subtotal - t.discount);
  $("#cartFoot").innerHTML = `
    ${coupon}
    <dl class="totals">
      <div><dt>Subtotal</dt><dd>${fmt(t.subtotal)}</dd></div>
      ${t.discount ? `<div class="good"><dt>Discount</dt><dd>− ${fmt(t.discount)}</dd></div>` : ""}
      <div><dt>Delivery</dt><dd>${t.delivery ? fmt(t.delivery) : "Free"}</dd></div>
      <div class="grand"><dt>Total</dt><dd>${fmt(t.total)}</dd></div>
    </dl>
    ${toFree > 0 ? `<p class="hint">Add ${fmt(toFree)} more for free delivery.</p>` : ""}
    <button class="btn btn-primary full" id="checkoutBtn">Checkout</button>`;
}

function applyCoupon(code) {
  code = code.trim().toUpperCase();
  if (!COUPONS[code]) { toast("Invalid coupon code"); return; }
  const sub = cartTotals().subtotal;
  if (COUPONS[code].calc(sub) === 0) { toast("Coupon not applicable to this cart"); return; }
  appliedCoupon = code; saveCart(); renderCart(); toast("Coupon applied");
}

function openCart() {
  const drawer = $("#cartDrawer");
  drawer.inert = false;                       // keep the closed drawer out of the tab order
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.classList.add("lock");
  $("#closeCart").focus();
}
function closeCart() {
  const drawer = $("#cartDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  drawer.inert = true;
  $("#overlay").hidden = true;
  document.body.classList.remove("lock");
}

/* ---------- Checkout ---------- */
function openCheckout() {
  const t = cartTotals();
  if (!t.items.length) return;
  closeCart();
  openModal(`
    <h2>Checkout</h2>
    <form id="checkoutForm" novalidate class="checkout">
      <div class="row">
        <label class="field">Full name<input id="cName" required autocomplete="name"><small class="err" data-for="cName"></small></label>
        <label class="field">Mobile<input id="cPhone" inputmode="numeric" maxlength="10" required autocomplete="tel"><small class="err" data-for="cPhone"></small></label>
      </div>
      <label class="field">Email<input id="cEmail" type="email" required autocomplete="email"><small class="err" data-for="cEmail"></small></label>
      <label class="field">Delivery address<textarea id="cAddress" rows="2" required autocomplete="street-address"></textarea><small class="err" data-for="cAddress"></small></label>
      <div class="row">
        <label class="field">City<input id="cCity" required autocomplete="address-level2"><small class="err" data-for="cCity"></small></label>
        <label class="field">PIN code<input id="cPin" inputmode="numeric" maxlength="6" required autocomplete="postal-code"><small class="err" data-for="cPin"></small></label>
      </div>
      <fieldset class="pay">
        <legend>Payment method (demo)</legend>
        <label><input type="radio" name="pay" value="UPI" checked> UPI</label>
        <label><input type="radio" name="pay" value="Card"> Card</label>
        <label><input type="radio" name="pay" value="Cash on delivery"> Cash on delivery</label>
      </fieldset>
      <div class="order-sum">
        <span>${t.items.length} item${t.items.length > 1 ? "s" : ""}</span><b>Total ${fmt(t.total)}</b>
      </div>
      <button class="btn btn-primary full" type="submit">Place order</button>
      <p class="hint">Demo only: no real payment is taken.</p>
    </form>`);
  $("#checkoutForm").addEventListener("submit", placeOrder);
}

function setErr(id, msg) { const el = $(`.err[data-for="${id}"]`); if (el) el.textContent = msg || ""; }

function placeOrder(e) {
  e.preventDefault();
  const v = (id) => $("#" + id).value.trim();
  const rules = [
    ["cName",    v("cName").length >= 3,                 "Enter your full name"],
    ["cPhone",   /^[6-9]\d{9}$/.test(v("cPhone")),       "Enter a valid 10-digit mobile number"],
    ["cEmail",   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("cEmail")), "Enter a valid email"],
    ["cAddress", v("cAddress").length >= 8,              "Enter your full address"],
    ["cCity",    v("cCity").length >= 2,                 "Enter your city"],
    ["cPin",     /^\d{6}$/.test(v("cPin")),              "PIN code must be 6 digits"]
  ];
  let ok = true;
  rules.forEach(([id, valid, msg]) => { setErr(id, valid ? "" : msg); if (!valid) ok = false; });
  if (!ok) return;

  const t = cartTotals();
  if (!t.items.length) { closeModal(); return; }
  const order = {
    id: "RB" + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    customer: v("cName"), city: v("cCity"),
    payment: $("input[name=pay]:checked").value,
    items: t.items.map((p) => ({ id: p.id, title: p.title, price: p.price })),
    total: t.total
  };
  const orders = store.get("orders", []); orders.push(order); store.set("orders", orders);

  const sold = store.get("sold", []);
  t.items.forEach((p) => { if (!sold.includes(p.id)) sold.push(p.id); });   // one-of-a-kind devices can't be sold twice
  store.set("sold", sold);
  cart = []; appliedCoupon = null; saveCart();
  compareIds = compareIds.filter((id) => !sold.includes(id));
  loadProducts(); renderProducts(); renderCart(); renderTray();
  const payLine = order.payment === "Cash on delivery"
    ? `You'll pay <b>${fmt(order.total)}</b> in cash when it arrives.`
    : `Total: <b>${fmt(order.total)}</b>, paid by ${esc(order.payment)}.`;
  openModal(`
    <div class="success">
      <div class="tick">✓</div>
      <h2>Order placed</h2>
      <p>Thanks, ${esc(order.customer.split(" ")[0])}. Your order <b>${order.id}</b> is confirmed.</p>
      <p>${payLine}</p>
      <p class="hint">It should reach ${esc(order.city)} in 3 to 5 working days.</p>
      <button class="btn btn-primary" id="doneBtn">Continue shopping</button>
    </div>`);
  $("#doneBtn").onclick = closeModal;
}

function setupCart() {
  $("#cartBtn").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);

  $("#cartItems").addEventListener("click", (e) => {
    const r = e.target.closest("[data-remove]");
    if (r) removeFromCart(+r.dataset.remove);
    if (e.target.closest("[data-close-cart]")) closeCart();
  });
  $("#cartFoot").addEventListener("click", (e) => {
    if (e.target.id === "checkoutBtn") openCheckout();
    if (e.target.id === "removeCoupon") { appliedCoupon = null; saveCart(); renderCart(); }
  });
  $("#cartFoot").addEventListener("submit", (e) => {
    if (e.target.id === "couponForm") { e.preventDefault(); applyCoupon($("#couponInput").value); }
  });
}
