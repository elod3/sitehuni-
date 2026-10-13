/* Turul 3D: modelul IFC al arhitectului, parcurs la persoana întâi.
   WASD + mouse pe desktop, două degete-joystick pe telefon. Ușile se deschid când te apropii,
   în sensul în care mergi; scara te urcă la mansardă; planul din colț arată unde ești. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { MeshBVH } from '../vendor/three/three-mesh-bvh.module.js';

const BASE = 'assets/3d/';
const EYE = 1.62, RADIUS = 0.26, STEP = 0.38, HEIGHT = 1.78;
const WALK = 1.45, RUN = 3.2, GRAVITY = 18;

const stage = document.getElementById('tur-stage');
const ui = {
  intro: document.getElementById('tur-intro'),
  start: document.getElementById('tur-start'),
  load: document.getElementById('tur-load'),
  loadNum: document.getElementById('tur-load-num'),
  loadBar: document.getElementById('tur-load-bar'),
  hud: document.getElementById('tur-hud'),
  level: document.getElementById('tur-level'),
  map: document.getElementById('tur-map'),
  mapImg: document.getElementById('tur-map-img'),
  dot: document.getElementById('tur-dot'),
  hint: document.getElementById('tur-hint'),
  pad: document.getElementById('tur-pad'),
  knob: document.getElementById('tur-knob'),
  err: document.getElementById('tur-err'),
};
const touch = matchMedia('(pointer: coarse)').matches;
document.documentElement.classList.toggle('is-touch', touch);

/* ---------- randare ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
if (!renderer.capabilities.isWebGL2) { ui.err.hidden = false; throw new Error('WebGL2'); }
let pixelRatio = Math.min(devicePixelRatio, touch ? 1.5 : 1.75);
renderer.setPixelRatio(pixelRatio);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, 1, 0.08, 900);
camera.rotation.order = 'YXZ';
scene.fog = new THREE.Fog(0xcfd5d8, 140, 560);

const hemi = new THREE.HemisphereLight(0xe8eef5, 0xc9b79c, 0.35);
scene.add(hemi);
// Soarele de după-amiază vine din sud-vest și intră pe ferestrele lungi ale fațadei.
const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
const SUN_DIR = new THREE.Vector3(-0.55, 0.62, 0.56).normalize();
sun.castShadow = true;
sun.shadow.mapSize.set(touch ? 2048 : 4096, touch ? 2048 : 4096);
Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 1, far: 160 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.035;
scene.add(sun, sun.target);

const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera));
const gtao = new GTAOPass(scene, camera, 1, 1);
gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1, samples: 12 });
gtao.blendIntensity = 0.85;
composer.addPass(gtao);
composer.addPass(new OutputPass());

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  composer.setPixelRatio(pixelRatio);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);

/* ---------- materiale ---------- */
// Texturile PBR ambientCG (CC0) se proiectează triplanar în coordonatele lumii, așa că modelul IFC nu
// are nevoie de UV-uri: plăcile de parchet au aceeași mărime în toate camerele.
const texLoader = new THREE.TextureLoader();
const texCache = {};
function texSet(name) {
  if (texCache[name]) return texCache[name];
  const t = {};
  for (const k of ['Color', 'NormalGL', 'Roughness']) {
    const tx = texLoader.load(`${BASE}tex/${name}-${k}.jpg`);
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    tx.anisotropy = 8;
    if (k === 'Color') tx.colorSpace = THREE.SRGBColorSpace;
    t[k] = tx;
  }
  return (texCache[name] = t);
}

const doorTex = new THREE.DataTexture(new Float32Array(256), 256, 1, THREE.RedFormat, THREE.FloatType);
doorTex.needsUpdate = true;

const DOOR_VERT_HEAD = /* glsl */`
attribute float _doorid;
attribute vec2 _pivot;
uniform sampler2D uDoors;
float doorAngle() { return texelFetch(uDoors, ivec2(int(_doorid + 0.5), 0), 0).r; }
vec3 doorRot(vec3 p, float a) {
  vec4 w = modelMatrix * vec4(p, 1.0);
  vec2 d = w.xz - _pivot;
  float c = cos(a), s = sin(a);
  w.xz = _pivot + vec2(d.x * c + d.y * s, -d.x * s + d.y * c);
  return (inverse(modelMatrix) * w).xyz;
}
vec3 doorRotN(vec3 n, float a) {
  float c = cos(a), s = sin(a);
  return vec3(n.x * c + n.z * s, n.y, -n.x * s + n.z * c);
}
`;

