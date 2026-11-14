/*
  ============================================================
  UNIVERSO.JS — Viaje en cohete guiado por el scroll
  ============================================================
  Al desplazarte, un cohete despega desde la Tierra y recorre
  el universo pasando por cada sección del portafolio:

    Inicio → Despegue → Sobre mí (Luna y astronauta)
    → Experiencia (Estación Espacial) → Estudios (Venus)
    → Habilidades (cinturón de tarjetas) → Proyectos (planeta
    con anillo y tarjetas en órbita) → Más allá (Neptuno)
    → Contacto (el Sol).

  Todo el contenido sale de data.js (SITE_DATA).
  Recorrido y posiciones: SECTIONS, POS y CAMERA_KEYS.
*/

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const DATA = window.SITE_DATA || {};
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const isMobile = () => window.innerWidth < 760;
const smooth = THREE.MathUtils.smoothstep;
const clamp = THREE.MathUtils.clamp;

/* ============================================================
   1. SECCIONES DEL VIAJE (rango de scroll 0 → 1)
   ============================================================ */
const SECTIONS = [
  { id: "inicio", label: "Inicio", range: [0, 0.07], focus: 0 },
  { id: "despegue", label: "Despegue", range: [0.07, 0.15], focus: 0.12, hidden: true },
  { id: "sobre-mi", label: "Sobre mí", range: [0.17, 0.29] },
  { id: "experiencia", label: "Experiencia", range: [0.32, 0.43] },
  { id: "estudios", label: "Estudios", range: [0.46, 0.56] },
  { id: "habilidades", label: "Habilidades", range: [0.58, 0.67] },
  { id: "proyectos", label: "Proyectos", range: [0.69, 0.83] },
  { id: "mas-alla", label: "Más allá", range: [0.855, 0.925] },
  { id: "contacto", label: "Contacto", range: [0.95, 1], focus: 0.975 },
];
SECTIONS.forEach((s) => (s.focus ??= (s.range[0] + s.range[1]) / 2));

/* Enlaces desde la portada (index.html) */
const HASH_ALIAS = {
  tierra: "sobre-mi",
  mercurio: "experiencia",
  venus: "estudios",
  marte: "proyectos",
  sol: "contacto",
  jupiter: "mas-alla",
  saturno: "mas-alla",
  "agujero-negro": "mas-alla",
  voyager: "mas-alla",
  juno: "mas-alla",
};

/* ============================================================
   2. POSICIONES EN EL ESPACIO (el viaje avanza hacia -Z)
   ============================================================ */
const POS = {
  earth: { p: new THREE.Vector3(-7.5, -0.5, -4), r: 5.2 },
  moon: { p: new THREE.Vector3(9, 3.5, -36), r: 1.7 },
  astronaut: new THREE.Vector3(6.2, 3.2, -30),
  iss: new THREE.Vector3(-13, 2, -78),
  venus: { p: new THREE.Vector3(15, -2, -118), r: 5 },
  skills: new THREE.Vector3(0, 0, -150),
  ringed: { p: new THREE.Vector3(-4, -3, -210), r: 8.5, inner: 11.5, outer: 21, cards: 17 },
  neptune: { p: new THREE.Vector3(17, 5, -262), r: 4.5 },
  sun: { p: new THREE.Vector3(34, 10, -330), r: 16 },
};
const RING_TILT = new THREE.Euler(0.42, 0, 0.1);

/* Cámara: posición y punto al que mira en cada momento del viaje */
const CAMERA_KEYS = [
  { p: 0.0, pos: [0, 0.9, 9], tgt: [0, 0.9, 0] },
  { p: 0.06, pos: [0, 1.1, 8.4], tgt: [0, 1.2, 0] },
  { p: 0.11, pos: [1.8, 3.2, 6.5], tgt: [0, 2.5, -10] },
  { p: 0.15, pos: [1.5, 2.6, -6], tgt: [4, 2.5, -30] },
  { p: 0.2, pos: [-1.5, 2.2, -17], tgt: [6, 2.8, -34] },
  { p: 0.27, pos: [-0.5, 2.4, -21], tgt: [7, 3, -36] },
  { p: 0.31, pos: [0, 2, -48], tgt: [-8, 2, -78] },
  { p: 0.36, pos: [3, 3, -58], tgt: [-6, 2, -78] },
  { p: 0.42, pos: [3.5, 2.6, -62], tgt: [-5, 2, -79] },
  { p: 0.46, pos: [5, 0, -92], tgt: [12, -1.5, -118] },
  { p: 0.5, pos: [2, 0.5, -99], tgt: [9, -1.2, -118] },
  { p: 0.555, pos: [4, 0, -108], tgt: [10, -1.4, -118] },
  { p: 0.585, pos: [0, 0.6, -126], tgt: [0, 0, -160] },
  { p: 0.63, pos: [0, 0.3, -142], tgt: [0, 0, -175] },
  { p: 0.67, pos: [1, 1.5, -166], tgt: [-3, -2, -205] },
  ...orbitKeys(0.7, 0.825, 6),
  { p: 0.86, pos: [4, 7, -236], tgt: [17, 5, -262] },
  { p: 0.9, pos: [2, 6, -238], tgt: [22, 5, -262] },
  { p: 0.94, pos: [16, 8, -280], tgt: [30, 9.5, -330] },
  { p: 1.0, pos: [20, 9, -296], tgt: [28, 9.5, -330] },
];

/* Vuelta alrededor del planeta de proyectos */
function orbitKeys(p0, p1, n) {
  const C = POS.ringed.p;
  const R = isMobile() ? 38 : 31;
  const H = 8;
  const keys = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const th = 0.25 - t * 4.7;
    keys.push({
      p: p0 + (p1 - p0) * t,
      pos: [C.x + Math.sin(th) * R, C.y + H, C.z + Math.cos(th) * R],
      tgt: [C.x, C.y, C.z],
    });
  }
  return keys;
}

function makePath(keys, field) {
  const pts = keys.map((k) => new THREE.Vector3(...k[field]));
  return { curve: new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5), stops: keys.map((k) => k.p) };
}

/* Convierte el progreso del scroll al parámetro de la curva (respeta el espaciado entre claves) */
function toU(p, stops) {
  const x = clamp(p, 0, 1);
  for (let i = 0; i < stops.length - 1; i++) {
    if (x <= stops[i + 1]) return (i + (x - stops[i]) / (stops[i + 1] - stops[i])) / (stops.length - 1);
  }
  return 1;
}

const camPath = makePath(CAMERA_KEYS, "pos");
const tgtPath = makePath(CAMERA_KEYS, "tgt");
const camAt = (p, out = new THREE.Vector3()) => camPath.curve.getPoint(toU(p, camPath.stops), out);
const tgtAt = (p, out = new THREE.Vector3()) => tgtPath.curve.getPoint(toU(p, tgtPath.stops), out);

/* ============================================================
   3. CONTENIDO HTML (desde data.js)
   ============================================================ */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const profile = DATA.profile || {};
