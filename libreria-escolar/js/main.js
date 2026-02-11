/* ==========================================================================
   PAPELERÍA ESCOLAR - JavaScript (Inventario + Ventas)
   Author: Juan Gabriel Aragón
   ========================================================================== */

'use strict';

// Product Database
const PRODUCTS = [
    { id: 1, name: 'Cuaderno A4 Rayado 100h', sku: 'CUA-001', category: 'Cuadernos', price: 8.50, cost: 5.00, stock: 245, minStock: 30, icon: '📓', iconClass: 'blue' },
    { id: 2, name: 'Cuaderno A4 Cuadriculado 200h', sku: 'CUA-002', category: 'Cuadernos', price: 14.90, cost: 9.00, stock: 180, minStock: 25, icon: '📕', iconClass: 'blue' },
    { id: 3, name: 'Lápiz 2B Caja x12', sku: 'UTI-001', category: 'Útiles', price: 12.00, cost: 7.50, stock: 120, minStock: 20, icon: '✏️', iconClass: 'green' },
    { id: 4, name: 'Lapicero Azul x3', sku: 'UTI-002', category: 'Útiles', price: 5.50, cost: 3.00, stock: 340, minStock: 40, icon: '🖊️', iconClass: 'green' },
    { id: 5, name: 'Borrador Blanco Grande', sku: 'UTI-003', category: 'Útiles', price: 2.00, cost: 0.80, stock: 500, minStock: 50, icon: '🧹', iconClass: 'green' },
    { id: 6, name: 'Colores x24 Acuarelables', sku: 'ART-001', category: 'Arte', price: 28.00, cost: 18.00, stock: 65, minStock: 15, icon: '🎨', iconClass: 'pink' },
    { id: 7, name: 'Témperas x12 Colores', sku: 'ART-002', category: 'Arte', price: 18.50, cost: 11.00, stock: 48, minStock: 15, icon: '🖌️', iconClass: 'pink' },
    { id: 8, name: 'Mochila Escolar Reforzada', sku: 'MOC-001', category: 'Mochilas', price: 89.90, cost: 55.00, stock: 35, minStock: 10, icon: '🎒', iconClass: 'cyan' },
    { id: 9, name: 'Lonchera Térmica Infantil', sku: 'MOC-002', category: 'Mochilas', price: 45.00, cost: 28.00, stock: 22, minStock: 10, icon: '🧊', iconClass: 'cyan' },
    { id: 10, name: 'Cartuchera 2 Pisos', sku: 'MOC-003', category: 'Mochilas', price: 25.00, cost: 14.00, stock: 78, minStock: 15, icon: '✂️', iconClass: 'cyan' },
    { id: 11, name: 'Calculadora Científica', sku: 'TEC-001', category: 'Tecnología', price: 65.00, cost: 42.00, stock: 18, minStock: 8, icon: '🔢', iconClass: 'yellow' },
    { id: 12, name: 'USB 32GB Kingston', sku: 'TEC-002', category: 'Tecnología', price: 28.00, cost: 16.00, stock: 42, minStock: 10, icon: '💾', iconClass: 'yellow' },
    { id: 13, name: 'Regla 30cm Flex', sku: 'UTI-004', category: 'Útiles', price: 3.50, cost: 1.50, stock: 210, minStock: 30, icon: '📏', iconClass: 'green' },
    { id: 14, name: 'Tijera Escolar Punta Roma', sku: 'UTI-005', category: 'Útiles', price: 4.50, cost: 2.00, stock: 8, minStock: 20, icon: '✂️', iconClass: 'green' },
    { id: 15, name: 'Papel Bond A4 x500', sku: 'CUA-003', category: 'Cuadernos', price: 22.00, cost: 15.00, stock: 90, minStock: 20, icon: '📄', iconClass: 'blue' },
    { id: 16, name: 'Folder Manila A4 x25', sku: 'UTI-006', category: 'Útiles', price: 8.00, cost: 5.00, stock: 155, minStock: 25, icon: '📁', iconClass: 'green' },
    { id: 17, name: 'Plastilina x12 Colores', sku: 'ART-003', category: 'Arte', price: 6.50, cost: 3.50, stock: 12, minStock: 20, icon: '🟡', iconClass: 'pink' },
    { id: 18, name: 'Corrector Liquid Paper', sku: 'UTI-007', category: 'Útiles', price: 5.00, cost: 2.50, stock: 4, minStock: 15, icon: '🔲', iconClass: 'green' },
];

