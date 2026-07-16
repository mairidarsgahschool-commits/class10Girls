/**
 * EduVerse Academy - Main Application JavaScript
 * Handles interactive functionality for the online learning platform
 */

(function() {
    'use strict';

    // ==========================================================================
    // Configuration & Constants
    // ==========================================================================

    const SELECTORS = {
        NAV: 'nav',
        NAV_LINKS: '.nav-links',
        MOBILE_MENU_TOGGLE: '.mobile-menu-toggle',
        SMOOTH_SCROLL_LINKS: 'a[href^="#"]',
        STATS_SECTION: '.stats',
        ANIMATE_ELEMENTS: '.stat-item, .feature-card, .course-card',
        JOIN_BUTTONS: '.btn-join'
    };

    const CLASSES = {
        SCROLLED: 'scrolled',
        ACTIVE: 'active',
        VISIBLE: 'visible',
        JOINED: 'joined'
    };

    const ANIMATION_DELAY = 2000; // ms

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Safely query DOM elements
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {Element|null}
     */
    function $(selector, context = document) {
        return context.querySelector(selector);
    }

    /**
     * Safely query multiple DOM elements
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {NodeList}
     */
    function $$(selector, context = document) {
        return context.querySelectorAll(selector);
    }

    // ==========================================================================
    // Module: Navigation
    // ==========================================================================

    const Navigation = {
        init() {
            this.nav = $(SELECTORS.NAV);
            this.navLinks = $(SELECTORS.NAV_LINKS);
            this.menuToggle = $(SELECTORS.MOBILE_MENU_TOGGLE);

            if (!this.nav || !this.menuToggle) return;

            this.bindEvents();
        },

        bindEvents() {
            // Scroll effect
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

            // Mobile menu toggle
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());

            // Close mobile menu on link click
            $$(SELECTORS.NAV_LINKS + ' a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                if (!this.nav.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        },

        handleScroll() {
            if (window.scrollY > 50) {
                this.nav.classList.add(CLASSES.SCROLLED);
            } else {
                this.nav.classList.remove(CLASSES.SCROLLED);
            }
        },

        toggleMobileMenu() {
            const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
            this.menuToggle.setAttribute('aria-expanded', !isExpanded);
            this.navLinks.classList.toggle(CLASSES.ACTIVE);
        },

        closeMobileMenu() {
            this.menuToggle.setAttribute('aria-expanded', 'false');
            this.navLinks.classList.remove(CLASSES.ACTIVE);
        }
    };

    // ==========================================================================
    // Module: Smooth Scrolling
    // ==========================================================================

    const SmoothScroll = {
        init() {
            $$(SELECTORS.SMOOTH_SCROLL_LINKS).forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
            });
        },

        handleAnchorClick(e) {
            const targetId = e.currentTarget.getAttribute('href');
            
            // Skip if not a valid ID or it's just "#"
            if (!targetId || targetId === '#') return;

            const target = $(targetId);
            
            if (target) {
                e.preventDefault();
                
                // Account for fixed header offset
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        }
    };

    // ==========================================================================
    // Module: Scroll Animations
    // ==========================================================================

    const ScrollAnimations = {
        init() {
            const elements = $$(SELECTORS.ANIMATE_ELEMENTS);
            
            if (!elements.length) return;

            // Apply initial styles
            elements.forEach(el => {
                el.classList.add('animate-on-scroll');
            });

            // Create observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(CLASSES.VISIBLE);
                        // Optionally unobserve after animation
                        // observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all elements
            elements.forEach(el => observer.observe(el));
        }
    };

    // ==========================================================================
    // Module: Join Button Interaction
    // ==========================================================================

    const JoinButtons = {
        init() {
            $$(SELECTORS.JOIN_BUTTONS).forEach(btn => {
                btn.addEventListener('click', (e) => this.handleClick(e));
            });
        },

        handleClick(e) {
            const button = e.currentTarget;
            
            // Prevent multiple clicks
            if (button.classList.contains(CLASSES.JOINED)) return;

            const originalText = button.textContent;
            
            button.textContent = '✓ Joined!';
            button.classList.add(CLASSES.JOINED);

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove(CLASSES.JOINED);
            }, ANIMATION_DELAY);
        }
    };

    // ==========================================================================
    // Module: Keyboard Navigation
    // ==========================================================================

    const KeyboardNavigation = {
        init() {
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        handleKeyDown(e) {
            // Close mobile menu on Escape key
            if (e.key === 'Escape') {
                const menuToggle = $(SELECTORS.MOBILE_MENU_TOGGLE);
                const navLinks = $(SELECTORS.NAV_LINKS);
                
                if (menuToggle && navLinks && navLinks.classList.contains(CLASSES.ACTIVE)) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove(CLASSES.ACTIVE);
                    menuToggle.focus();
                }
            }
        }
    };

    // ==========================================================================
    // Module: Performance Optimization
    // ==========================================================================

    const Performance = {
        init() {
            // Defer loading of non-critical resources
            this.lazyLoadImages();
            
            // Reduce animations for users who prefer reduced motion
            this.checkReducedMotion();
        },

        lazyLoadImages() {
            const images = $$('img[data-src]');
            
            if (!images.length) return;

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        },

        checkReducedMotion() {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (mediaQuery.matches) {
                document.documentElement.style.setProperty('--transition-fast', '0s');
                document.documentElement.style.setProperty('--transition-slow', '0s');
            }
        }
    };

    // ==========================================================================
    // Module: Analytics (Placeholder)
    // ==========================================================================

    const Analytics = {
        init() {
            // Track page views
            this.trackPageView();
            
            // Track user interactions
            this.trackInteractions();
        },

        trackPageView() {
            // Placeholder for analytics integration
            console.log('📊 Page view tracked:', window.location.pathname);
        },

        trackInteractions() {
            // Track CTA clicks
            $$('.btn-primary, .btn-secondary').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.currentTarget.textContent.trim();
                    console.log('🖱️ User action:', action);
                });
            });
        }
    };

    // ==========================================================================
    // Application Initialization
    // ==========================================================================

    const App = {
        modules: [
            Navigation,
            SmoothScroll,
            ScrollAnimations,
            JoinButtons,
            KeyboardNavigation,
            Performance,
            Analytics
        ],

        init() {
            console.log('🎓 EduVerse Academy - Initializing...');

            // Initialize all modules
            this.modules.forEach(module => {
                try {
                    module.init();
                    console.log(`✓ ${module.constructor.name} initialized`);
                } catch (error) {
                    console.error(`✗ ${module.constructor.name} failed:`, error);
                }
            });

            console.log('🎓 EduVerse Academy - Ready!');
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    // Expose App for debugging (remove in production)
    window.EduVerseApp = App;

})();
