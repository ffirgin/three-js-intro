import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let loadedModel

const kendama = new GLTFLoader();
kendama.load('./assets/Kendama/scene.gltf', (model) => {
  loadedModel = model;

  model.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0x403F4C)
    }
  })

  scene.add(model.scene)
  console.log(model)

  //Timeline animation
  const tl = gsap.timeline({ defaults: { duration: 1 }})
  tl.fromTo(loadedModel.scene.scale, {z:0, x:0, y:0}, {z:0.9, x:0.9, y:0.9})
  tl.fromTo('nav', {y: '-100%'}, {y: '0%'})
  tl.fromTo('h1', {opacity: 0}, {opacity: 1})
})

const animate = () => {
  if (loadedModel) {
    loadedModel.scene.position.set(0, -2, 0)
  }
  requestAnimationFrame(animate)
}
animate();

// Scene Setup
const scene = new THREE.Scene();

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Creating a light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
light.intensity = 1.5
scene.add(light)

// Setting up the Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20;
scene.add(camera);


// Setting up the Render
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// Setting up Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 2.5

// Resizing the window
window.addEventListener('resize', () => {
  // Updating with window sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Updating the camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//Mouse Animation
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    // Animate the colors based off the mouse position
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    loadedModel.scene.traverse((child) => {
      if (child.isMesh) {
        gsap.to(child.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
      }
    })
  }
})
