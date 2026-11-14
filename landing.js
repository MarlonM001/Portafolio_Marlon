/*
  ============================================================
  LANDING.JS — Portada estilo "misión espacial"
  ============================================================
  - Carrusel de 5 diapositivas (01/05) con un planeta 3D que
    cambia en cada una (Three.js, texturas de assets/textures).
  - La Tierra de la diapositiva 01 se ve de noche, con las
    luces de las ciudades (texturas de la NASA vía three.js).
  - Navegación: menú, barra vertical, rueda del mouse,
    flechas del teclado y deslizar en móvil.
  - Al entrar al universo 3D se hace un salto al hiperespacio
    y se abre directamente el planeta de la diapositiva.
  El contenido sale de data.js (SITE_DATA).
*/

import * as THREE from "three";

const DATA = window.SITE_DATA || {};
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SLIDE_MS = 8000;

/* ============================================================
   DIAPOSITIVAS
   ============================================================ */
const projects = DATA.projects || [];
const experience = DATA.experience || [];
const studies = DATA.studies || [];
const certs = DATA.certifications || [];
const profile = DATA.profile || {};
const contact = DATA.contact || {};

const topTech = (() => {
  const count = {};
  projects.forEach((p) => (p.tech || []).forEach((t) => (count[t] = (count[t] || 0) + 1)));
  return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t);
})();

const firstName = (profile.name || "Marlon Monsalve").split(" ")[0];

const SLIDES = [
  {
    key: "tierra",
    planet: "Tierra",
    kicker: "Desarrollador Full-Stack · Colombia",
    title: ["Marlon", "Monsalve"],
    lead: "Construyo y despliego aplicaciones web completas: tiendas en línea, APIs REST, sistemas de boletería y agentes de IA. Bienvenido a mi universo.",
    chips: profile.highlight ? [{ text: "🏆 1er lugar · Hackathon Regional Casanare", gold: true }] : [],
    cta: "Conóceme",
    nebula: ["rgba(30,120,220,0.85)", "rgba(20,190,200,0.55)", "rgba(70,60,200,0.35)"],
  },
  {
    key: "marte",
    planet: "Marte",
    kicker: "Proyectos",
    title: ["Misiones", "lanzadas"],
    outline: 1,
    lead: `${projects.length} proyectos construidos y desplegados: e-commerce, boletería con Next.js y Supabase, APIs en NestJS, Django y Go, bots de automatización y un sistema de agentes de IA ganador.`,
    chips: topTech.map((t) => ({ text: t })),
    cta: "Ver proyectos",
    nebula: ["rgba(200,70,40,0.7)", "rgba(230,120,60,0.4)", "rgba(120,40,120,0.35)"],
  },
  {
    key: "mercurio",
    planet: "Mercurio",
    kicker: "Experiencia",
    title: ["Bitácora", "de vuelo"],
    outline: 1,
    lead: experience[0]
      ? `${experience[0].role} en ${experience[0].place.split("·")[0].trim()}. Soporte técnico, procesos e indicadores: experiencia real trabajando con usuarios.`
      : "Mi recorrido profesional.",
    chips: experience.slice(0, 3).map((e) => ({ text: e.date })),
    cta: "Ver experiencia",
    nebula: ["rgba(120,120,150,0.55)", "rgba(80,140,190,0.4)", "rgba(60,60,120,0.35)"],
  },
  {
    key: "venus",
    planet: "Venus",
    kicker: "Estudios y certificaciones",
    title: ["Academia", "estelar"],
    outline: 1,
    lead: studies[0]
      ? `${studies[0].title} en el ${studies[0].place.split("·")[0].trim()}, más ${certs.length} certificaciones en IA, robótica y soporte técnico.`
      : "Formación y certificaciones.",
    chips: [{ text: "SENA" }, { text: "IA aplicada" }, { text: "Robótica" }],
    cta: "Ver estudios",
    nebula: ["rgba(210,150,60,0.6)", "rgba(220,190,110,0.35)", "rgba(140,80,160,0.35)"],
  },
  {
    key: "sol",
    planet: "El Sol",
    kicker: "Contacto",
    title: ["Abre un", "canal"],
    outline: 1,
    lead: `¿Tienes un proyecto o una vacante? Hablemos. Disponible para trabajo presencial o remoto${contact.location ? " desde " + contact.location.split(",")[0] : ""}.`,
    chips: contact.email ? [{ text: contact.email }] : [],
    cta: "Contactar",
    nebula: ["rgba(240,120,30,0.65)", "rgba(250,180,60,0.4)", "rgba(180,50,60,0.35)"],
  },
];

