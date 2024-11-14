// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';


const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const audioPlay = document.getElementById("audio");

// @ts-ignore
openModalBtn.onclick = function() {
    // @ts-ignore
    modal.style.display = "flex";  // Show modal
    animateCover()
}

// @ts-ignore
closeModalBtn.onclick = function() {
    animateCover()
    stopCdRotation()
    // @ts-ignore
    audioPlay.pause();
    // @ts-ignore
    modal.style.display = "none";  // Hide modal
}

// @ts-ignore
audioPlay.addEventListener("play", animateCd);
// @ts-ignore
audioPlay.addEventListener("pause", stopCdRotation);
// Global variables
let model;
let isOpening = false;
let animationInProgress = false;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let cdRotating = false;
let animationFrameId;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(7, window.innerWidth / window.innerHeight, 0.3, 1000);
camera.position.setZ(30);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 1.5 , window.innerHeight / 1.5);
renderer.render(scene, camera);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

// Model loading
const loader = new GLTFLoader();
loader.load(
    '../public/albumClosed.glb',
    (gltf) => {
        model = gltf.scene;

        // Set model position and rotation
        model.rotation.set(0, Math.PI + 2/2, 0);
        model.position.set(1.3, -1, -2);
        scene.add(model);
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the model', error);
    }
);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function isCursorOnModel() {
    // Update the raycaster with the current mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the model
    const intersects = raycaster.intersectObject(model);

    // Return true if there’s an intersection, false otherwise
    return intersects.length > 0;
}

// Animation functions
export function animateCover() {
    const targetRotation = isOpening ? 0 :-Math.PI;
    const rotationSpeed = 0.03;

    function animate() {
        let isFinished = true;

        //Iterate through the model and rotate
        model.traverse((child) => {
            if (child.name === "Case_Front_0") {
                const currentRotation = child.rotation.y;
                const deltaRotation = targetRotation - currentRotation;

                if (Math.abs(deltaRotation) > 0.6) {
                    child.rotation.y += deltaRotation * rotationSpeed;
                    isFinished = false;
                }
            }
        });

        if (!isFinished) {
            requestAnimationFrame(animate);
        }

        if (isFinished) {
            animationInProgress = false;
        }
    }

    if (!animationInProgress) {
        animationInProgress = true;
        animate();
    }
}

export function animateCd() {
    const rotationSpeed = 0.01;

    function animate() {
        model.traverse((child) => {
            if (child.name === "Object_13") {
                child.rotation.y += rotationSpeed;
            }
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start the animation if not already rotating
    if (!cdRotating) {
        cdRotating = true;
        animate();
    }
}

export function stopCdRotation() {
    if (cdRotating) {
        cancelAnimationFrame(animationFrameId);
        cdRotating = false;
    }
}

// Mouse event handlers
function onMouseDown(event) {
    isMouseDown = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseMove(event) {
    if (isMouseDown && model) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        model.rotation.y += deltaX * 0.01;
        model.rotation.x -= deltaY * 0.01;
        model.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, model.rotation.x));

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
}

function onMouseUp() {
    isMouseDown = false;
}

function onMouseOut() {
    isMouseDown = false;
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Event listeners
window.addEventListener('click', () => {
    if (isMouseDown) return;
    if (isCursorOnModel()) return;
    if (!animationInProgress) {
        isOpening = !isOpening;
        animateCover();
    }
});

//Mouse event Listeners
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mouseout', onMouseOut, false);

// Start animation
animate();