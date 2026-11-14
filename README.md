# Portafolio_Marlon

Bienvenido al portafolio web de **Marlon Monsalve**, desarrollador full-stack junior.

La entrada es una portada estilo "misión espacial": un marco con nebulosa, la Tierra de noche en 3D y un carrusel de 5 diapositivas (Sobre mí, Proyectos, Experiencia, Estudios y Contacto). Al entrar, un salto al hiperespacio te lleva al **universo**: un viaje en cohete guiado por el scroll donde cada parada es una sección del portafolio.

**Visita la versión publicada:**
[https://marlonm001.github.io/Portafolio_Marlon/](https://marlonm001.github.io/Portafolio_Marlon/)

---

## El viaje del universo

| Parada | Sección |
|---|---|
| 🌍 Tierra de noche | Inicio y despegue |
| 🌕 Luna y astronauta | Sobre mí |
| 🛰 Estación Espacial | Experiencia |
| ♀ Venus | Estudios y certificaciones |
| ☄ Cinturón de tarjetas | Habilidades |
| 🪐 Planeta con anillo | Proyectos (tarjetas en órbita, clic para ver detalles) |
| 🔵 Neptuno | Más allá: metas, aprendizaje, sueños, hobbies y áreas de mejora |
| ☀ Sol | Contacto |

Se navega con el scroll, el menú superior, el riel lateral o las flechas del teclado. Desde la portada se puede entrar directo a una sección: `sistema-solar.html#marte` (proyectos), `#tierra`, `#venus`, `#mercurio`, `#sol`.

---

## Descripción del Proyecto

El objetivo de este portafolio es presentar de forma visual, memorable y profesional mi perfil como desarrollador. La escena 3D usa planetas con texturas reales (NASA/ESA vía Solar System Scope), órbitas animadas y una cámara que se enfoca en el cuerpo celeste seleccionado, abriendo un panel lateral con el contenido correspondiente.

Está construido con **HTML, CSS y JavaScript puro** (sin build ni frameworks), usando [Three.js](https://threejs.org/) vía módulos ES para el render 3D.

---

## Características Principales

- ✔ Portada con carrusel 01/05, planetas 3D con atmósfera (Three.js), parallax con el mouse y salto al hiperespacio
- ✔ Navegación de la portada con menú, rueda del mouse, flechas del teclado y deslizar en móvil
- ✔ Enlaces directos a cada planeta: `sistema-solar.html#marte`, `#tierra`, `#sol`…
- ✔ Viaje en cohete por el universo guiado por el scroll (Three.js): cámara con recorrido, cohete con llama y partículas, astronauta, Estación Espacial y planetas
- ✔ Tarjetas 3D de habilidades y proyectos (los proyectos orbitan un planeta y se abren con un clic)
- ✔ Paneles con diseño "glass" que aparecen en cada parada del viaje
- ✔ Modelo 3D de la Estación Espacial de NASA 3D Resources (dominio público); Vía Láctea de Solar System Scope (CC BY 4.0)
- ✔ Texturas planetarias reales (NASA/ESA, cortesía de Solar System Scope, CC BY 4.0); luces nocturnas de la Tierra de NASA Visible Earth (vía ejemplos de three.js)
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

Todo el contenido vive en **`data.js`**: perfil, experiencia, estudios, certificaciones, proyectos, hobbies, sueños, contacto y redes sociales. No hace falta tocar `sistema-solar.html`, `universo.css` ni `universo.js` para actualizarlo.

Las habilidades (tarjetas del cinturón) están en `skills` dentro de `data.js`. El recorrido de la cámara y las posiciones de los planetas están en `SECTIONS`, `POS` y `CAMERA_KEYS` al inicio de `universo.js`.

La portada (`index.html`, `landing.css`, `landing.js`) toma sus textos de `data.js`. Las diapositivas se definen en `SLIDES` y la posición de cada planeta en `LAYOUTS`, ambos en `landing.js`. Cada botón "Explorar" abre el sistema solar directamente en su planeta (`sistema-solar.html#clave`).

### Redes sociales

En `data.js`, dentro de `social`, coloca la URL completa. Si la dejas vacía (`""`), el ícono no se muestra.

### Email de contacto

Cambia `contact.email` en `data.js`. Es el correo al que llegan los mensajes del formulario (requiere confirmar el primer envío en FormSubmit, ver más abajo).

---

## Activar el formulario de contacto

El formulario usa [FormSubmit.co](https://formsubmit.co), un servicio gratuito que no requiere backend ni registro. **La primera vez** que alguien lo envíe, FormSubmit mandará un correo de confirmación a `contact.email` — hay que confirmarlo **una sola vez**. Después, todos los mensajes llegan directo a esa bandeja.

---

## Ejecutar en local

Al usar módulos ES, el sitio debe servirse por HTTP (no abrir los `.html` directamente como archivo):

```bash
npx serve .
```

y abrir la URL que indique en el navegador.
