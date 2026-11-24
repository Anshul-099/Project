# ReBoot – Second-hand Electronics & Refurbished Laptop Marketplace

CSE326 Project-Based Assessment · **Group 8** · Lovely Professional University

| Member | Reg. No | Roll No |
|---|---|---|
| Anshul Narayan Singh | 12622239 | RK4P26ARA22 |
| Granth Gaur | 12623291 | RK4P26ARA23 |
| Ritvik Khajuria | 12623512 | RK4P26ARA24 |

## Problem
Buying used electronics is risky: unclear condition, no warranty, unfair pricing. ReBoot is a marketplace where every device carries a standard condition grade, warranty information and a transparent discount against the original price, and where people can sell their own devices with a fair-price helper.

## Features
- Catalogue of 16 devices across 6 categories (laptops, phones, tablets, cameras, consoles, audio)
- Live search, category chips, condition, max-price, warranty-only and saved-only filters, 5 sort options
- Product detail view with specs, condition-grade explanation, savings and warranty
- Saved items (wishlist) and side-by-side comparison of up to 3 devices (best values highlighted)
- Cart with coupons (`REBOOT10`, `WELCOME500`), free-delivery threshold, validated checkout and order confirmation
- Sell form with validation and a price helper (depreciation by age and condition); new listings appear in the shop immediately
- Each device is one-of-a-kind: after an order it is marked **Sold** and can't be bought again
- Responsive layout, keyboard accessible, data persisted in `localStorage` (footer has a **Reset demo data** button)

## Tech
HTML5, CSS3 (Grid/Flexbox, custom properties), vanilla JavaScript (no frameworks or build step).

## Structure
```
index.html
css/style.css
js/data.js       catalogue, constants, coupons
js/utils.js      helpers (formatting, storage, modal, toast)
js/products.js   filters, sorting, product cards, detail view, wishlist   (Member 1)
js/cart.js       cart, coupons, checkout, orders                          (Member 2)
js/compare.js    comparison tray and table                                (Member 3)
js/sell.js       sell form, validation, price helper                      (Member 3)
js/main.js       start-up and shared events
```

## Run locally
Open `index.html` in a browser. No install needed.

## Deploy (GitHub Pages)
Repo → Settings → Pages → Deploy from branch → `main` / `(root)`.

> Demo project: no real payments are processed.
