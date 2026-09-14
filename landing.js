/*
  ============================================================
  LANDING.JS — Escena de bienvenida
  ============================================================
  Al hacer clic en la pantalla del televisor, hace una
  transición de salida antes de entrar al portafolio.
*/

document.addEventListener("DOMContentLoaded", () => {
  const link = document.querySelector(".tv-screen-link");
  const room = document.querySelector(".room");
  if (!link || !room) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    room.classList.add("leaving");
    setTimeout(() => {
      window.location.href = link.href;
    }, 420);
  });
});