function patch(mat, { tri, door }) {
  mat.onBeforeCompile = (sh) => {
    if (door) {
      sh.uniforms.uDoors = { value: doorTex };
      sh.vertexShader = DOOR_VERT_HEAD + sh.vertexShader
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal = doorRotN(objectNormal, doorAngle());')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed = doorRot(transformed, doorAngle());');
    }
    if (tri) {
      sh.uniforms.tMap = { value: tri.t.Color };
      sh.uniforms.tNrm = { value: tri.t.NormalGL };
      sh.uniforms.tRgh = { value: tri.t.Roughness };
      sh.uniforms.uScale = { value: 1 / tri.scale };
      sh.uniforms.uNrm = { value: tri.normal ?? 1 };
      sh.uniforms.uMix = { value: tri.mix ?? 1 };
      sh.uniforms.uRghMix = { value: tri.rough ?? 1 };
      sh.defines = { ...(sh.defines || {}), ...(tri.vert ? { TRI_VERT: 1 } : {}) };
      sh.vertexShader = 'varying vec3 vWPos;\nvarying vec3 vWNrm;\n' + sh.vertexShader.replace('#include <project_vertex>',
        '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNrm = normalize(mat3(modelMatrix) * objectNormal);');
      sh.fragmentShader = `varying vec3 vWPos;\nvarying vec3 vWNrm;\nuniform sampler2D tMap, tNrm, tRgh;\nuniform float uScale, uNrm, uMix, uRghMix;
vec3 triW() { vec3 w = pow(abs(normalize(vWNrm)), vec3(6.0)); return w / (w.x + w.y + w.z); }
vec4 triS(sampler2D t) { vec3 w = triW(); vec3 p = vWPos * uScale;
#ifdef TRI_VERT
  return texture2D(t, p.yz) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.yx) * w.z; }
#else
  return texture2D(t, p.zy) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.xy) * w.z; }
#endif
` + sh.fragmentShader
        .replace('#include <map_fragment>', 'diffuseColor.rgb *= mix(vec3(0.82), triS(tMap).rgb, uMix);')
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * mix(1.0, triS(tRgh).g, uRghMix);')
        .replace('#include <normal_fragment_maps>', `{
  vec3 n = normalize(vWNrm); vec3 w = triW(); vec3 p = vWPos * uScale;
  vec3 tx = texture2D(tNrm, p.zy).xyz * 2.0 - 1.0;
  vec3 ty = texture2D(tNrm, p.xz).xyz * 2.0 - 1.0;
  vec3 tz = texture2D(tNrm, p.xy).xyz * 2.0 - 1.0;
  tx = vec3(tx.xy * uNrm + n.zy, abs(tx.z) * n.x);
  ty = vec3(ty.xy * uNrm + n.xz, abs(ty.z) * n.y);
  tz = vec3(tz.xy * uNrm + n.xy, abs(tz.z) * n.z);
  vec3 wn = normalize(tx.zyx * w.x + ty.xzy * w.y + tz.xyz * w.z);
  normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
  if (!gl_FrontFacing) normal = -normal;
}`);
    }
  };
  mat.customProgramCacheKey = () => (door ? 'door' : '') + (tri ? 'tri' : '') + (tri?.vert ? 'v' : '');
}

