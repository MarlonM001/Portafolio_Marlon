/*
  ============================================================
  SCRIPT.JS — Sistema solar interactivo del portafolio
  ============================================================
  Usa el contenido definido en data.js (variable global SITE_DATA).
*/

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const DATA = window.SITE_DATA;

/* ============================================================
   CONFIGURACIÓN DE PLANETAS
   ============================================================ */
const PLANET_CONFIG = [
  { key: "mercurio", name: "Mercurio", section: "Experiencia", radius: 1.7, orbitRadius: 20, speed: 0.9, rotSpeed: 0.4, type: "rocky", colorBase: "#9c8878", colorAccent: "#5f5348" },
  { key: "venus", name: "Venus", section: "Estudios", radius: 2.6, orbitRadius: 30, speed: 0.7, rotSpeed: 0.3, type: "rocky", colorBase: "#e0b978", colorAccent: "#c98a4b" },
  { key: "tierra", name: "Tierra", section: "Sobre mí", radius: 2.9, orbitRadius: 42, speed: 0.55, rotSpeed: 0.6, type: "earth", colorBase: "#1f6fa8", colorAccent: "#2f7d3c" },
  { key: "marte", name: "Marte", section: "Proyectos", radius: 2.1, orbitRadius: 54, speed: 0.45, rotSpeed: 0.5, type: "rocky", colorBase: "#b3502f", colorAccent: "#7a3520" },
  { key: "jupiter", name: "Júpiter", section: "Hobbies", radius: 6.4, orbitRadius: 74, speed: 0.28, rotSpeed: 1.1, type: "bands", colorA: "#c9a06a", colorB: "#8a5a3a" },
  { key: "saturno", name: "Saturno", section: "Sueños", radius: 5.6, orbitRadius: 96, speed: 0.2, rotSpeed: 0.9, type: "bands", colorA: "#d8c48a", colorB: "#b79b63", ring: true },
];

const PANEL_TITLES = {
  sol: { title: "Contacto", subtitle: "El Sol · Centro del sistema" },
  mercurio: { title: "Experiencia", subtitle: "Mercurio" },
  venus: { title: "Estudios y Certificaciones", subtitle: "Venus" },
  tierra: { title: DATA.profile.name, subtitle: "Tierra · Sobre mí" },
  marte: { title: "Proyectos", subtitle: "Marte" },
  jupiter: { title: "Hobbies", subtitle: "Júpiter" },
  saturno: { title: "Sueños", subtitle: "Saturno" },
  "agujero-negro": { title: "Debilidades", subtitle: "Agujero Negro · Áreas de mejora" },
  voyager: { title: "Hacia dónde voy", subtitle: "Voyager 1 · Próximas tecnologías" },
  juno: { title: "Metas cercanas", subtitle: "Juno · Objetivos a corto plazo" },
};

/* ============================================================
   ESCENA BASE
   ============================================================ */
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
const DEFAULT_CAM_POS = new THREE.Vector3(0, 70, 210);
camera.position.copy(DEFAULT_CAM_POS);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 25;
controls.maxDistance = 420;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xffffff, 0.18));
const sunLight = new THREE.PointLight(0xfff3d6, 3.2, 0, 2);
scene.add(sunLight);

/* ============================================================
   TEXTURAS PROCEDURALES (CANVAS)
   ============================================================ */
function makeCanvas(size = 256) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
}

