/* ==========================================================================
   DASHBOARD ANALYTICS - JavaScript
   ========================================================================== */

'use strict';

/* Sidebar Toggle */
const MobileMenu = {
    init() {
        const toggle = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        toggle?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay?.classList.toggle('active');
        });

        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
};

/* Active Nav Item */
const Navigation = {
    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
};

/* Animate Stats on Load */
const AnimateStats = {
    animateValue(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * easeOut);

            element.textContent = this.formatNumber(current, element.dataset.format);

            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    },

    formatNumber(num, format) {
        if (format === 'currency') return 'S/' + num.toLocaleString();
        if (format === 'percent') return num + '%';
        return num.toLocaleString();
    },

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const end = parseInt(el.dataset.value);
                    this.animateValue(el, 0, end, 1500);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-value]').forEach(el => observer.observe(el));
    }
};

/* Chart Bars Animation */
const ChartAnimation = {
    init() {
        const bars = document.querySelectorAll('.chart-bar');
        const heights = [65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65, 95];

        bars.forEach((bar, i) => {
            setTimeout(() => {
                bar.style.height = heights[i % heights.length] + '%';
            }, i * 100);
        });
    }
};

/* Chart Tabs */
const ChartTabs = {
    init() {
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                ChartAnimation.init();
            });
        });
    }
};

/* Dark/Light Mode */
const ThemeToggle = {
    init() {
        const btn = document.getElementById('theme-toggle');
        btn?.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }
};

/* Notifications */
const Notifications = {
    show(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✓</span> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

/* Search */
const Search = {
    init() {
        const input = document.querySelector('.search-box input');
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                Notifications.show(`Buscando: "${input.value}"`);
            }
        });
    }
};

/* Init All */
document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
    Navigation.init();
    AnimateStats.init();
    ChartAnimation.init();
    ChartTabs.init();
    ThemeToggle.init();
    Search.init();

    console.log('📊 Dashboard Analytics - Cargado');
});
