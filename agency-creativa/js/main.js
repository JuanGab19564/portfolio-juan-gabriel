/* ==========================================================================
   NOVA CREATIVE - Agency JavaScript
   ========================================================================== */

'use strict';

/* Custom Cursor */
const CustomCursor = {
    cursor: null,

    init() {
        this.cursor = document.querySelector('.cursor');
        if (!this.cursor || window.innerWidth < 768) return;

        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .work-item, .service-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }
};

/* Navigation Scroll */
const NavScroll = {
    init() {
        const nav = document.querySelector('.nav');
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 100);
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
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.service-card, .work-item, .about-content, .stat').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

/* Add visible class styles */
const addVisibleStyles = () => {
    const style = document.createElement('style');
    style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
};

/* Counter Animation */
const CounterAnimation = {
    animateValue(el, end, duration) {
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            el.textContent = current + '+';
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    },

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = parseInt(entry.target.dataset.value);
                    this.animateValue(entry.target, value, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number[data-value]').forEach(el => observer.observe(el));
    }
};

/* Parallax Effect */
const Parallax = {
    init() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
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

/* Text Reveal Animation */
const TextReveal = {
    init() {
        const title = document.querySelector('.hero-title');
        if (!title) return;

        const text = title.innerHTML;
        title.innerHTML = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.innerHTML = text.substring(0, i + 1);
                i++;
                setTimeout(typeWriter, 30);
            }
        };

        setTimeout(typeWriter, 500);
    }
};

/* Init All */
document.addEventListener('DOMContentLoaded', () => {
    addVisibleStyles();
    CustomCursor.init();
    NavScroll.init();
    SmoothScroll.init();
    AnimateOnScroll.init();
    CounterAnimation.init();
    Parallax.init();
    MobileMenu.init();

    console.log('🎨 Nova Creative Agency - Cargado');
});
