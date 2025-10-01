import * as THREE from 'three';

<<<<<<< HEAD
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// Axes Helper
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Group
const group = new THREE.Group();
scene.add(group);

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }) // green
);
sphere.position.x = -2;
group.add(sphere);

// Cone
const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 2, 32),
    new THREE.MeshStandardMaterial({ color: 0x0000ff }) // blue
);
cone.position.x = 0;
group.add(cone);

// Cylinder
const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 2, 32),
    new THREE.MeshStandardMaterial({ color: 0xffff00 }) // yellow
);
cylinder.position.x = 2;
group.add(cylinder);

// Clock for motion
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

   
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.position.x = -2 + Math.sin(t) * 1.0;

   
    cone.rotation.y += 0.02;
    cone.position.y = Math.sin(t * 2) * 1.0;

    
    cylinder.rotation.x += 0.015;
    cylinder.rotation.y += 0.015;
    cylinder.position.z = Math.sin(t) * 1.5;

    renderer.render(scene, camera);
}

animate();
=======
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x202020);

const camera=
new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
camera.position.z=3;

const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry=new THREE.BoxGeometry(1,1,1);
const material=new THREE.MeshBasicMaterial({color:0x00ff88});
const cubeMesh=new THREE.Mesh(geometry,material);
scene.add(cubeMesh);

const light=new THREE.DirectionalLight(0xffffff,1);
light.position.set(2,2,5);
scene.add(light);

//cubeMesh.rotation.x=10;

function animate(){
    requestAnimationFrame(animate);
    cubeMesh.rotation.x +=0.01;
    renderer.render(scene,camera);
}

animate()
>>>>>>> feb7abdc4b011ee5f441fb00bfb988020e0123b9