/* Posición del planeta en el marco: centro (cx, cy) y radio r,
   todo como fracción del alto/ancho del marco. */
const LAYOUTS = {
  desktop: {
    tierra: { cx: 0.8, cy: 1.16, r: 0.72 },
    marte: { cx: 0.76, cy: 0.56, r: 0.3 },
    mercurio: { cx: 0.78, cy: 0.6, r: 0.25 },
    venus: { cx: 0.8, cy: 0.98, r: 0.55 },
    sol: { cx: 1.02, cy: 0.52, r: 0.5 },
  },
  mobile: {
    tierra: { cx: 0.7, cy: 0.62, r: 0.42 },
    marte: { cx: 0.6, cy: 0.33, r: 0.2 },
    mercurio: { cx: 0.62, cy: 0.33, r: 0.17 },
    venus: { cx: 0.6, cy: 0.34, r: 0.21 },
    sol: { cx: 0.95, cy: 0.3, r: 0.26 },
  },
};

const PLANETS = {
  tierra: {
    map: "assets/textures/earth_day.jpg",
    night: "assets/textures/earth_night.jpg",
    spec: "assets/textures/earth_specular.jpg",
    clouds: "assets/textures/earth_clouds.jpg",
    atmo: "#3d9bff",
    tilt: 0.25,
    spin: 0.012,
    startRot: -1.95,
    sun: [-0.45, 0.5, -0.74], // luz por detrás: casi toda la cara visible queda de noche
  },
  marte: { sun: [-0.55, 0.45, 0.7], map: "assets/textures/mars.jpg", atmo: "#ff7a4a", tilt: 0.44, spin: 0.06 },
  mercurio: { sun: [-0.55, 0.45, 0.7], map: "assets/textures/mercury.jpg", atmo: "#b9c4d8", tilt: 0.03, spin: 0.05 },
  venus: { sun: [-0.55, 0.45, 0.7], map: "assets/textures/venus.jpg", atmo: "#ffcf7a", tilt: 0.05, spin: 0.03 },
  sol: { sun: [-0.55, 0.45, 0.7], map: "assets/textures/sun.jpg", atmo: "#ff9a2e", tilt: 0, spin: 0.02, emissive: true },
};

/* ============================================================
   ELEMENTOS
   ============================================================ */
const $ = (s) => document.querySelector(s);
const frame = $("#frame");
const copy = $("#hero-copy");
const progress = $("#progress");
const navLinks = document.querySelectorAll(".nav-links [data-goto]");
const cta = $("#cta");

$("#counter-total").textContent = String(SLIDES.length).padStart(2, "0");

/* Redes sociales del menú (desde data.js) */
const SOCIAL_ICONS = { github: "fa-brands fa-github", linkedin: "fa-brands fa-linkedin-in", twitter: "fa-brands fa-x-twitter" };
$("#nav-socials").innerHTML = Object.entries(DATA.social || {})
  .filter(([, url]) => url)
  .map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${k}"><i class="${SOCIAL_ICONS[k] || "fa-solid fa-link"}"></i></a>`)
  .join("");

/* Barra vertical */
progress.style.setProperty("--slide-ms", SLIDE_MS + "ms");
progress.innerHTML = SLIDES.map(
  (s, i) => `<button type="button" data-goto="${i}" aria-label="${s.kicker}"><span class="label">${String(i + 1).padStart(2, "0")} · ${s.kicker.split(" ")[0]}</span></button>`
).join("");
if (REDUCED) progress.classList.add("static");

/* ============================================================
   ESCENA 3D DEL PLANETA
   ============================================================ */
const canvas = $("#planet");
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  console.warn("WebGL no disponible", e);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
camera.position.set(0, 0, 10);

