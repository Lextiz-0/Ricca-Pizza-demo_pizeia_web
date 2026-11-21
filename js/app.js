/* =========================================
   RICCA PIZZA — FUNCIONES GENERALES
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNavigation = document.getElementById("mainNavigation");
  const currentYear = document.getElementById("currentYear");
  const header = document.querySelector(".site-header");

  /* Año automático del pie de página */
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* Abrir y cerrar navegación móvil */
  function closeMobileNavigation() {
    if (!menuToggle || !mainNavigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    mainNavigation.classList.remove("is-open");
  }

  if (menuToggle && mainNavigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación"
      );

      mainNavigation.classList.toggle("is-open", !isOpen);
    });

    /* Cerrar al seleccionar una sección */
    mainNavigation.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);

        if (!target) return;

        event.preventDefault();
        closeMobileNavigation();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth"
        });

        history.replaceState(null, "", `#${targetId}`);
      });
    });

    /* Cerrar si se cambia a pantalla grande */
    window.addEventListener("resize", () => {
      if (window.innerWidth > 650) {
        closeMobileNavigation();
      }
    });
  }
});