/* ==========================================================================
   FERREMAX - JavaScript (Facturación)
   Author: Juan Gabriel Aragón
   ========================================================================== */

'use strict';

// Product catalog
const PRODUCTS = [
    { id: 1, name: 'Cemento Portland 42.5kg', price: 28.50, stock: 145, category: 'Construcción', unit: 'Bolsa' },
    { id: 2, name: 'Fierro Corrugado 1/2"', price: 34.00, stock: 230, category: 'Construcción', unit: 'Varilla' },
    { id: 3, name: 'Tubo PVC 2" x 3m', price: 18.90, stock: 89, category: 'Plomería', unit: 'Unidad' },
    { id: 4, name: 'Cable THW 14 AWG', price: 2.80, stock: 500, category: 'Eléctrico', unit: 'Metro' },
    { id: 5, name: 'Pintura Látex 4L Blanco', price: 45.00, stock: 62, category: 'Pinturas', unit: 'Galón' },
    { id: 6, name: 'Ladrillo King Kong 18H', price: 0.95, stock: 5000, category: 'Construcción', unit: 'Unidad' },
    { id: 7, name: 'Clavos 3" (1kg)', price: 8.50, stock: 120, category: 'Ferretería', unit: 'Kilo' },
    { id: 8, name: 'Disco de Corte 7"', price: 6.50, stock: 95, category: 'Herramientas', unit: 'Unidad' },
    { id: 9, name: 'Llave Mixta 12mm', price: 15.00, stock: 40, category: 'Herramientas', unit: 'Unidad' },
    { id: 10, name: 'Cinta Teflón', price: 2.50, stock: 200, category: 'Plomería', unit: 'Unidad' },
    { id: 11, name: 'Interruptor Simple', price: 12.00, stock: 75, category: 'Eléctrico', unit: 'Unidad' },
    { id: 12, name: 'Arena Fina m³', price: 65.00, stock: 30, category: 'Construcción', unit: 'm³' },
    { id: 13, name: 'Thinner 1L', price: 14.00, stock: 45, category: 'Pinturas', unit: 'Litro' },
    { id: 14, name: 'Tornillo 2" (100u)', price: 12.50, stock: 180, category: 'Ferretería', unit: 'Caja' },
    { id: 15, name: 'Silicona Tubo 280ml', price: 18.00, stock: 50, category: 'Ferretería', unit: 'Unidad' },
    { id: 16, name: 'Broca HSS 8mm', price: 8.00, stock: 65, category: 'Herramientas', unit: 'Unidad' },
];