const loader = new THREE.TextureLoader();
const tex = {};
const loadTex = (url) => {
  if (!tex[url]) {
    tex[url] = loader.load(url);
    tex[url].colorSpace = THREE.SRGBColorSpace;
    tex[url].anisotropy = 8;
  }
  return tex[url];
};

const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
const sunDir = new THREE.Vector3(...PLANETS.tierra.sun).normalize();
const sunTarget = sunDir.clone();
sunLight.position.copy(sunDir).multiplyScalar(10);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x223355, 0.35));

const planetGroup = new THREE.Group();
scene.add(planetGroup);

const tiltGroup = new THREE.Group();
planetGroup.add(tiltGroup);

const sphereGeo = new THREE.SphereGeometry(1, 96, 96);

const surfaceMat = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, transparent: true });
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true });

/* Tierra: día + luces nocturnas de las ciudades + reflejo del océano */
const earthMat = new THREE.ShaderMaterial({
  uniforms: {
    dayMap: { value: loadTex(PLANETS.tierra.map) },
    nightMap: { value: loadTex(PLANETS.tierra.night) },
    specMap: { value: loadTex(PLANETS.tierra.spec) },
    uSun: { value: sunDir },
    uOpacity: { value: 1 },
  },
  vertexShader: `
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vView;
    void main(){
      vUv = uv;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D specMap;
    uniform vec3 uSun; uniform float uOpacity;
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vView;
    void main(){
      vec3 n = normalize(vNormal);
      float d = dot(n, normalize(uSun));
      vec3 day = texture2D(dayMap, vUv).rgb;
      vec3 night = texture2D(nightMap, vUv).rgb;
      float spec = texture2D(specMap, vUv).r;

      float dayMix = smoothstep(-0.08, 0.35, d);
      float nightMix = 1.0 - smoothstep(-0.2, 0.12, d);

      vec3 col = day * dayMix * 1.25;
      col += day * vec3(0.02, 0.05, 0.12);                       // continentes apenas visibles de noche
      col += pow(night, vec3(1.4)) * vec3(1.0, 0.78, 0.45) * 2.4 * nightMix; // luces de ciudades
      vec3 r = reflect(-normalize(uSun), n);
      col += vec3(0.55, 0.75, 1.0) * pow(max(dot(r, vView), 0.0), 18.0) * spec * dayMix * 0.8;

      float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.5);
      col += vec3(0.15, 0.45, 1.0) * fres * (0.25 + 0.9 * smoothstep(-0.4, 0.5, d));

      gl_FragColor = vec4(col, uOpacity);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  transparent: true,
});

const surface = new THREE.Mesh(sphereGeo, surfaceMat);
tiltGroup.add(surface);

const cloudsMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  alphaMap: loadTex(PLANETS.tierra.clouds),
});
const clouds = new THREE.Mesh(sphereGeo, cloudsMat);
clouds.scale.setScalar(1.012);
tiltGroup.add(clouds);

/* Halo de atmósfera (por detrás) */
const haloMat = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(PLANETS.tierra.atmo) },
    uLimb: { value: 0.5 },
    uOpacity: { value: 1 },
    uStrength: { value: 0.9 },
    uExp: { value: 3.0 },
    uSun: { value: sunDir },
  },
  vertexShader: `
    varying vec3 vNormal; varying vec3 vView;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform vec3 uColor; uniform float uLimb; uniform float uOpacity; uniform float uStrength; uniform float uExp; uniform vec3 uSun;
    varying vec3 vNormal; varying vec3 vView;
    void main(){
      float d = clamp(-dot(vNormal, vView) / uLimb, 0.0, 1.0);
      float lit = 0.45 + 0.8 * smoothstep(-0.6, 0.6, dot(vNormal, normalize(uSun)));
      float i = pow(d, uExp) * uStrength * lit;
      gl_FragColor = vec4(uColor * i * uOpacity, 1.0);
    }`,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
});
const halo = new THREE.Mesh(sphereGeo, haloMat);
halo.scale.setScalar(1.14);
planetGroup.add(halo);

/* Brillo del borde (por delante) */
const rimMat = new THREE.ShaderMaterial({
  uniforms: { uColor: { value: new THREE.Color(PLANETS.tierra.atmo) }, uOpacity: { value: 1 }, uSun: { value: sunDir } },
  vertexShader: `
    varying vec3 vNormal; varying vec3 vView;
    void main(){
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform vec3 uColor; uniform float uOpacity; uniform vec3 uSun;
    varying vec3 vNormal; varying vec3 vView;
    void main(){
      float f = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 3.5);
      float lit = 0.35 + 0.9 * smoothstep(-0.5, 0.6, dot(vNormal, normalize(uSun)));
      gl_FragColor = vec4(uColor, f * 0.8 * lit * uOpacity);
    }`,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
});
const rim = new THREE.Mesh(sphereGeo, rimMat);
rim.scale.setScalar(1.004);
planetGroup.add(rim);

/* Estrellas dentro del marco */
function makeSprite(cross) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.2, "rgba(255,255,255,0.8)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.beginPath();
  g.arc(32, 32, cross ? 10 : 32, 0, Math.PI * 2);
  g.fill();
  if (cross) {
    const lg = (x1, y1, x2, y2) => {
      const l = g.createLinearGradient(x1, y1, x2, y2);
      l.addColorStop(0, "rgba(255,255,255,0)");
      l.addColorStop(0.5, "rgba(255,255,255,0.95)");
      l.addColorStop(1, "rgba(255,255,255,0)");
      return l;
    };
    g.fillStyle = lg(0, 32, 64, 32);
    g.fillRect(0, 31, 64, 2);
    g.fillStyle = lg(32, 0, 32, 64);
    g.fillRect(31, 0, 2, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeStars(count, size, sprite, spread) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    pos[i * 3 + 2] = -10 - Math.random() * 30;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  return new THREE.Points(geo, mat);
}

const starsGroup = new THREE.Group();
const dust = makeStars(900, 0.12, makeSprite(false), 60);
const sparkles = makeStars(28, 0.9, makeSprite(true), 48);
starsGroup.add(dust, sparkles);
scene.add(starsGroup);
scene.add(planetGroup); // el planeta siempre por delante

/* Disposición según el tamaño del marco */
let isMobile = false;
function viewSize() {
  const dist = camera.position.z;
  const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
  return { h, w: h * camera.aspect };
}

function layoutFor(key) {
  const L = (isMobile ? LAYOUTS.mobile : LAYOUTS.desktop)[key];
  const { w, h } = viewSize();
  return {
    x: (L.cx - 0.5) * w,
    y: (0.5 - L.cy) * h,
    s: L.r * h,
  };
}

function resize() {
  const { width, height } = frame.getBoundingClientRect();
  isMobile = width < 700;
  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
  }
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if (!transition) applyPlanetPose(layoutFor(SLIDES[current].key), 1);
}

function applyPlanetPose(p, opacity) {
  planetGroup.position.set(p.x, p.y, 0);
  planetGroup.scale.setScalar(p.s);
  surfaceMat.opacity = sunMat.opacity = opacity;
  earthMat.uniforms.uOpacity.value = opacity;
  cloudsMat.opacity = 0.55 * opacity;
  haloMat.uniforms.uOpacity.value = opacity;
  rimMat.uniforms.uOpacity.value = opacity;
}

function setPlanetLook(key) {
  const P = PLANETS[key];
  if (P.emissive) {
    sunMat.map = loadTex(P.map);
    sunMat.needsUpdate = true;
    surface.material = sunMat;
    halo.scale.setScalar(1.4);
    haloMat.uniforms.uLimb.value = Math.sqrt(1 - 1 / (1.4 * 1.4));
    haloMat.uniforms.uStrength.value = 1.5;
    haloMat.uniforms.uExp.value = 1.6;
  } else if (P.night) {
    surface.material = earthMat;
    surface.rotation.y = P.startRot || 0;
    clouds.rotation.y = (P.startRot || 0) + 0.4;
    halo.scale.setScalar(1.12);
    haloMat.uniforms.uLimb.value = Math.sqrt(1 - 1 / (1.12 * 1.12));
    haloMat.uniforms.uStrength.value = 1.1;
    haloMat.uniforms.uExp.value = 2.4;
  } else {
    surfaceMat.map = loadTex(P.map);
    surfaceMat.needsUpdate = true;
    surface.material = surfaceMat;
    halo.scale.setScalar(1.12);
    haloMat.uniforms.uLimb.value = Math.sqrt(1 - 1 / (1.12 * 1.12));
    haloMat.uniforms.uStrength.value = 0.85;
    haloMat.uniforms.uExp.value = 3.0;
  }
  clouds.visible = !!P.clouds;
  haloMat.uniforms.uColor.value.set(P.atmo);
  rimMat.uniforms.uColor.value.set(P.atmo);
  tiltGroup.rotation.z = P.tilt;
  sunTarget.set(...P.sun).normalize();
}

/* Precarga de texturas */
Object.values(PLANETS).forEach((p) => [p.map, p.night, p.spec].filter(Boolean).forEach(loadTex));

/* ============================================================
   CARRUSEL
   ============================================================ */
let current = 0;
let transition = null; // { from, to, start }
const TRANSITION_MS = REDUCED ? 1 : 1500;

const easeIn = (t) => t * t * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function renderCopy(i) {
  const s = SLIDES[i];
  $("#counter-current").textContent = String(i + 1).padStart(2, "0");
  $("#kicker").textContent = s.kicker;
  $("#title").innerHTML = s.title
    .map((line, n) => `<span class="line${s.outline === n ? " outline" : ""}"><span>${line}</span></span>`)
    .join("");
  $("#lead").textContent = s.lead;
  $("#chips").innerHTML = (s.chips || [])
    .map((c) => `<span class="chip${c.gold ? " gold" : ""}">${c.text}</span>`)
    .join("");
  $("#cta-label").textContent = s.cta;
  cta.href = `sistema-solar.html#${s.key}`;
  $("#planet-tag").textContent = `${s.planet}`;
}

function setNebula(i) {
  const [a, b, c] = SLIDES[i].nebula;
  frame.style.setProperty("--neb-a", a);
  frame.style.setProperty("--neb-b", b);
  frame.style.setProperty("--neb-c", c);
}

function setActiveUI(i) {
  progress.querySelectorAll("button").forEach((b, n) => {
    b.classList.remove("active");
    b.setAttribute("aria-current", n === i ? "true" : "false");
  });
  void progress.offsetWidth; // reinicia la animación de la barra
  progress.querySelectorAll("button")[i].classList.add("active");
  navLinks.forEach((b) => b.classList.toggle("active", Number(b.dataset.goto) === i));
}

function goTo(i, { user = false } = {}) {
  i = (i + SLIDES.length) % SLIDES.length;
  if (i === current && !user) return;
  if (i === current) return restartTimer();
  if (transition) return;

  const from = current;
  current = i;
  transition = { from, to: i, start: performance.now(), swapped: false };

  copy.classList.remove("in");
  copy.classList.add("out");
  setTimeout(() => {
    renderCopy(i);
    void copy.offsetWidth;
    copy.classList.remove("out");
    copy.classList.add("in");
  }, REDUCED ? 0 : 520);

  setNebula(i);
  setActiveUI(i);
  restartTimer();
}

/* Avance automático */
let timer = null;
function restartTimer() {
  clearTimeout(timer);
  if (REDUCED) return;
  timer = setTimeout(() => goTo(current + 1), SLIDE_MS);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearTimeout(timer);
  else {
    setActiveUI(current);
    restartTimer();
  }
});