const contact = DATA.contact || {};
const projects = DATA.projects || [];
const num = (i) => String(i + 1).padStart(2, "0");

function timelineHTML(list, descKey = "description") {
  return `<ul class="timeline">${list
    .map(
      (x) => `<li><h3>${esc(x.role || x.title)}</h3>
        <p class="meta">${esc([x.place, x.date].filter(Boolean).join(" · "))}</p>
        ${x[descKey] ? `<p>${esc(x[descKey])}</p>` : ""}</li>`
    )
    .join("")}</ul>`;
}

const TABS = [
  { id: "metas", label: "Metas", items: DATA.nearTermGoals },
  { id: "aprendiendo", label: "Aprendiendo", items: DATA.learningGoals },
  { id: "suenos", label: "Sueños", items: DATA.dreams },
  { id: "hobbies", label: "Hobbies", items: DATA.hobbies },
  { id: "mejora", label: "Áreas de mejora", items: DATA.weaknesses },
].filter((t) => t.items && t.items.length);

function tabCards(tab) {
  return tab.items
    .map(
      (x) => `<div class="mini-card">${x.group ? `<p class="group">${esc(x.group)}</p>` : ""}
      <h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></div>`
    )
    .join("");
}

const legal = DATA.legal || {};
const policyUrl = legal.policyUrl || "politica-de-datos.html";
const whatsapp = contact.phone ? `https://wa.me/${contact.phone.replace(/\D/g, "")}` : "";

const SECTION_HTML = {
  inicio: `
    <div class="section hero" data-id="inicio">
      <span class="tag"><b>●</b> ${esc(profile.role || "Desarrollador Full-Stack")} · ${esc((contact.location || "Colombia").split(",")[0])}, Colombia</span>
      <h1>Marlon Monsalve</h1>
    </div>`,
  despegue: `
    <div class="section countdown" data-id="despegue">
      Secuencia de despegue
      <b id="countdown">T-3</b>
    </div>`,
  "sobre-mi": `
    <section class="section panel pos-left" data-id="sobre-mi" aria-labelledby="h-sobre">
      <p class="eyebrow">01 // Sobre mí</p>
      <h2 id="h-sobre">Construyo, despliego <em>y aprendo</em></h2>
      ${(profile.bio || []).map((b) => `<p>${esc(b)}</p>`).join("")}
      ${profile.highlight ? `<span class="gold-chip">${esc(profile.highlight)}</span>` : ""}
      <ul class="facts">
        <li>${esc(profile.name || "")}</li>
        <li>${esc(contact.location || "")}</li>
        <li>Disponible: presencial o remoto</li>
      </ul>
    </section>`,
  experiencia: `
    <section class="section panel pos-right" data-id="experiencia" aria-labelledby="h-exp">
      <p class="eyebrow">02 // Experiencia</p>
      <h2 id="h-exp">Bitácora <em>de vuelo</em></h2>
      ${timelineHTML(DATA.experience || [])}
    </section>`,
  estudios: `
    <section class="section panel pos-left" data-id="estudios" aria-labelledby="h-est">
      <p class="eyebrow">03 // Estudios</p>
      <h2 id="h-est">Academia <em>estelar</em></h2>
      ${timelineHTML(DATA.studies || [])}
      <p class="sub">Certificaciones</p>
      ${timelineHTML(DATA.certifications || [])}
    </section>`,
  habilidades: `
    <section class="section floating-head pos-top-left" data-id="habilidades" aria-labelledby="h-hab">
      <p class="eyebrow">04 // Habilidades</p>
      <h2 id="h-hab">Mi caja de <em>herramientas</em></h2>
      <p>Tecnologías que he usado en proyectos reales. Atraviesa el cinturón de tarjetas.</p>
    </section>`,
  proyectos: `
    <section class="section floating-head pos-top-left" data-id="proyectos" aria-labelledby="h-pro">
      <p class="eyebrow">05 // Proyectos</p>
      <h2 id="h-pro">Proyectos <em>en órbita</em></h2>
      <p>${projects.length} proyectos construidos y desplegados.</p>
      <span class="hint"><i class="fa-solid fa-hand-pointer"></i> Haz clic en una tarjeta</span>
      <div class="project-list">${projects
        .map((p, i) => `<button type="button" data-project="${i}">${esc(p.title.split("—")[0].trim())}</button>`)
        .join("")}</div>
    </section>`,
  "mas-alla": `
    <section class="section panel pos-right" data-id="mas-alla" aria-labelledby="h-mas">
      <p class="eyebrow">06 // Más allá</p>
      <h2 id="h-mas">Hacia dónde <em>voy</em></h2>
      <div class="tabs" role="tablist">${TABS.map(
        (t, i) => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${i === 0}">${t.label}</button>`
      ).join("")}</div>
      <div class="cards" id="tab-cards" role="tabpanel">${TABS[0] ? tabCards(TABS[0]) : ""}</div>
    </section>`,
  contacto: `
    <section class="section panel pos-left" data-id="contacto" aria-labelledby="h-con">
      <p class="eyebrow">07 // Contacto</p>
      <h2 id="h-con">Abramos un <em>canal</em></h2>
      <p>¿Tienes un proyecto o una vacante? Escríbeme y te respondo pronto.</p>
      <ul class="contact-list">
        ${contact.email ? `<li><a href="mailto:${esc(contact.email)}"><i class="fa-solid fa-envelope"></i>${esc(contact.email)}</a></li>` : ""}
        ${whatsapp ? `<li><a href="${whatsapp}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i>${esc(contact.phone)}</a></li>` : ""}
        ${contact.location ? `<li><span><i class="fa-solid fa-location-dot"></i>${esc(contact.address ? contact.address + ", " + contact.location : contact.location)}</span></li>` : ""}
      </ul>
      <form class="form" id="contact-form" novalidate>
        <input type="text" name="nombre" placeholder="Tu nombre" required autocomplete="name" maxlength="80">
        <input type="email" name="email" placeholder="Tu correo" required autocomplete="email" maxlength="120">
        <select name="motivo" required aria-label="Motivo del contacto">
          <option value="" selected disabled>Motivo del contacto</option>
          <option>Oferta de empleo</option>
          <option>Proyecto o servicio</option>
          <option>Otro</option>
        </select>
        <textarea name="mensaje" placeholder="Cuéntame sobre tu proyecto o vacante" required maxlength="3000"></textarea>
        <input type="text" name="_honey" class="honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="_subject" value="Nuevo mensaje desde el portafolio">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="autorizacion_datos" value="">
        <p class="legal-notice">${esc(legal.fullName || profile.name || "")} tratará tus datos solo para responder tu mensaje, procesos de selección o servicios que solicites. Puedes conocer, actualizar, rectificar o pedir que borre tus datos escribiendo a ${esc(contact.email || "")}. <a href="${policyUrl}" target="_blank" rel="noopener">Política de tratamiento de datos</a>.</p>
        <label class="consent">
          <input type="checkbox" name="acepto" required>
          <span>Autorizo el tratamiento de mis datos personales según la <a href="${policyUrl}" target="_blank" rel="noopener">política de tratamiento de datos</a>.</span>
        </label>
        <button class="btn" type="submit">Enviar mensaje <i class="fa-solid fa-paper-plane"></i></button>
        <p class="form-status" id="form-status" role="status"></p>
      </form>
      <div class="end-actions">
        <button class="btn btn-ghost" type="button" data-goto="inicio"><i class="fa-solid fa-rotate-left"></i> Volver al despegue</button>
        <a class="btn btn-ghost" href="index.html"><i class="fa-solid fa-house"></i> Portada</a>
      </div>
      <div class="legal-footer">
        <p>${esc(legal.fullName || "")} · ${esc((contact.location || "").split(",").slice(0, 2).join(","))}${contact.address ? " · " + esc(contact.address) : ""} · <a href="mailto:${esc(contact.email || "")}">${esc(contact.email || "")}</a> · ${esc(contact.phone || "")}</p>
        <p><a href="${policyUrl}">Política de tratamiento de datos</a> · <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">Superintendencia de Industria y Comercio</a> · © ${legal.year || new Date().getFullYear()} ${esc(legal.fullName || "")}</p>
      </div>
      <p class="credits">Texturas: <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer">Solar System Scope</a> (CC BY 4.0) y NASA · Estación Espacial: <a href="https://github.com/nasa/NASA-3D-Resources" target="_blank" rel="noopener noreferrer">NASA 3D Resources</a></p>
    </section>`,
};

const overlays = $("#overlays");
overlays.innerHTML = SECTIONS.map((s) => SECTION_HTML[s.id] || "").join("");
SECTIONS.forEach((s) => (s.el = overlays.querySelector(`[data-id="${s.id}"]`)));

/* Menú superior y riel lateral */
const navSections = SECTIONS.filter((s) => !s.hidden && s.id !== "inicio");
$("#topnav").innerHTML = navSections
  .map((s, i) => `<button type="button" data-goto="${s.id}"><b>${num(i)}.</b>${s.label}</button>`)
  .join("");
$("#hud-dots").innerHTML = SECTIONS.filter((s) => !s.hidden)
  .map((s) => `<button type="button" class="hud-dot" data-goto="${s.id}" aria-label="${s.label}"><span>${s.label}</span><i></i></button>`)
  .join("");

const SOCIAL_ICONS = { github: "fa-brands fa-github", linkedin: "fa-brands fa-linkedin-in", twitter: "fa-brands fa-x-twitter" };
$("#social-rail").innerHTML =
  Object.entries(DATA.social || {})
    .filter(([, url]) => url)
    .map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${k}"><i class="${SOCIAL_ICONS[k] || "fa-solid fa-link"}"></i></a>`)
    .join("") + (contact.email ? `<a href="mailto:${esc(contact.email)}" aria-label="Correo"><i class="fa-solid fa-envelope"></i></a>` : "");