function rockyTexture(base, accent) {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 10 + 2;
    ctx.beginPath();
    ctx.fillStyle = accent;
    ctx.globalAlpha = Math.random() * 0.35 + 0.1;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function bandedTexture(colorA, colorB) {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  const bands = 14;
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
    ctx.fillRect(0, (i * 256) / bands, 256, 256 / bands + 1);
  }
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? colorA : colorB;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 40 + 10, 2);
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function earthTexture() {
  const c = makeCanvas(512);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#1f6fa8";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#2f7d3c";
  for (let i = 0; i < 24; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 300 + 100;
    ctx.beginPath();
    ctx.ellipse(x, y, Math.random() * 55 + 25, Math.random() * 35 + 15, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#eef6ff";
  ctx.fillRect(0, 0, 512, 20);
  ctx.fillRect(0, 492, 512, 20);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function sunTexture() {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 140);
  grad.addColorStop(0, "#fff6d0");
  grad.addColorStop(0.5, "#ffd873");
  grad.addColorStop(1, "#ff9d3d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.fillStyle = "#ffb347";
    ctx.globalAlpha = Math.random() * 0.25;
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 18 + 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(c);
}

function glowTexture() {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(255,220,150,0.9)");
  grad.addColorStop(0.4, "rgba(255,180,90,0.35)");
  grad.addColorStop(1, "rgba(255,150,60,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function ringTexture() {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  for (let x = 0; x < 256; x++) {
    const t = x / 256;
    const alpha = 0.25 + 0.4 * Math.abs(Math.sin(t * 30));
    ctx.fillStyle = `rgba(216,196,138,${alpha})`;
    ctx.fillRect(x, 0, 1, 256);
  }
  return new THREE.CanvasTexture(c);
}

function purpleGlowTexture() {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(210,160,255,0.85)");
  grad.addColorStop(0.4, "rgba(150,90,255,0.35)");
  grad.addColorStop(1, "rgba(90,40,200,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function blackHoleRingTexture() {
  const c = makeCanvas(256);
  const ctx = c.getContext("2d");
  for (let x = 0; x < 256; x++) {
    const t = x / 256;
    const flicker = 0.35 + 0.5 * Math.abs(Math.sin(t * 40));
    const r = 255;
    const g = Math.floor(140 + 80 * t);
    const b = Math.floor(60 + 180 * (1 - t));
    ctx.fillStyle = `rgba(${r},${g},${b},${flicker})`;
    ctx.fillRect(x, 0, 1, 256);
  }
  return new THREE.CanvasTexture(c);
}

function starSpriteTexture() {
  const c = makeCanvas(64);
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.7)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* ============================================================
   ESTRELLAS FUGACES AMBIENTALES (fondo decorativo, 2D)
   ============================================================ */
function initAmbientShootingStars() {
  const fxCanvas = document.getElementById("ambient-fx");
  const ctx = fxCanvas.getContext("2d");
  let comets = [];
  let nextSpawnAt = 0;

  function resize() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnComet() {
    const x = Math.random() * fxCanvas.width * 0.7 + fxCanvas.width * 0.15;
    const y = -20;
    const angle = Math.PI / 3.2 + Math.random() * (Math.PI / 6);
    const speed = 9 + Math.random() * 7;
    comets.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 80 + Math.random() * 70,
      life: 1,
    });
  }

  function tick(ts) {
    ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    if (ts > nextSpawnAt) {
      spawnComet();
      nextSpawnAt = ts + 2200 + Math.random() * 3200;
    }

    comets.forEach((c) => {
      c.x += c.vx;
      c.y += c.vy;
      c.life -= 0.01;

      const mag = Math.hypot(c.vx, c.vy) || 1;
      const tailX = c.x - (c.vx / mag) * c.len;
      const tailY = c.y - (c.vy / mag) * c.len;

      const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${Math.max(c.life, 0)})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    });

    comets = comets.filter((c) => c.life > 0 && c.y < fxCanvas.height + 100 && c.x < fxCanvas.width + 100);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ============================================================
   ESTRELLAS DE FONDO
   ============================================================ */
function buildStarfield() {
  const count = 3500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 500 + Math.random() * 900;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 2.2,
    map: starSpriteTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  });
  scene.add(new THREE.Points(geo, mat));
}
buildStarfield();

/* ============================================================
   SOL
   ============================================================ */
const sunGeo = new THREE.SphereGeometry(9, 48, 48);
const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture() });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.userData.planetKey = "sol";
scene.add(sunMesh);

