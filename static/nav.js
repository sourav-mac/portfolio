document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Toggle Mobile Navbar using Uiverse.io Hamburger Checkbox
  const hamburgerCheckbox = document.getElementById("hamburgerCheckbox");
  const links = document.getElementById("navLinks");

  if (hamburgerCheckbox && links) {
    hamburgerCheckbox.addEventListener("change", () => {
      links.classList.toggle("show");
    });
  }

  // 🔹 Highlight Active Nav Item
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 🔹 Theme Toggle with Persistence
  const themeToggle = document.getElementById("themeToggle");
  const isDark = localStorage.getItem("theme") === "dark";

  if (isDark) {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    const dark = themeToggle.checked;
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  });

  // 🔹 Fade-in Transition on Load
  document.body.classList.add("visible");
});

window.addEventListener("pageshow", () => {
  document.body.classList.add("visible");
});
