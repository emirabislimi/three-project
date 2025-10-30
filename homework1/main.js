import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const sizes = { width: 800, height: 600 }
const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87CEEB)

// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.set(26, 16, 34)
scene.add(camera)

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(6, 3, 6)

//  Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x7dbb6f, 0.6))
const sun = new THREE.DirectionalLight(0xffffff, 0.9)
sun.position.set(25, 30, 15)
sun.castShadow = true
scene.add(sun)

//  Ground & Roads
const grassMat = new THREE.MeshStandardMaterial({ color: 0x6faf60, roughness: 1.0, metalness: 0.0 })
const roadMat  = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.95 })

const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 100), grassMat)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// Cross road in front
const roadHorizontal = new THREE.Mesh(new THREE.PlaneGeometry(160, 10), roadMat)
roadHorizontal.rotation.x = -Math.PI / 2
roadHorizontal.position.set(0, 0.02, 6)
scene.add(roadHorizontal)

// Vertical roads
const roadVertical1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 100), roadMat)
roadVertical1.rotation.x = -Math.PI / 2
roadVertical1.position.set(-4, 0.02, 6)
scene.add(roadVertical1)

const roadVertical2 = new THREE.Mesh(new THREE.PlaneGeometry(10, 100), roadMat)
roadVertical2.rotation.x = -Math.PI / 2
roadVertical2.position.set(20, 0.02, 6)
scene.add(roadVertical2)

//  Building factory 
function makeBuilding({ x, z, bodyColor, stripeColor, materialType = 'standard', scale = [1,1,1] }) {
  let bodyMat
  if (materialType === 'phong')
    bodyMat = new THREE.MeshPhongMaterial({ color: bodyColor, shininess: 40 })
  else
    bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.6, metalness: 0.05 })

  const g = new THREE.Group()

  // main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 6), bodyMat)
  body.position.set(0, 3, 0)
  body.castShadow = true
  body.receiveShadow = true
  g.add(body)

  // stripe in front
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 6.01, 6.02),
    new THREE.MeshPhongMaterial({ color: stripeColor, shininess: 10 })
  )
  stripe.position.set(0.2, 3, 0.01)
  g.add(stripe)

  // windows
  const windowMat = new THREE.MeshStandardMaterial({ color: 0xdde7f1, roughness: 0.3, metalness: 0.1 })
  function addWindow(wx, wy, wz, w = 1.2, h = 0.9) {
    const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), windowMat)
    windowMesh.position.set(wx, wy, wz)
    g.add(windowMesh)
  }

  // Add front windows
  addWindow(-2.0, 4.2, 3.03)
  addWindow(2.0, 4.2, 3.03)
  addWindow(0.0, 2.1, 3.03, 2.4, 0.7)

  g.position.set(x, 0, z)
  g.scale.set(...scale)
  scene.add(g)
}

// Buildings 
makeBuilding({
  x: -16, z: 0,
  bodyColor: 0x9ecbff, stripeColor: 0x6ba8f5,
  materialType: 'standard', scale: [1.2, 1.0, 1.0]
})

makeBuilding({
  x: 6, z: 0,
  bodyColor: 0x3f86c9, stripeColor: 0x2e6aa3,
  materialType: 'phong', scale: [1.2, 1.0, 1.0]
})

makeBuilding({
  x: 32, z: 0,
  bodyColor: 0xF2C230, stripeColor: 0xD69E1D,
  materialType: 'standard', scale: [1.2, 1.0, 1.0]
})

//  Trees
function addTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  )
  trunk.position.set(x, 1, z)
  trunk.castShadow = true

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 3, 10),
    new THREE.MeshPhongMaterial({ color: 0x2e7d32 })
  )
  leaves.position.set(x, 3, z)
  leaves.castShadow = true

  scene.add(trunk, leaves)
}

// Trees in front of buildings
addTree(-20, 10)
addTree(-12, 10)
addTree(28, 10)
addTree(36, 10)

//  Animation
function animate() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

// Resize handler
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})
