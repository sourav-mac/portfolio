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
// Slide Transition Setup
// ===============================
class SlideTransition {
    constructor() {
        const style = document.createElement('style');
        style.textContent = `
            [data-barba="container"] {
                position: relative;
                overflow: hidden;
            }
            .animate-item {
                will-change: transform, opacity;
                transform: translateX(0);
                opacity: 1;
            }
            html.is-transitioning {
                overflow: hidden;
            }
            html.is-transitioning body {
                cursor: wait;
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
    }

    prepareElements(container) {
        if (!container) return null;
        return {
            headings: container.querySelectorAll('h1, h2, h3, .heading'),
            images: container.querySelectorAll('img, .profile-pic, .gallery img'),
            cards: container.querySelectorAll('.project-card, section'),
            buttons: container.querySelectorAll('.btn, .cta-buttons button'),
            paragraphs: container.querySelectorAll('p'),
            stats: container.querySelectorAll('.stats div'),
            nav: container.querySelectorAll('.nav-links li')
        };
    }

    async animateOut(elements, direction = 1) {
        if (!elements) return;
        const xOffset = direction * 100;
        const tl = gsap.timeline({
            defaults: {
                duration: 0.4,
                ease: 'power2.inOut'
            }
        });

        const animations = [
            { items: elements.headings, delay: 0 },
            { items: elements.images, delay: 0.1 },
            { items: elements.cards, delay: 0.2 },
            { items: elements.paragraphs, delay: 0.15 },
            { items: elements.buttons, delay: 0.25 },
            { items: elements.stats, delay: 0.2 }
        ];

        animations.forEach(({ items, delay }) => {
            if (items?.length) {
                tl.to(items, {
                    x: `${-xOffset}%`,
                    opacity: 0,
                    stagger: 0.03
                }, delay);
            }
        });

        if (elements.nav?.length) {
            tl.to(elements.nav, {
                y: -20,
                opacity: 0,
                stagger: 0.02
            }, 0);
        }

        return tl;
    }

    async animateIn(elements, direction = 1) {
        if (!elements) return;
        const xOffset = direction * 100;
        const tl = gsap.timeline({
            defaults: {
                duration: 0.4,
                ease: 'power2.out'
            }
        });

        // Set initial positions
        const elementsToAnimate = [
            { items: elements.headings, delay: 0 },
            { items: elements.images, delay: 0.1 },
            { items: elements.cards, delay: 0.2 },
            { items: elements.paragraphs, delay: 0.15 },
            { items: elements.buttons, delay: 0.25 },
            { items: elements.stats, delay: 0.2 }
        ];

        // Set initial states
        elementsToAnimate.forEach(({ items }) => {
            if (items?.length) {
                gsap.set(items, {
                    x: `${xOffset}%`,
                    opacity: 0
                });
            }
        });

        if (elements.nav?.length) {
            gsap.set(elements.nav, {
                y: 20,
                opacity: 0
            });
        }

        // Animate in
        elementsToAnimate.forEach(({ items, delay }) => {
            if (items?.length) {
                tl.to(items, {
                    x: 0,
                    opacity: 1,
                    stagger: 0.03
                }, delay);
            }
        });

        if (elements.nav?.length) {
            tl.to(elements.nav, {
                y: 0,
                opacity: 1,
                stagger: 0.02
            }, 0.1);
        }

        return tl;
    }
}

const slideTransition = new SlideTransition();

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
        name: 'slide-transition',
        sync: false,

        beforeOnce() {
            initNavigation();
            initChatWidget();
            ensureFloatingElements();
        },

        beforeLeave() {
            document.documentElement.classList.add('is-transitioning');
            // Clean up old event listeners
            const oldThemeToggle = document.getElementById("themeToggle");
            const oldChatToggle = document.getElementById("chat-toggle");
            const oldChatClose = document.getElementById("chat-close");
            
            if (oldThemeToggle) oldThemeToggle.replaceWith(oldThemeToggle.cloneNode(true));
            if (oldChatToggle) oldChatToggle.replaceWith(oldChatToggle.cloneNode(true));
            if (oldChatClose) oldChatClose.replaceWith(oldChatClose.cloneNode(true));
        },

        async leave(data) {
            // Start the sliding transition
            return new Promise((resolve) => {
                startPageTransition(() => {
                    // Animate out existing elements
                    const elements = slideTransition.prepareElements(data.current.container);
                    if (elements) {
                        slideTransition.animateOut(elements).then(resolve);
                    } else {
                        resolve();
                    }
                });
            });
        },

        async enter(data) {
            // Animate in new elements
            const elements = slideTransition.prepareElements(data.next.container);
            if (elements) {
                await slideTransition.animateIn(elements);
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
                        startPageTransition(() => {
                            window.location.href = href;
                        });
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
    document.body.classList.add('visible');
    
    // Run floating elements check less frequently to avoid interference
    setInterval(ensureFloatingElements, 5000);
});

// Handle cleanup before unload
window.addEventListener('beforeunload', () => {
    gsap.killTweensOf("*");
});