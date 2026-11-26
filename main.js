/* main.js - start-up, navigation, shared events */

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupFilters();
  setupCompare();
  setupCart();
  setupSell();

  $("#gradeGrid").innerHTML = Object.entries(CONDITIONS).map(([name, g]) => `
    <div class="grade"><span class="tag cond-${name.replace(" ", "")}">${name}</span><p>${g.text}</p></div>`).join("");

  renderProducts();
  renderCart();
  renderTray();

  // reset demo data (handy before recording the video / the viva)
  $("#resetDemo").addEventListener("click", () => {
    if (!confirm("Clear saved items, cart, orders and your listings in this browser?")) return;
    ["wishlist", "cart", "coupon", "orders", "userListings", "sold", "lastId"].forEach((k) => {
      try { localStorage.removeItem("reboot_" + k); } catch (e) { /* ignore */ }
    });
    location.reload();
  });

  // modal close
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (!$("#modal").hidden) closeModal(); else closeCart(); }
  });

  // mobile nav
  const toggle = $("#navToggle"), links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", () => { links.classList.remove("open"); toggle.setAttribute("aria-expanded", false); });
});
