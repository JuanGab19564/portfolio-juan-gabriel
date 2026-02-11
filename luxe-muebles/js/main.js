/* ==========================================================================
   LUXE MUEBLES - Main JavaScript
   Version: 1.0.0
   Author: LUXE Design Team
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
    navLinks: document.querySelectorAll('a[href^="#"]')
};

/* ==========================================================================
   2. INITIALIZE AOS (Animate On Scroll)
   ========================================================================== */
function initAOS() {
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
        easing: 'ease-out-cubic'
    });
}

/* ==========================================================================
   3. MOBILE MENU FUNCTIONALITY
   ========================================================================== */
const MobileMenu = {
    isOpen: false,
    
    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.open();
        } else {
            this.close();
        }
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
    threshold: 50,
    
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
    
    prev() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    },
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    },
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
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
   6. SCROLL TO TOP BUTTON
   ========================================================================== */
const ScrollToTop = {
    threshold: 400,
    
    update() {
        if (!DOM.scrollTopBtn) return;
        
        if (window.scrollY > this.threshold) {
            DOM.scrollTopBtn.classList.add('visible');
        } else {
            DOM.scrollTopBtn.classList.remove('visible');
        }
    },
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    init() {
        if (!DOM.scrollTopBtn) return;
        
        window.addEventListener('scroll', () => this.update());
        DOM.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
    }
};

/* ==========================================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
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
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
};

/* ==========================================================================
   8. NEWSLETTER FORM
   ========================================================================== */
const NewsletterForm = {
    init() {
        const form = document.getElementById('newsletter-form');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            console.log('Newsletter subscription:', email);
            alert('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.');
            form.reset();
        });
    }
};

/* ==========================================================================
   9. LAZY LOADING IMAGES
   ========================================================================== */
const LazyLoad = {
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

/* ==========================================================================
   10. INITIALIZE ALL MODULES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    MobileMenu.init();
    HeaderScroll.init();
    TestimonialSlider.init();
    ScrollToTop.init();
    SmoothScroll.init();
    NewsletterForm.init();
    LazyLoad.init();
    
    console.log('LUXE Muebles - All modules initialized');
});
