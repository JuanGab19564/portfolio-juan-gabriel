/* ==========================================================================
   COLEGIO INNOVAR - JavaScript
   Author: Juan Gabriel Aragón
   ========================================================================== */

'use strict';

/* Navigation Scroll Effect */
const NavScroll = {
    init() {
        const nav = document.querySelector('.nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });
    }
};

/* Smooth Scroll */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const navHeight = document.querySelector('.nav').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            });
        });
    }
};

/* Animate on Scroll */
const AnimateOnScroll = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.feature-card, .level-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

/* Counter Animation */
const CounterAnimation = {
    animateValue(el, end, duration, suffix = '') {
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    },

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = parseInt(entry.target.dataset.value);
                    const suffix = entry.target.dataset.suffix || '';
                    this.animateValue(entry.target, value, 2000, suffix);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-value]').forEach(el => observer.observe(el));
    }
};

/* Mobile Menu */
const MobileMenu = {
    init() {
        const toggle = document.querySelector('.menu-toggle');
        const links = document.querySelector('.nav-links');

        toggle?.addEventListener('click', () => {
            links.classList.toggle('mobile-open');
        });
    }
};

/* Init */
document.addEventListener('DOMContentLoaded', () => {
    NavScroll.init();
    SmoothScroll.init();
    AnimateOnScroll.init();
    CounterAnimation.init();
    MobileMenu.init();

    console.log('🎓 Colegio Innovar - Desarrollado por Juan Gabriel Aragón');
});