/* Clic en menú y barra */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-goto]");
  if (!btn) return;
  e.preventDefault();
  goTo(Number(btn.dataset.goto), { user: true });
  closeMenu();
});

/* Rueda del mouse */
let wheelLock = 0;
frame.addEventListener(
  "wheel",
  (e) => {
    if (Math.abs(e.deltaY) < 12) return;
    e.preventDefault();
    const now = Date.now();
    if (now < wheelLock) return;
    wheelLock = now + 1100;
    goTo(current + (e.deltaY > 0 ? 1 : -1), { user: true });
  },
  { passive: false }
);

/* Teclado */
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, textarea")) return;
  if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) goTo(current + 1, { user: true });
  if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) goTo(current - 1, { user: true });
  if (e.key === "Escape") closeMenu();
});

/* Deslizar en móvil */
let touchStart = null;
frame.addEventListener("touchstart", (e) => (touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }), { passive: true });
frame.addEventListener(
  "touchend",
  (e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return; // vertical = desplazar la página
    goTo(current + (dx < 0 ? 1 : -1), { user: true });
  },
  { passive: true }
);

/* Menú móvil */
const burger = $("#burger");
const navList = $("#nav-links");
function closeMenu() {
  navList.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}
burger.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});

/* Compartir */
const toast = $("#toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
$("#share-btn").addEventListener("click", async () => {
  const data = { title: document.title, text: "Mira el portafolio de Marlon Monsalve", url: location.href.split("#")[0] };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(data.url);
      showToast("Enlace copiado ✨");
    }
  } catch (_) {
    /* el usuario canceló */
  }
});