const glowSprite = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
);
glowSprite.scale.set(46, 46, 1);
sunMesh.add(glowSprite);

/* ============================================================
   PLANETAS
   ============================================================ */
const planetMeshes = []; // { key, mesh, pivot, config }

function buildOrbitRing(radius) {
  const points = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x6fb7ff, transparent: true, opacity: 0.15 });
  return new THREE.LineLoop(geo, mat);
}

PLANET_CONFIG.forEach((cfg) => {
  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random() * Math.PI * 2;
  scene.add(pivot);
  scene.add(buildOrbitRing(cfg.orbitRadius));

  let texture;
  if (cfg.type === "earth") texture = earthTexture();
  else if (cfg.type === "bands") texture = bandedTexture(cfg.colorA, cfg.colorB);
  else texture = rockyTexture(cfg.colorBase, cfg.colorAccent);

  const geo = new THREE.SphereGeometry(cfg.radius, 48, 48);
  const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9, metalness: 0.05 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(cfg.orbitRadius, 0, 0);
  mesh.userData.planetKey = cfg.key;
  pivot.add(mesh);

  if (cfg.ring) {
    const ringGeo = new THREE.RingGeometry(cfg.radius * 1.5, cfg.radius * 2.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTexture(),
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.2;
    mesh.add(ringMesh);
  }

  planetMeshes.push({ key: cfg.key, mesh, pivot, config: cfg });
});

const jupiterEntry = planetMeshes.find((p) => p.key === "jupiter");

/* ============================================================
   AGUJERO NEGRO — Debilidades
   ============================================================ */
const blackHoleGroup = new THREE.Object3D();
blackHoleGroup.position.set(-150, 25, -110);
scene.add(blackHoleGroup);

const blackHoleCore = new THREE.Mesh(
  new THREE.SphereGeometry(4.2, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
blackHoleCore.userData.planetKey = "agujero-negro";
blackHoleGroup.add(blackHoleCore);

const blackHoleDisk = new THREE.Mesh(
  new THREE.RingGeometry(5.2, 11, 64),
  new THREE.MeshBasicMaterial({
    map: blackHoleRingTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
);
blackHoleDisk.rotation.x = Math.PI / 2.3;
blackHoleDisk.userData.planetKey = "agujero-negro";
blackHoleGroup.add(blackHoleDisk);

const blackHoleGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: purpleGlowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
);
blackHoleGlow.scale.set(30, 30, 1);
blackHoleGroup.add(blackHoleGlow);

/* ============================================================
   VOYAGER 1 — Hacia dónde voy (cruza el sistema en línea recta)
   ============================================================ */
function buildProbe(color) {
  const group = new THREE.Object3D();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.5, 1.6, 12),
    new THREE.MeshStandardMaterial({ color: 0xcfd4da, metalness: 0.6, roughness: 0.4 })
  );
  body.rotation.z = Math.PI / 2;
  group.add(body);

  const dish = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 20),
    new THREE.MeshStandardMaterial({ color: 0xe8e8e8, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.5 })
  );
  dish.position.x = 1.1;
  dish.rotation.y = Math.PI / 2;
  group.add(dish);

  const panelGeo = new THREE.BoxGeometry(1.8, 0.05, 0.6);
  const panelMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, metalness: 0.2, roughness: 0.6 });
  const panelL = new THREE.Mesh(panelGeo, panelMat);
  panelL.position.set(-0.4, 0, 1.1);
  group.add(panelL);
  const panelR = new THREE.Mesh(panelGeo, panelMat);
  panelR.position.set(-0.4, 0, -1.1);
  group.add(panelR);

  return group;
}

const voyager = buildProbe(0x6fb7ff);
voyager.userData.planetKey = "voyager";
voyager.traverse((child) => (child.userData.planetKey = "voyager"));
scene.add(voyager);

