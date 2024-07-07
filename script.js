// Mesh

import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { cameraNear, color } from 'three/examples/jsm/nodes/Nodes.js';

const scene = new THREE.Scene();
const tableGroup = new THREE.Group();
const axesHelper = new THREE.AxesHelper(14);





let texture = ([
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/px.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/nx.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/py.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/ny.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/pz.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/nz.png'), side : THREE.BackSide})
]);


// console.log(texture);
// texture.encoding = THREE.sRGBEncoding;
// scene.background = texture;
// scene.environment = texture;

const ground = new THREE.Mesh(
	new THREE.BoxGeometry(1000,1000,1000),
	texture
);
// ground.rotation.x = Math.PI / 2;
// ground.position.y += 20;

const ball = new THREE.Mesh(
	new THREE.SphereGeometry(0.2,64,64),
	new THREE.MeshBasicMaterial({color : "orange"})
);
ball.position.y += 0.4;
ball.position.z += 5;

scene.add(tableGroup, ball, ground);
scene.add(axesHelper);

////////////////////////////////////////
const table = new THREE.Mesh(
	new THREE.BoxGeometry(14 , 0.2 , 20),
	new THREE.MeshBasicMaterial({color : "blue"}));
//////////////////////////////////////
const out0 = new THREE.Mesh(
	new THREE.BoxGeometry(0.2 , 0.01 , 20),
	new THREE.MeshBasicMaterial({color : "white"}));
	out0.position.y += 0.1;
		
		
const out1 = new THREE.Mesh(
	new THREE.BoxGeometry(0.2 , 0.01 , 20),
	new THREE.MeshBasicMaterial({color : "white"}));
	out1.position.y += 0.1;
	out1.position.x += 7 - 0.1;
			
			
const out2 = new THREE.Mesh(
	new THREE.BoxGeometry(0.2 , 0.01 , 20),
	new THREE.MeshBasicMaterial({color : "white"}));
out2.position.y += 0.1;
out2.position.x -= 7 - 0.1;
	
	
	
const out3 = new THREE.Mesh(
	new THREE.BoxGeometry(14 , 0.01 , 0.2),
	new THREE.MeshBasicMaterial({color : "white"}));
	out3.position.y += 0.1;
	out3.position.z += 10 - 0.1;

	
const out4 = new THREE.Mesh(
	new THREE.BoxGeometry(14 , 0.01 , 0.2),
	new THREE.MeshBasicMaterial({color : "white"}));
	out4.position.y += 0.1;
	out4.position.z -= 10 - 0.1;
		//////////////////////////////////////
const fil = new THREE.Mesh(
	new THREE.BoxGeometry(14 , 1.3, 0.1),
	new THREE.MeshBasicMaterial( {color: "silver", side: THREE.DoubleSide}));
	fil.position.y = 0.8;

///////////////////////////////////////
tableGroup.add(table, fil, out0,out1,out2,out3,out4);
			
			
// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 2000);
camera.position.z = 13;
camera.position.y = 8;
camera.position.x = 0;
scene.add(camera);

// Create the renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

renderer.render(scene, camera);

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth , window.innerHeight);
	camera.updateProjectionMatrix();
	});
	
	// animation
	
const clock = new THREE.Clock();
function animate(){

	const elapsedTime = clock.getElapsedTime();
	let speed = (Math.sin(elapsedTime * 13 ) + 1.3);
	ball.position.y = speed;
	ball.position.x = Math.sin(elapsedTime) * 2;
	// ball.position.z = Math.sin(elapsedTime * 5) * 10;

	controls.update();
	renderer.render( scene, camera );
	window.requestAnimationFrame(animate);
};
animate();