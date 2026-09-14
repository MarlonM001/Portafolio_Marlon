/*
  ============================================================
  DATA.JS — Contenido del portafolio, organizado por planeta
  ============================================================
  Edita SOLO este archivo para actualizar tu información.
  No necesitas tocar sistema-solar.html, style.css ni script.js.
*/

window.SITE_DATA = {

  contact: {
    email: "stimonl06@gmail.com",
    phone: "+57 312 443 2044",
    location: "Yopal, Casanare, Colombia",
  },

  social: {
    github: "https://github.com/MarlonM001",
    linkedin: "https://www.linkedin.com/in/stiven-monsalve-341b42435/",
    twitter: "",
  },

  // ---------------------------------------------------------
  // TIERRA — Sobre mí
  // ---------------------------------------------------------
  profile: {
    name: "Marlon Stiven Monsalve Pulido",
    role: "Desarrollador Full-Stack Junior",
    photo: "assets/foto-perfil.jpg",
    highlight: "🏆 Primer Lugar — Hackathon Regional Casanare (Colombia 5.0) con AgroIA Casanare",
    bio: [
      "Estudiante de Análisis y Desarrollo de Software del SENA con experiencia construyendo y desplegando aplicaciones full-stack reales.",
      "Integrante del equipo ganador del Primer Lugar en la Hackathon Regional Casanare (Colombia 5.0) con AgroIA Casanare, un sistema de agentes de Inteligencia Artificial para comercialización agrícola, donde desarrollé el backend y la integración de APIs.",
      "He construido y desplegado de forma individual tiendas de e-commerce completas (React, Vite, Tailwind CSS, Node.js/Express), APIs REST en NestJS, Django REST Framework y Go, y sitios web con JavaScript.",
      "Persona proactiva, responsable y con facilidad para el trabajo en equipo. Busco una oportunidad como desarrollador full-stack junior, presencial o remota.",
    ],
  },

  // ---------------------------------------------------------
  // MERCURIO — Experiencia
  // ---------------------------------------------------------
  experience: [
    {
      role: "Agente de Soporte Técnico — Operación ETB",
      place: "Comdata · Yopal, Casanare",
      date: "2022",
      description: "Brindé soporte técnico a usuarios de telecomunicaciones, resolviendo incidencias de conectividad y de servicio. Reconocido por el cumplimiento de indicadores y procesos de soporte técnico.",
    },
    {
      role: "Auxiliar de Aprovisionamiento y Mantenimiento",
      place: "OPEGIN S.A.S. · Casanare",
      date: "Sep. 2019 – Mar. 2020",
      description: "Apoyé los procesos de aprovisionamiento y mantenimiento técnico dentro de la operación asignada por la empresa (contrato de aprendizaje).",
    },
    {
      role: "Decorador",
      place: "El Palacio de la Pizza · Yopal, Casanare",
      date: "Ago. 2017 – Jul. 2019",
      description: "Desempeñé labores operativas y de atención al público, demostrando responsabilidad y cumplimiento durante casi dos años.",
    },
  ],

  // ---------------------------------------------------------
  // VENUS — Estudios y certificaciones
  // ---------------------------------------------------------
  studies: [
    { title: "Análisis y Desarrollo de Software", place: "SENA · Estudiante activo", date: "En curso" },
    { title: "Técnico en Implementación y Mantenimiento de Equipos Electrónicos Industriales", place: "SENA · Yopal, Casanare", date: "2021" },
    { title: "Bachiller Académico", place: "I.E. Luis Hernández Vargas · Yopal, Casanare", date: "2017" },
  ],

  certifications: [
    { title: "Reconocimiento a Indicadores y Procesos de Soporte Técnico", place: "Comdata (Operación ETB)", date: "Nov. 2022" },
    { title: "Seminario Taller de Programación de Software y Hardware en Mantenimiento y Reparación de Celulares", place: "Academia Cell, 25h", date: "Ago. 2019" },
    { title: "Robótica Humanoide e Inteligente — Robot Humanoide Inteligente", place: "SENA, 4h", date: "Dic. 2025" },
    { title: "Fundamentos de la IA — Inteligencia Artificial Aplicada", place: "SENA, 4h", date: "Dic. 2025" },
    { title: "Robótica Humanoide e Inteligente — Sensores e Inteligencia Artificial Aplicada", place: "SENA, 4h", date: "Dic. 2025" },
  ],

  // ---------------------------------------------------------
  // MARTE — Proyectos
  // ---------------------------------------------------------
  projects: [
    {
      title: "AgroIA Casanare",
      description: "Sistema de tres agentes de IA que permite a un productor agrícola publicar su oferta por nota de voz en Telegram, y a un comprador encontrarla en lenguaje natural. Proyecto ganador del Primer Lugar en la Hackathon Regional Casanare.",
      tech: ["Python", "FastAPI", "Telegram Bot API"],
      repo: "",
      demo: "",
    },
    {
      title: "Tienda-Online — Mercado Central",
      description: "Tienda en línea multicategoría con cliente en React/Vite/Tailwind y servidor propio en Express. Panel de administrador completo, checkout por WhatsApp y reportes en PDF.",
      tech: ["React", "Vite", "Tailwind CSS", "Express", "lowdb", "JWT"],
      repo: "https://github.com/MarlonM001/Tienda-Online",
      demo: "",
    },
    {
      title: "Essence Polar — Tienda de Perfumería",
      description: "Tienda de perfumería con catálogo por categorías, checkout vía WhatsApp, cuentas de cliente y panel de administración con reportes de ventas exportables a PDF.",
      tech: ["React", "Vite", "Tailwind CSS v4", "jsPDF"],
      repo: "https://github.com/MarlonM001/Lociones",
      demo: "https://lociones-sable.vercel.app",
    },
    {
      title: "CATALOGO_CORE_CRUD",
      description: "Microservicio backend en Go para la plataforma colaborativa Jobsy: centraliza datos de referencia y gestión de identidad de usuarios, con arquitectura por capas.",
      tech: ["Go", "Gorilla Mux", "PostgreSQL"],
      repo: "https://github.com/MarlonM001/CATALOGO_CORE_CRUD",
      demo: "",
    },
    {
      title: "API de Red Social",
      description: "API REST con NestJS y MongoDB/Mongoose, validación por DTOs, encriptación de contraseñas con bcrypt y documentación Swagger/OpenAPI.",
      tech: ["TypeScript", "NestJS", "MongoDB"],
      repo: "https://github.com/MarlonM001/API_RED_SOCIAL",
      demo: "",
    },
    {
      title: "Sistema de Gestión de Recursos Humanos",
      description: "API REST de gestión de RRHH con autenticación, permisos por rol, auditoría automática de cambios y exportación de datos a CSV/Excel.",
      tech: ["Python", "Django REST Framework"],
      repo: "https://github.com/MarlonM001/Sistema-de-Gesti-n-de-Recursos-Humanos",
      demo: "",
    },
    {
      title: "Lavaautos — NOCTA",
      description: "Landing page para un negocio de lavado y detallado de vehículos, con música electrónica generativa, galería de antes/después y citas vía WhatsApp.",
      tech: ["HTML", "CSS", "JavaScript", "Tone.js"],
      repo: "https://github.com/MarlonM001/Lavaautos",
      demo: "https://lavaautos-seven.vercel.app",
    },
  ],

  // ---------------------------------------------------------
  // JÚPITER — Hobbies
  // ---------------------------------------------------------
  hobbies: [
    { title: "Deporte", description: "Practicar actividades físicas para mantener disciplina y energía." },
    { title: "Música", description: "Escuchar música electrónica como fuente de inspiración y concentración." },
    { title: "Moto", description: "Salir a rodar y disfrutar nuevas experiencias sobre dos ruedas." },
    { title: "Proyectos Personales", description: "Desarrollar ideas propias para mejorar habilidades técnicas." },
    { title: "Videojuegos", description: "Entretenimiento estratégico y competitivo." },
    { title: "Aprender Tecnología", description: "Explorar constantemente nuevas herramientas y tendencias tech." },
  ],

  // ---------------------------------------------------------
  // SATURNO — Sueños (estrellas fugaces por atrapar)
  // ---------------------------------------------------------
  dreams: [
    { title: "Desarrollador Profesional", description: "Convertirme en un desarrollador altamente competitivo y reconocido." },
    { title: "Empresa Tech", description: "Crear mi propia startup tecnológica y generar oportunidades laborales." },
    { title: "Ingresos Digitales", description: "Desarrollar plataformas web que generen ingresos sostenibles." },
    { title: "Trabajo Internacional", description: "Trabajar de manera remota con empresas globales." },
    { title: "Innovación", description: "Crear soluciones tecnológicas que impacten positivamente la sociedad." },
    { title: "Conocer Lugares en Moto", description: "Recorrer nuevas rutas y lugares, viviendo la libertad de la carretera." },
  ],

  // ---------------------------------------------------------
  // AGUJERO NEGRO — Debilidades / áreas de mejora
  // ---------------------------------------------------------
  weaknesses: [
    { group: "Como developer junior", title: "Inglés técnico", description: "Aún en proceso de dominarlo para leer documentación y comunicarme sin fricciones." },
    { group: "Como developer junior", title: "Trabajo en equipo en producción", description: "Experiencia limitada colaborando con otros devs en proyectos reales a gran escala." },
    { group: "Como persona", title: "Autoexigencia", description: "Puedo ser demasiado exigente conmigo mismo, al punto de la autocrítica excesiva." },
    { group: "Como persona", title: "Pedir ayuda", description: "Prefiero intentarlo todo por mi cuenta antes de pedir apoyo." },
    { group: "Como hijo", title: "Tiempo en casa", description: "A veces priorizo el trabajo y el estudio por encima del tiempo con la familia." },
    { group: "Como hermano", title: "Expresar emociones", description: "Soy reservado y me cuesta expresar abiertamente lo que siento." },
  ],

  // ---------------------------------------------------------
  // VOYAGER 1 — Hacia dónde voy (próximas tecnologías)
  // ---------------------------------------------------------
  learningGoals: [
    { title: "Angular", description: "Sumar un segundo framework de frontend a mi caja de herramientas." },
    { title: "Inglés técnico avanzado", description: "Ganar fluidez para trabajar en equipos internacionales." },
    { title: "Testing automatizado", description: "Jest, Pytest y pruebas end-to-end para escribir código más confiable." },
    { title: "DevOps y contenedores", description: "Docker, CI/CD y despliegues más profesionales." },
    { title: "Arquitectura de microservicios", description: "Diseñar sistemas backend distribuidos y escalables." },
  ],

  // ---------------------------------------------------------
  // JUNO — Metas cercanas (a corto plazo)
  // ---------------------------------------------------------
  nearTermGoals: [
    { title: "Graduarme como Tecnólogo ADSO", description: "Terminar mi formación en el SENA." },
    { title: "Primera oportunidad full-stack junior", description: "Conseguir mi primer empleo formal como desarrollador." },
    { title: "Contribuir a un proyecto open source", description: "Aportar código real a la comunidad." },
    { title: "Certificar mi inglés", description: "Obtener una certificación formal de nivel de inglés." },
  ],
};
