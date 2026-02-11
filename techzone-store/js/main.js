/* ==========================================================================
   TECHZONE - E-commerce JavaScript
   Version: 1.0.0
   ========================================================================== */

'use strict';

/* ==========================================================================
   CART STATE
   ========================================================================== */
const Cart = {
    items: [],

    add(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ ...product, qty: 1 });
        }
        this.save();
        this.updateUI();
        this.showToast(`${product.name} añadido al carrito`);
    },

    remove(id) {
        const itemEl = document.querySelector(`[data-cart-item="${id}"]`);
        if (itemEl) {
            itemEl.classList.add('removing');
            setTimeout(() => {
                this.items = this.items.filter(item => item.id !== id);
                this.save();
                this.updateUI();
            }, 300);
        }
    },

    updateQty(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                this.remove(id);
            } else {
                this.save();
                this.updateUI();
            }
        }
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    },

    getCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    },

    save() {
        localStorage.setItem('techzone_cart', JSON.stringify(this.items));
    },

    load() {
        const saved = localStorage.getItem('techzone_cart');
        if (saved) this.items = JSON.parse(saved);
        this.updateUI();
    },

    updateUI() {
        // Update cart badge
        const badges = document.querySelectorAll('.cart-count');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
            badge.classList.add('cart-badge');
            setTimeout(() => badge.classList.remove('cart-badge'), 500);
        });

        // Update cart sidebar
        this.renderCartItems();

        // Update total
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = `S/${this.getTotal().toFixed(2)}`;

        // Update checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.disabled = this.items.length === 0;
    },

    renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <span class="text-6xl mb-4 block">🛒</span>
                    <p class="text-gray-500">Tu carrito está vacío</p>
                    <p class="text-sm text-gray-400 mt-2">¡Agrega productos para comenzar!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item flex gap-4 p-4 border-b border-gray-100" data-cart-item="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg bg-gray-100">
                <div class="flex-1">
                    <h4 class="font-medium text-sm text-gray-800 line-clamp-2">${item.name}</h4>
                    <p class="text-blue-600 font-bold mt-1">S/${item.price.toFixed(2)}</p>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center border border-gray-200 rounded-lg">
                            <button onclick="Cart.updateQty(${item.id}, -1)" class="qty-btn w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white rounded-l-lg">−</button>
                            <span class="w-10 text-center text-sm font-medium">${item.qty}</span>
                            <button onclick="Cart.updateQty(${item.id}, 1)" class="qty-btn w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white rounded-r-lg">+</button>
                        </div>
                        <button onclick="Cart.remove(${item.id})" class="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
};

/* ==========================================================================
   CART SIDEBAR
   ========================================================================== */
const CartSidebar = {
    open() {
        document.getElementById('cart-overlay').classList.add('active');
        document.getElementById('cart-sidebar').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        document.getElementById('cart-overlay').classList.remove('active');
        document.getElementById('cart-sidebar').classList.remove('active');
        document.body.style.overflow = '';
    },

    init() {
        document.querySelectorAll('.cart-trigger').forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });

        document.getElementById('cart-overlay')?.addEventListener('click', () => this.close());
        document.getElementById('close-cart')?.addEventListener('click', () => this.close());
    }
};

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
const MobileMenu = {
    isOpen: false,
    toggle() {
        this.isOpen = !this.isOpen;
        const menu = document.getElementById('mobile-menu');
        const icon = document.getElementById('menu-icon');
        const close = document.getElementById('close-icon');

        if (this.isOpen) {
            menu.classList.remove('hidden');
            setTimeout(() => menu.classList.add('visible'), 10);
            icon.classList.add('hidden');
            close.classList.remove('hidden');
        } else {
            menu.classList.remove('visible');
            setTimeout(() => menu.classList.add('hidden'), 300);
            icon.classList.remove('hidden');
            close.classList.add('hidden');
        }
    },
    init() {
        document.getElementById('menu-toggle')?.addEventListener('click', () => this.toggle());
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => { this.isOpen = false; this.toggle(); });
        });
    }
};

/* ==========================================================================
   HEADER SCROLL
   ========================================================================== */
const HeaderScroll = {
    init() {
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
};

/* ==========================================================================
   SCROLL TO TOP
   ========================================================================== */
const ScrollToTop = {
    init() {
        const btn = document.getElementById('scroll-top-btn');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

/* ==========================================================================
   PRODUCT INTERACTIONS
   ========================================================================== */
const Products = {
    addToCart(id, name, price, image) {
        Cart.add({ id, name, price, image });

        // Animate button
        const btn = document.querySelector(`[data-product-btn="${id}"]`);
        if (btn) {
            btn.classList.add('added');
            btn.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Añadido';

            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Añadir';
            }, 2000);
        }
    }
};

/* ==========================================================================
   COUNTDOWN TIMER
   ========================================================================== */
const CountdownTimer = {
    init() {
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours

        const update = () => {
            const now = new Date().getTime();
            const diff = endTime - now;

            if (diff <= 0) return;

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            const hoursEl = document.getElementById('timer-hours');
            const minsEl = document.getElementById('timer-mins');
            const secsEl = document.getElementById('timer-secs');

            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
            if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
        };

        update();
        setInterval(update, 1000);
    }
};

/* ==========================================================================
   SEARCH
   ========================================================================== */
const Search = {
    init() {
        const input = document.getElementById('search-input');
        if (!input) return;

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    Cart.showToast(`Buscando: "${query}"...`);
                }
            }
        });
    }
};

/* ==========================================================================
   INIT ALL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ once: true, offset: 80, duration: 700, easing: 'ease-out-cubic' });

    Cart.load();
    CartSidebar.init();
    MobileMenu.init();
    HeaderScroll.init();
    ScrollToTop.init();
    CountdownTimer.init();
    Search.init();

    console.log('🛒 TechZone Store - Cargado');
});
