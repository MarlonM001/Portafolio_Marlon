/*
  ============================================================
  SCRIPT.JS — Interactividad del portafolio
  ============================================================
  Usa el contenido definido en data.js (variable global SITE_DATA).
*/

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initScrollReveal();
  initActiveNavLink();
  renderProjects();
  renderSocialLinks();
  initContactForm();
  initParticles();
});

/* ============================================================
   TEMA CLARO / OSCURO
   ============================================================ */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const icon = toggleBtn.querySelector("i");

  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = saved || (prefersLight ? "light" : "dark");
  applyTheme(initial);

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

/* ============================================================
   MENÚ HAMBURGUESA (MÓVIL)
   ============================================================ */
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.querySelector("i").className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelector("i").className = "fa-solid fa-bars";
    });
  });
}

/* ============================================================
   ANIMACIONES AL HACER SCROLL (REVEAL)
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".section-title, .timeline-item, .card, .project-card, .contact-wrapper"
  );

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ============================================================
   ENLACE ACTIVO EN NAVBAR SEGÚN SECCIÓN VISIBLE
   ============================================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   RENDERIZADO DE PROYECTOS (desde SITE_DATA.projects)
   ============================================================ */
function renderProjects() {
  const container = document.getElementById("projects-container");
  if (!container || !window.SITE_DATA) return;

  const { projects } = window.SITE_DATA;

  container.innerHTML = projects
    .map(
      (project) => `
      <div class="project-card">
        <div class="project-image">
          ${
            project.image
              ? `<img src="${escapeHtml(project.image)}" alt="Captura de ${escapeHtml(project.title)}">`
              : `<i class="fa-solid fa-code"></i>`
          }
        </div>
        <div class="project-body">
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="skills-container">
            ${project.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}
          </div>
          <div class="project-links">
            ${project.repo ? `<a href="${escapeHtml(project.repo)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Código</a>` : ""}
            ${project.demo ? `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ""}
          </div>
        </div>
      </div>`
    )
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* ============================================================
   REDES SOCIALES (desde SITE_DATA.social)
   ============================================================ */
function renderSocialLinks() {
  if (!window.SITE_DATA) return;
  const { social } = window.SITE_DATA;

  const icons = {
    github: "fa-brands fa-github",
    linkedin: "fa-brands fa-linkedin",
    twitter: "fa-brands fa-twitter",
  };

  const links = Object.entries(social)
    .filter(([, url]) => url)
    .map(
      ([key, url]) =>
        `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${key}"><i class="${icons[key]}"></i></a>`
    )
    .join("");

  const contactSocial = document.getElementById("social-container");
  const footerSocial = document.getElementById("footer-social");

  if (contactSocial) contactSocial.innerHTML = links;
  if (footerSocial) footerSocial.innerHTML = links;
}

/* ============================================================
   FORMULARIO DE CONTACTO (vía FormSubmit.co)
   ============================================================
   La primera vez que se envíe un mensaje, FormSubmit enviará un
   correo de confirmación al email configurado en data.js. Hay que
   confirmarlo una sola vez para activar el envío automático.
*/
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !window.SITE_DATA) return;

  const email = window.SITE_DATA.contact.email;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Campo trampa anti-spam: si viene lleno, se ignora el envío.
    if (form._honey.value) return;

    const submitBtn = form.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    status.textContent = "";
    status.className = "form-status";

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error("Error en el envío");

      status.textContent = "¡Mensaje enviado con éxito! Te responderé pronto.";
      status.classList.add("success");
      form.reset();
    } catch (err) {
      status.textContent = "No se pudo enviar el mensaje. Intenta de nuevo o escríbeme directo a " + email;
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar mensaje";
    }
  });
}

/* ============================================================
   FONDO DE PARTÍCULAS SUTIL EN EL HERO
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  let particles = [];
  let animationId;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  function resize() {
    canvas.width = hero.clientWidth;
    canvas.height = hero.clientHeight;
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    particles = Array.from({ length: count }, createParticle);
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    };
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#38bdf8";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
    });

    ctx.globalAlpha = 0.15;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    animationId = requestAnimationFrame(tick);
  }

  resize();
  tick();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      resize();
      tick();
    }, 200);
  });
}
