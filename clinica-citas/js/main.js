/* VitaSalud - JS | Author: Juan Gabriel Aragón */
'use strict';

const Clinic = {
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,

    init() {
        this.renderCalendar();
        this.initDoctors();
        this.initTimeSlots();
        this.initNav();
        this.initSidebar();
        this.animateStats();
        console.log('🏥 VitaSalud - Desarrollado por Juan Gabriel Aragón');
    },

    renderCalendar() {
        const grid = document.getElementById('cal-grid');
        if (!grid) return;
        const days = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
        let html = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');

        // February 2026
        const blanks = 6; // Feb 1 2026 is Sunday, but Mon-first so 6 blanks
        for (let i = 0; i < blanks; i++) html += '<div class="cal-day disabled"></div>';
        for (let d = 1; d <= 28; d++) {
            const past = d < 10;
            const today = d === 10;
            const cls = past ? 'disabled' : today ? 'today' : '';
            html += `<div class="cal-day ${cls}" onclick="Clinic.selectDate(this, ${d})">${d}</div>`;
        }
        grid.innerHTML = html;
    },

    selectDate(el, day) {
        document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        this.selectedDate = `${day}/02/2026`;
    },

    initDoctors() {
        document.querySelectorAll('.doctor-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedDoctor = card.dataset.name;
            });
        });
    },

    initTimeSlots() {
        document.querySelectorAll('.time-slot:not(.taken)').forEach(slot => {
            slot.addEventListener('click', () => {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                this.selectedTime = slot.textContent;
            });
        });
    },

    animateStats() {
        document.querySelectorAll('[data-counter]').forEach(el => {
            const end = parseFloat(el.dataset.counter);
            const prefix = el.dataset.prefix || '';
            const duration = 1500;
            const startTime = performance.now();
            const update = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = prefix + Math.floor(end * ease).toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    },

    initNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            });
        });
    },

    initSidebar() {
        const toggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
};

document.addEventListener('DOMContentLoaded', () => Clinic.init());
