const socket = io();

// Set up three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up a simple cube for players
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const playerCube = new THREE.Mesh(geometry, material);
scene.add(playerCube);

// Camera controls (WASD, mouse movement)
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canJump = false;

let username = '';
let isPointerLocked = false;

// Handle pointer lock
document.body.addEventListener('click', () => {
  if (!isPointerLocked) {
    document.body.requestPointerLock();
    isPointerLocked = true;
  }
});

// Update movement based on user input
function handleMovement() {
  if (moveForward) velocity.z -= 0.1;
  if (moveBackward) velocity.z += 0.1;
  if (moveLeft) velocity.x -= 0.1;
  if (moveRight) velocity.x += 0.1;

  playerCube.position.add(velocity);
}

// Socket handling
function joinGame() {
  username = document.getElementById('username').value;
  if (username) {
    socket.emit('join', username);
  }
}

// Listen for other players' movements
socket.on('userMove', (data) => {
  console.log('User moved:', data);
  // Handle updating positions for other users
});

// Listen for the list of users
socket.on('userList', (users) => {
  console.log('Users:', users);
});

// Game update loop
function animate() {
  requestAnimationFrame(animate);

  handleMovement();
  renderer.render(scene, camera);
}

animate();