const VOYAGER_START = new THREE.Vector3(-260, 90, -220);
const VOYAGER_END = new THREE.Vector3(260, -60, 200);
const VOYAGER_PERIOD = 70;

/* ============================================================
   JUNO — Metas cercanas (orbita a Júpiter)
   ============================================================ */
const junoPivot = new THREE.Object3D();
junoPivot.rotation.y = Math.random() * Math.PI * 2;
if (jupiterEntry) {
  // Se cuelga del pivote orbital de Júpiter (no de su malla) para no
  // heredar la rotación sobre su propio eje del planeta.
  junoPivot.position.copy(jupiterEntry.mesh.position);
  jupiterEntry.pivot.add(junoPivot);
}

const juno = buildProbe(0xffb347);
juno.scale.set(0.6, 0.6, 0.6);
juno.position.set(jupiterEntry ? jupiterEntry.config.radius + 3.2 : 10, 0, 0);
juno.userData.planetKey = "juno";
juno.traverse((child) => (child.userData.planetKey = "juno"));
junoPivot.add(juno);

/* ============================================================
   REGISTRO DE CUERPOS "EXTRA" (no planetas del CONFIG)
   ============================================================ */
const EXTRA_BODIES = {
  sol: { obj: sunMesh, radius: 9 },
  "agujero-negro": { obj: blackHoleGroup, radius: 7 },
  voyager: { obj: voyager, radius: 3 },
  juno: { obj: juno, radius: 2.5 },
};

/* ============================================================
   ETIQUETAS HTML FLOTANTES
   ============================================================ */
const labelsContainer = document.getElementById("planet-labels");
const labelEls = {};

function createLabel(key, name, section) {
  const el = document.createElement("div");
  el.className = "planet-label";
  el.innerHTML = `${name}<span class="label-section">${section}</span>`;
  el.addEventListener("click", () => focusPlanet(key));
  labelsContainer.appendChild(el);
  labelEls[key] = el;
}
createLabel("sol", "Sol", "Contacto");
PLANET_CONFIG.forEach((cfg) => createLabel(cfg.key, cfg.name, cfg.section));
createLabel("agujero-negro", "Agujero Negro", "Debilidades");
createLabel("voyager", "Voyager 1", "Hacia dónde voy");
createLabel("juno", "Juno", "Metas cercanas");

function updateLabels() {
  const targets = [
    { key: "sol", obj: sunMesh },
    ...planetMeshes.map((p) => ({ key: p.key, obj: p.mesh })),
    { key: "agujero-negro", obj: blackHoleGroup },
    { key: "voyager", obj: voyager },
    { key: "juno", obj: juno },
  ];
  const worldPos = new THREE.Vector3();

  targets.forEach(({ key, obj }) => {
    obj.getWorldPosition(worldPos);
    const projected = worldPos.clone().project(camera);
    const behind = projected.z > 1;
    const el = labelEls[key];
    if (behind) {
      el.classList.add("hidden-label");
      return;
    }
    el.classList.remove("hidden-label");
    const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });
}

/* ============================================================
   INTERACCIÓN: RAYCASTING
   ============================================================ */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let isDragging = false;
let downPos = { x: 0, y: 0 };