/* Pestañas de "Más allá" */
overlays.addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tab]");
  if (!tab) return;
  overlays.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tab)));
  $("#tab-cards").innerHTML = tabCards(TABS.find((t) => t.id === tab.dataset.tab));
});

/* ============================================================
   4. ESCENA BASE
   ============================================================ */
const canvas = $("#universe");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 4000);

const manager = new THREE.LoadingManager();
const texLoader = new THREE.TextureLoader(manager);
const tex = (url, color = true) => {
  const t = texLoader.load(url);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/* Luces: el Sol ilumina todo + relleno suave desde la cámara */
const sunLight = new THREE.PointLight(0xfff1dc, 2.6, 0, 0);
sunLight.position.copy(POS.sun.p);
scene.add(sunLight);
const fill = new THREE.DirectionalLight(0x9fc4ff, 0.9);
fill.position.set(0.2, 0.5, 1);
scene.add(fill);
scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x1a1030, 0.35));

/* Brillo radial reutilizable (atmósferas, Sol, nebulosas) */
function glowTexture(stops) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([o, col]) => grd.addColorStop(o, col));
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const SOFT = glowTexture([[0, "rgba(255,255,255,1)"], [0.25, "rgba(255,255,255,0.55)"], [0.6, "rgba(255,255,255,0.12)"], [1, "rgba(255,255,255,0)"]]);
function glow(color, size, opacity = 1) {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: SOFT, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  s.scale.setScalar(size);
  return s;
}

/* ===== Fondo: Vía Láctea + estrellas + nebulosas ===== */
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(1800, 48, 32),
  new THREE.MeshBasicMaterial({ map: tex("assets/textures/milky_way.webp"), side: THREE.BackSide, color: 0x7f8db3, depthWrite: false })
);
scene.add(sky);

function starField(count, rMin, rMax, size, color) {
  const pos = new Float32Array(count * 3);
  const center = new THREE.Vector3(0, 0, -160);
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(rMin + Math.random() * (rMax - rMin)).add(center);
    pos.set([v.x, v.y, v.z], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    g,
    new THREE.PointsMaterial({ size, color, map: SOFT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
}
const stars = new THREE.Group();
stars.add(starField(2600, 500, 1200, 3.2, 0xffffff), starField(500, 500, 1200, 6, 0x9fd8ff), starField(900, 60, 400, 0.6, 0xdde8ff));
scene.add(stars);

[
  [new THREE.Vector3(-160, 60, -260), 0x2563eb, 380, 0.35],
  [new THREE.Vector3(180, -40, -120), 0x7c3aed, 320, 0.25],
  [new THREE.Vector3(60, 90, -520), 0x0ea5e9, 420, 0.3],
  [new THREE.Vector3(-90, -70, -420), 0xdb2777, 260, 0.16],
].forEach(([p, c, s, o]) => {
  const n = glow(c, s, o);
  n.position.copy(p);
  scene.add(n);
});

/* ============================================================
   5. CUERPOS CELESTES
   ============================================================ */
const sphere = new THREE.SphereGeometry(1, 96, 64);
const spinners = [];

/* --- Tierra de noche con luces de ciudades (igual que la portada) --- */
const earthSun = POS.sun.p.clone().sub(POS.earth.p).normalize();
const earthMat = new THREE.ShaderMaterial({
  uniforms: {
    dayMap: { value: tex("assets/textures/earth_day.jpg") },
    nightMap: { value: tex("assets/textures/earth_night.jpg") },
    specMap: { value: tex("assets/textures/earth_specular.jpg", false) },
    uSun: { value: earthSun },
  },
  vertexShader: `
    varying vec2 vUv; varying vec3 vN; varying vec3 vW;
    void main(){
      vUv = uv;
      vec4 w = modelMatrix * vec4(position, 1.0);
      vW = w.xyz;
      vN = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragmentShader: `
    uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D specMap; uniform vec3 uSun;
    varying vec2 vUv; varying vec3 vN; varying vec3 vW;
    void main(){
      vec3 n = normalize(vN);
      vec3 v = normalize(cameraPosition - vW);
      float d = dot(n, uSun);
      vec3 day = texture2D(dayMap, vUv).rgb;
      vec3 night = texture2D(nightMap, vUv).rgb;
      float spec = texture2D(specMap, vUv).r;
      float dayMix = smoothstep(-0.08, 0.35, d);
      float nightMix = 1.0 - smoothstep(-0.2, 0.12, d);
      vec3 col = day * dayMix * 1.25 + day * vec3(0.03, 0.06, 0.13);
      col += pow(night, vec3(1.4)) * vec3(1.0, 0.78, 0.45) * 2.4 * nightMix;
      vec3 r = reflect(-uSun, n);
      col += vec3(0.55, 0.75, 1.0) * pow(max(dot(r, v), 0.0), 18.0) * spec * dayMix * 0.8;
      float fres = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      col += vec3(0.15, 0.45, 1.0) * fres * (0.35 + 0.9 * smoothstep(-0.4, 0.5, d));
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
});
const earth = new THREE.Group();
earth.position.copy(POS.earth.p);
earth.rotation.z = 0.35;
const earthSurface = new THREE.Mesh(sphere, earthMat);
earthSurface.rotation.y = -1.6;
const clouds = new THREE.Mesh(
  sphere,
  new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false, alphaMap: tex("assets/textures/earth_clouds.jpg", false) })
);
clouds.scale.setScalar(1.012);
earth.add(earthSurface, clouds);
earth.scale.setScalar(POS.earth.r);
scene.add(earth);
const earthGlow = glow(0x3d9bff, POS.earth.r * 2.9, 0.75);
earthGlow.position.copy(POS.earth.p);
scene.add(earthGlow);
spinners.push([earthSurface, 0.01], [clouds, 0.014]);

/* --- Planetas con textura --- */
function planet({ p, r }, map, opts = {}) {
  const m = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ map: tex(map), roughness: 0.95, metalness: 0 }));
  m.position.copy(p);
  m.scale.setScalar(r);
  if (opts.tilt) m.rotation.z = opts.tilt;
  scene.add(m);
  if (opts.glow) {
    const g = glow(opts.glow, r * (opts.glowSize || 2.8), opts.glowOpacity ?? 0.6);
    g.position.copy(p);
    scene.add(g);
  }
  spinners.push([m, opts.spin ?? 0.03]);
  return m;
}