// Numele vin din materialele ArchiCAD ale proiectului. Culorile sunt cele din paleta sitului
// (tencuială, antracit, stejar), ca turul să arate ca randările din broșură.
function makeMaterial(name, src, door, cls = '', level = '') {
  let n = name.toLowerCase();
  // fața de jos a plăcii de acoperiș e tavanul mansardei
  if (level === 'Acoperis' && n.includes('beton - aparent')) n = 'tavan';
  // tâmplăria e antracit, ca pe fațadă; ușile de interior, stejar deschis
  if (n.includes('lemn') && cls === 'IfcWindow') n = 'antracit';
  if (n.includes('lemn') && (door || cls === 'IfcDoor')) n = 'usa stejar';
  const c = src.color.clone();
  let p = { color: c, roughness: 0.8, metalness: 0, side: THREE.FrontSide };
  let tri = null, phys = false;
  const T = (set, scale, extra = {}) => { tri = { t: texSet(set), scale, ...extra }; };
  if (n.includes('tavan')) { T('Plaster001', 2.4, { normal: 0.15, mix: 0.25 }); p.color = new THREE.Color(0xf4f2ee); p.roughness = 1; p.emissive = new THREE.Color(0x1c1b19); }
  else if (n.includes('usa stejar')) { T('WoodFloor051', 1.6, { normal: 0.4, vert: 1 }); p.color = new THREE.Color(0xf1e3cf); p.roughness = 0.6; }
  else if (n.includes('pardoseala')) { T('WoodFloor051', 2.2); p.color = new THREE.Color(0xcdbca3); }
  else if (n.includes('gazon')) { T('Grass004', 4.5, { normal: 0.25, mix: 0.65, rough: 0 }); p.color = new THREE.Color(0xc9c99a); p.roughness = 1; }
  else if (n.includes('asfalt')) { T('Asphalt026C', 4); p.color = new THREE.Color(0x8d8d8d); p.roughness = 1; }
  else if (n.includes('beton')) { T('Concrete034', 3, { mix: 0.45, normal: 0.5 }); p.color = new THREE.Color(0xb4afa6); p.roughness = 1; }
  else if (n.includes('alb titaniu') || n.includes('bca') || n.includes('izolatie')) { T('Plaster001', 2.4, { normal: 0.2, mix: 0.35 }); p.color = new THREE.Color(0xf2eee7); p.roughness = 1; }
  else if (n.includes('tencuiala')) { T('Plaster001', 2.4, { normal: 0.4, mix: 0.5 }); p.color = new THREE.Color(0xbdb8b0); p.roughness = 1; }
  else if (n.includes('lemn') || n.includes('lambriu')) { T('WoodFloor051', 1.8, { normal: 0.5 }); p.color = new THREE.Color(0xd6c3a8); p.roughness = 0.7; }
  else if (n.includes('textil')) { T('Fabric045', 0.7); p.color = new THREE.Color(0xd8d0c4); p.roughness = 1; }
  else if (n.includes('marmura') || n.includes('placaj piatr')) { T('Marble012', 1.2, { normal: 0.3 }); p.color = new THREE.Color(0xf0eeea); p.roughness = 0.5; }
  else if (n.includes('tabla')) { p.color = new THREE.Color(0x2b2925); p.metalness = 0.55; p.roughness = 0.45; }
  else if (n.includes('ceramic')) { p.color = new THREE.Color(0xf3f2ee); p.roughness = 0.14; }
  else if (n.includes('alb lucios')) { p.color = new THREE.Color(0xeeece7); p.roughness = 0.3; }
  else if (n.includes('galben')) { T('Fabric045', 0.7, { normal: 0.8 }); p.color = new THREE.Color(0xc29a3f); p.roughness = 1; }
  else if (n.includes('gri inchis')) { p.color = new THREE.Color(0x3b3934); p.roughness = 0.55; }
  else if (n.includes('antracit')) { p.color = new THREE.Color(0x2b2925); p.roughness = 0.5; }
  else if (n.includes('oglinda')) { p.color = new THREE.Color(0xdddddd); p.metalness = 1; p.roughness = 0.03; }
  else if (n.includes('sticla')) { phys = true; }
  else if (n.includes('metal') || n.includes('fier')) {
    p.metalness = 1; p.roughness = n.includes('crom') ? 0.12 : 0.35;
    p.color = new THREE.Color(n.includes('fier') ? 0x3a3a3a : n.includes('alumin') ? 0x55534f : 0xc9c9c9);
  }
  else if (n.includes('laminat')) { T('Marble012', 1.0, { normal: 0.2, mix: 0.4 }); p.color = new THREE.Color(0xe6dfd3); p.roughness = 0.35; }
  else if (n.includes('granit')) { p.color = new THREE.Color(0x6b2e28); p.roughness = 0.3; }
  else { p.color = c.multiplyScalar(1.8); }

  let mat;
  if (phys) {
    mat = new THREE.MeshPhysicalMaterial({
      color: n.includes('albastra') ? 0xcfe0e8 : 0xffffff, metalness: 0, roughness: n.includes('sablata') ? 0.5 : 0.02,
      transparent: true, opacity: n.includes('sablata') ? 0.7 : 0.14, depthWrite: false, side: THREE.DoubleSide,
      envMapIntensity: 1.4, specularIntensity: 1,
    });
  } else mat = new THREE.MeshStandardMaterial(p);
  if (tri || door) patch(mat, { tri, door });
  mat.name = name;
  return { mat, glass: phys };
}