renderer.domElement.addEventListener("pointerdown", (e) => {
  isDragging = false;
  downPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener("pointermove", (e) => {
  if (Math.abs(e.clientX - downPos.x) > 4 || Math.abs(e.clientY - downPos.y) > 4) {
    isDragging = true;
  }
});

renderer.domElement.addEventListener("pointerup", (e) => {
  if (isDragging) return;
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = [
    sunMesh,
    ...planetMeshes.map((p) => p.mesh),
    blackHoleCore,
    blackHoleDisk,
    voyager,
    juno,
  ];
  const hits = raycaster.intersectObjects(meshes, true);
  if (hits.length > 0) {
    const key = hits[0].object.userData.planetKey;
    focusPlanet(key);
  }
});

/* ============================================================
   ENFOQUE DE PLANETA Y PANEL
   ============================================================ */
let simulationPaused = false;
let activeKey = null;
let camTweenTarget = null;
let controlsTweenTarget = null;

const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");
const panelClose = document.getElementById("panel-close");
const dockButtons = document.querySelectorAll(".dock-btn");

function focusPlanet(key) {
  activeKey = key;
  simulationPaused = true;
  controls.autoRotate = false;

  const extra = EXTRA_BODIES[key];
  const planetEntry = planetMeshes.find((p) => p.key === key);
  const obj = extra ? extra.obj : planetEntry.mesh;
  const worldPos = new THREE.Vector3();
  obj.getWorldPosition(worldPos);

  const baseRadius = extra ? extra.radius : planetEntry.config.radius;
  const distance = Math.max(baseRadius * 8, 16);

  const dir = camera.position.clone().sub(controls.target).normalize();
  camTweenTarget = worldPos.clone().add(dir.multiplyScalar(distance));
  controlsTweenTarget = worldPos.clone();

  dockButtons.forEach((b) => b.classList.toggle("active", b.dataset.planet === key));
  stopDreamStars();
  openPanel(key);
  if (key === "saturno") startDreamStars();
}

function resetView() {
  activeKey = null;
  simulationPaused = false;
  controls.autoRotate = true;
  camTweenTarget = DEFAULT_CAM_POS.clone();
  controlsTweenTarget = new THREE.Vector3(0, 0, 0);
  dockButtons.forEach((b) => b.classList.remove("active"));
  stopDreamStars();
  closePanel();
}

function openPanel(key) {
  panelContent.innerHTML = buildPanelHTML(key);
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  if (key === "sol") {
    renderSocialLinks(panelContent.querySelector("#social-container"));
    initContactForm();
  }
}

function closePanel() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
}

panelClose.addEventListener("click", resetView);

dockButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    focusPlanet(btn.dataset.planet);
    document.getElementById("dock").classList.remove("open");
  });
});