planet(POS.moon, "assets/textures/moon.webp", { spin: 0.02 });
planet(POS.venus, "assets/textures/venus.jpg", { glow: 0xffcf7a, glowOpacity: 0.45, spin: 0.015 });
planet(POS.neptune, "assets/textures/neptune.webp", { glow: 0x38bdf8, glowOpacity: 0.55, tilt: 0.5, spin: 0.04 });

/* --- Planeta con anillo (Proyectos) --- */
const ringed = new THREE.Group();
ringed.position.copy(POS.ringed.p);
ringed.rotation.copy(RING_TILT);
scene.add(ringed);
const ringedBody = new THREE.Mesh(
  sphere,
  new THREE.MeshStandardMaterial({ map: tex("assets/textures/saturn.jpg"), roughness: 0.9, emissive: 0x0b1a33, emissiveIntensity: 0.6 })
);
ringedBody.scale.setScalar(POS.ringed.r);
ringed.add(ringedBody);
spinners.push([ringedBody, 0.05]);

function ringGeometry(inner, outer) {
  const g = new THREE.RingGeometry(inner, outer, 160, 1);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  g.rotateX(-Math.PI / 2);
  return g;
}
const ringTex = tex("assets/textures/saturn_ring.png");
const ring = new THREE.Mesh(
  ringGeometry(POS.ringed.inner, POS.ringed.outer),
  new THREE.MeshBasicMaterial({ map: ringTex, color: 0xbfe6ff, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })
);
ringed.add(ring);
/* Líneas de neón en el color de acento */
[POS.ringed.inner - 0.3, POS.ringed.outer + 0.4, POS.ringed.cards].forEach((r, i) => {
  const l = new THREE.Mesh(
    ringGeometry(r - 0.06, r + 0.06),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: i === 2 ? 0.35 : 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  ringed.add(l);
});
const ringedGlow = glow(0x38bdf8, POS.ringed.r * 3.2, 0.35);
ringedGlow.position.copy(POS.ringed.p);
scene.add(ringedGlow);

/* --- El Sol --- */
const sun = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ map: tex("assets/textures/sun.jpg"), color: 0xffd7a0 }));
sun.position.copy(POS.sun.p);
sun.scale.setScalar(POS.sun.r);
scene.add(sun);
spinners.push([sun, 0.01]);
const sunGlowA = glow(0xffa53a, POS.sun.r * 3.4, 0.9);
const sunGlowB = glow(0xff6a1a, POS.sun.r * 6.5, 0.45);
sunGlowA.position.copy(POS.sun.p);
sunGlowB.position.copy(POS.sun.p);
scene.add(sunGlowA, sunGlowB);

/* --- Asteroides alrededor del planeta de proyectos y en el cinturón --- */
const rockGeo = new THREE.DodecahedronGeometry(1, 0);
const rocks = new THREE.InstancedMesh(rockGeo, new THREE.MeshStandardMaterial({ color: 0x8a8f9c, roughness: 1, flatShading: true }), 220);
const rockData = [];
{
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  for (let i = 0; i < rocks.count; i++) {
    let p;
    if (i < 150) {
      const a = Math.random() * Math.PI * 2;
      const r = 26 + Math.random() * 14;
      p = new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 6, Math.sin(a) * r).applyEuler(RING_TILT).add(POS.ringed.p);
    } else {
      const side = Math.random() < 0.5 ? -1 : 1;
      p = new THREE.Vector3(side * (7 + Math.random() * 12), (Math.random() - 0.5) * 12, POS.skills.z + (Math.random() - 0.5) * 50);
    }
    const sc = 0.15 + Math.pow(Math.random(), 3) * 1.1;
    rockData.push({ p, sc, rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, 0), sp: (Math.random() - 0.5) * 0.6 });
    q.setFromEuler(rockData[i].rot);
    s.setScalar(sc);
    rocks.setMatrixAt(i, m.compose(p, q, s));
  }
}
scene.add(rocks);

/* ============================================================
   6. ASTRONAUTA Y ESTACIÓN ESPACIAL
   ============================================================ */
const draco = new DRACOLoader(manager).setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/");
const gltf = new GLTFLoader(manager).setDRACOLoader(draco);
let astronaut = null;
let iss = null;

function fitTo(obj, size, axis = "max") {
  const box = new THREE.Box3().setFromObject(obj);
  const dim = box.getSize(new THREE.Vector3());
  const ref = axis === "y" ? dim.y : Math.max(dim.x, dim.y, dim.z);
  obj.scale.multiplyScalar(size / ref);
  const c = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
  obj.position.sub(c);
}

