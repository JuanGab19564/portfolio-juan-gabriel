/* RapidFood - JS | Author: Juan Gabriel Aragón */
'use strict';

const App = {
    init() {
        this.initCategories();
        this.initAddButtons();
        console.log('🍔 RapidFood - Desarrollado por Juan Gabriel Aragón');
    },

    initCategories() {
        document.querySelectorAll('.cat-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            });
        });
    },

    initAddButtons() {
        document.querySelectorAll('.item-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const badge = document.getElementById('cart-count');
                let count = parseInt(badge.textContent) + 1;
                badge.textContent = count;
                btn.textContent = '✓';
                btn.style.background = 'var(--green)';
                setTimeout(() => {
                    btn.textContent = '+';
                    btn.style.background = '';
                }, 800);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
