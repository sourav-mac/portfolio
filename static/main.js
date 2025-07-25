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
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            html.is-transitioning [data-barba="container"] {
                pointer-events: none;
            }
            
            .animate-item {
                will-change: transform, opacity;
                transform: translateX(0);
                opacity: 1;
                transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                           transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            html.is-transitioning {
                overflow: hidden;
            }
            
            html.is-transitioning body {
                cursor: wait;
            }
            
            /* Enhanced transition overlay with blur effect */
            .smart-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, 
                    var(--bg-color) 0%, 
                    rgba(17, 17, 17, 0.98) 100%);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
                border: 3px solid rgba(99, 102, 241, 0.2);
                border-top: 3px solid var(--accent-color);
                border-radius: 50%;
                animation: smartSpin 0.8s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes smartSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .smart-transition-text {
                font-size: 0.9rem;
                opacity: 0.7;
                font-weight: 500;
                letter-spacing: 0.5px;
            }
            
            /* Page loading states */
            body.page-loaded {
                animation: pageLoadFade 0.5s ease-out;
            }
            
            @keyframes pageLoadFade {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            body.page-transition-complete .animate-item {
                animation: subtleFloat 0.8s ease-out;
            }
            
            @keyframes subtleFloat {
                0% { transform: translateY(5px); opacity: 0.8; }
                100% { transform: translateY(0); opacity: 1; }
            }
            
            /* Preload indicator */
            .preload-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, 
                    transparent, 
                    var(--accent-color), 
                    transparent);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .preload-indicator.active {
                opacity: 1;
                animation: preloadSlide 1.5s ease-in-out infinite;
            }
            
            @keyframes preloadSlide {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
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
            // Additional transitions TO about page from all pages
            'projects-to-about': 'slideLeft',
            'certifications-to-about': 'fadeUp',
            'cv-to-about': 'fadeUp',
            'contact-to-about': 'fadeUp',
            // Non-sequential transitions
            'home-to-projects': 'fadeUp',
            'home-to-contact': 'fadeDown',
            'projects-to-contact': 'fadeScale'
        };
        
        const transitionKey = `${currentNamespace}-to-${nextNamespace}`;
        console.log('Transition:', transitionKey, 'Type:', transitions[transitionKey] || 'fade');
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
                duration: 0.4, // Faster transitions for smoother feel
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
                duration: 0.5, // Slightly longer for enter animations
                ease: 'power2.out'
            },
            onComplete: () => {
                if (overlay) {
                    overlay.classList.remove('active');
                }
                // Reset transforms on profile picture to preserve CSS centering
                this.resetProfilePicture();
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

    // Enhanced loading indicator methods
    showLoadingIndicator() {
        const overlay = document.querySelector('.smart-transition-overlay');
        if (overlay) {
            overlay.classList.add('active');
            // Add subtle pulse animation to spinner
            const spinner = overlay.querySelector('.smart-transition-spinner');
            if (spinner) {
                gsap.to(spinner, {
                    scale: 1.1,
                    duration: 0.8,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }

    hideLoadingIndicator() {
        const overlay = document.querySelector('.smart-transition-overlay');
        if (overlay) {
            // Stop spinner animation
            const spinner = overlay.querySelector('.smart-transition-spinner');
            if (spinner) {
                gsap.killTweensOf(spinner);
                gsap.set(spinner, { scale: 1 });
            }
            
            // Fade out overlay smoothly
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    overlay.classList.remove('active');
                    gsap.set(overlay, { opacity: 1 }); // Reset for next use
                }
            });
        }
    }

    resetProfilePicture() {
        const profilePic = document.querySelector('.profile-pic');
        const card2 = document.querySelector('.card2');
        const card = document.querySelector('.card');
        
        if (profilePic) {
            gsap.set(profilePic, { 
                x: 0, y: 0, scale: 1, rotation: 0,
                clearProps: "transform" // This allows CSS to take over
            });
        }
        if (card2) {
            gsap.set(card2, { 
                x: 0, y: 0, scale: 1, rotation: 0
            });
            card2.style.display = 'flex';
            card2.style.alignItems = 'center';
            card2.style.justifyContent = 'center';
        }
        if (card) {
            gsap.set(card, { 
                x: 0, y: 0, scale: 1, rotation: 0
            });
        }
    }
}

const smartTransition = new SmartTransition();

// ===============================
// Barba.js Setup - Enhanced for Ultra-Smooth Transitions
// ===============================

// Preload links for faster transitions
function preloadNextPages() {
    const currentPath = window.location.pathname;
    const preloadMap = {
        '/': ['/about', '/projects'],
        '/about': ['/projects', '/'],
        '/projects': ['/certifications', '/about'],
        '/certifications': ['/cv', '/projects'],
        '/cv': ['/contact', '/certifications'],
        '/contact': ['/']
    };
    
    const preloadUrls = preloadMap[currentPath] || [];
    preloadUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    });
}