/* Astronauta (geometría propia) */
{
  const suit = new THREE.MeshStandardMaterial({ color: 0xeef1f6, roughness: 0.6, metalness: 0.05 });
  const joint = new THREE.MeshStandardMaterial({ color: 0xb8c0cf, roughness: 0.7 });
  const visor = new THREE.MeshStandardMaterial({ color: 0x0a1630, roughness: 0.05, metalness: 0.9, emissive: 0x38bdf8, emissiveIntensity: 0.25 });
  const accentM = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.2 });
  const redM = new THREE.MeshStandardMaterial({ color: 0xe23b3b, roughness: 0.5 });
  const cap = (r, h, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, h, 8, 16), m);

  astronaut = new THREE.Group();
  const torso = cap(0.34, 0.42, suit);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.33, 32, 24), suit);
  helmet.position.y = 0.66;
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.255, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62), visor);
  face.rotation.x = Math.PI / 2.1;
  face.position.set(0, 0.68, 0.12);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.3), joint);
  pack.position.set(0, 0.08, -0.36);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.06), joint);
  panel.position.set(0, 0.12, 0.33);
  const light = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.065), accentM);
  light.position.set(0, 0.16, 0.34);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.02), redM);
  flag.position.set(0.24, 0.32, 0.25);
  astronaut.add(torso, helmet, face, pack, panel, light, flag);

  const limb = (x, y, rz, rx, len) => {
    const g = new THREE.Group();
    const m = cap(0.12, len, suit);
    m.position.y = -len / 2 - 0.06;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), joint);
    hand.position.y = -len - 0.16;
    g.add(m, hand);
    g.position.set(x, y, 0);
    g.rotation.set(rx, 0, rz);
    astronaut.add(g);
    return g;
  };
  astronaut.userData.arms = [limb(-0.42, 0.32, -0.9, 0.3, 0.38), limb(0.42, 0.32, 1.25, -0.4, 0.38)];
  astronaut.userData.legs = [limb(-0.16, -0.38, -0.25, 0.4, 0.42), limb(0.16, -0.38, 0.3, -0.2, 0.42)];

  astronaut.scale.setScalar(1.1);
  astronaut.position.copy(POS.astronaut);
  astronaut.rotation.set(0.25, -0.6, 0.35);
  scene.add(astronaut);
}

gltf.load(
  "assets/models/iss.glb",
  (g) => {
    const inner = g.scene;
    fitTo(inner, 15);
    iss = new THREE.Group();
    iss.add(inner);
    iss.position.copy(POS.iss);
    iss.rotation.set(0.35, 0.6, -0.15);
    scene.add(iss);
  },
  undefined,
  () => console.warn("No se pudo cargar la estación espacial")
);

/* ============================================================
   7. EL COHETE (hecho con geometría, sin modelos externos)
   ============================================================ */
const rocket = new THREE.Group();
const rocketBody = new THREE.Group();
rocket.add(rocketBody);
scene.add(rocket);
{
  const white = new THREE.MeshStandardMaterial({ color: 0xf1f4fa, roughness: 0.35, metalness: 0.35 });
  const red = new THREE.MeshStandardMaterial({ color: 0xe23b3b, roughness: 0.45, metalness: 0.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2f45, roughness: 0.5, metalness: 0.7 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.6 });

  const prof = (pts) => pts.map(([r, y]) => new THREE.Vector2(r, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof([[0, -1], [0.33, -1], [0.43, -0.6], [0.46, 0.15], [0.41, 0.72]]), 48), white);
  const nose = new THREE.Mesh(new THREE.LatheGeometry(prof([[0.41, 0.72], [0.3, 1.02], [0.15, 1.28], [0, 1.42]]), 48), red);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.455, 0.025, 8, 48), accent);
  band.rotation.x = Math.PI / 2;
  band.position.y = -0.25;
  const porthole = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshStandardMaterial({ color: 0x0b2a4a, emissive: 0x38bdf8, emissiveIntensity: 0.9, roughness: 0.1, metalness: 0.6 }));
  porthole.position.set(0, 0.32, 0.455);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 32), dark);
  rim.position.copy(porthole.position);
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.28, 32, 1, true), dark);
  nozzle.position.y = -1.13;

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.42, -0.35);
  finShape.lineTo(0.42, -0.62);
  finShape.lineTo(0, -0.38);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: false });
  finGeo.translate(0, 0, -0.025);
  for (let i = 0; i < 3; i++) {
    const f = new THREE.Mesh(finGeo, red);
    const holder = new THREE.Group();
    f.position.set(0.38, -0.42, 0);
    holder.add(f);
    holder.rotation.y = (i / 3) * Math.PI * 2 + Math.PI / 6;
    rocketBody.add(holder);
  }
  rocketBody.add(body, nose, band, porthole, rim, nozzle);
}

/* Llama del motor */
const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa54a, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xfff4d6, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
const flame = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1, 24, 1, true).translate(0, 0.5, 0).rotateX(Math.PI), flameMat);
const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1, 24, 1, true).translate(0, 0.5, 0).rotateX(Math.PI), flameCoreMat);
flame.position.y = flameCore.position.y = -1.25;
const engineGlow = glow(0xff9a3c, 2.2, 0.8);
engineGlow.position.y = -1.45;
rocketBody.add(flame, flameCore, engineGlow);

