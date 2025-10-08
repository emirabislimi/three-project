import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// === SCENE ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f1f); // dark bluish background

// === CAMERA ===
const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);
camera.position.set(4, 3, 7);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// === LIGHTS ===

// Ambient light (fills shadows softly)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Main top light (reflecting from above)
const topLight = new THREE.DirectionalLight(0xffffff, 1.3);
topLight.position.set(0, 10, 2);
topLight.castShadow = true;
topLight.shadow.mapSize.width = 2048;
topLight.shadow.mapSize.height = 2048;
scene.add(topLight);

// A secondary colored light for reflection and contrast
const blueLight = new THREE.PointLight(0x66ccff, 1.2, 50);
blueLight.position.set(-4, 3, 5);
scene.add(blueLight);

// === FLOOR (reflective-like plane) ===
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
color: 0x222228,
metalness: 0.7, // higher = more reflective
roughness: 0.25
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// === GEOMETRIES ===

// 1️⃣ Cube — sunset orange metallic
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({
color: 0xff8c42,
metalness: 0.8,
roughness: 0.3
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-2.2, 0, 0);
cube.castShadow = true;
scene.add(cube);

// 2️⃣ Sphere — emerald glossy
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
color: 0x00ffaa,
roughness: 0.1,
metalness: 0.7,
clearcoat: 0.9
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
sphere.castShadow = true;
scene.add(sphere);

// 3️⃣ Cone — neon purple
const coneGeometry = new THREE.ConeGeometry(0.7, 1.5, 32);
const coneMaterial = new THREE.MeshStandardMaterial({
color: 0xaa66ff,
metalness: 0.8,
roughness: 0.25
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(2.2, 0, 0);
cone.castShadow = true;
scene.add(cone);

// === ORBIT CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === ANIMATION LOOP ===
function animate() {
requestAnimationFrame(animate);

// Rotate all objects
cube.rotation.x += 0.01;
cube.rotation.y += 0.02;

sphere.rotation.x += 0.015;
sphere.rotation.y += 0.015;

cone.rotation.x += 0.02;
cone.rotation.y += 0.025;

controls.update();
renderer.render(scene, camera);
}

animate();

// === RESIZE HANDLER ===
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});
