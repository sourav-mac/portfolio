barba.init({
  transitions: [
    {
      name: 'smooth-slide-horizontal',

      async leave({ current }) {
        const leaveEls = current.container.querySelectorAll("*:not(script):not(style):not(.gallery img)");

        const tl = gsap.timeline();
        tl.to(leaveEls, {
          x: -100,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.02
        });

        return tl;
      },

      // ✅ Make enter() async and return the animation
      async enter({ next }) {
        const enterEls = next.container.querySelectorAll("*:not(script):not(style):not(.gallery img)");

        gsap.set(enterEls, {
          x: 100,
          opacity: 0
        });

        const tl = gsap.timeline();
        tl.to(enterEls, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.02
        });

        return tl;
      },

      once({ next }) {
        const els = next.container.querySelectorAll("*:not(script):not(style):not(.gallery img)");

        gsap.set(els, {
          x: 100,
          opacity: 0
        });

        return gsap.to(els, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.02
        });
      },

      afterEnter({ next }) {
        // ✅ Re-enable gallery hover scaling
        const galleryImages = next.container.querySelectorAll(".gallery img");
        gsap.set(galleryImages, {
          clearProps: "all",
          opacity: 1
        });

        // ✅ Highlight active nav link manually
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll(".nav-links a");

        navLinks.forEach(link => {
          const linkPath = new URL(link.href, location.origin).pathname;
          if (linkPath === currentPath) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });

        document.body.classList.add("visible");
      }
    }
  ]
});

// ✅ Handle back/forward navigation and page restore
window.addEventListener("pageshow", () => {
  document.body.classList.add("visible");
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("visible");
});
