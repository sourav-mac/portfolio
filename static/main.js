// ===============================
// Theme & Navigation Setup
// ===============================
function initNavigation() {
    const hamburgerCheckbox = document.getElementById("hamburgerCheckbox");
    const links = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");

    // Clean up and reinitialize hamburger
    if (hamburgerCheckbox && links) {
        const newHamburger = hamburgerCheckbox.cloneNode(true);
        hamburgerCheckbox.parentNode.replaceChild(newHamburger, hamburgerCheckbox);
        newHamburger.addEventListener("change", () => {
            links.classList.toggle("show");
        });
    }

    // Clean up and reinitialize theme toggle
    if (themeToggle) {
        const newThemeToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
        
        // Set initial state
        const isDark = localStorage.getItem("theme") === "dark";
        if (isDark) {
            document.body.classList.add("dark-mode");
            newThemeToggle.checked = true;
        }
        
        // Add new event listener
        newThemeToggle.addEventListener("change", () => {
            const dark = newThemeToggle.checked;
            document.body.classList.toggle("dark-mode", dark);
            localStorage.setItem("theme", dark ? "dark" : "light");
        });
    }

    // Update active navigation links
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        link.classList.toggle("active", linkPath === currentPath);
    });
}

// ===============================
// Floating Elements Handler
// ===============================
function ensureFloatingElements() {
    // Ensure floating elements stay fixed and visible
    const chatToggle = document.getElementById("chat-toggle");
    const chatWidget = document.getElementById("chat-widget");
    const toggleContainer = document.querySelector(".toggle-container");
    
    if (chatToggle) {
        // Only set visibility if the element is not intentionally hidden
        if (chatToggle.style.display !== "none") {
            chatToggle.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 10001 !important;
                pointer-events: auto !important;
                opacity: 1 !important;
                visibility: visible !important;
            `;
        } else {
            // Keep position fixed but allow display: none
            chatToggle.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 10001 !important;
                display: none !important;
            `;
        }
    }
    
    if (chatWidget) {
        // Only ensure positioning, don't force visibility for chat widget
        const currentDisplay = chatWidget.style.display;
        chatWidget.style.cssText = `
            position: fixed !important;
            bottom: 80px !important;
            right: 20px !important;
            z-index: 10000 !important;
            pointer-events: auto !important;
            ${currentDisplay ? `display: ${currentDisplay} !important;` : 'display: none !important;'}
        `;
        
        // If it should be visible, ensure opacity and visibility
        if (currentDisplay === 'flex' || currentDisplay === 'block') {
            chatWidget.style.opacity = '1';
            chatWidget.style.visibility = 'visible';
        }
    }
    
    if (toggleContainer) {
        toggleContainer.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10000 !important;
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
        `;
    }
}


// ===============================
// Page Transition Animation
// ===============================
function startPageTransition(callback) {
    const transition = document.querySelector('.transition');
    const bg = transition.querySelector('.transition__background');
    const text = transition.querySelector('.transition__text');

    if (!transition || !bg) return;

    transition.classList.add('is-animating');
    
    // Animate text after background starts sliding
    setTimeout(() => {
        if (text) text.style.opacity = '1';
    }, 200);

    // Wait for CSS transition to finish (duration: 0.8s)
    setTimeout(() => {
        if (typeof callback === 'function') callback();
        endPageTransition();
    }, 800);
}

function endPageTransition() {
    const transition = document.querySelector('.transition');
    const text = transition.querySelector('.transition__text');
    
    if (!transition) return;
    
    // Fade out text first
    if (text) text.style.opacity = '0';
    
    // Then slide out the background
    setTimeout(() => {
        transition.classList.remove('is-animating');
    }, 200);
}

// ===============================
// Smart Transition Setup
// ===============================
class SmartTransition {
    constructor() {
        this.setupStyles();
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            [data-barba="container"] {
                position: relative;
                opacity: 1;
                transform: none;
                transition: all 0.6s ease-in-out;
            }
            
            html.is-transitioning [data-barba="container"] {
                pointer-events: none;
            }
            
            .animate-item {
                will-change: transform, opacity;
                transform: translateX(0);
                opacity: 1;
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            html.is-transitioning {
                overflow: hidden;
            }
            
            html.is-transitioning body {
                cursor: wait;
            }
            
            /* Smart transition overlay */
            .smart-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--bg-color) 0%, rgba(17, 17, 17, 0.95) 100%);
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s ease-in-out;
            }
            
            .smart-transition-overlay.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .smart-transition-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: var(--text-color);
            }
            
            .smart-transition-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(99, 102, 241, 0.3);
                border-top: 3px solid var(--accent-color);
                border-radius: 50%;
                animation: smartSpin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes smartSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .smart-transition-text {
                font-size: 1rem;
                opacity: 0.8;
                font-weight: 500;
            }
            
            .heading, h1, h2, h3,
            .profile-pic,
            .project-card,
            .btn,
            p,
            .gallery img,
            .stats div,
            .nav-links,
            section {
                opacity: 1;
                transform: translateX(0);
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(style);
        
        // Create overlay element
        this.createOverlay();
    }
    
    createOverlay() {
        if (document.querySelector('.smart-transition-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'smart-transition-overlay';
        overlay.innerHTML = `
            <div class="smart-transition-content">
                <div class="smart-transition-spinner"></div>
                <div class="smart-transition-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    getTransitionType(currentNamespace, nextNamespace) {
        // Smart transition logic based on page types
        const transitions = {
            'home-to-about': 'slideRight',
            'about-to-projects': 'slideRight', 
            'projects-to-certifications': 'slideRight',
            'certifications-to-cv': 'slideRight',
            'cv-to-contact': 'slideRight',
            'contact-to-home': 'fadeScale',
            // Reverse transitions
            'about-to-home': 'slideLeft',
            'projects-to-about': 'slideLeft',
            'certifications-to-projects': 'slideLeft',
            'cv-to-certifications': 'slideLeft',
            'contact-to-cv': 'slideLeft',
            // Non-sequential transitions
            'home-to-projects': 'fadeUp',
            'home-to-contact': 'fadeDown',
            'projects-to-contact': 'fadeScale'
        };
        
        const transitionKey = `${currentNamespace}-to-${nextNamespace}`;
        return transitions[transitionKey] || 'fade';
    }

    prepareElements(container) {
        if (!container) return null;
        return {
            headings: container.querySelectorAll('h1, h2, h3, .heading'),
            paragraphs: container.querySelectorAll('p:not(.animate-item p)'),
            cards: container.querySelectorAll('.project-card, .cert-item, .cv-buttons'),
            images: container.querySelectorAll('img, .profile-pic, .cert-image'),
            buttons: container.querySelectorAll('.btn, .cta-buttons a'),
            stats: container.querySelectorAll('.stats div'),
            nav: container.querySelectorAll('.nav-links li'),
            sections: container.querySelectorAll('section, .hero, .about-section'),
            container: container
        };
    }

    async animateOut(elements, transitionType = 'fade') {
        if (!elements) return;
        
        const overlay = document.querySelector('.smart-transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
        
        const tl = gsap.timeline({
            defaults: {
                duration: 0.5,
                ease: 'power2.inOut'
            }
        });

        // Different animation patterns based on transition type
        switch (transitionType) {
            case 'slideRight':
                return this.slideOutRight(elements, tl);
            case 'slideLeft': 
                return this.slideOutLeft(elements, tl);
            case 'fadeUp':
                return this.fadeOutUp(elements, tl);
            case 'fadeDown':
                return this.fadeOutDown(elements, tl);
            case 'fadeScale':
                return this.fadeOutScale(elements, tl);
            default:
                return this.fadeOut(elements, tl);
        }
    }

    async animateIn(elements, transitionType = 'fade') {
        if (!elements) return;
        
        const overlay = document.querySelector('.smart-transition-overlay');
        
        const tl = gsap.timeline({
            defaults: {
                duration: 0.6,
                ease: 'power2.out'
            },
            onComplete: () => {
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });

        // Different animation patterns based on transition type
        switch (transitionType) {
            case 'slideRight':
                return this.slideInRight(elements, tl);
            case 'slideLeft':
                return this.slideInLeft(elements, tl);
            case 'fadeUp':
                return this.fadeInUp(elements, tl);
            case 'fadeDown':
                return this.fadeInDown(elements, tl);
            case 'fadeScale':
                return this.fadeInScale(elements, tl);
            default:
                return this.fadeIn(elements, tl);
        }
    }

    // Slide Right Transitions
    slideOutRight(elements, tl) {
        tl.to(elements.container, { x: '-100%', opacity: 0.8 }, 0)
          .to(elements.sections, { x: '-50px', opacity: 0, stagger: 0.1 }, 0.1);
        return tl;
    }

    slideInRight(elements, tl) {
        gsap.set(elements.container, { x: '100%', opacity: 0.8 });
        gsap.set(elements.sections, { x: '50px', opacity: 0 });
        
        tl.to(elements.container, { x: '0%', opacity: 1 }, 0)
          .to(elements.sections, { x: '0px', opacity: 1, stagger: 0.1 }, 0.2);
        return tl;
    }

    // Slide Left Transitions  
    slideOutLeft(elements, tl) {
        tl.to(elements.container, { x: '100%', opacity: 0.8 }, 0)
          .to(elements.sections, { x: '50px', opacity: 0, stagger: 0.1 }, 0.1);
        return tl;
    }

    slideInLeft(elements, tl) {
        gsap.set(elements.container, { x: '-100%', opacity: 0.8 });
        gsap.set(elements.sections, { x: '-50px', opacity: 0 });
        
        tl.to(elements.container, { x: '0%', opacity: 1 }, 0)
          .to(elements.sections, { x: '0px', opacity: 1, stagger: 0.1 }, 0.2);
        return tl;
    }

    // Fade Up Transitions
    fadeOutUp(elements, tl) {
        tl.to(elements.sections, { y: '-50px', opacity: 0, stagger: 0.05 }, 0);
        return tl;
    }

    fadeInUp(elements, tl) {
        gsap.set(elements.sections, { y: '50px', opacity: 0 });
        tl.to(elements.sections, { y: '0px', opacity: 1, stagger: 0.1 }, 0);
        return tl;
    }

    // Fade Down Transitions
    fadeOutDown(elements, tl) {
        tl.to(elements.sections, { y: '50px', opacity: 0, stagger: 0.05 }, 0);
        return tl;
    }

    fadeInDown(elements, tl) {
        gsap.set(elements.sections, { y: '-50px', opacity: 0 });
        tl.to(elements.sections, { y: '0px', opacity: 1, stagger: 0.1 }, 0);
        return tl;
    }

    // Fade Scale Transitions
    fadeOutScale(elements, tl) {
        tl.to(elements.container, { scale: 0.9, opacity: 0 }, 0);
        return tl;
    }

    fadeInScale(elements, tl) {
        gsap.set(elements.container, { scale: 1.1, opacity: 0 });
        tl.to(elements.container, { scale: 1, opacity: 1 }, 0);
        return tl;
    }

    // Basic Fade Transitions
    fadeOut(elements, tl) {
        tl.to(elements.sections, { opacity: 0, stagger: 0.05 }, 0);
        return tl;
    }

    fadeIn(elements, tl) {
        gsap.set(elements.sections, { opacity: 0 });
        tl.to(elements.sections, { opacity: 1, stagger: 0.1 }, 0);
        return tl;
    }
}

const smartTransition = new SmartTransition();

// ===============================
// Barba.js Setup
// ===============================
barba.hooks.beforeEnter(() => {
    window.scrollTo(0, 0);
});

barba.hooks.after(() => {
    gsap.killTweensOf("*");
});

// Update the barba.init configuration:
barba.init({
    debug: false,
    timeout: 5000,
    prevent: ({ el }) => {
        return (
            !el ||
            el.classList.contains('prevent-barba') ||
            el.getAttribute('href')?.startsWith('#') ||
            el.getAttribute('target') === '_blank' ||
            el.getAttribute('href')?.includes('tel:') ||
            el.getAttribute('href')?.includes('mailto:')
        );
    },
    transitions: [{
        name: 'smart-transition',
        sync: false,

        beforeOnce() {
            initNavigation();
            initChatWidget();
            ensureFloatingElements();
            
            // Initialize animated background for all pages
            if (typeof initAnimatedBackgroundOnAllPages !== 'undefined') {
                initAnimatedBackgroundOnAllPages();
            }
        },

        beforeLeave(data) {
            document.documentElement.classList.add('is-transitioning');
            
            // Store transition type based on current and next page
            const currentNamespace = data.current.namespace;
            const nextNamespace = data.next.namespace;
            this.transitionType = smartTransition.getTransitionType(currentNamespace, nextNamespace);
            
            // Clean up old event listeners
            const oldThemeToggle = document.getElementById("themeToggle");
            const oldChatToggle = document.getElementById("chat-toggle");
            const oldChatClose = document.getElementById("chat-close");
            
            if (oldThemeToggle) oldThemeToggle.replaceWith(oldThemeToggle.cloneNode(true));
            if (oldChatToggle) oldChatToggle.replaceWith(oldChatToggle.cloneNode(true));
            if (oldChatClose) oldChatClose.replaceWith(oldChatClose.cloneNode(true));
        },

        async leave(data) {
            // Use smart transition with determined type
            return new Promise((resolve) => {
                const elements = smartTransition.prepareElements(data.current.container);
                if (elements) {
                    smartTransition.animateOut(elements, this.transitionType).then(resolve);
                } else {
                    resolve();
                }
            });
        },

        async enter(data) {
            // Animate in new elements with the same transition type
            const elements = smartTransition.prepareElements(data.next.container);
            if (elements) {
                await smartTransition.animateIn(elements, this.transitionType);
            }
        },

        afterEnter(data) {
            document.documentElement.classList.remove('is-transitioning');
            
            // Reinitialize with a slight delay to ensure DOM is ready
            setTimeout(() => {
                initNavigation();
                initChatWidget();
                ensureFloatingElements();
                initManualTransitions();
                
                // Handle animated background for all pages
                if (typeof initAnimatedBackgroundOnAllPages !== 'undefined') {
                    initAnimatedBackgroundOnAllPages();
                }
                
                // Restore theme state
                const themeToggle = document.getElementById("themeToggle");
                if (themeToggle) {
                    const isDark = localStorage.getItem("theme") === "dark";
                    document.body.classList.toggle("dark-mode", isDark);
                    themeToggle.checked = isDark;
                }
                
                // Restore chat widget state
                const chatWidget = document.getElementById("chat-widget");
                const chatToggle = document.getElementById("chat-toggle");
                if (chatWidget && chatToggle) {
                    const isVisible = chatWidget.style.display === "flex";
                    chatToggle.style.display = isVisible ? "none" : "block";
                }
            }, 50);
        }
    }]
});
// ===============================
// Manual Navigation Handler (Fallback)
// ===============================
function getCurrentNamespace(path) {
    // Extract namespace from path
    const pathMap = {
        '/': 'home',
        '/about': 'about', 
        '/projects': 'projects',
        '/certifications': 'certifications',
        '/cv': 'cv',
        '/contact': 'contact'
    };
    return pathMap[path] || 'home';
}

function initManualTransitions() {
    // Handle navigation links manually as fallback
    document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])').forEach(link => {
        if (!link.dataset.manualTransition) {
            link.dataset.manualTransition = 'true';
            
            link.addEventListener('click', function(e) {
                // Only handle if Barba.js hasn't already handled it
                if (!e.defaultPrevented && !this.classList.contains('prevent-barba')) {
                    const href = this.getAttribute('href');
                    if (href && href !== window.location.pathname) {
                        e.preventDefault();
                        
                        // Determine transition type based on current and target pages
                        const currentPath = window.location.pathname;
                        const targetPath = href;
                        const currentNamespace = getCurrentNamespace(currentPath);
                        const nextNamespace = getCurrentNamespace(targetPath);
                        const transitionType = smartTransition.getTransitionType(currentNamespace, nextNamespace);
                        
                        // Start smart transition
                        const currentContainer = document.querySelector('[data-barba="container"]');
                        if (currentContainer) {
                            const elements = smartTransition.prepareElements(currentContainer);
                            smartTransition.animateOut(elements, transitionType).then(() => {
                                window.location.href = href;
                            });
                        } else {
                            window.location.href = href;
                        }
                    }
                }
            });
        }
    });
}

// ===============================
// Initialize Everything
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChatWidget();
    ensureFloatingElements();
    initManualTransitions();
    
    // Initialize animated background for all pages
    if (typeof initAnimatedBackgroundOnAllPages !== 'undefined') {
        initAnimatedBackgroundOnAllPages();
    }
    
    document.body.classList.add('visible');
    
    // Run floating elements check less frequently to avoid interference
    setInterval(ensureFloatingElements, 5000);
});

// Handle cleanup before unload
window.addEventListener('beforeunload', () => {
    gsap.killTweensOf("*");
});