/* ============================================================
   PARALLAX CON EL MOUSE
   ============================================================ */
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
if (!REDUCED) {
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5;
    mouse.y = e.clientY / window.innerHeight - 0.5;
    frame.style.setProperty("--px", `${mouse.x * -18}px`);
    frame.style.setProperty("--py", `${mouse.y * -12}px`);
  });
}

/* ============================================================
   BUCLE DE ANIMACIÓN
   ============================================================ */
const clock = new THREE.Clock();
setPlanetLook(SLIDES[0].key);

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const now = performance.now();

  if (transition) {
    const t = Math.min((now - transition.start) / TRANSITION_MS, 1);
    const A = layoutFor(SLIDES[transition.from].key);
    const B = layoutFor(SLIDES[transition.to].key);
    const { w, h } = viewSize();
    if (t < 0.5) {
      const k = easeIn(t / 0.5);
      applyPlanetPose({ x: A.x + w * 0.35 * k, y: A.y - h * 0.3 * k, s: A.s * (1 - 0.35 * k) }, 1 - k);
    } else {
      if (!transition.swapped) {
        setPlanetLook(SLIDES[transition.to].key);
        transition.swapped = true;
      }
      const k = easeOut((t - 0.5) / 0.5);
      applyPlanetPose(
        { x: B.x + w * 0.3 * (1 - k), y: B.y + h * 0.35 * (1 - k), s: B.s * (0.7 + 0.3 * k) },
        k
      );
    }
    if (t >= 1) transition = null;
  }

  const P = PLANETS[SLIDES[transition && !transition.swapped ? transition.from : current].key];
  if (!REDUCED) {
    surface.rotation.y += P.spin * dt;
    clouds.rotation.y += P.spin * 1.35 * dt;
    mouse.sx += (mouse.x - mouse.sx) * 0.04;
    mouse.sy += (mouse.y - mouse.sy) * 0.04;
    starsGroup.position.x = mouse.sx * -1.2;
    starsGroup.position.y = mouse.sy * 0.8;
    sparkles.material.opacity = 0.75 + Math.sin(now * 0.002) * 0.25;
    camera.position.x = mouse.sx * 0.25;
    camera.position.y = -mouse.sy * 0.18;
  }

  sunDir.lerp(sunTarget, 0.08).normalize();
  sunLight.position.copy(sunDir).multiplyScalar(10);

  if (renderer) renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

