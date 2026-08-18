/*
  ============================================================
  DATA.JS — Panel de contenido controlable del portafolio
  ============================================================
  Edita SOLO este archivo para cambiar proyectos, redes sociales
  o el email de contacto. No necesitas tocar index.html, style.css
  ni script.js para actualizar esta información.
*/

window.SITE_DATA = {

  // ----------------------------------------------------------
  // CONTACTO
  // ----------------------------------------------------------
  contact: {
    // Email real donde llegarán los mensajes del formulario.
    email: "stimonl06@gmail.com",
  },

  // ----------------------------------------------------------
  // REDES SOCIALES
  // Deja "" (vacío) en las que aún no tengas: el ícono no se
  // mostrará hasta que agregues la URL.
  // ----------------------------------------------------------
  social: {
    github: "https://github.com/MarlonM001",
    linkedin: "",
    twitter: "",
  },

  // ----------------------------------------------------------
  // PROYECTOS
  // Estos 3 son EJEMPLOS/PLACEHOLDER. Reemplázalos por tus
  // proyectos reales cuando los tengas: cambia title, description,
  // tech (array de tecnologías), y los links.
  // ----------------------------------------------------------
  projects: [
    {
      title: "Portafolio Personal",
      description: "Este mismo sitio: portafolio web responsivo construido con HTML, CSS y JavaScript puro, con tema claro/oscuro y contenido controlable desde un panel de datos.",
      tech: ["HTML5", "CSS3", "JavaScript"],
      image: "",
      repo: "https://github.com/MarlonM001/Portafolio_Marlon",
      demo: "https://marlonm001.github.io/Portafolio_Marlon/",
    },
    {
      title: "Proyecto Ejemplo 2",
      description: "TODO: reemplaza este texto con la descripción real de tu segundo proyecto (qué problema resuelve, qué hiciste tú).",
      tech: ["HTML5", "CSS3", "JavaScript"],
      image: "",
      repo: "",
      demo: "",
    },
    {
      title: "Proyecto Ejemplo 3",
      description: "TODO: reemplaza este texto con la descripción real de tu tercer proyecto.",
      tech: ["Git", "GitHub"],
      image: "",
      repo: "",
      demo: "",
    },
  ],
};
