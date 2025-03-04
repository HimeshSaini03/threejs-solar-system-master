// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background Color (Dark Space)
scene.background = new THREE.Color(0x111111);

// Sun
const sunTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/3/3a/Solar_surface_map.jpg');
const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    emissive: 0xffaa00,
    emissiveIntensity: 2,
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), sunMaterial);
scene.add(sun);

// Sun Light
const sunLight = new THREE.PointLight(0xffaa00, 3, 200);
scene.add(sunLight);

// Planet Data
const planetData = [
    { name: "Mercury", color: 0x8c8c8c, distance: 15, size: 0.5, orbitSpeed: 0.02, rotationSpeed: 0.001 },
    { name: "Venus", color: 0xffa500, distance: 25, size: 1.2, orbitSpeed: 0.015, rotationSpeed: 0.002 },
    { name: "Earth", color: 0x4287f5, distance: 35, size: 1.5, orbitSpeed: 0.01, rotationSpeed: 0.02 },
    { name: "Mars", color: 0xff4500, distance: 50, size: 1.0, orbitSpeed: 0.008, rotationSpeed: 0.015 },
    { name: "Jupiter", color: 0xd2b48c, distance: 70, size: 3.0, orbitSpeed: 0.005, rotationSpeed: 0.05 },
    { name: "Saturn", color: 0xffd700, distance: 90, size: 2.8, orbitSpeed: 0.004, rotationSpeed: 0.04 },
    { name: "Uranus", color: 0x66ccff, distance: 110, size: 2.5, orbitSpeed: 0.003, rotationSpeed: 0.03 },
    { name: "Neptune", color: 0x0000ff, distance: 130, size: 2.4, orbitSpeed: 0.002, rotationSpeed: 0.02 }
];

// Planets & Orbital Paths
const planets = [];
const orbitLines = [];

planetData.forEach((data) => {
    const material = new THREE.MeshStandardMaterial({ color: data.color });
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const planet = new THREE.Mesh(geometry, material);

    planet.userData = { distance: data.distance, orbitSpeed: data.orbitSpeed, rotationSpeed: data.rotationSpeed, angle: Math.random() * Math.PI * 2 };

    // Create Orbit Path
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    
    for (let i = 0; i <= 360; i++) {
        const angle = (i * Math.PI) / 180;
        orbitPoints.push(new THREE.Vector3(Math.cos(angle) * data.distance, 0, Math.sin(angle) * data.distance));
    }

    orbitGeometry.setFromPoints(orbitPoints);
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.visible = false; // Initially hidden

    scene.add(orbitLine);
    scene.add(planet);

    planets.push(planet);
    orbitLines.push(orbitLine);
});

// Button to Show/Hide Orbital Axes
const orbitButton = document.createElement("button");
orbitButton.innerText = "Toggle Orbital Axes";
orbitButton.style.position = "absolute";
orbitButton.style.top = "10px";
orbitButton.style.left = "10px";
orbitButton.style.padding = "10px";
orbitButton.style.background = "#222";
orbitButton.style.color = "#fff";
orbitButton.style.border = "none";
orbitButton.style.cursor = "pointer";
document.body.appendChild(orbitButton);

orbitButton.addEventListener("click", () => {
    orbitLines.forEach(orbit => orbit.visible = !orbit.visible);
});

// Camera Initial Position
const radius = 150;
camera.position.set(radius * Math.sin(Math.PI / 4), radius * Math.sin(Math.PI / 6), radius * Math.cos(Math.PI / 4));
camera.lookAt(0, 0, 0);

// Control Panel Elements
const planetSelect = document.getElementById("planet-select");
const sizeControl = document.getElementById("size");
const rotationSpeedControl = document.getElementById("rotation-speed");
const orbitSpeedControl = document.getElementById("orbit-speed");

function updatePlanetSettings() {
    const index = parseInt(planetSelect.value);
    const planet = planets[index];

    planet.scale.set(sizeControl.value, sizeControl.value, sizeControl.value);
    planet.userData.rotationSpeed = parseFloat(rotationSpeedControl.value);
    planet.userData.orbitSpeed = parseFloat(orbitSpeedControl.value);
}

// Event Listeners for Controls
sizeControl.addEventListener("input", updatePlanetSettings);
rotationSpeedControl.addEventListener("input", updatePlanetSettings);
orbitSpeedControl.addEventListener("input", updatePlanetSettings);
planetSelect.addEventListener("change", () => {
    updatePlanetSettings();
});

// Camera Control with Arrow Keys
document.addEventListener("keydown", (event) => {
    const moveSpeed = 10;
    if (event.key === "ArrowLeft") {
        camera.position.x -= moveSpeed;
    } else if (event.key === "ArrowRight") {
        camera.position.x += moveSpeed;
    } else if (event.key === "ArrowUp") {
        camera.position.y += moveSpeed;
    } else if (event.key === "ArrowDown") {
        camera.position.y -= moveSpeed;
    }
    camera.lookAt(0, 0, 0);
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    planets.forEach((planet) => {
        planet.userData.angle += planet.userData.orbitSpeed * 0.05;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += planet.userData.rotationSpeed;
    });

    renderer.render(scene, camera);
}

animate();
