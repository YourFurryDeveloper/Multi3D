// public/game.js

const socket = io('/api/game'); // Connect to the serverless WebSocket endpoint

let username = '';
let isPointerLocked = false;
let playerCube = null;

// Handle pointer lock
document.body.addEventListener('click', () => {
  if (!isPointerLocked) {
    document.body.requestPointerLock();
    isPointerLocked = true;
  }
});

// Create the 3D scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up a simple cube for players
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
playerCube = new THREE.Mesh(geometry, material);
scene.add(playerCube);

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

function handleMovement() {
  if (moveForward) velocity.z -= 0.1;
  if (moveBackward) velocity.z += 0.1;
  if (moveLeft) velocity.x -= 0.1;
  if (moveRight) velocity.x += 0.1;

  playerCube.position.add(velocity);
}

// Join game function (triggered by button)
function joinGame() {
  username = document.getElementById('username').value;
  if (username) {
    socket.emit('join', username);
  }
}

// Listen for other players' movements (useful in multiplayer mode)
socket.on('userMove', (data) => {
  console.log('User moved:', data);
  // Update the positions of other players here
});

// Game loop (update the scene)
function animate() {
  requestAnimationFrame(animate);

  handleMovement();
  renderer.render(scene, camera);
}

animate();
