/* ==========================================================================
   JUAN GABRIEL ARAGÓN - Portfolio JavaScript
   Version: 1.0.0
   ========================================================================== */

'use strict';

const DOM = {
    header: document.querySelector('.header'),
    menuToggle: document.getElementById('menu-toggle'),
    mobileMenu: document.getElementById('mobile-menu'),
    menuIcon: document.getElementById('menu-icon'),
    closeIcon: document.getElementById('close-icon'),
    mobileLinks: document.querySelectorAll('#mobile-menu a'),
    scrollTopBtn: document.getElementById('scroll-top-btn'),
    navLinks: document.querySelectorAll('a[href^="#"]'),
    cursorGlow: document.getElementById('cursor-glow'),
    contactForm: document.getElementById('contact-form')
};

/* AOS Init */
function initAOS() {
    AOS.init({ once: true, offset: 80, duration: 700, easing: 'ease-out-cubic' });
}

/* Mobile Menu */
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
        if (DOM.menuToggle) DOM.menuToggle.addEventListener('click', () => this.toggle());
        DOM.mobileLinks.forEach(link => link.addEventListener('click', () => { this.isOpen = false; this.close(); }));
    }
};

/* Header Scroll */
const HeaderScroll = {
    update() {
        DOM.header.classList.toggle('scrolled', window.scrollY > 50);
    },
    init() {
        window.addEventListener('scroll', () => this.update());
        this.update();
    }
};

/* Scroll To Top */
const ScrollToTop = {
    update() {
        if (!DOM.scrollTopBtn) return;
        DOM.scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    },
    init() {
        if (!DOM.scrollTopBtn) return;
        window.addEventListener('scroll', () => this.update());
        DOM.scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
};

/* Smooth Scroll */
const SmoothScroll = {
    init() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = DOM.header.offsetHeight;
                        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                    }
                }
            });
        });
    }
};

/* Cursor Glow Effect */
const CursorGlow = {
    init() {
        if (!DOM.cursorGlow || window.innerWidth < 768) return;
        document.addEventListener('mousemove', (e) => {
            DOM.cursorGlow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
        });
    }
};

/* Contact Form */
const ContactForm = {
    init() {
        if (!DOM.contactForm) return;
        DOM.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(DOM.contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Mensaje enviado:', data);
            alert(`¡Gracias ${data.name}! Tu mensaje ha sido enviado. Te contactaré pronto.`);
            DOM.contactForm.reset();
        });
    }
};

/* Typing Effect */
const TypingEffect = {
    element: null,
    words: ['Desarrollador Web', 'Creador de Experiencias', 'Diseñador UI/UX'],
    currentWord: 0,
    currentChar: 0,
    isDeleting: false,

    type() {
        if (!this.element) return;

        const word = this.words[this.currentWord];

        if (this.isDeleting) {
            this.element.textContent = word.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = word.substring(0, this.currentChar + 1);
            this.currentChar++;
        }

        let delay = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentChar === word.length) {
            delay = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentWord = (this.currentWord + 1) % this.words.length;
            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    },

    init() {
        this.element = document.getElementById('typing-text');
        if (this.element) this.type();
    }
};

/* Project Filter */
const ProjectFilter = {
    init() {
        const filterBtns = document.querySelectorAll('[data-filter]');
        const projects = document.querySelectorAll('[data-category]');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                filterBtns.forEach(b => b.classList.remove('active', 'bg-indigo-500', 'text-white'));
                btn.classList.add('active', 'bg-indigo-500', 'text-white');

                projects.forEach(project => {
                    if (filter === 'all' || project.dataset.category === filter) {
                        project.style.display = 'block';
                        project.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        project.style.display = 'none';
                    }
                });
            });
        });
    }
};

/* Init All */
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    MobileMenu.init();
    HeaderScroll.init();
    ScrollToTop.init();
    SmoothScroll.init();
    CursorGlow.init();
    ContactForm.init();
    TypingEffect.init();
    ProjectFilter.init();

    console.log('🚀 Portfolio - Juan Gabriel Aragón - Cargado');
});