/* ---------- încărcare ---------- */
const manager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager).setMeshoptDecoder(MeshoptDecoder);

function setProgress(f, text) {
  ui.loadBar.style.transform = `scaleX(${f})`;
  ui.loadNum.textContent = text;
}

const world = new THREE.Group();
scene.add(world);
let collider = null, doors = [], plan = null;

async function load() {
  const [gltf, hdr, meta, planMeta] = await Promise.all([
    new Promise((res, rej) => gltfLoader.load(BASE + 'arcadian.glb', res, (e) => {
      const tot = e.total || 9.3e6;
      setProgress(Math.min(1, e.loaded / tot), `${(e.loaded / 1e6).toFixed(1).replace('.', ',')} / ${(tot / 1e6).toFixed(1).replace('.', ',')} MB`);
    }, rej)),
    new RGBELoader().loadAsync(BASE + 'sky.hdr'),
    fetch(BASE + 'doors.json').then((r) => r.json()),
    fetch(BASE + 'plan.json').then((r) => r.json()),
  ]);
  setProgress(1, 'se pregătește scena');
  await new Promise((r) => setTimeout(r, 30));

  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdr;
  scene.backgroundIntensity = 0.9;
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(hdr).texture;
  scene.environmentIntensity = 0.75;
  pm.dispose();

  doors = meta.doors.map((d) => ({ ...d, a: 0, target: 0, sign: 1 }));
  plan = planMeta;

  const geos = [];
  const mats = {};
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    const isDoor = o.name.startsWith('Door|');
    const cls = o.name.split('|')[1] || '';
    const level = o.name.split('|')[0];
    const key = o.material.name + (isDoor ? '|door' : '') + (cls === 'IfcWindow' || cls === 'IfcDoor' ? '|' + cls : '') + (level === 'Acoperis' ? '|roof' : '');
    mats[key] ??= makeMaterial(o.material.name, o.material, isDoor, cls, level);
    o.material = mats[key].mat;
    const glass = mats[key].glass;
    o.castShadow = !glass;
    o.receiveShadow = !glass;
    if (glass) o.renderOrder = 2;
    if (isDoor) {
      const dm = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
      patch(dm, { door: true });
      o.customDepthMaterial = dm;
      o.frustumCulled = false;
    }
    // coliziunea: tot ce e static, inclusiv geamurile (nu treci prin fereastră)
    if (!isDoor) {
      const pos = o.geometry.attributes.position, idx = o.geometry.index;
      const arr = new Float32Array(pos.count * 3);
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
        arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z;
      }
      geos.push({ arr, idx: idx ? idx.array : null, count: pos.count });
    }
  });
  world.add(gltf.scene);

  // un singur mesh pentru coliziuni, cu BVH
  let vt = 0, it = 0;
  for (const g of geos) { vt += g.count; it += g.idx ? g.idx.length : g.count; }
  const P = new Float32Array(vt * 3), I = new Uint32Array(it);
  let vo = 0, io = 0;
  for (const g of geos) {
    P.set(g.arr, vo * 3);
    if (g.idx) for (let i = 0; i < g.idx.length; i++) I[io++] = g.idx[i] + vo;
    else for (let i = 0; i < g.count; i++) I[io++] = vo + i;
    vo += g.count;
  }
  const cg = new THREE.BufferGeometry();
  cg.setAttribute('position', new THREE.BufferAttribute(P, 3));
  cg.setIndex(new THREE.BufferAttribute(I, 1));
  cg.boundsTree = new MeshBVH(cg, { maxLeafTris: 8 });
  collider = cg;

  // terenul din jur, ca să nu se termine lumea la marginea parcelei
  const ground = new THREE.Mesh(new THREE.CircleGeometry(700, 64).rotateX(-Math.PI / 2),
    makeMaterial('Gazon', { color: new THREE.Color(1, 1, 1) }, false).mat);
  ground.position.y = -0.56;
  ground.receiveShadow = true;
  scene.add(ground);

  resize();
  renderer.compile(scene, camera);
}