barba.hooks.beforeEnter(() => {
    window.scrollTo(0, 0);
    // Preload next likely pages
    preloadNextPages();
});

barba.hooks.after(() => {
    gsap.killTweensOf("*");
});

// Enhanced Barba configuration
barba.init({
    debug: false,
    timeout: 8000, // Increased timeout for slower connections
    requestError: (trigger, action, url, response) => {
        console.warn('Barba request failed, falling back to regular navigation');
        console.error('Request details:', { trigger, action, url, response });
        window.location.href = url;
    },
    prevent: ({ el }) => {
        return (
            !el ||
            el.classList.contains('prevent-barba') ||
            el.getAttribute('href')?.startsWith('#') ||
            el.getAttribute('href')?.includes('tel:') ||
            el.getAttribute('href')?.includes('mailto:') ||
            el.getAttribute('target') === '_blank' ||
            el.hasAttribute('download')
        );
    },
    transitions: [{
        name: 'ultra-smooth-transition',
        sync: false,

        beforeOnce() {
            initNavigation();
            initChatWidget();
            ensureFloatingElements();
            
            // Initialize animated background for all pages
            if (typeof initAnimatedBackgroundOnAllPages !== 'undefined') {
                initAnimatedBackgroundOnAllPages();
            }
            
            // Add page loaded class for styling
            document.body.classList.add('page-loaded');
        },

        beforeLeave(data) {
            document.documentElement.classList.add('is-transitioning');
            
            // Store transition type based on current and next page
            const currentNamespace = data.current.namespace;
            const nextNamespace = data.next.namespace;
            this.transitionType = smartTransition.getTransitionType(currentNamespace, nextNamespace);
            
            // Show loading indicator
            smartTransition.showLoadingIndicator();
            
            // Clean up old event listeners to prevent memory leaks
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
                    smartTransition.animateOut(elements, this.transitionType)
                        .then(() => {
                            // Small delay for ultra-smooth effect
                            setTimeout(resolve, 50);
                        });
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
            
            // Hide loading indicator
            smartTransition.hideLoadingIndicator();
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
                
                // Reset profile picture transforms after page transition
                smartTransition.resetProfilePicture();
                
                // Smooth scroll to top if needed
                if (window.scrollY > 0) {
                    gsap.to(window, {
                        scrollTo: { y: 0 },
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                
                // Add loaded class for any delayed effects
                document.body.classList.add('page-transition-complete');
                setTimeout(() => {
                    document.body.classList.remove('page-transition-complete');
                }, 1000);
                
            }, 30); // Reduced delay for faster initialization
        },

        onError: (data) => {
            console.error('Barba transition error:', data);
            // Hide loading indicator
            smartTransition.hideLoadingIndicator();
            // Fallback to regular navigation
            window.location.href = data.next.url.href;
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
    
    // Ensure profile picture centering is preserved after any GSAP animations
    function resetProfilePicTransforms() {
        const profilePic = document.querySelector('.profile-pic');
        const card2 = document.querySelector('.card2');
        const card = document.querySelector('.card');
        const profileContainer = document.querySelector('.profile-container');
        
        if (profilePic) {
            // Reset GSAP transforms but preserve CSS hover capabilities
            gsap.set(profilePic, { 
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                transformOrigin: "center center"
                // Removed clearProps to allow CSS hover effects
            });
            
            // Ensure hover effects work by preserving CSS transition capability
            if (profilePic.parentElement && profilePic.parentElement.classList.contains('card')) {
                profilePic.parentElement.style.transition = 'all 0.3s ease';
            }
            
            // Force CSS centering properties for profile picture
            profilePic.style.margin = '0 auto';
            profilePic.style.display = 'block';
            profilePic.style.position = 'relative';
            profilePic.style.left = '0';
            profilePic.style.right = '0';
            profilePic.style.transform = 'none';
        }
        
        if (card2) {
            // Ensure card2 container maintains proper centering
            gsap.set(card2, { 
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0
                // Removed clearProps to allow CSS hover effects
            });
            
            // Force CSS centering properties
            card2.style.display = 'flex';
            card2.style.alignItems = 'center';
            card2.style.justifyContent = 'center';
            card2.style.margin = '0 auto';
            card2.style.position = 'relative';
            card2.style.left = '0';
            card2.style.right = '0';
            card2.style.transform = 'none';
        }
        
        if (card) {
            // Reset card container and ensure perfect centering
            gsap.set(card, { 
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0
                // Removed clearProps to allow CSS hover effects
            });
            
            // Apply simple centering without complex transforms
            card.style.margin = '0 auto 1.5rem auto';
            card.style.position = 'relative';
            card.style.left = '0';
            card.style.right = '0';
            card.style.transform = 'none';
            card.style.display = 'block';
            card.style.alignSelf = 'center';
        }
        
        if (profileContainer) {
            // Ensure profile container centering across all devices
            profileContainer.style.display = 'flex';
            profileContainer.style.flexDirection = 'column';
            profileContainer.style.alignItems = 'center';
            profileContainer.style.justifyContent = 'center';
            profileContainer.style.textAlign = 'center';
            profileContainer.style.width = '100%';
            profileContainer.style.position = 'relative';
            profileContainer.style.left = '0';
            profileContainer.style.right = '0';
            profileContainer.style.transform = 'none';
        }
    }
    
    // Enhanced function to ensure centering on window resize
    function ensureResponsiveCentering() {
        resetProfilePicTransforms();
        
        // Force reflow to ensure CSS changes take effect
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
            profileContainer.offsetHeight; // Trigger reflow
            profileContainer.style.display = 'flex';
        }
    }
    
    // Reset immediately on load
    resetProfilePicTransforms();
    
    // Reset periodically to ensure it stays centered (more frequent for better consistency)
    setInterval(resetProfilePicTransforms, 500);
    
    // Also reset on window resize to handle responsive changes
    window.addEventListener('resize', () => {
        setTimeout(resetProfilePicTransforms, 100);
    });
    
    // Reset after any GSAP animation completes
    gsap.ticker.add(() => {
        // Only reset if there are no active tweens on profile elements
        const profilePic = document.querySelector('.profile-pic');
        const card2 = document.querySelector('.card2');
        if (profilePic && !gsap.isTweening(profilePic) && !gsap.isTweening(card2)) {
            // Check every few frames when animations are idle
            if (gsap.ticker.frame % 60 === 0) {
                resetProfilePicTransforms();
            }
        }
    });
    
    document.body.classList.add('visible');
    
    // Run floating elements check less frequently to avoid interference
    setInterval(ensureFloatingElements, 5000);
    
    // Add window resize listener for responsive centering
    window.addEventListener('resize', ensureResponsiveCentering);
    window.addEventListener('orientationchange', () => {
        setTimeout(ensureResponsiveCentering, 100);
    });
    
    // Ensure centering after page load
    setTimeout(resetProfilePicTransforms, 500);
    
    // Initialize hover effects to ensure they work after GSAP resets
    setTimeout(initializeHoverEffects, 600);
});

// Function to reinitialize hover effects
function initializeHoverEffects() {
    const card = document.querySelector('.card');
    const profileContainer = document.querySelector('.profile-container');
    
    if (card) {
        // Ensure the card can accept hover effects
        card.style.pointerEvents = 'auto';
        card.style.cursor = 'pointer';
        
        // Force CSS transitions to be enabled
        card.style.transition = 'all 0.3s ease, border 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease';
        
        // Test hover effect programmatically
        console.log('Hover effects initialized for profile card');
    }
    
    if (profileContainer) {
        profileContainer.style.pointerEvents = 'auto';
    }
}

// Handle cleanup before unload
window.addEventListener('beforeunload', () => {
    gsap.killTweensOf("*");
});