// Recent sales (simulated)
const RECENT_SALES = [
    { product: 'Mochila Escolar Reforzada', qty: 2, total: 179.80, time: 'Hace 5 min', icon: '🎒', iconClass: 'cyan' },
    { product: 'Cuaderno A4 Rayado x10', qty: 10, total: 85.00, time: 'Hace 20 min', icon: '📓', iconClass: 'blue' },
    { product: 'Colores x24 Acuarelables', qty: 3, total: 84.00, time: 'Hace 45 min', icon: '🎨', iconClass: 'pink' },
    { product: 'Lápiz 2B Caja x12', qty: 5, total: 60.00, time: 'Hace 1 hora', icon: '✏️', iconClass: 'green' },
    { product: 'Calculadora Científica', qty: 1, total: 65.00, time: 'Hace 2 horas', icon: '🔢', iconClass: 'yellow' },
];

// App State
const App = {
    currentTab: 'todos',
    searchQuery: '',

    init() {
        this.renderProducts();
        this.renderRecentSales();
        this.renderLowStockAlerts();
        this.animateStats();
        this.initTabs();
        this.initSearch();
        this.initSidebar();
        this.initNav();
        console.log('📚 Papelería Escolar - Desarrollado por Juan Gabriel Aragón');
    },

    renderProducts() {
        const tbody = document.getElementById('products-tbody');
        if (!tbody) return;

        let filtered = [...PRODUCTS];

        // Filter by tab
        if (this.currentTab !== 'todos') {
            const catMap = {
                'cuadernos': 'Cuadernos',
                'utiles': 'Útiles',
                'arte': 'Arte',
                'mochilas': 'Mochilas',
                'tecnologia': 'Tecnología'
            };
            filtered = filtered.filter(p => p.category === catMap[this.currentTab]);
        }

        // Filter by search
        if (this.searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.sku.toLowerCase().includes(this.searchQuery) ||
                p.category.toLowerCase().includes(this.searchQuery)
            );
        }

        const catClassMap = {
            'Cuadernos': 'cat-cuadernos',
            'Útiles': 'cat-utiles',
            'Arte': 'cat-arte',
            'Mochilas': 'cat-mochilas',
            'Tecnología': 'cat-tecnologia'
        };

        tbody.innerHTML = filtered.map(p => {
            const stockPct = Math.min(100, (p.stock / (p.minStock * 4)) * 100);
            const stockClass = p.stock <= p.minStock * 0.5 ? 'low' : p.stock <= p.minStock ? 'mid' : 'high';
            const statusText = p.stock <= p.minStock * 0.5 ? 'Agotado' : p.stock <= p.minStock ? 'Bajo' : 'En Stock';
            const statusClass = p.stock <= p.minStock * 0.5 ? 'status-out' : p.stock <= p.minStock ? 'status-low' : 'status-in';

            return `
                <tr>
                    <td>
                        <div class="product-info">
                            <div class="product-img ${p.iconClass}">${p.icon}</div>
                            <div>
                                <div class="product-name">${p.name}</div>
                                <div class="product-sku">${p.sku}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="category-badge ${catClassMap[p.category]}">${p.category}</span></td>
                    <td style="font-weight:600;">S/${p.price.toFixed(2)}</td>
                    <td>S/${p.cost.toFixed(2)}</td>
                    <td>
                        <div>${p.stock} uds.</div>
                        <div class="stock-bar"><div class="stock-bar-fill ${stockClass}" style="width:${stockPct}%"></div></div>
                    </td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="action-btn edit" title="Editar" onclick="App.editProduct(${p.id})">✏️</button>
                        <button class="action-btn delete" title="Eliminar" onclick="App.deleteProduct(${p.id})">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Update count
        const countEl = document.getElementById('products-count');
        if (countEl) countEl.textContent = filtered.length + ' productos';
    },

    renderRecentSales() {
        const container = document.getElementById('recent-sales');
        if (!container) return;

        container.innerHTML = RECENT_SALES.map(sale => `
            <div class="sale-item">
                <div class="sale-left">
                    <div class="sale-icon ${sale.iconClass}" style="background: var(--${sale.iconClass === 'blue' ? 'accent' : sale.iconClass === 'green' ? 'success' : sale.iconClass === 'pink' ? 'pink' : sale.iconClass === 'cyan' ? 'cyan' : 'warning'}-glow);">${sale.icon}</div>
                    <div>
                        <div class="sale-name">${sale.product}</div>
                        <div class="sale-time">${sale.time} · ${sale.qty} uds.</div>
                    </div>
                </div>
                <div class="sale-amount">+S/${sale.total.toFixed(2)}</div>
            </div>
        `).join('');
    },

    renderLowStockAlerts() {
        const container = document.getElementById('low-stock-alerts');
        if (!container) return;

        const lowStock = PRODUCTS.filter(p => p.stock <= p.minStock).sort((a, b) => a.stock - b.stock);

        container.innerHTML = lowStock.map(p => `
            <div class="alert-item">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span>${p.icon}</span>
                    <div class="alert-name">${p.name}</div>
                </div>
                <span class="alert-stock ${p.stock <= p.minStock * 0.5 ? 'critical' : 'low'}">${p.stock} uds.</span>
            </div>
        `).join('');
    },

    animateStats() {
        document.querySelectorAll('[data-counter]').forEach(el => {
            const end = parseFloat(el.dataset.counter);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
            const duration = 1500;
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = end * ease;
                el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    },

    initTabs() {
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.renderProducts();
            });
        });
    },

    initSearch() {
        const input = document.getElementById('search-products');
        if (input) {
            input.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderProducts();
            });
        }
    },

    initSidebar() {
        const toggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle) {
            toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
    },

    initNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            });
        });
    },

    // Modal
    openModal() {
        document.getElementById('product-modal').classList.add('active');
    },

    closeModal() {
        document.getElementById('product-modal').classList.remove('active');
        document.getElementById('modal-form').reset();
    },

    saveProduct() {
        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const cost = parseFloat(document.getElementById('p-cost').value);
        const stock = parseInt(document.getElementById('p-stock').value);
        const category = document.getElementById('p-category').value;

        if (!name || isNaN(price) || isNaN(stock)) {
            Toast.show('⚠️ Completa todos los campos');
            return;
        }

        const iconMap = { 'Cuadernos': '📓', 'Útiles': '✏️', 'Arte': '🎨', 'Mochilas': '🎒', 'Tecnología': '🔢' };
        const classMap = { 'Cuadernos': 'blue', 'Útiles': 'green', 'Arte': 'pink', 'Mochilas': 'cyan', 'Tecnología': 'yellow' };

        PRODUCTS.push({
            id: PRODUCTS.length + 1,
            name,
            sku: category.substring(0, 3).toUpperCase() + '-' + String(PRODUCTS.length + 1).padStart(3, '0'),
            category,
            price,
            cost: cost || price * 0.6,
            stock,
            minStock: Math.ceil(stock * 0.15),
            icon: iconMap[category] || '📦',
            iconClass: classMap[category] || 'blue'
        });

        this.renderProducts();
        this.renderLowStockAlerts();
        this.closeModal();
        Toast.show('✅ Producto agregado exitosamente');
    },

    editProduct(id) {
        Toast.show('✏️ Función de edición (demo)');
    },

    deleteProduct(id) {
        const idx = PRODUCTS.findIndex(p => p.id === id);
        if (idx !== -1) {
            const name = PRODUCTS[idx].name;
            PRODUCTS.splice(idx, 1);
            this.renderProducts();
            this.renderLowStockAlerts();
            Toast.show('🗑️ ' + name + ' eliminado');
        }
    }
};

// Toast
const Toast = {
    timeout: null,
    show(message) {
        const el = document.getElementById('toast');
        document.getElementById('toast-msg').textContent = message;
        el.classList.add('show');
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => el.classList.remove('show'), 2500);
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => App.init());
