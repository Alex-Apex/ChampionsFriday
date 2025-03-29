// starwars.js
const container = document.getElementById('three-container');
container.style.width = '100vw';
container.style.height = '100vh';
container.style.overflow = 'hidden';
const planes = [];
const chunkSize = 5; //Number of lines per canvas
const lineSpacing = 100;
const planeHeight = chunkSize * lineSpacing;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lorem Ipsum text clearly
const lines = [
    "Episode Q1 2025",
    "A new rebell base has decided to celebrate the vitory of the Q4-2024 and Q1-2025",
    "",
    "Gabriel Gomez Villasana",
    "Practice: Java",
    "Number of badges: 3",
    "Logro un chorro de cosas muy buenas",
    "El cliente lo quiere mucho.",
    "",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    ""
];
const chunks = [];
for (let i = 0; i < lines.length; i += chunkSize) {
    chunks.push(lines.slice(i, i + chunkSize));
}

chunks.forEach((chunk, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = 3000;
    canvas.height = 2000;//planeHeight;

    const ctx = canvas.getContext('2d');
    if(i%2 === 0){
        ctx.fillStyle = 'black';// 'blue';
    } else {
        ctx.fillStyle = 'blak';//'black';
    }
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';
    
    chunk.forEach((line, j) => {
        ctx.fillText(line, (canvas.width / 2), 100 + (j * lineSpacing)); // Adjusted spacing for larger font
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(20, 40);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.set(0,0,0);
    mesh.position.set(0, i * -40, 0); // text position is slightly below the camera
    planes.push(mesh)
    scene.add(mesh);
});


camera.position.set(0,10,10); // camera positioned at a good distance away from text
camera.rotation.x = Math.PI / 4; // camera tilted downwards

function animate() {
  requestAnimationFrame(animate);
    planes.forEach((plane, i) => {        
        plane.position.y += 0.035; 
    });

  //textMesh.position.y += 0.035;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});