/* ---------- jucătorul ---------- */
const feet = new THREE.Vector3();
const vel = new THREE.Vector3();
let yaw = 0, pitch = 0, onGround = false;
const keys = new Set();
let running = false, active = false;

function spawn(i = 0) {
  const s = plan.spawns[i];
  feet.set(s.p[0], s.p[1], s.p[2]);
  if (collider) feet.y = Math.max(groundHeight(feet.x, feet.z, feet.y + 1), feet.y - 1);
  yaw = s.yaw; pitch = -0.04; vel.set(0, 0, 0);
}

const seg = new THREE.Line3(), tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), box = new THREE.Box3();
const ray = new THREE.Ray(), down = new THREE.Vector3(0, -1, 0);

function collide() {
  // capsula începe deasupra treptei, ca scările și pragurile să nu o oprească
  for (let pass = 0; pass < 3; pass++) {
    seg.start.set(feet.x, feet.y + STEP + RADIUS, feet.z);
    seg.end.set(feet.x, feet.y + HEIGHT - RADIUS, feet.z);
    box.makeEmpty(); box.expandByPoint(seg.start); box.expandByPoint(seg.end);
    box.min.addScalar(-RADIUS); box.max.addScalar(RADIUS);
    let pushed = false;
    collider.boundsTree.shapecast({
      intersectsBounds: (b) => b.intersectsBox(box),
      intersectsTriangle: (tri) => {
        const d = tri.closestPointToSegment(seg, tmpV, tmpV2);
        if (d < RADIUS) {
          const depth = RADIUS - d;
          const dir = tmpV2.sub(tmpV).normalize();
          dir.y = Math.max(-0.0, dir.y) * 0; // doar împingere orizontală
          if (dir.lengthSq() < 1e-6) return;
          dir.normalize();
          feet.addScaledVector(dir, depth + 1e-4);
          seg.start.addScaledVector(dir, depth + 1e-4); seg.end.addScaledVector(dir, depth + 1e-4);
          pushed = true;
        }
      },
    });
    if (!pushed) break;
  }
}

function groundHeight(x, z, fromY) {
  ray.origin.set(x, fromY, z); ray.direction.copy(down);
  const hit = collider.boundsTree.raycastFirst(ray, THREE.DoubleSide);
  return hit ? hit.point.y : -Infinity;
}

function ceilingFree(y) {
  ray.origin.set(feet.x, y, feet.z); ray.direction.set(0, 1, 0);
  const hit = collider.boundsTree.raycastFirst(ray, THREE.DoubleSide);
  return !hit || hit.distance > HEIGHT - STEP;
}

const fwd = new THREE.Vector3(), right = new THREE.Vector3(), move = new THREE.Vector3();
const stick = { x: 0, y: 0 };

function update(dt) {
  fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  right.set(Math.cos(yaw), 0, -Math.sin(yaw));
  move.set(0, 0, 0);
  if (keys.has('KeyW') || keys.has('ArrowUp')) move.add(fwd);
  if (keys.has('KeyS') || keys.has('ArrowDown')) move.sub(fwd);
  if (keys.has('KeyD') || keys.has('ArrowRight')) move.add(right);
  if (keys.has('KeyA') || keys.has('ArrowLeft')) move.sub(right);
  if (stick.x || stick.y) move.addScaledVector(fwd, -stick.y).addScaledVector(right, stick.x);
  const len = move.length();
  if (len > 1) move.multiplyScalar(1 / len);
  const speed = (running || keys.has('ShiftLeft') || keys.has('ShiftRight')) ? RUN : WALK;
  // accelerație scurtă: pasul pornește și se oprește moale, nu ca un cursor
  const k = 1 - Math.exp(-dt * 10);
  vel.x += (move.x * speed - vel.x) * k;
  vel.z += (move.z * speed - vel.z) * k;

  const steps = Math.ceil(Math.hypot(vel.x, vel.z) * dt / 0.1) || 1;
  for (let s = 0; s < steps; s++) {
    feet.x += vel.x * dt / steps;
    feet.z += vel.z * dt / steps;
    collide();
  }

  // gravitație și urcatul treptelor
  const gy = groundHeight(feet.x, feet.z, feet.y + STEP + 0.05);
  if (gy > feet.y - 0.02 && gy - feet.y <= STEP + 0.05) {
    feet.y += (gy - feet.y) * Math.min(1, dt * 18);
    if (Math.abs(gy - feet.y) < 0.01) feet.y = gy;
    vel.y = 0; onGround = true;
  } else {
    vel.y -= GRAVITY * dt;
    feet.y += vel.y * dt;
    if (feet.y < gy) { feet.y = gy; vel.y = 0; onGround = true; } else onGround = false;
  }
  if (feet.y < -20) spawn(0);

  // mersul se simte în cameră: o legănare mică, doar când chiar mergi
  const sp = Math.hypot(vel.x, vel.z);
  bob += dt * sp * 5.2;
  const bobAmt = Math.min(sp / WALK, 1.4) * 0.022 * (onGround ? 1 : 0);
  camera.position.set(feet.x, feet.y + EYE + Math.sin(bob) * bobAmt, feet.z);
  camera.rotation.set(pitch, yaw, Math.sin(bob * 0.5) * bobAmt * 0.12);

  updateDoors(dt);
  updateSun();
  adapt(dt);
  updateMap();
}
let bob = 0;

