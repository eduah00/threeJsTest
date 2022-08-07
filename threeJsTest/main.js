import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Creates a new scene, camera, and renderer for the 3d environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

//Sets the size of the renderer to be the same as the window
renderer.setPixelRatio(window.devicePixelRatio); 
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//Render puts the scene and camera into the renderer
renderer.render(scene, camera);

//Creates a new torus with standard mesh that reflects lights
const geomerty = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geomerty, material);
scene.add(torus);

//Creates a point light that is directional and ambient light that lights the whole scene
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
pointLight.position.set(20, 20, 20);
const ambnientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambnientLight);

//Creates a helpers that visualizes the where light and grid are in the scene
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

//Creates controls that allows the user to rotate and zoom the scene
const controls = new OrbitControls(camera, renderer.domElement);

//Function that create starts with random xyz position from -100 to 100
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100) );
  
  star.position.set(x, y, z);
  scene.add(star);
}

//Fills an array with 200 random stars
Array(200).fill().forEach(addStar);

//Creates a space background for the scene
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Box with texture
const kalmfroTexture = new THREE.TextureLoader().load('kalmfro.jpg');

const kalm = new THREE.Mesh(
  new THREE.BoxGeometry(10, 7.5, 7.5),
  new THREE.MeshBasicMaterial({ map: kalmfroTexture })
);
kalm.position.y = 20;
scene.add(kalm);

//Earth with normal map
const earthTexture = new THREE.TextureLoader().load('earthmap1k.jpg');
const earthNormalMap = new THREE.TextureLoader().load('earthmap1k.jpg');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormalMap,
  })
);
scene.add(earth);

earth.position.z = 30;
earth.position.setX(-10);

kalm.position.z = -5;
kalm.position.x = 2;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  earth.rotation.x += 0.05;
  earth.rotation.y += 0.075;
  earth.rotation.z += 0.05;

  kalm.rotation.y += 0.01;
  kalm.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();












//Recursivve functon that updates the screne infinitely
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();