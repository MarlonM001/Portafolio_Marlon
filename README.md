# Portafolio_Marlon

Bienvenido al portafolio web de **Marlon Monsalve**, desarrollador full-stack junior.

Este portafolio se presenta como un **sistema solar interactivo en 3D**: cada planeta representa una sección — haz clic (o usa el menú) para explorar mi perfil, proyectos, experiencia, estudios, hobbies, sueños y contacto.

**Visita la versión publicada:**
[https://marlonm001.github.io/Portafolio_Marlon/](https://marlonm001.github.io/Portafolio_Marlon/)

---

## Mapa del sistema solar

| Cuerpo | Sección |
|---|---|
| 🌍 Tierra | Sobre mí |
| ♂ Marte | Proyectos |
| ☿ Mercurio | Experiencia |
| ♀ Venus | Estudios y certificaciones |
| ♃ Júpiter | Hobbies |
| ♄ Saturno | Sueños |
| ☀ Sol | Contacto |

---

## Descripción del Proyecto

El objetivo de este portafolio es presentar de forma visual, memorable y profesional mi perfil como desarrollador. La escena 3D usa planetas con texturas generadas por código, órbitas animadas y una cámara que se enfoca en el cuerpo celeste seleccionado, abriendo un panel lateral con el contenido correspondiente.

Está construido con **HTML, CSS y JavaScript puro** (sin build ni frameworks), usando [Three.js](https://threejs.org/) vía módulos ES para el render 3D.

---

## Características Principales

- ✔ Sistema solar 3D interactivo (Three.js) con órbitas, rotación y controles de cámara
- ✔ Navegación por clic directo en los planetas o desde el menú superior
- ✔ Panel de contenido deslizante con diseño "glass" y animaciones suaves
- ✔ Texturas de planetas generadas 100% por código (sin imágenes externas)
- ✔ Formulario de contacto funcional (sin backend propio, vía FormSubmit)
- ✔ Contenido controlable desde un único archivo de datos (`data.js`)
- ✔ Responsivo: menú colapsable y panel a pantalla completa en móvil

---

## Tecnologías usadas

- ✔ HTML5 + CSS3 (variables, Grid, Flexbox, backdrop-filter)
- ✔ JavaScript (vanilla, módulos ES, sin build)
- ✔ [Three.js](https://threejs.org/) + OrbitControls (vía CDN/importmap)
- ✔ Font Awesome (iconos)
- ✔ FormSubmit.co (envío del formulario de contacto)
- ✔ Git & GitHub Pages

---

## Cómo editar el contenido

Todo el contenido vive en **`data.js`**: perfil, experiencia, estudios, certificaciones, proyectos, hobbies, sueños, contacto y redes sociales. No hace falta tocar `index.html`, `style.css` ni `script.js` para actualizarlo.

Para agregar o quitar un planeta/sección, edita también `PLANET_CONFIG` y `PANEL_TITLES` en `script.js`.

### Redes sociales

En `data.js`, dentro de `social`, coloca la URL completa. Si la dejas vacía (`""`), el ícono no se muestra.

### Email de contacto

Cambia `contact.email` en `data.js`. Es el correo al que llegan los mensajes del formulario (requiere confirmar el primer envío en FormSubmit, ver más abajo).

---

## Activar el formulario de contacto

El formulario usa [FormSubmit.co](https://formsubmit.co), un servicio gratuito que no requiere backend ni registro. **La primera vez** que alguien lo envíe, FormSubmit mandará un correo de confirmación a `contact.email` — hay que confirmarlo **una sola vez**. Después, todos los mensajes llegan directo a esa bandeja.

---

## Ejecutar en local

Al usar módulos ES, el sitio debe servirse por HTTP (no abrir `index.html` directamente como archivo):

```bash
npx serve .
```

y abrir la URL que indique en el navegador.
