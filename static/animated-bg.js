// ===============================
// Animated Background - Barba.js Style
// ===============================

class AnimatedBackground {
    constructor() {
        this.container = null;
        this.shapes = [];
        this.maxShapes = window.innerWidth > 768 ? 30 : 18; // Increased particle count
        this.animationId = null;
        this.isActive = false;
        this.init();
    }

    init() {
        this.createContainer();
        this.createShapes();
        this.startAnimation();
        this.isActive = true;
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle visibility change to pause/resume animation
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    createContainer() {
        // Remove existing container if any
        const existing = document.querySelector('.animated-background');
        if (existing) existing.remove();

        this.container = document.createElement('div');
        this.container.className = 'animated-background';
        document.body.appendChild(this.container);
    }

    createShapes() {
        for (let i = 0; i < this.maxShapes; i++) {
            this.createShape();
        }
    }

    createShape() {
        const shape = document.createElement('div');
        const shapeTypes = ['circle', 'triangle', 'square', 'hexagon', 'diamond', 'star'];
        const animationTypes = ['float', 'side-float', 'pulse', 'spiral', 'bounce'];
        
        const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const randomAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
        
        shape.className = `floating-shape ${randomType}`;
        
        // Add animation type - higher probability for more movement
        if (Math.random() > 0.3) {
            shape.classList.add(randomAnimation);
        }
        
        // Random size based on shape type - make them more prominent
        let size;
        if (randomType === 'circle') {
            size = Math.random() * 100 + 60; // 60-160px (larger)
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
        } else if (randomType === 'square' || randomType === 'diamond') {
            size = Math.random() * 80 + 50; // 50-130px (larger)
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
        } else if (randomType === 'triangle') {
            // Triangle size is controlled by border properties in CSS
            const scale = Math.random() * 1.5 + 1.0; // 1.0-2.5 scale (larger)
            shape.style.transform = `scale(${scale})`;
        } else if (randomType === 'hexagon' || randomType === 'star') {
            // Hexagon/star size is controlled by width/height in CSS
            const scale = Math.random() * 1.3 + 0.9; // 0.9-2.2 scale (larger)
            shape.style.transform = `scale(${scale})`;
        }
        
        // Random position
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        shape.style.animationDelay = `${Math.random() * 20}s`;
        
        // Random animation duration variation
        const baseDuration = randomType === 'triangle' ? 25 : randomType === 'square' ? 30 : 20;
        const duration = baseDuration + (Math.random() * 10 - 5); // ±5s variation
        shape.style.animationDuration = `${duration}s`;
        
        this.container.appendChild(shape);
        this.shapes.push(shape);
    }

    updateShapes() {
        // Remove excess shapes or add more as needed
        while (this.shapes.length > this.maxShapes) {
            const shape = this.shapes.pop();
            if (shape && shape.parentNode) {
                shape.remove();
            }
        }
        
        while (this.shapes.length < this.maxShapes) {
            this.createShape();
        }
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Periodically refresh shapes for variety
        const animate = () => {
            if (this.isActive) {
                // Randomly reset some shapes for continuous movement
                if (Math.random() > 0.995) { // Very low probability for smooth effect
                    const randomIndex = Math.floor(Math.random() * this.shapes.length);
                    const shape = this.shapes[randomIndex];
                    
                    if (shape) {
                        // Reset position for continuous movement
                        shape.style.left = `${Math.random() * 100}%`;
                        shape.style.animationDelay = '0s';
                        
                        // Occasionally change animation type
                        if (Math.random() > 0.8) {
                            const animationTypes = ['', 'side-float', 'pulse'];
                            const currentClasses = shape.className.split(' ');
                            const baseClasses = currentClasses.filter(cls => 
                                !['side-float', 'pulse'].includes(cls)
                            );
                            
                            const newAnimation = animationTypes[Math.floor(Math.random() * animationTypes.length)];
                            shape.className = baseClasses.join(' ') + (newAnimation ? ' ' + newAnimation : '');
                        }
                    }
                }
                
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    handleResize() {
        const newMaxShapes = window.innerWidth > 768 ? 30 : 18; // Updated for new particle count
        if (newMaxShapes !== this.maxShapes) {
            this.maxShapes = newMaxShapes;
            this.updateShapes();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    pause() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Pause CSS animations
        this.shapes.forEach(shape => {
            if (shape) {
                shape.style.animationPlayState = 'paused';
            }
        });
    }

    resume() {
        this.isActive = true;
        this.startAnimation();
        
        // Resume CSS animations
        this.shapes.forEach(shape => {
            if (shape) {
                shape.style.animationPlayState = 'running';
            }
        });
    }

    destroy() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        
        this.container = null;
        this.shapes = [];
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    reinitialize() {
        this.destroy();
        setTimeout(() => {
            this.init();
        }, 100);
    }

    // Method to add shapes dynamically
    addShape() {
        if (this.shapes.length < this.maxShapes + 5) { // Allow a few extra
            this.createShape();
        }
    }

    // Method to remove random shape
    removeRandomShape() {
        if (this.shapes.length > 5) { // Keep minimum shapes
            const randomIndex = Math.floor(Math.random() * this.shapes.length);
            const shape = this.shapes[randomIndex];
            if (shape && shape.parentNode) {
                shape.remove();
                this.shapes.splice(randomIndex, 1);
            }
        }
    }
}

// Global instance
let animatedBg = null;

// Initialize animated background
function initAnimatedBackground() {
    if (!animatedBg) {
        animatedBg = new AnimatedBackground();
    }
}

// Reinitialize animated background
function reinitAnimatedBackground() {
    if (animatedBg) {
        animatedBg.reinitialize();
    } else {
        initAnimatedBackground();
    }
}

// Destroy animated background
function destroyAnimatedBackground() {
    if (animatedBg) {
        animatedBg.destroy();
        animatedBg = null;
    }
}

// Check if we're on any page (show background on all pages)
function shouldShowAnimatedBackground() {
    // Show on all pages now
    return true;
}

// Initialize on DOM ready (for all pages)
function initAnimatedBackgroundOnAllPages() {
    if (shouldShowAnimatedBackground()) {
        initAnimatedBackground();
    } else {
        destroyAnimatedBackground();
    }
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimatedBackgroundOnAllPages);
} else {
    initAnimatedBackgroundOnAllPages();
}

// Export functions for use in main.js
window.initAnimatedBackground = initAnimatedBackground;
window.reinitAnimatedBackground = reinitAnimatedBackground;
window.destroyAnimatedBackground = destroyAnimatedBackground;
window.shouldShowAnimatedBackground = shouldShowAnimatedBackground;
window.initAnimatedBackgroundOnAllPages = initAnimatedBackgroundOnAllPages;
