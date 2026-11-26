# ReBoot – Second-hand Electronics & Refurbished Laptop Marketplace

ReBoot is a website for buying and selling second-hand electronics and refurbished laptops. Every device has a condition grade, clear warranty info and shows how much cheaper it is than the original price.

## Problem
Buying used electronics is a gamble: you often can't tell what condition it's really in, there's no warranty, and the price is a guess. ReBoot grades every device on the same scale, shows what you save, and gives sellers a price helper so they don't have to guess either.

## Features
- Catalogue of 16 devices across 6 categories (laptops, phones, tablets, cameras, consoles, audio)
- Live search, category chips, condition, max-price, warranty-only and saved-only filters, and 5 sort options
- Product detail view with specs, condition-grade explanation, savings and warranty
- Saved items (wishlist) and side-by-side comparison of up to 3 devices, with the best values highlighted
- Cart with coupons (`REBOOT10`, `WELCOME500`), free delivery on orders of ₹10,000 or more, checkout form with validation, and an order confirmation
- Sell form with validation and a price helper (depreciation by age and condition); new listings appear in the shop immediately
- Every device is a single piece: once it's ordered it is marked **Sold** and can't be bought again
- Works on phones and desktops, can be used with a keyboard, and keeps your data in `localStorage` (the footer has a **Reset demo data** button)

## Tech
HTML5, CSS3 (Grid/Flexbox, custom properties), vanilla JavaScript. No frameworks, no backend and no build step.

## Project structure
```
index.html
css/style.css
js/data.js       catalogue, constants, coupons
js/utils.js      helpers (formatting, storage, modal, toast)
js/products.js   filters, sorting, product cards, detail view, wishlist
js/cart.js       cart, coupons, checkout, orders
js/compare.js    comparison tray and table
js/sell.js       sell form, validation, price helper
js/main.js       start-up and shared events
```

## Run locally
Open `index.html` in a browser. No installation needed.

## Deploy (GitHub Pages)
Repo → Settings → Pages → Deploy from branch → `main` / `(root)`.

> Demo project: no real payments are processed.
