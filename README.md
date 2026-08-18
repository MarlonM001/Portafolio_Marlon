# Portafolio_Marlon

Bienvenido al portafolio web de **Marlon Monsalve**, un desarrollador web en formación con enfoque en experiencias digitales modernas, funcionales y responsivas.

Este repositorio contiene la versión web de mi portafolio personal, donde podrás encontrar mi presentación, experiencia, proyectos, conocimientos, estudios, hobbies, sueños y contacto.

**Visita la versión publicada:**  
[https://marlonm001.github.io/Portafolio_Marlon/](https://marlonm001.github.io/Portafolio_Marlon/)

---

## Descripción del Proyecto

El objetivo de este portafolio es presentar de forma visual y profesional mi perfil como desarrollador web. Aquí se muestran mis proyectos, habilidades, experiencia educativa y motivación para continuar creciendo en el desarrollo front-end.

Está construido con **HTML, CSS y JavaScript puro**, usando buenas prácticas de diseño y una estructura semántica moderna.

---

## Características Principales

- ✔ Diseño moderno, atractivo y responsivo
- ✔ Tema claro/oscuro con preferencia guardada en el navegador
- ✔ Menú de navegación fijo con versión hamburguesa en móvil
- ✔ Animaciones de aparición al hacer scroll y resaltado de sección activa
- ✔ Fondo de partículas animado en la sección de inicio
- ✔ Sección de Proyectos generada dinámicamente
- ✔ Formulario de contacto funcional (sin backend propio)
- ✔ Contenido controlable desde un único archivo de datos (`data.js`)
- ✔ Compatible con todos los dispositivos (PC, tablet y móvil)

---

## Tecnologías usadas

- ✔ HTML5
- ✔ CSS3 (variables CSS para temas, Grid, Flexbox)
- ✔ JavaScript (vanilla, sin frameworks ni build)
- ✔ Font Awesome (iconos)
- ✔ FormSubmit.co (envío del formulario de contacto)
- ✔ Git & GitHub (Pages)

---

## Cómo editar el contenido

Todo el contenido variable del sitio (proyectos, redes sociales y email de contacto) vive en **`data.js`**. No hace falta tocar `index.html`, `style.css` ni `script.js` para actualizarlo.

### Agregar o editar un proyecto

Edita el arreglo `projects` en `data.js`:

```js
{
  title: "Nombre del proyecto",
  description: "Qué hace y qué hiciste tú.",
  tech: ["HTML5", "CSS3", "JavaScript"],
  image: "assets/mi-proyecto.png", // opcional, deja "" para usar un ícono
  repo: "https://github.com/usuario/repo",
  demo: "https://mi-demo.com", // opcional
}
```

Actualmente hay 3 proyectos cargados: este mismo portafolio (real) y 2 placeholders marcados con `TODO` — reemplaza esos 2 por tus proyectos reales cuando los tengas.

### Redes sociales

En `data.js`, dentro de `social`, coloca la URL completa. Si la dejas vacía (`""`), el ícono simplemente no se muestra:

```js
social: {
  github: "https://github.com/MarlonM001",
  linkedin: "",
  twitter: "",
}
```

### Email de contacto

Cambia `contact.email` en `data.js`. Es el correo al que llegan los mensajes del formulario.

---

## Activar el formulario de contacto

El formulario usa [FormSubmit.co](https://formsubmit.co), un servicio gratuito que no requiere backend ni registro. **La primera vez** que alguien envíe el formulario, FormSubmit mandará un correo de confirmación a la dirección configurada en `data.js` (`contact.email`) — hay que hacer clic en ese enlace **una sola vez** para activar el envío automático. Después de esa confirmación, todos los mensajes llegan directo a esa bandeja de entrada.

---

## Ejecutar en local

Al no tener build ni dependencias, basta con servir la carpeta como archivos estáticos, por ejemplo:

```bash
npx serve .
```

y abrir la URL que indique en el navegador.
