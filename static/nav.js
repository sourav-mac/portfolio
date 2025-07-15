document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("show");
    });
  }

  // Highlight active nav item
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPage = location.pathname.split("/").pop();
  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});


// for toggle button
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    const isDark = localStorage.getItem("theme") === "dark";

    // Set initial toggle state
    if (isDark) {
      document.body.classList.add("dark-mode");
      toggle.checked = true;
    }

    document.body.classList.add("visible");

    // Toggle functionality
    toggle.addEventListener("change", () => {
      const dark = toggle.checked;
      document.body.classList.toggle("dark-mode", dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
    });
  });