document.getElementById("menu-toggle").addEventListener("click", (e) => {
  const dock = document.getElementById("dock");
  const isOpen = dock.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

/* ============================================================
   CONTENIDO DE PANELES
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function panelHeader(key) {
  const { title, subtitle } = PANEL_TITLES[key];
  return `<span class="panel-subtitle">${escapeHtml(subtitle)}</span><h2>${escapeHtml(title)}</h2>`;
}

function buildPanelHTML(key) {
  if (key === "tierra") return buildTierraHTML();
  if (key === "mercurio") return buildMercurioHTML();
  if (key === "venus") return buildVenusHTML();
  if (key === "marte") return buildMarteHTML();
  if (key === "jupiter") return buildCardListHTML(key, DATA.hobbies);
  if (key === "saturno") return buildSaturnoHTML();
  if (key === "sol") return buildSolHTML();
  if (key === "agujero-negro") return buildWeaknessesHTML();
  if (key === "voyager") return buildCardListHTML(key, DATA.learningGoals);
  if (key === "juno") return buildCardListHTML(key, DATA.nearTermGoals);
  return "";
}

function buildTierraHTML() {
  const p = DATA.profile;
  return `
    ${panelHeader("tierra")}
    <div class="profile-photo-wrap">
      <img class="profile-photo" src="${escapeHtml(p.photo)}" alt="Foto de ${escapeHtml(p.name)}">
    </div>
    <span class="highlight-badge">${escapeHtml(p.highlight)}</span>
    ${p.bio.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    <div class="panel-video">
      <iframe src="${escapeHtml(p.video)}" title="Video de presentación" allowfullscreen loading="lazy"></iframe>
    </div>
  `;
}

function buildMercurioHTML() {
  return `
    ${panelHeader("mercurio")}
    ${DATA.experience
      .map(
        (job) => `
      <div class="timeline-item">
        <span class="date">${escapeHtml(job.date)}</span>
        <h3>${escapeHtml(job.role)}</h3>
        <h4>${escapeHtml(job.place)}</h4>
        <p>${escapeHtml(job.description)}</p>
      </div>`
      )
      .join("")}
  `;
}

function buildVenusHTML() {
  return `
    ${panelHeader("venus")}
    <div class="section-divider">Formación académica</div>
    ${DATA.studies
      .map(
        (s) => `
      <div class="info-card">
        <span class="meta">${escapeHtml(s.date)}</span>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.place)}</p>
      </div>`
      )
      .join("")}
    <div class="section-divider">Certificaciones</div>
    ${DATA.certifications
      .map(
        (c) => `
      <div class="info-card">
        <span class="meta">${escapeHtml(c.date)}</span>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.place)}</p>
      </div>`
      )
      .join("")}
  `;
}

function buildMarteHTML() {
  return `
    ${panelHeader("marte")}
    ${DATA.projects
      .map(
        (proj) => `
      <div class="project-card">
        <h3>${escapeHtml(proj.title)}</h3>
        <p>${escapeHtml(proj.description)}</p>
        <div class="tech-tags">${proj.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
        <div class="project-links">
          ${proj.repo ? `<a href="${escapeHtml(proj.repo)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Código</a>` : ""}
          ${proj.demo ? `<a href="${escapeHtml(proj.demo)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ""}
        </div>
      </div>`
      )
      .join("")}
  `;
}

function buildCardListHTML(key, items) {
  return `
    ${panelHeader(key)}
    ${items
      .map(
        (item) => `
      <div class="info-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </div>`
      )
      .join("")}
  `;
}

function buildWeaknessesHTML() {
  const groups = [];
  DATA.weaknesses.forEach((w) => {
    if (!groups.includes(w.group)) groups.push(w.group);
  });
  return `
    ${panelHeader("agujero-negro")}
    <p>Nadie es perfecto — ni siquiera un sistema solar entero. Aquí caen, sin escapatoria, las cosas en las que todavía estoy trabajando.</p>
    ${groups
      .map(
        (group) => `
      <div class="weakness-group-title">${escapeHtml(group)}</div>
      ${DATA.weaknesses
        .filter((w) => w.group === group)
        .map(
          (w) => `
        <div class="info-card weakness">
          <h3>${escapeHtml(w.title)}</h3>
          <p>${escapeHtml(w.description)}</p>
        </div>`
        )
        .join("")}`
      )
      .join("")}
  `;
}

/* ============================================================
   SATURNO — Estrellas fugaces atrapables (Sueños)
   ============================================================ */
const DREAM_STORAGE_KEY = "marlon-portfolio-sueños-atrapados";

function getCaughtDreams() {
  try {
    return JSON.parse(localStorage.getItem(DREAM_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCaughtDream(index) {
  const caught = getCaughtDreams();
  if (!caught.includes(index)) {
    caught.push(index);
    localStorage.setItem(DREAM_STORAGE_KEY, JSON.stringify(caught));
  }
}

function buildSaturnoHTML() {
  const caught = getCaughtDreams();
  const total = DATA.dreams.length;
  return `
    ${panelHeader("saturno")}
    <p class="dream-instructions">✨ Haz clic en las estrellas fugaces que cruzan la pantalla para descubrir cada sueño.</p>
    <span class="dream-progress" id="dream-progress-text">${caught.length} / ${total} descubiertos</span>
    <div id="dream-slots">
      ${DATA.dreams
        .map((dream, i) =>
          caught.includes(i)
            ? `<div class="dream-slot revealed" data-index="${i}"><h3>${escapeHtml(dream.title)}</h3><p>${escapeHtml(dream.description)}</p></div>`
            : `<div class="dream-slot" data-index="${i}"><span class="placeholder">✦ Aún sin descubrir…</span></div>`
        )
        .join("")}
    </div>
    ${caught.length > 0 ? `<button id="dream-reset-btn" class="dream-reset" type="button">Reiniciar sueños descubiertos</button>` : ""}
  `;
}

let dreamSpawnTimer = null;
const activeDreamStarEls = [];

function stopDreamStars() {
  if (dreamSpawnTimer) {
    clearTimeout(dreamSpawnTimer);
    dreamSpawnTimer = null;
  }
  activeDreamStarEls.splice(0).forEach((el) => el.remove());
}

function resetDreamsGame() {
  stopDreamStars();
  localStorage.removeItem(DREAM_STORAGE_KEY);
  panelContent.innerHTML = buildSaturnoHTML();
  startDreamStars();
}

function startDreamStars() {
  const resetBtn = document.getElementById("dream-reset-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetDreamsGame);

  const scheduleNext = (delay) => {
    dreamSpawnTimer = setTimeout(() => {
      const caught = getCaughtDreams();
      if (caught.length >= DATA.dreams.length) return;
      const remaining = DATA.dreams.map((_, i) => i).filter((i) => !caught.includes(i));
      const index = remaining[Math.floor(Math.random() * remaining.length)];
      spawnDreamStar(index);
      scheduleNext(2600 + Math.random() * 1800);
    }, delay);
  };

  // La primera estrella sale casi de inmediato; las siguientes respetan el ritmo normal.
  if (getCaughtDreams().length < DATA.dreams.length) scheduleNext(400 + Math.random() * 400);
}

function spawnDreamStar(index) {
  const container = document.getElementById("dream-stars");
  const el = document.createElement("div");
  el.className = "dream-star";
  el.textContent = "✦";

  const margin = 80;
  const startX = Math.random() * (window.innerWidth - margin * 2) + margin;
  const startY = -40;
  const endX = startX + (Math.random() * 300 - 150);
  const endY = window.innerHeight * (0.5 + Math.random() * 0.4);
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  el.style.transform = `rotate(${angle}deg)`;
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;

  container.appendChild(el);
  activeDreamStarEls.push(el);

  const duration = 3200;
  const start = performance.now();
  let caught = false;
  let rafId;

  const remove = () => {
    cancelAnimationFrame(rafId);
    const i = activeDreamStarEls.indexOf(el);
    if (i > -1) activeDreamStarEls.splice(i, 1);
    el.remove();
  };

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.opacity = t < 0.05 ? t / 0.05 : t > 0.85 ? Math.max(1 - (t - 0.85) / 0.15, 0) : 1;

    if (t >= 1 || caught) return;
    rafId = requestAnimationFrame(step);
  }
  rafId = requestAnimationFrame(step);

  setTimeout(() => {
    if (!caught) remove();
  }, duration + 50);

  el.addEventListener("click", () => {
    if (caught) return;
    caught = true;
    el.classList.add("caught");
    saveCaughtDream(index);
    revealDreamSlot(index);
    setTimeout(remove, 400);
  });
}

function revealDreamSlot(index) {
  const slot = document.querySelector(`.dream-slot[data-index="${index}"]`);
  const dream = DATA.dreams[index];
  if (slot) {
    slot.classList.add("revealed");
    slot.innerHTML = `<h3>${escapeHtml(dream.title)}</h3><p>${escapeHtml(dream.description)}</p>`;
  }
  const progressEl = document.getElementById("dream-progress-text");
  const caught = getCaughtDreams();
  if (progressEl) progressEl.textContent = `${caught.length} / ${DATA.dreams.length} descubiertos`;
  if (caught.length >= DATA.dreams.length) {
    stopDreamStars();
    const slotsWrap = document.getElementById("dream-slots");
    if (slotsWrap && !document.getElementById("dream-reset-btn")) {
      slotsWrap.insertAdjacentHTML(
        "afterend",
        `<button id="dream-reset-btn" class="dream-reset" type="button">Reiniciar sueños descubiertos</button>`
      );
      document.getElementById("dream-reset-btn").addEventListener("click", resetDreamsGame);
    }
  }
}

function buildSolHTML() {
  const c = DATA.contact;
  return `
    ${panelHeader("sol")}
    <p class="contact-meta"><i class="fa-solid fa-envelope"></i>&nbsp; ${escapeHtml(c.email)}</p>
    <p class="contact-meta"><i class="fa-solid fa-phone"></i>&nbsp; ${escapeHtml(c.phone)}</p>
    <p class="contact-meta"><i class="fa-solid fa-location-dot"></i>&nbsp; ${escapeHtml(c.location)}</p>

    <form id="contact-form" class="contact-form" method="POST">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="text" id="name" name="name" required placeholder="Tu nombre">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="tu@email.com">
      </div>
      <div class="form-group">
        <label for="message">Mensaje</label>
        <textarea id="message" name="message" rows="5" required placeholder="Escribe tu mensaje..."></textarea>
      </div>
      <input type="hidden" name="_subject" value="Nuevo mensaje desde el portafolio">
      <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
      <button type="submit" class="submit-btn">Enviar mensaje</button>
      <p id="form-status" class="form-status" role="status"></p>
    </form>

    <div id="social-container" class="social-container"></div>
  `;
}

function renderSocialLinks(container) {
  if (!container) return;
  const icons = { github: "fa-brands fa-github", linkedin: "fa-brands fa-linkedin", twitter: "fa-brands fa-twitter" };
  container.innerHTML = Object.entries(DATA.social)
    .filter(([, url]) => url)
    .map(([key, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${key}"><i class="${icons[key]}"></i></a>`)
    .join("");
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form._honey.value) return;

    const submitBtn = form.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    status.textContent = "";
    status.className = "form-status";

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(DATA.contact.email)}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Error en el envío");
      status.textContent = "¡Mensaje enviado con éxito! Te responderé pronto.";
      status.classList.add("success");
      form.reset();
    } catch (err) {
      status.textContent = "No se pudo enviar el mensaje. Intenta de nuevo o escríbeme directo a " + DATA.contact.email;
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar mensaje";
    }
  });
}

/* Pie de página: siempre visible */
renderSocialLinks(document.getElementById("footer-social"));

/* ============================================================
   BUCLE DE ANIMACIÓN
   ============================================================ */
const clock = new THREE.Clock();
let elapsed = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  elapsed += dt;

  if (!simulationPaused) {
    planetMeshes.forEach(({ mesh, pivot, config }) => {
      pivot.rotation.y += dt * config.speed * 0.25;
      mesh.rotation.y += dt * config.rotSpeed;
    });
    junoPivot.rotation.y += dt * 1.4;

    blackHoleDisk.rotation.z += dt * 0.4;
    blackHoleGroup.rotation.y += dt * 0.05;

    const t = (elapsed % VOYAGER_PERIOD) / VOYAGER_PERIOD;
    voyager.position.lerpVectors(VOYAGER_START, VOYAGER_END, t);
    voyager.lookAt(VOYAGER_END);
    const edgeFade = Math.min(t / 0.05, (1 - t) / 0.05, 1);
    voyager.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = Math.max(edgeFade, 0);
      }
    });
  }
  sunMesh.rotation.y += dt * 0.05;

  if (camTweenTarget) {
    camera.position.lerp(camTweenTarget, 0.06);
    if (camera.position.distanceTo(camTweenTarget) < 0.05) camTweenTarget = null;
  }
  if (controlsTweenTarget) {
    controls.target.lerp(controlsTweenTarget, 0.06);
    if (controls.target.distanceTo(controlsTweenTarget) < 0.05) controlsTweenTarget = null;
  }

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}

/* ============================================================
   RESIZE
   ============================================================ */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ============================================================
   INICIO
   ============================================================ */
animate();
initAmbientShootingStars();
window.requestAnimationFrame(() => {
  document.getElementById("loader").classList.add("hidden");
});