/* ============================================================
   ESTRELLAS DEL FONDO EXTERIOR
   ============================================================ */
const bg = $("#bg-stars");
const bgx = bg.getContext("2d");
let bgStars = [];
function initBg() {
  const dpr = Math.min(window.devicePixelRatio, 2);
  bg.width = innerWidth * dpr;
  bg.height = innerHeight * dpr;
  bgx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.round((innerWidth * innerHeight) / 2600);
  bgStars = Array.from({ length: n }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() < 0.08 ? 1.3 : Math.random() * 0.9 + 0.2,
    p: Math.random() * Math.PI * 2,
    s: 0.5 + Math.random() * 1.5,
    c: Math.random() < 0.15 ? "170,190,255" : "255,255,255",
  }));
}
function drawBg(t) {
  bgx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of bgStars) {
    const a = REDUCED ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(s.p + t * 0.0006 * s.s));
    bgx.fillStyle = `rgba(${s.c},${a})`;
    bgx.beginPath();
    bgx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    bgx.fill();
  }
  if (!REDUCED) requestAnimationFrame(drawBg);
}

/* ============================================================
   SALTO AL HIPERESPACIO
   ============================================================ */
const warp = $("#warp");
const wx = warp.getContext("2d");

function hyperjump(href) {
  if (REDUCED) return (location.href = href);
  document.body.classList.add("warping");
  clearTimeout(timer);
  const W = (warp.width = innerWidth);
  const H = (warp.height = innerHeight);
  const cx = W / 2;
  const cy = H / 2;
  const stars = Array.from({ length: 700 }, () => ({
    x: (Math.random() - 0.5) * W * 2,
    y: (Math.random() - 0.5) * H * 2,
    z: Math.random() * W,
    pz: 0,
  }));
  stars.forEach((s) => (s.pz = s.z));
  const start = performance.now();
  const DURATION = 1300;
  let done = false;

  function frameWarp(now) {
    const t = Math.min((now - start) / DURATION, 1);
    const speed = 4 + Math.pow(t, 2.2) * 90;
    wx.fillStyle = `rgba(2,4,12,${0.35 + t * 0.4})`;
    wx.fillRect(0, 0, W, H);
    wx.lineCap = "round";
    for (const s of stars) {
      s.pz = s.z;
      s.z -= speed;
      if (s.z < 1) {
        s.z = W;
        s.pz = W;
        s.x = (Math.random() - 0.5) * W * 2;
        s.y = (Math.random() - 0.5) * H * 2;
      }
      const sx = cx + (s.x / s.z) * (W / 2);
      const sy = cy + (s.y / s.z) * (W / 2);
      const px = cx + (s.x / s.pz) * (W / 2);
      const py = cy + (s.y / s.pz) * (W / 2);
      const a = Math.min(1, (1 - s.z / W) * 1.6);
      wx.strokeStyle = `rgba(${180 + t * 75},${210 + t * 45},255,${a})`;
      wx.lineWidth = Math.max(0.5, (1 - s.z / W) * 3);
      wx.beginPath();
      wx.moveTo(px, py);
      wx.lineTo(sx, sy);
      wx.stroke();
    }
    if (t > 0.82) {
      wx.fillStyle = `rgba(235,245,255,${(t - 0.82) / 0.18})`;
      wx.fillRect(0, 0, W, H);
    }
    if (t < 1) requestAnimationFrame(frameWarp);
    else if (!done) {
      done = true;
      location.href = href;
    }
  }
  requestAnimationFrame(frameWarp);
}

