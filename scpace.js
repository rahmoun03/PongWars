import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { cameraNear, color } from 'three/examples/jsm/nodes/Nodes.js';

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01 , 3000);
camera.position.z = 20;

// let background = ([
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./background/px.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./background/nx.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./background/py.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./background/ny.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./background/pz.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./background/nz.png'), side : THREE.BackSide})
// ]);
// console.log(background);
// const bg = new THREE.Mesh(
//     new THREE.BoxGeometry(100, 100, 100),
//     background
// );

const background = new THREE.TextureLoader().load('bg.jpg');
scene.background = background;
scene.environment = background;

const sunTexture = new THREE.TextureLoader().load('sun.jpg');
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3, 64, 64),
    new THREE.MeshBasicMaterial({map : sunTexture})
);

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({map : moonTexture})
);
// moon.position.x = 6;
// moon.position.z = 6;

const makemakeTexture = new THREE.TextureLoader().load('makemake.jpg');
const makemake = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({map : makemakeTexture})
);
// makemake.position.x += 8;
// makemake.position.z -= 10;

scene.add(camera, sun, moon, makemake, axesHelper);

// Create the renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);



const controls = new OrbitControls( camera, renderer.domElement );

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth , window.innerHeight);
	camera.updateProjectionMatrix();
});
const clock = new THREE.Clock();

function animate()
{
    const elapsedTime = clock.getElapsedTime();
    makemake.position.x = Math.cos(elapsedTime * 0.5) * 12;
    makemake.position.z = Math.sin(elapsedTime * 0.5) * 12;
    moon.position.x = Math.cos(elapsedTime * 0.4) * 8;
    moon.position.z = Math.sin(elapsedTime * 0.4) * 8;

    sun.rotation.y = elapsedTime ;
    
    controls.update();
    renderer.render( scene, camera );
    window.requestAnimationFrame(animate);
};
animate();