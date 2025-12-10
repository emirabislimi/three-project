import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Renderer (enable shadows)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.getElementById("scene").appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.set(0, 0, 40);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ----------- LIGHTING WITH SHADOWS -----------

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(30, 40, 20);
sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);

// Soft glowing point light
const glowLight = new THREE.PointLight(0xffffff, 0.8, 100);
glowLight.position.set(-20, 10, 20);
scene.add(glowLight);

//Adding glow

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,   // strength of glow
    0.4,   // radius
    0.0    // threshold
);
composer.addPass(bloomPass);

// UI
const infoPanel = document.getElementById("cube-info");

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Cubes
const cubes = [];
let selectedCube = null;

// --- CREATE GLOWING, SHADOWED CUBES IN FULL 3D SPACE ---
for (let i = 0; i < 20; i++) {
    const size = rand(2, 5);

    const geo = new THREE.BoxGeometry(size, size, size);

    // Standard material supports shadows + looks better with bloom
    const mat = new THREE.MeshStandardMaterial({
        color: randomColor(),
        roughness: 0.4,
        metalness: 0.3
    });

    const cube = new THREE.Mesh(geo, mat);
    cube.castShadow = true;
    cube.receiveShadow = true;

    // Random free-floating 3D placement
    cube.position.set(
        rand(-25, 25),
        rand(-15, 15),
        rand(-10, 10)
    );

    cube.userData.size = size;

    cubes.push(cube);
    scene.add(cube);
}

// Click event
window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(cubes);

    if (hit.length > 0) {
        const cube = hit[0].object;

     
        cube.material.color.set(randomColor());

        selectedCube = cube;
        updateInfo(cube);
    } else {
        selectedCube = null;
        infoPanel.textContent = "No object selected.";
    }
});


function updateInfo(cube) {
    infoPanel.textContent =
`Cube Selected:
Position:
  x: ${cube.position.x.toFixed(2)}
  y: ${cube.position.y.toFixed(2)}
  z: ${cube.position.z.toFixed(2)}

Size:
  width:  ${cube.userData.size.toFixed(2)}
  height: ${cube.userData.size.toFixed(2)}
  depth:  ${cube.userData.size.toFixed(2)}
`;
}

// Animation
function animate() {
    controls.update();

    for (let cube of cubes) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    // Render with bloom
    composer.render();
    requestAnimationFrame(animate);
}

animate();

// Resize handler
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Utils
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function randomColor() {
    return Math.random() * 0xffffff;
}