/* Partículas del escape */
const MAXP = 420;
const pPos = new Float32Array(MAXP * 3);
const pLife = new Float32Array(MAXP);
const pSize = new Float32Array(MAXP);
const pVel = Array.from({ length: MAXP }, () => new THREE.Vector3());
const pAge = new Float32Array(MAXP).fill(1);
const pMax = new Float32Array(MAXP).fill(1);
let pHead = 0;
const exhaustGeo = new THREE.BufferGeometry();
exhaustGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
exhaustGeo.setAttribute("aLife", new THREE.BufferAttribute(pLife, 1));
exhaustGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
const exhaust = new THREE.Points(
  exhaustGeo,
  new THREE.ShaderMaterial({
    uniforms: { uScale: { value: innerHeight / 2 } },
    vertexShader: `
      attribute float aLife; attribute float aSize; varying float vLife; uniform float uScale;
      void main(){
        vLife = aLife;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (1.0 + (1.0 - aLife) * 2.5) * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vLife;
      void main(){
        if (vLife <= 0.0) discard;
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d) * vLife;
        vec3 hot = vec3(1.0, 0.92, 0.7);
        vec3 warm = vec3(1.0, 0.45, 0.12);
        vec3 smoke = vec3(0.35, 0.4, 0.55);
        vec3 c = mix(smoke, mix(warm, hot, smoothstep(0.6, 1.0, vLife)), smoothstep(0.15, 0.6, vLife));
        gl_FragColor = vec4(c, a * 0.85);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
exhaust.frustumCulled = false;
scene.add(exhaust);

const _nozzle = new THREE.Vector3();
const _back = new THREE.Vector3();
function emit(n, speed) {
  rocketBody.localToWorld(_nozzle.set(0, -1.3, 0));
  _back.set(0, -1, 0).applyQuaternion(rocket.quaternion);
  for (let k = 0; k < n; k++) {
    const i = pHead;
    pHead = (pHead + 1) % MAXP;
    pPos.set([_nozzle.x, _nozzle.y, _nozzle.z], i * 3);
    pVel[i].copy(_back).multiplyScalar(2.5 + speed * 6 + Math.random() * 2).add(
      new THREE.Vector3((Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.9)
    );
    pAge[i] = 0;
    pMax[i] = 0.45 + Math.random() * 0.6;
    pSize[i] = 0.18 + Math.random() * 0.22;
  }
}
function updateExhaust(dt) {
  for (let i = 0; i < MAXP; i++) {
    if (pAge[i] >= pMax[i]) {
      pLife[i] = 0;
      continue;
    }
    pAge[i] += dt;
    pPos[i * 3] += pVel[i].x * dt;
    pPos[i * 3 + 1] += pVel[i].y * dt;
    pPos[i * 3 + 2] += pVel[i].z * dt;
    pVel[i].multiplyScalar(0.96);
    pLife[i] = Math.max(0, 1 - pAge[i] / pMax[i]);
  }
  exhaustGeo.attributes.position.needsUpdate = true;
  exhaustGeo.attributes.aLife.needsUpdate = true;
  exhaustGeo.attributes.aSize.needsUpdate = true;
}

/* Trayectoria del cohete: siempre un poco delante y debajo de la cámara */
const SUN_HIT = POS.sun.p.clone().add(camAt(1).sub(POS.sun.p).normalize().multiplyScalar(POS.sun.r * 0.95));
const _c = new THREE.Vector3();
const _f = new THREE.Vector3();
const ROCKET_AHEAD = 12;
function rocketAt(p, out = new THREE.Vector3()) {
  const lift = smooth(p, 0.06, 0.15);
  camAt(p, _c);
  tgtAt(p, _f).sub(_c).normalize();
  const ahead = _c.addScaledVector(_f, ROCKET_AHEAD);
  ahead.y -= isMobile() ? 1.6 : 2.3;
  out.set(0, 0, 0).lerp(ahead, lift);
  const end = smooth(p, 0.955, 0.995);
  if (end > 0) out.lerp(SUN_HIT, end);
  return out;
}

/* ============================================================
   8. TARJETAS 3D (habilidades y proyectos)
   ============================================================ */
const FONT_DISPLAY = '"Orbitron", "Segoe UI", sans-serif';
const FONT_BODY = '"Space Grotesk", "Segoe UI", sans-serif';
const FONT_MONO = '"JetBrains Mono", Consolas, monospace';

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function wrap(g, text, maxW, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else line = test;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  }
  return lines;
}

function chipsRow(g, items, x, y, maxW, h = 40) {
  g.font = `500 22px ${FONT_MONO}`;
  let cx = x;
  let cy = y;
  for (const it of items) {
    const w = g.measureText(it).width + 28;
    if (cx + w > x + maxW) {
      cx = x;
      cy += h + 10;
    }
    roundRect(g, cx, cy, w, h, h / 2);
    g.fillStyle = "rgba(56,189,248,0.12)";
    g.fill();
    g.strokeStyle = "rgba(56,189,248,0.45)";
    g.lineWidth = 1.5;
    g.stroke();
    g.fillStyle = "#bae6fd";
    g.fillText(it, cx + 14, cy + h / 2 + 8);
    cx += w + 10;
  }
}

function cardCanvas(draw, W = 768, H = 480) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  roundRect(g, 4, 4, W - 8, H - 8, 28);
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "rgba(14,22,44,0.94)");
  bg.addColorStop(1, "rgba(6,10,24,0.94)");
  g.fillStyle = bg;
  g.fill();
  g.strokeStyle = "rgba(56,189,248,0.7)";
  g.lineWidth = 3;
  g.stroke();
  /* esquinas tipo HUD */
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 5;
  [[22, 22, 1, 1], [W - 22, 22, -1, 1], [22, H - 22, 1, -1], [W - 22, H - 22, -1, -1]].forEach(([x, y, sx, sy]) => {
    g.beginPath();
    g.moveTo(x, y + 26 * sy);
    g.lineTo(x, y);
    g.lineTo(x + 26 * sx, y);
    g.stroke();
  });
  draw(g, W, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function cardMesh(texture, w, h) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })
  );
  return m;
}

const skillCards = [];
const projectCards = [];
const projectOrbit = new THREE.Group();
projectOrbit.position.copy(POS.ringed.p);
projectOrbit.rotation.copy(RING_TILT);
scene.add(projectOrbit);

const SKILL_SPOTS = [
  [-3.7, 1.7, -136],
  [3.8, -1.1, -141],
  [-3.4, -1.4, -147],
  [3.6, 1.6, -152],
  [-3.8, 1.2, -158],
  [3.7, -1.3, -163],
];

function buildCards() {
  (DATA.skills || []).forEach((s, i) => {
    const t = cardCanvas((g, W) => {
      g.fillStyle = "#38bdf8";
      g.font = `500 22px ${FONT_MONO}`;
      g.fillText(`${num(i)} // HABILIDADES`, 48, 74);
      g.fillStyle = "#f4f6fb";
      g.font = `900 46px ${FONT_DISPLAY}`;
      g.fillText(s.group.toUpperCase(), 48, 138);
      chipsRow(g, s.items, 48, 180, W - 96, 44);
    });
    const m = cardMesh(t, 4.4, 2.75);
    const spot = SKILL_SPOTS[i % SKILL_SPOTS.length];
    m.position.set(...spot);
    m.userData.base = m.position.clone();
    m.userData.phase = i * 1.3;
    scene.add(m);
    skillCards.push(m);
  });

  projects.forEach((p, i) => {
    const t = cardCanvas((g, W, H) => {
      g.fillStyle = "#38bdf8";
      g.font = `500 22px ${FONT_MONO}`;
      g.fillText(`P-${num(i)}${p.demo ? "  ·  DEMO EN VIVO" : ""}`, 48, 74);
      g.fillStyle = "#f4f6fb";
      g.font = `700 38px ${FONT_DISPLAY}`;
      wrap(g, p.title.split("—")[0].trim(), W - 96, 2).forEach((l, k) => g.fillText(l, 48, 130 + k * 46));
      g.fillStyle = "rgba(244,246,251,0.75)";
      g.font = `400 25px ${FONT_BODY}`;
      wrap(g, p.description, W - 96, 3).forEach((l, k) => g.fillText(l, 48, 230 + k * 34));
      chipsRow(g, (p.tech || []).slice(0, 3), 48, H - 104, W - 260, 40);
      g.fillStyle = "#38bdf8";
      g.font = `600 22px ${FONT_MONO}`;
      g.textAlign = "right";
      g.fillText("VER DETALLES →", W - 48, H - 76);
      g.textAlign = "left";
    });
    const m = cardMesh(t, 6, 3.75);
    m.userData.index = i;
    m.userData.angle = (i / projects.length) * Math.PI * 2;
    projectOrbit.add(m);
    projectCards.push(m);
  });
}

