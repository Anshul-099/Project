/* data.js - catalogue and constants (shared by all modules) */

const CATEGORIES = [
  { name: "Laptops",     icon: "💻", tint: ["#d9f0e8", "#b4e0d0"] },
  { name: "Smartphones", icon: "📱", tint: ["#e3e8fb", "#c5cef5"] },
  { name: "Tablets",     icon: "📲", tint: ["#fdebd3", "#f9d3a4"] },
  { name: "Cameras",     icon: "📷", tint: ["#f6e0e6", "#eebdca"] },
  { name: "Consoles",    icon: "🎮", tint: ["#e6defa", "#cdbdf2"] },
  { name: "Audio",       icon: "🎧", tint: ["#dcf1f7", "#b3dfec"] }
];

const CONDITIONS = {
  "Like New":  { rank: 4, text: "Barely used. No visible marks, battery at 90%+ health." },
  "Excellent": { rank: 3, text: "Very light signs of use, only visible up close. Battery 85%+." },
  "Good":      { rank: 2, text: "Minor scratches or scuffs. Fully functional. Battery 75%+." },
  "Fair":      { rank: 1, text: "Visible wear and cosmetic marks, but everything works. The cheapest way in." }
};

/* warranty = months; refurbished = professionally restored by ReBoot */
const SEED_PRODUCTS = [
  { id: 1,  title: "MacBook Air M1 (8GB, 256GB)", brand: "Apple", category: "Laptops", condition: "Excellent", price: 52999, original: 92900, warranty: 6, refurbished: true, rating: 4.8, reviews: 214, city: "Delhi", seller: "ReBoot Certified",
    specs: { Processor: "Apple M1", RAM: "8 GB", Storage: "256 GB SSD", Display: "13.3\" Retina", Battery: "89% health" }, desc: "Fanless and silent, and the battery easily lasts a working day. Fully tested." },
  { id: 2,  title: "Dell Latitude 5420 (i5 11th Gen, 16GB, 512GB)", brand: "Dell", category: "Laptops", condition: "Good", price: 28499, original: 78000, warranty: 6, refurbished: true, rating: 4.5, reviews: 342, city: "Bengaluru", seller: "ReBoot Certified",
    specs: { Processor: "Intel i5-1145G7", RAM: "16 GB", Storage: "512 GB SSD", Display: "14\" FHD", Battery: "78% health" }, desc: "Sturdy business laptop that suits college work and coding." },
  { id: 3,  title: "HP Pavilion 15 (Ryzen 5, 8GB, 512GB)", brand: "HP", category: "Laptops", condition: "Excellent", price: 31999, original: 64990, warranty: 6, refurbished: true, rating: 4.4, reviews: 128, city: "Mumbai", seller: "ReBoot Certified",
    specs: { Processor: "Ryzen 5 5500U", RAM: "8 GB", Storage: "512 GB SSD", Display: "15.6\" FHD", Battery: "86% health" }, desc: "Big 15.6-inch screen and a quick SSD. Does everyday jobs without fuss." },
  { id: 4,  title: "Lenovo ThinkPad T480 (i7, 16GB, 512GB)", brand: "Lenovo", category: "Laptops", condition: "Fair", price: 21999, original: 95000, warranty: 3, refurbished: true, rating: 4.3, reviews: 96, city: "Pune", seller: "ReBoot Certified",
    specs: { Processor: "Intel i7-8550U", RAM: "16 GB", Storage: "512 GB SSD", Display: "14\" FHD", Battery: "Dual battery, 72%" }, desc: "Great keyboard and a tough body. The lid has some cosmetic wear." },
  { id: 5,  title: "ASUS TUF Gaming F15 (i5, GTX 1650, 16GB)", brand: "ASUS", category: "Laptops", condition: "Good", price: 38999, original: 79990, warranty: 3, refurbished: false, rating: 4.6, reviews: 77, city: "Hyderabad", seller: "Rohit M.",
    specs: { Processor: "Intel i5-10300H", RAM: "16 GB", Storage: "512 GB SSD", Display: "15.6\" 144Hz", Battery: "77% health" }, desc: "Runs current games at 1080p. Original charger and box included." },
  { id: 6,  title: "iPhone 12 (128GB)", brand: "Apple", category: "Smartphones", condition: "Excellent", price: 31499, original: 79900, warranty: 6, refurbished: true, rating: 4.7, reviews: 402, city: "Delhi", seller: "ReBoot Certified",
    specs: { Chipset: "A14 Bionic", Storage: "128 GB", Display: "6.1\" OLED", Camera: "12MP dual", Battery: "88% health" }, desc: "Battery health checked and only genuine parts used." },
  { id: 7,  title: "Samsung Galaxy S21 FE (8GB, 128GB)", brand: "Samsung", category: "Smartphones", condition: "Good", price: 19999, original: 54999, warranty: 3, refurbished: true, rating: 4.4, reviews: 188, city: "Chennai", seller: "ReBoot Certified",
    specs: { Chipset: "Snapdragon 888", Storage: "128 GB", Display: "6.4\" AMOLED 120Hz", Camera: "12MP triple", Battery: "82% health" }, desc: "Fast chip and a smooth 120Hz screen for far less than it cost new." },
  { id: 8,  title: "OnePlus 9R (8GB, 128GB)", brand: "OnePlus", category: "Smartphones", condition: "Fair", price: 13499, original: 39999, warranty: 0, refurbished: false, rating: 4.1, reviews: 41, city: "Jalandhar", seller: "Karan S.",
    specs: { Chipset: "Snapdragon 870", Storage: "128 GB", Display: "6.55\" AMOLED 120Hz", Camera: "48MP triple", Battery: "76% health" }, desc: "Light scratches on frame. Charger included." },
  { id: 9,  title: "iPad 9th Gen (64GB, Wi-Fi)", brand: "Apple", category: "Tablets", condition: "Like New", price: 17999, original: 29900, warranty: 6, refurbished: true, rating: 4.8, reviews: 156, city: "Gurugram", seller: "ReBoot Certified",
    specs: { Chipset: "A13 Bionic", Storage: "64 GB", Display: "10.2\" Retina", Connectivity: "Wi-Fi", Battery: "94% health" }, desc: "Good for notes and studying. Works with the 1st-gen Apple Pencil." },
  { id: 10, title: "Samsung Galaxy Tab S6 Lite (4GB, 64GB)", brand: "Samsung", category: "Tablets", condition: "Good", price: 12499, original: 27999, warranty: 3, refurbished: true, rating: 4.2, reviews: 63, city: "Kolkata", seller: "ReBoot Certified",
    specs: { Chipset: "Exynos 9611", Storage: "64 GB", Display: "10.4\" TFT", Connectivity: "Wi-Fi", Battery: "80% health" }, desc: "S Pen included. Light enough to carry around all day." },
  { id: 11, title: "Canon EOS 200D II (18-55mm kit)", brand: "Canon", category: "Cameras", condition: "Excellent", price: 36999, original: 62995, warranty: 3, refurbished: true, rating: 4.7, reviews: 52, city: "Mumbai", seller: "ReBoot Certified",
    specs: { Sensor: "24.1MP APS-C", Video: "Full HD 60p", Shutter: "~6,200 actuations", Lens: "18-55mm STM", Battery: "LP-E17 included" }, desc: "Compact DSLR with a flip-out screen, handy for vlogging." },
  { id: 12, title: "Sony WH-1000XM4 Headphones", brand: "Sony", category: "Audio", condition: "Excellent", price: 12999, original: 29990, warranty: 3, refurbished: true, rating: 4.8, reviews: 301, city: "Delhi", seller: "ReBoot Certified",
    specs: { Type: "Over-ear ANC", Battery: "30 hours", Connectivity: "Bluetooth 5.0", Included: "Case + cable", Cushions: "Replaced" }, desc: "Strong noise cancelling. New ear cushions have been fitted." },
  { id: 13, title: "Apple AirPods Pro (2nd Gen)", brand: "Apple", category: "Audio", condition: "Like New", price: 15499, original: 26900, warranty: 6, refurbished: true, rating: 4.7, reviews: 119, city: "Bengaluru", seller: "ReBoot Certified",
    specs: { Type: "In-ear ANC", Battery: "6 h (30 h with case)", Connectivity: "Bluetooth 5.3", Case: "MagSafe charging case", Tips: "New set" }, desc: "Cleaned, battery tested and sold with a fresh set of ear tips." },
  { id: 14, title: "PlayStation 4 Slim (1TB) + 1 Controller", brand: "Sony", category: "Consoles", condition: "Good", price: 17499, original: 32990, warranty: 3, refurbished: true, rating: 4.6, reviews: 90, city: "Pune", seller: "ReBoot Certified",
    specs: { Storage: "1 TB", Output: "1080p HDMI", Controllers: "1 DualShock 4", Included: "HDMI + power cable", Fan: "Cleaned, re-pasted" }, desc: "Cleaned inside, fresh thermal paste, ready to play." },
  { id: 15, title: "Nintendo Switch (V2, Neon)", brand: "Nintendo", category: "Consoles", condition: "Excellent", price: 18999, original: 29999, warranty: 3, refurbished: true, rating: 4.7, reviews: 133, city: "Mumbai", seller: "ReBoot Certified",
    specs: { Storage: "32 GB", Display: "6.2\" touch", Battery: "4.5-9 h", Included: "Dock + Joy-Cons", Drift: "None" }, desc: "Joy-Cons tested for drift. Includes dock and charger." },
  { id: 16, title: "GoPro HERO9 Black", brand: "GoPro", category: "Cameras", condition: "Good", price: 14999, original: 39500, warranty: 0, refurbished: false, rating: 4.3, reviews: 38, city: "Chandigarh", seller: "Neha K.",
    specs: { Video: "5K 30p", Photo: "20MP", Screen: "Front + rear", Included: "2 batteries", Waterproof: "10 m" }, desc: "Used on two treks. Two batteries and mount kit included." }
];

const COUPONS = {
  REBOOT10:   { label: "10% off (max ₹2,000)", calc: (sub) => Math.min(Math.round(sub * 0.10), 2000) },
  WELCOME500: { label: "₹500 off orders of ₹15,000 or more", calc: (sub) => (sub >= 15000 ? 500 : 0) }
};

const MAX_LISTING_PRICE = 1000000;
const FREE_DELIVERY_ABOVE = 10000;
const DELIVERY_FEE = 199;