document.querySelectorAll("[data-warp]").forEach((a) =>
  a.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    hyperjump(a.href);
  })
);

/* Al volver con el botón "atrás" del navegador */
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    document.body.classList.remove("warping");
    wx.clearRect(0, 0, warp.width, warp.height);
    restartTimer();
  }
});

/* ============================================================
   PIE DE PÁGINA (datos desde data.js)
   ============================================================ */
{
  const legal = DATA.legal || {};
  const c = DATA.contact || {};
  const v = {
    fullName: legal.fullName,
    place: [c.address, (c.location || "").split(",").slice(0, 2).join(",")].filter(Boolean).join(", "),
    email: c.email,
    phone: c.phone,
    year: legal.year,
  };
  document.querySelectorAll("#site-footer [data-field]").forEach((el) => {
    const val = v[el.dataset.field];
    if (!val) return;
    el.textContent = val;
    if (el.tagName === "A") el.href = `mailto:${val}`;
  });
}

/* ============================================================
   INICIO
   ============================================================ */
renderCopy(0);
setNebula(0);
setActiveUI(0);
requestAnimationFrame(() => copy.classList.add("in"));
resize();
initBg();
requestAnimationFrame(drawBg);
window.addEventListener("resize", () => {
  resize();
  initBg();
  if (REDUCED) drawBg(0);
});
tick();
restartTimer();
