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
// Chat Widget Implementation
// ===============================
function initChatWidget() {
    const chatToggle = document.getElementById("chat-toggle");
    const chatWidget = document.getElementById("chat-widget");
    const chatClose = document.getElementById("chat-close");
    const chatBox = document.getElementById("chat-box");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const spinner = document.getElementById("chat-loading");

    // Clean up and reinitialize chat toggle
    if (chatToggle && chatWidget) {
        const newChatToggle = chatToggle.cloneNode(true);
        chatToggle.parentNode.replaceChild(newChatToggle, chatToggle);
        newChatToggle.addEventListener("click", () => {
            chatWidget.style.display = "flex";
            newChatToggle.style.display = "none";
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        });
    }

    // Clean up and reinitialize chat close
    if (chatClose && chatWidget && chatToggle) {
        const newChatClose = chatClose.cloneNode(true);
        chatClose.parentNode.replaceChild(newChatClose, chatClose);
        newChatClose.addEventListener("click", () => {
            chatWidget.style.display = "none";
            chatToggle.style.display = "block";
        });
    }

    function appendMessage(content, type = "bot") {
        if (!chatBox || !spinner) return;
        const msg = document.createElement("div");
        msg.className = type === "user" ? "user-msg" : "bot-msg";
        msg.innerHTML = content;
        chatBox.insertBefore(msg, spinner);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        if (!input?.value.trim()) return;
        const message = input.value.trim();
        
        appendMessage(message, "user");
        input.value = "";
        
        if (spinner) spinner.style.display = "flex";
        
        try {
            const res = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            if (spinner) spinner.style.display = "none";
            appendMessage(data.reply || "No response.", "bot");
        } catch (error) {
            if (spinner) spinner.style.display = "none";
            appendMessage("Error: " + error.message, "bot");
        }
    }

    // Clean up and reinitialize send button
    if (sendBtn) {
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        newSendBtn.addEventListener("click", sendMessage);
    }

    // Clean up and reinitialize input
    if (input) {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        newInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }
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
    debug: true,
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
        name: 'element-cascade-transition',
        sync: false,

        beforeOnce() {
            initNavigation();
            initChatWidget();
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
            const elements = slideTransition.prepareElements(data.current.container);
            if (elements) {
                await slideTransition.animateOut(elements);
            }
        },

        async enter(data) {
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
// Initialize Everything
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChatWidget();
    document.body.classList.add('visible');
});

// Handle cleanup before unload
window.addEventListener('beforeunload', () => {
    gsap.killTweensOf("*");
});