// Invoice state
const Invoice = {
    items: [],
    counter: 0,
    client: { name: '', ruc: '', address: '' },
    invoiceNumber: 'F001-000' + Math.floor(Math.random() * 900 + 100),

    addItem(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.qty++;
            existingItem.subtotal = existingItem.qty * existingItem.price;
        } else {
            this.items.push({
                id: ++this.counter,
                productId: product.id,
                name: product.name,
                price: product.price,
                qty: 1,
                unit: product.unit,
                subtotal: product.price
            });
        }

        this.render();
        Toast.show('✅ ' + product.name + ' agregado');
    },

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.render();
    },

    updateQty(id, delta) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;
        item.qty = Math.max(1, item.qty + delta);
        item.subtotal = item.qty * item.price;
        this.render();
    },

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + item.subtotal, 0);
    },

    getIGV() {
        return this.getSubtotal() * 0.18;
    },

    getTotal() {
        return this.getSubtotal() + this.getIGV();
    },

    render() {
        const tbody = document.getElementById('invoice-items');
        const emptyState = document.getElementById('invoice-empty');
        const summaryEl = document.getElementById('invoice-summary');

        if (this.items.length === 0) {
            if (tbody) tbody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (summaryEl) {
                document.getElementById('subtotal-value').textContent = 'S/0.00';
                document.getElementById('igv-value').textContent = 'S/0.00';
                document.getElementById('total-value').textContent = 'S/0.00';
                document.getElementById('items-count').textContent = '0 items';
            }
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        if (tbody) {
            tbody.innerHTML = this.items.map(item => `
                <tr>
                    <td>
                        <div style="font-weight:500;">${item.name}</div>
                        <div style="font-size:11px; color:var(--text-muted);">${item.unit}</div>
                    </td>
                    <td>S/${item.price.toFixed(2)}</td>
                    <td>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="Invoice.updateQty(${item.id}, -1)">−</button>
                            <span style="min-width:24px; text-align:center;">${item.qty}</span>
                            <button class="qty-btn" onclick="Invoice.updateQty(${item.id}, 1)">+</button>
                        </div>
                    </td>
                    <td style="font-weight:600;">S/${item.subtotal.toFixed(2)}</td>
                    <td><button class="remove-btn" onclick="Invoice.removeItem(${item.id})">×</button></td>
                </tr>
            `).join('');
        }

        document.getElementById('subtotal-value').textContent = 'S/' + this.getSubtotal().toFixed(2);
        document.getElementById('igv-value').textContent = 'S/' + this.getIGV().toFixed(2);
        document.getElementById('total-value').textContent = 'S/' + this.getTotal().toFixed(2);
        document.getElementById('items-count').textContent = this.items.length + ' item' + (this.items.length > 1 ? 's' : '');
    },

    generateInvoice() {
        if (this.items.length === 0) {
            Toast.show('⚠️ Agrega productos a la factura');
            return;
        }

        const printContent = document.getElementById('print-content');
        printContent.innerHTML = `
            <div class="print-header">
                <div class="print-logo">🛠️ FERREMAX S.A.C.</div>
                <div class="print-info">RUC: 20456789012 | Av. Independencia 1420, Arequipa</div>
                <div class="print-info">Tel: +51 960 922 781 | juates1234@gmail.com</div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:16px; font-size:13px;">
                <div>
                    <strong>Cliente:</strong> ${document.getElementById('client-name').value || 'Cliente General'}<br>
                    <strong>RUC:</strong> ${document.getElementById('client-ruc').value || '—'}<br>
                    <strong>Dirección:</strong> ${document.getElementById('client-address').value || '—'}
                </div>
                <div style="text-align:right;">
                    <strong>Factura:</strong> ${this.invoiceNumber}<br>
                    <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')}<br>
                    <strong>Método:</strong> ${document.getElementById('payment-method').value}
                </div>
            </div>
            <table class="print-table">
                <thead><tr><th>Producto</th><th>P.Unit</th><th>Cant.</th><th>Subtotal</th></tr></thead>
                <tbody>
                    ${this.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>S/${item.price.toFixed(2)}</td>
                            <td>${item.qty}</td>
                            <td>S/${item.subtotal.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="text-align:right; margin-top:12px; font-size:14px;">
                <div>Subtotal: <strong>S/${this.getSubtotal().toFixed(2)}</strong></div>
                <div>IGV (18%): <strong>S/${this.getIGV().toFixed(2)}</strong></div>
                <div class="print-total">TOTAL: S/${this.getTotal().toFixed(2)}</div>
            </div>
            <div class="print-footer">
                Desarrollado por Juan Gabriel Aragón · juates1234@gmail.com · +51 960 922 781
            </div>
        `;

        document.getElementById('print-preview').classList.add('active');
    },

    closePrint() {
        document.getElementById('print-preview').classList.remove('active');
    },

    newInvoice() {
        this.items = [];
        this.counter = 0;
        this.invoiceNumber = 'F001-000' + Math.floor(Math.random() * 900 + 100);
        document.getElementById('invoice-number').textContent = this.invoiceNumber;
        document.getElementById('client-name').value = '';
        document.getElementById('client-ruc').value = '';
        document.getElementById('client-address').value = '';
        this.render();
        Toast.show('📄 Nueva factura creada');
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

// Product search
const Search = {
    init() {
        const input = document.getElementById('product-search');
        const results = document.getElementById('search-results');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 1) { results.innerHTML = ''; results.style.display = 'none'; return; }
            const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(query)).slice(0, 6);
            if (matches.length === 0) { results.innerHTML = '<div style="padding:12px; color:var(--text-muted);">Sin resultados</div>'; results.style.display = 'block'; return; }
            results.innerHTML = matches.map(p => `
                <div style="padding:10px 14px; cursor:pointer; display:flex; justify-content:space-between; border-bottom:1px solid var(--border); transition:background 0.2s;" 
                     onmouseover="this.style.background='var(--bg-glass-hover)'" 
                     onmouseout="this.style.background='transparent'"
                     onclick="Invoice.addItem(${p.id}); document.getElementById('product-search').value=''; document.getElementById('search-results').style.display='none';">
                    <div>
                        <div style="font-size:14px;">${p.name}</div>
                        <div style="font-size:11px; color:var(--text-muted);">${p.category} · Stock: ${p.stock}</div>
                    </div>
                    <div style="font-weight:600; color:var(--accent-light);">S/${p.price.toFixed(2)}</div>
                </div>
            `).join('');
            results.style.display = 'block';
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.product-search')) { results.style.display = 'none'; }
        });
    }
};

// Stats animation
const Stats = {
    animate() {
        document.querySelectorAll('[data-counter]').forEach(el => {
            const end = parseFloat(el.dataset.counter);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
            const duration = 1500;
            const start = 0;
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = start + (end - start) * ease;
                el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    }
};

// Sidebar toggle
const Sidebar = {
    init() {
        const toggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle) {
            toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
    }
};

// Navigation
const Nav = {
    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
};

// Quick products
const QuickProducts = {
    init() {
        const grid = document.getElementById('quick-products');
        if (!grid) return;
        const featured = PRODUCTS.slice(0, 6);
        grid.innerHTML = featured.map(p => `
            <div class="quick-product" onclick="Invoice.addItem(${p.id})">
                <div class="quick-product-name">${p.name}</div>
                <div class="quick-product-price">S/${p.price.toFixed(2)}</div>
                <div class="quick-product-stock">Stock: ${p.stock} ${p.unit}</div>
            </div>
        `).join('');
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    Search.init();
    Stats.animate();
    Sidebar.init();
    Nav.init();
    QuickProducts.init();
    Invoice.render();
    document.getElementById('invoice-number').textContent = Invoice.invoiceNumber;
    console.log('🛠️ FerreMax - Desarrollado por Juan Gabriel Aragón');
});