/* ============================================================
   9. SCROLL, NAVEGACIÓN Y PANELES
   ============================================================ */
const track = $("#track");
const PAGES = () => (isMobile() ? 12 : 14);
function sizeTrack() {
  track.style.height = `${PAGES() * 100}vh`;
}
sizeTrack();

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
let target = 0;
let progress = 0;
let lastProgress = 0;

function readScroll() {
  target = clamp(window.scrollY / maxScroll(), 0, 1);
}
window.addEventListener("scroll", readScroll, { passive: true });

function goTo(id) {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) return;
  window.scrollTo({ top: s.focus * maxScroll(), behavior: "auto" });
  readScroll();
}

document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (!g) return;
  e.preventDefault();
  goTo(g.dataset.goto);
  closeMenu();
});

/* Teclado: flechas / AvPág saltan a la siguiente sección */
const STOPS = SECTIONS.map((s) => s.focus);
document.addEventListener("keydown", (e) => {
  if (!modal.hidden) {
    if (e.key === "Escape") closeModal();
    return;
  }
  if (e.target.closest("input, textarea, select, [contenteditable]")) return;
  if (e.key === " " && e.target.closest("button, a")) return;
  let dir = 0;
  if (["ArrowDown", "PageDown", " "].includes(e.key)) dir = 1;
  if (["ArrowUp", "PageUp"].includes(e.key)) dir = -1;
  if (!dir) return;
  e.preventDefault();
  const cur = target;
  const next = dir > 0 ? STOPS.find((s) => s > cur + 0.005) : [...STOPS].reverse().find((s) => s < cur - 0.005);
  if (next !== undefined) window.scrollTo({ top: next * maxScroll(), behavior: "auto" });
  readScroll();
});

/* Menú móvil */
const burger = $("#burger");
const topnav = $("#topnav");
function closeMenu() {
  topnav.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}
burger.addEventListener("click", () => {
  const open = topnav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});

/* Visibilidad de cada panel según el progreso */
function sectionAlpha(s, p) {
  const [a, b] = s.range;
  const f = Math.max(0.012, (b - a) * 0.18);
  const inA = a === 0 ? 1 : smooth(p, a, a + f);
  const outA = b === 1 ? 1 : 1 - smooth(p, b - f, b);
  return inA * outA;
}

let activeId = null;
function updateOverlays(p) {
  let best = SECTIONS[0];
  for (const s of SECTIONS) {
    const al = sectionAlpha(s, p);
    if (s.el) {
      s.el.style.opacity = al.toFixed(3);
      s.el.style.setProperty("--shift", `${((1 - al) * 18).toFixed(1)}px`);
      s.el.classList.toggle("live", al > 0.01);
      s.el.classList.toggle("interactive", al > 0.6);
    }
    if (p >= s.range[0] - 0.02) best = s;
  }
  const navId = best.hidden ? "inicio" : best.id;
  if (navId !== activeId) {
    activeId = navId;
    document.querySelectorAll("[data-goto]").forEach((b) => b.classList.toggle("active", b.dataset.goto === navId));
    $("#hud-sec").textContent = (SECTIONS.find((s) => s.id === navId)?.label || "").toUpperCase();
  }
  $("#scroll-cue").style.opacity = String(1 - smooth(p, 0.01, 0.05));

  const cd = $("#countdown");
  if (cd) {
    const k = (p - 0.07) / 0.08;
    cd.textContent = k < 0.25 ? "T-3" : k < 0.5 ? "T-2" : k < 0.75 ? "T-1" : "¡Despegue!";
  }
}

/* ============================================================
   10. INTERACCIÓN CON LAS TARJETAS DE PROYECTOS
   ============================================================ */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(9, 9);
let hovered = null;

window.addEventListener("pointermove", (e) => {
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
});
canvas.addEventListener("click", () => {
  if (hovered) openModal(hovered.userData.index);
});

overlays.addEventListener("click", (e) => {
  const b = e.target.closest("[data-project]");
  if (b) openModal(Number(b.dataset.project));
});
overlays.addEventListener("pointerover", (e) => {
  const b = e.target.closest("[data-project]");
  projectCards.forEach((m) => (m.userData.hot = b && m.userData.index === Number(b.dataset.project)));
});
overlays.addEventListener("pointerout", () => projectCards.forEach((m) => (m.userData.hot = false)));

const modal = $("#modal");
let lastFocus = null;
function openModal(i) {
  const p = projects[i];
  if (!p) return;
  lastFocus = document.activeElement;
  $("#modal-body").innerHTML = `
    <p class="eyebrow">Proyecto ${num(i)}</p>
    <h3 id="modal-title">${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <div class="chips">${(p.tech || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    <div class="end-actions">
      ${p.demo ? `<a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ver demo</a>` : ""}
      ${p.repo ? `<a class="btn btn-ghost" href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Código</a>` : ""}
      ${!p.demo && !p.repo ? `<p>Código privado o en desarrollo.</p>` : ""}
    </div>`;
  modal.hidden = false;
  $(".modal-close", modal).focus();
}
function closeModal() {
  modal.hidden = true;
  if (lastFocus) lastFocus.focus();
}
modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal();
});

/* ============================================================
   11. FORMULARIO DE CONTACTO (FormSubmit, sin backend)
   ============================================================ */
const form = $("#contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form._honey.value) return;
    const status = $("#form-status");
    if (!form.checkValidity()) {
      status.textContent = form.acepto.checked
        ? "Completa tu nombre, un correo válido, el motivo y el mensaje."
        : "Para enviar el mensaje debes autorizar el tratamiento de tus datos.";
      status.className = "form-status error";
      return;
    }
    /* Constancia de la autorización (Ley 1581 de 2012, art. 9) */
    const stamp = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "long", timeStyle: "medium" });
    form.autorizacion_datos.value = `Sí. Aceptada el ${stamp} (hora de Colombia). Política vigente desde el ${legal.policyVersion || ""}.`;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.textContent = "Enviando…";
    status.className = "form-status";
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contact.email)}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!r.ok) throw new Error();
      status.textContent = "¡Mensaje enviado! Te responderé pronto.";
      status.className = "form-status success";
      form.reset();
    } catch {
      status.textContent = `No se pudo enviar. Escríbeme directo a ${contact.email}`;
      status.className = "form-status error";
    } finally {
      btn.disabled = false;
    }
  });
}

/* ============================================================
   12. BUCLE DE ANIMACIÓN
   ============================================================ */