// Ochiul se obișnuiește: în casă expunerea crește încet, afară scade la loc.
let inside = 0, adaptT = 0;
function adapt(dt) {
  adaptT -= dt;
  if (adaptT <= 0) {
    adaptT = 0.25;
    ray.origin.set(feet.x, feet.y + 1.2, feet.z); ray.direction.set(0, 1, 0);
    const hit = collider.boundsTree.raycastFirst(ray, THREE.DoubleSide);
    inside = hit && hit.distance < 6 ? 1 : 0;
  }
  const k = 1 - Math.exp(-dt * 1.6);
  renderer.toneMappingExposure += ((inside ? 1.45 : 1.05) - renderer.toneMappingExposure) * k;
  scene.environmentIntensity += ((inside ? 1.15 : 0.75) - scene.environmentIntensity) * k;
  hemi.intensity += ((inside ? 0.7 : 0.35) - hemi.intensity) * k;
}

/* ---------- uși ---------- */
const OPEN = THREE.MathUtils.degToRad(88);
function updateDoors(dt) {
  let dirty = false;
  const arr = doorTex.image.data;
  for (let i = 0; i < doors.length; i++) {
    const d = doors[i];
    const cx = d.p[0] + d.h[0] * d.w * 0.5, cz = d.p[2] + d.h[1] * d.w * 0.5;
    const dx = feet.x - cx, dz = feet.z - cz;
    const dist = Math.hypot(dx, dz);
    const same = Math.abs(feet.y - d.p[1]) < 1.6;
    if (same && dist < 2.0 && d.target === 0) {
      // se deschide în sensul în care mergi: departe de tine
      const side = Math.sign(dx * d.n[0] + dz * d.n[1]) || 1;
      const hx = d.h[1], hz = -d.h[0];               // h rotit cu +90°
      const dot = hx * d.n[0] + hz * d.n[1];
      d.sign = Math.sign(dot) === -side ? 1 : -1;
      d.target = 1;
    } else if (d.target === 1 && (!same || dist > 2.9)) d.target = 0;
    const goal = d.target * OPEN * d.sign;
    if (Math.abs(d.a - goal) > 1e-3) {
      d.a += (goal - d.a) * (1 - Math.exp(-dt * (d.target ? 7 : 3.5)));
      arr[i] = d.a; dirty = true;
    }
  }
  if (dirty) doorTex.needsUpdate = true;
}

/* ---------- soarele urmărește jucătorul ---------- */
function updateSun() {
  const cx = Math.round(feet.x / 4) * 4, cz = Math.round(feet.z / 4) * 4;
  sun.target.position.set(cx, 0, cz);
  sun.position.set(cx, 0, cz).addScaledVector(SUN_DIR, 80);
}

