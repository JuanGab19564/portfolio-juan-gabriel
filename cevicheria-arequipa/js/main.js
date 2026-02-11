/* ==========================================================================
   MAR DE AREQUIPA - JavaScript Principal
   Version: 1.0.0
   ========================================================================== */

'use strict';

/* ==========================================================================
   1. DOM ELEMENTS
   ========================================================================== */
const DOM = {
    header: document.querySelector('.header'),
    menuToggle: document.getElementById('menu-toggle'),
    mobileMenu: document.getElementById('mobile-menu'),
    menuIcon: document.getElementById('menu-icon'),
    closeIcon: document.getElementById('close-icon'),
    mobileLinks: document.querySelectorAll('#mobile-menu a'),
    testimonialSlides: document.querySelectorAll('.testimonial-slide'),
    testimonialDots: document.querySelectorAll('.testimonial-dot'),
    scrollTopBtn: document.getElementById('scroll-top-btn'),
    navLinks: document.querySelectorAll('a[href^="#"]'),
    reservationForm: document.getElementById('reservation-form')
};

/* ==========================================================================
   2. INITIALIZE AOS
   ========================================================================== */
function initAOS() {
    AOS.init({
        once: true,
        offset: 80,
        duration: 800,
        easing: 'ease-out-cubic'
    });
}

/* ==========================================================================
   3. MOBILE MENU
   ========================================================================== */
const MobileMenu = {
    isOpen: false,

    toggle() {
        this.isOpen = !this.isOpen;
        this.isOpen ? this.open() : this.close();
    },

    open() {
        DOM.mobileMenu.classList.remove('hidden');
        setTimeout(() => DOM.mobileMenu.classList.add('visible'), 10);
        DOM.menuIcon.classList.add('hidden');
        DOM.closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    close() {
        DOM.mobileMenu.classList.remove('visible');
        setTimeout(() => DOM.mobileMenu.classList.add('hidden'), 300);
        DOM.menuIcon.classList.remove('hidden');
        DOM.closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    },

    init() {
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', () => this.toggle());
        }
        DOM.mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.isOpen = false;
                this.close();
            });
        });
    }
};

/* ==========================================================================
   4. HEADER SCROLL EFFECT
   ========================================================================== */
const HeaderScroll = {
    threshold: 100,

    update() {
        if (window.scrollY > this.threshold) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
    },

    init() {
        window.addEventListener('scroll', () => this.update());
        this.update();
    }
};

/* ==========================================================================
   5. TESTIMONIAL SLIDER
   ========================================================================== */
const TestimonialSlider = {
    currentSlide: 0,
    totalSlides: 0,
    autoPlayInterval: null,
    autoPlayDelay: 5000,

    showSlide(index) {
        if (!DOM.testimonialSlides.length) return;

        DOM.testimonialSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        DOM.testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentSlide = index;
    },

    next() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    },

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    },

    init() {
        this.totalSlides = DOM.testimonialSlides.length;
        if (this.totalSlides === 0) return;

        DOM.testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoPlay();
                this.showSlide(index);
                this.startAutoPlay();
            });
        });

        this.showSlide(0);
        this.startAutoPlay();
    }
};

/* ==========================================================================
   6. SCROLL TO TOP
   ========================================================================== */
const ScrollToTop = {
    threshold: 500,

    update() {
        if (!DOM.scrollTopBtn) return;
        DOM.scrollTopBtn.classList.toggle('visible', window.scrollY > this.threshold);
    },

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    init() {
        if (!DOM.scrollTopBtn) return;
        window.addEventListener('scroll', () => this.update());
        DOM.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
    }
};

/* ==========================================================================
   7. SMOOTH SCROLL
   ========================================================================== */
const SmoothScroll = {
    init() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = DOM.header.offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            });
        });
    }
};

/* ==========================================================================
   8. RESERVATION FORM
   ========================================================================== */
const ReservationForm = {
    init() {
        if (!DOM.reservationForm) return;

        DOM.reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(DOM.reservationForm);
            const data = Object.fromEntries(formData.entries());

            console.log('Reservación:', data);
            alert(`¡Gracias ${data.name}! Tu reservación para ${data.guests} personas el ${data.date} a las ${data.time} ha sido recibida. Te contactaremos pronto para confirmar.`);
            DOM.reservationForm.reset();
        });
    }
};

/* ==========================================================================
   9. PARALLAX EFFECT
   ========================================================================== */
const ParallaxEffect = {
    elements: [],

    update() {
        const scrollY = window.scrollY;
        this.elements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    },

    init() {
        this.elements = document.querySelectorAll('.parallax-slow');
        if (this.elements.length) {
            window.addEventListener('scroll', () => this.update());
        }
    }
};

/* ==========================================================================
   10. COUNTER ANIMATION
   ========================================================================== */
const CounterAnimation = {
    animated: false,

    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(easeOut * (end - start) + start);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    },

    init() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.counter);
                        this.animateValue(counter, 0, target, 2000);
                    });
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
};

/* ==========================================================================
   11. INITIALIZE ALL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    MobileMenu.init();
    HeaderScroll.init();
    TestimonialSlider.init();
    ScrollToTop.init();
    SmoothScroll.init();
    ReservationForm.init();
    ParallaxEffect.init();
    CounterAnimation.init();

    console.log('🦐 Mar de Arequipa - Todos los módulos cargados');
});