const clock = new THREE.Clock();
const camPos = new THREE.Vector3();
const camTgt = new THREE.Vector3();
const rPos = new THREE.Vector3();
const rNext = new THREE.Vector3();
const dir = new THREE.Vector3(0, 1, 0);
const UP = new THREE.Vector3(0, 1, 0);
const qTravel = new THREE.Quaternion();
const qUp = new THREE.Quaternion();
const mouse = { x: 0, y: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.x = e.clientX / innerWidth - 0.5;
  mouse.y = e.clientY / innerHeight - 0.5;
});
const flash = $("#flash");
const rockMatrix = new THREE.Matrix4();
const rockQ = new THREE.Quaternion();
const rockS = new THREE.Vector3();
const hudAlt = $("#hud-alt");
const hudVel = $("#hud-vel");
let vel = 0;

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  /* progreso suavizado (efecto de vuelo) */
  progress += (target - progress) * (REDUCED ? 1 : 1 - Math.pow(0.0015, dt));
  if (Math.abs(target - progress) < 0.00005) progress = target;
  const p = progress;
  const dp = Math.abs(p - lastProgress) / Math.max(dt, 1e-3);
  lastProgress = p;
  vel += (dp - vel) * 0.1;

  /* cámara */
  camAt(p, camPos);
  tgtAt(p, camTgt);
  camera.position.copy(camPos);
  if (!REDUCED) {
    camera.position.x += mouse.x * 0.6;
    camera.position.y -= mouse.y * 0.4;
  }
  camera.lookAt(camTgt);
  sky.position.copy(camera.position);

  /* cohete */
  rocketAt(p, rPos);
  rocketAt(Math.min(p + 0.004, 1), rNext);
  if (rNext.distanceToSquared(rPos) > 1e-6) dir.copy(rNext).sub(rPos).normalize();
  qTravel.setFromUnitVectors(UP, dir);
  qUp.identity().slerp(qTravel, smooth(p, 0.07, 0.14));
  rocket.position.copy(rPos);
  if (p < 0.07) rocket.position.y += Math.sin(t * 1.6) * 0.06;
  rocket.quaternion.copy(qUp);
  rocketBody.rotation.y += dt * (0.25 + vel * 4);
  const end = smooth(p, 0.975, 0.995);
  rocket.scale.setScalar(Math.max(0.001, 1 - end));
  rocket.visible = end < 0.999;

  /* empuje del motor */
  const launching = smooth(p, 0.07, 0.11) * (1 - smooth(p, 0.16, 0.2));
  const thrust = clamp(0.18 + launching * 0.9 + vel * 9, 0.18, 1.2) * (1 - end);
  const flick = 0.85 + Math.random() * 0.3;
  flame.scale.set(1, 0.6 + thrust * 1.8 * flick, 1);
  flameCore.scale.set(1, 0.4 + thrust * 1.1 * flick, 1);
  flameMat.opacity = 0.35 + thrust * 0.5;
  engineGlow.material.opacity = 0.35 + thrust * 0.55;
  if (!REDUCED && rocket.visible) emit(Math.round(thrust * 7 * flick), thrust);
  updateExhaust(dt);

  /* final: el cohete se funde con el Sol */
  const blast = smooth(p, 0.97, 0.99) * (1 - smooth(p, 0.993, 1.0) * 0.6);
  flash.style.opacity = (blast * 0.45).toFixed(3);
  sunGlowA.scale.setScalar(POS.sun.r * (3.4 + blast * 1.6 + Math.sin(t * 2) * 0.08));

  /* rotaciones y animaciones */
  if (!REDUCED) {
    for (const [m, s] of spinners) m.rotation.y += s * dt;
    if (astronaut) {
      astronaut.position.y = POS.astronaut.y + Math.sin(t * 0.8) * 0.25;
      astronaut.rotation.z = 0.35 + Math.sin(t * 0.5) * 0.15;
      astronaut.rotation.y = -0.6 + Math.sin(t * 0.3) * 0.5;
      const [a1, a2] = astronaut.userData.arms;
      a1.rotation.z = -0.9 + Math.sin(t * 1.1) * 0.25;
      a2.rotation.z = 1.25 + Math.sin(t * 0.9 + 1) * 0.25;
    }
    if (iss) iss.rotation.y += dt * 0.04;
    for (let i = 0; i < rockData.length; i++) {
      const r = rockData[i];
      r.rot.x += r.sp * dt;
      r.rot.y += r.sp * 0.7 * dt;
      rockQ.setFromEuler(r.rot);
      rockS.setScalar(r.sc);
      rocks.setMatrixAt(i, rockMatrix.compose(r.p, rockQ, rockS));
    }
    rocks.instanceMatrix.needsUpdate = true;
    stars.rotation.y = t * 0.002;
  }

  /* tarjetas de habilidades: flotan y miran a la cámara */
  for (const m of skillCards) {
    m.position.copy(m.userData.base);
    if (!REDUCED) m.position.y += Math.sin(t * 0.9 + m.userData.phase) * 0.18;
    m.lookAt(camera.position);
  }

  /* tarjetas de proyectos: orbitan el planeta */
  const R = POS.ringed.cards;
  const drift = REDUCED ? 0 : t * 0.035;
  const projAlpha = sectionAlpha(SECTIONS.find((s) => s.id === "proyectos"), p);
  if (projAlpha > 0.3) {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(projectCards, false)[0];
    hovered = hit ? hit.object : null;
  } else hovered = null;
  canvas.style.cursor = hovered ? "pointer" : "";
  for (const m of projectCards) {
    const a = m.userData.angle + drift;
    m.position.set(Math.cos(a) * R, 0.6, Math.sin(a) * R);
    m.lookAt(camera.position);
    const want = hovered === m || m.userData.hot ? 1.22 : 1;
    const s = m.scale.x + (want - m.scale.x) * 0.15;
    m.scale.setScalar(s);
  }

  /* HUD */
  hudAlt.textContent = Math.round(p * 384400).toLocaleString("es-CO");
  hudVel.textContent = (vel * 40).toFixed(1);
  updateOverlays(p);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ============================================================
   13. TAMAÑO DE PANTALLA
   ============================================================ */
function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.fov = isMobile() ? 62 : 50;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  exhaust.material.uniforms.uScale.value = innerHeight / 2;
  sizeTrack();
  readScroll();
}
window.addEventListener("resize", resize);

/* ============================================================
   14. INICIO
   ============================================================ */
const loader = $("#loader");
const pct = $("#loader-pct");
let started = false;
manager.onProgress = (_u, loaded, total) => (pct.textContent = Math.round((loaded / total) * 100));

async function start() {
  if (started) return;
  started = true;
  const fontsReady = document.fonts
    ? Promise.all([
        document.fonts.load(`900 40px "Orbitron"`),
        document.fonts.load(`700 40px "Orbitron"`),
        document.fonts.load(`400 20px "Space Grotesk"`),
        document.fonts.load(`500 20px "JetBrains Mono"`),
      ]).catch(() => {})
    : Promise.resolve();
  await Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]);
  buildCards();
  loader.classList.add("done");

  const key = decodeURIComponent(location.hash.slice(1));
  const id = HASH_ALIAS[key] || key;
  if (id && SECTIONS.some((s) => s.id === id)) setTimeout(() => goTo(id), 350);
}
manager.onLoad = start;
setTimeout(start, 12000);
window.addEventListener("hashchange", () => {
  const key = decodeURIComponent(location.hash.slice(1));
  goTo(HASH_ALIAS[key] || key);
});

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
resize();
readScroll();
progress = target;
frame();