/* ---------- planul ---------- */
let curLevel = -1;
function updateMap() {
  const lv = feet.y > plan.levels[1].y - 0.8 ? 1 : 0;
  if (lv !== curLevel) {
    curLevel = lv;
    ui.mapImg.src = BASE + plan.levels[lv].img;
    ui.level.textContent = plan.levels[lv].name;
  }
  const b = plan.bounds; // x0, x1, z0, z1
  const u = (b[1] - feet.x) / (b[1] - b[0]), v = (feet.z - b[2]) / (b[3] - b[2]);
  // planul e întors pe lung: axa z a clădirii e orizontala hărții, x crește în sus
  ui.dot.style.left = `${Math.min(1, Math.max(0, v)) * 100}%`;
  ui.dot.style.top = `${Math.min(1, Math.max(0, u)) * 100}%`;
  ui.dot.style.transform = `translate(-50%,-50%) rotate(${(-yaw * 180) / Math.PI - 90}deg)`;
}

ui.map.addEventListener('click', (e) => {
  if (!collider || document.pointerLockElement) return;
  const r = ui.mapImg.getBoundingClientRect();
  const v = (e.clientX - r.left) / r.width, u = (e.clientY - r.top) / r.height;
  if (u < 0 || u > 1 || v < 0 || v > 1) return;
  const b = plan.bounds;
  const x = b[1] - u * (b[1] - b[0]), z = b[2] + v * (b[3] - b[2]);
  const y = plan.levels[curLevel].y;
  const gy = groundHeight(x, z, y + 2.2);
  if (gy > y - 0.6 && gy < y + 0.6) { feet.set(x, gy, z); vel.set(0, 0, 0); }
});

/* ---------- control ---------- */
const canvas = renderer.domElement;
addEventListener('keydown', (e) => {
  if (!active) return;
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  keys.add(e.code);
  if (e.code === 'KeyM') stage.classList.toggle('map-big');
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => keys.clear());

function look(dx, dy, s) {
  yaw -= dx * s; pitch -= dy * s;
  pitch = Math.max(-1.35, Math.min(1.35, pitch));
}

if (!touch) {
  canvas.addEventListener('click', () => { if (active) canvas.requestPointerLock(); });
  document.addEventListener('mousemove', (e) => { if (document.pointerLockElement === canvas) look(e.movementX, e.movementY, 0.0022); });
  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    stage.classList.toggle('is-locked', locked);
    document.documentElement.classList.toggle('tur-playing', locked);
    if (!locked) keys.clear();
  });
} else {
  // stânga: joystick; restul ecranului: privești
  let padId = null, lookId = null, lx = 0, ly = 0, ox = 0, oy = 0;
  canvas.addEventListener('touchstart', (e) => {
    for (const t of e.changedTouches) {
      if (t.clientX < innerWidth * 0.42 && padId === null) {
        padId = t.identifier; ox = t.clientX; oy = t.clientY;
        ui.pad.style.left = `${ox}px`; ui.pad.style.top = `${oy}px`; ui.pad.hidden = false;
      } else if (lookId === null) { lookId = t.identifier; lx = t.clientX; ly = t.clientY; }
    }
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === padId) {
        let dx = t.clientX - ox, dy = t.clientY - oy;
        const m = Math.hypot(dx, dy), R = 52;
        if (m > R) { dx *= R / m; dy *= R / m; }
        stick.x = dx / R; stick.y = dy / R;
        running = m > R * 1.6;
        ui.knob.style.transform = `translate(${dx}px,${dy}px)`;
      } else if (t.identifier === lookId) {
        look(t.clientX - lx, t.clientY - ly, 0.005); lx = t.clientX; ly = t.clientY;
      }
    }
    e.preventDefault();
  }, { passive: false });
  const end = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === padId) { padId = null; stick.x = stick.y = 0; running = false; ui.pad.hidden = true; ui.knob.style.transform = ''; }
      if (t.identifier === lookId) lookId = null;
    }
  };
  canvas.addEventListener('touchend', end);
  canvas.addEventListener('touchcancel', end);
}

