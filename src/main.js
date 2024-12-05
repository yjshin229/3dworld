import * as THREE from 'three';

let scene, camera, renderer, cat;

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Cat
    const catGeometry = new THREE.BoxGeometry(1, 1, 2);
    const catMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    cat = new THREE.Mesh(catGeometry, catMaterial);
    cat.position.set(0, 1, 0);
    scene.add(cat);

    // Animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Cat movement
    // cat.position.x = Math.sin(Date.now() * 0.001) * 5;
    // cat.position.z = Math.cos(Date.now() * 0.001) * 5;

    // Render
    renderer.render(scene, camera);
}

// Start
init();
