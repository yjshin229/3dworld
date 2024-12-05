import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, cat;

function init() {
    // Scene
    scene = new THREE.Scene();

    // Background Gradient
    const gradientTexture = createGradientBackground();
    scene.background = gradientTexture;

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(ambientLight, directionalLight);

    // Gradient Plane
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            void main() {
                // Gradient colors
                vec3 color1 = vec3(0.1, 0.1, 0.1); // Darker color
                vec3 color2 = vec3(0.9, 0.5, 0.1); // Brighter color
                
                // Mix the colors based on vUv.y (vertical gradient)
                vec3 gradient = mix(color1, color2, vUv.y);
                gl_FragColor = vec4(gradient, 1.0);
            }
        `,
        side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Lay flat
    scene.add(plane);

    // Cat Placeholder
    const catGeometry = new THREE.BoxGeometry(1, 1, 2);
    const catMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    cat = new THREE.Mesh(catGeometry, catMaterial);
    cat.position.set(0, 1, 0);
    scene.add(cat);

    // OrbitControls (optional for debugging)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the cat for demo purposes
    const time = Date.now() * 0.001;
    cat.position.x = Math.sin(time) * 5;
    cat.position.z = Math.cos(time) * 5;

    renderer.render(scene, camera);
}

// Create a gradient background
function createGradientBackground() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    // Create a gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FF8A00'); // Top color
    gradient.addColorStop(1, '#6A3300'); // Bottom color
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
}

// Initialize the scene
init();