/* ---------- intrarea: zborul de deasupra ansamblului până la ușă ---------- */
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode = 'orbit', orbitA = -2.3, flyT = 0;
const flyFrom = new THREE.Vector3(), flyQ0 = new THREE.Quaternion(), flyQ1 = new THREE.Quaternion();
const eul = new THREE.Euler(0, 0, 0, 'YXZ'), CENTER = new THREE.Vector3(0, 1.5, 0);
function shadowSpan(r) {
  const c = sun.shadow.camera;
  if (c.right === r) return;
  c.left = c.bottom = -r; c.right = c.top = r; c.updateProjectionMatrix();
}
function cinematic(dt) {
  if (mode === 'orbit') {
    if (!still) orbitA += dt * 0.035;
    camera.position.set(Math.sin(orbitA) * 48, 24, Math.cos(orbitA) * 70);
    camera.lookAt(CENTER);
    shadowSpan(60);
    sun.target.position.set(0, 0, 0);
    sun.position.copy(SUN_DIR).multiplyScalar(110);
    return;
  }
  // mode === 'fly'
  flyT = Math.min(1, flyT + dt / 3.4);
  const e = flyT < 0.5 ? 4 * flyT ** 3 : 1 - (-2 * flyT + 2) ** 3 / 2;
  // curbă Bézier: trece pe deasupra fațadei de intrare, apoi coboară la înălțimea ochilor
  const to = tmpV.set(feet.x, feet.y + EYE, feet.z);
  const mid = tmpV2.set(feet.x - 26, 16, feet.z);
  const u = 1 - e;
  camera.position.set(
    u * u * flyFrom.x + 2 * u * e * mid.x + e * e * to.x,
    u * u * flyFrom.y + 2 * u * e * mid.y + e * e * to.y,
    u * u * flyFrom.z + 2 * u * e * mid.z + e * e * to.z);
  camera.quaternion.slerpQuaternions(flyQ0, flyQ1, e * e * (3 - 2 * e));
  if (flyT > 0.55) shadowSpan(32);
  updateSun();
  if (flyT >= 1) { mode = 'walk'; camera.rotation.set(pitch, yaw, 0); ui.hud.hidden = false; }
}

/* ---------- bucla ---------- */
const clock = new THREE.Clock();
// când scena iese din ecran (ai coborât la note sau în footer), nu mai desenăm degeaba
let visible = true;
new IntersectionObserver(([e]) => {
  visible = e.isIntersecting;
  if (collider) renderer.setAnimationLoop(visible ? frame : null);
  clock.getDelta();
}).observe(stage);
stage.addEventListener('wheel', (e) => { if (active) e.preventDefault(); }, { passive: false });
let fpsT = 0, fpsN = 0, quality = 2;
function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (collider) {
    if (mode === 'walk') update(dt);
    else { cinematic(dt); updateDoors(dt); }
  }
  composer.render(dt);
  // calitate adaptivă: dacă placa video nu ține pasul, scădem rezoluția, apoi umbrele de contact
  fpsT += dt; fpsN++;
  if (fpsT > 2.5) {
    const fps = fpsN / fpsT; fpsT = 0; fpsN = 0;
    if (fps < 38 && quality > 0) {
      quality--;
      if (quality === 1) { pixelRatio = 1; resize(); }
      if (quality === 0) { gtao.enabled = false; }
    }
  }
}

ui.start.disabled = true;
load().then(() => {
  spawn(0);
  feet.y = groundHeight(feet.x, feet.z, feet.y + 1);
  cinematic(0);
  stage.classList.add('is-ready');
  ui.start.disabled = false;
  ui.start.textContent = touch ? 'Intră în clădire' : 'Intră în clădire';
  if (visible) renderer.setAnimationLoop(frame);
}).catch((e) => { console.error(e); ui.err.hidden = false; ui.load.hidden = true; });

ui.start.addEventListener('click', () => {
  active = true;
  window.scrollTo({ top: stage.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  stage.classList.add('is-playing');
  ui.intro.hidden = true;
  if (!touch) canvas.requestPointerLock();
  clock.getDelta();
  flyFrom.copy(camera.position);
  flyQ0.copy(camera.quaternion);
  flyQ1.setFromEuler(eul.set(pitch, yaw, 0));
  flyT = still ? 1 : 0;
  mode = 'fly';
});
// Esc scoate mouse-ul; un click pe scenă îl prinde din nou

if (location.search.includes('debug')) {
  window.__tur = { feet, keys, doors, camera, spawn, groundHeight,
    look: (y, p) => { yaw = y; pitch = p; }, start: () => { ui.start.click(); if (!location.search.includes('fly')) { mode = 'walk'; ui.hud.hidden = false; } },
    up: () => { const r = new THREE.Raycaster(camera.position.clone(), new THREE.Vector3(0, 1, 0)); return r.intersectObject(world, true).slice(0, 3).map((h) => h.object.name + ' ' + h.distance.toFixed(2)); },
    info: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles }) };
}
