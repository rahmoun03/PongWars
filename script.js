// Mesh

import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { cameraNear, color } from 'three/examples/jsm/nodes/Nodes.js';
import * as dat from 'lil-gui';


const gui = new dat.GUI();
const scene = new THREE.Scene();
const tableGroup = new THREE.Group();
const axesHelper = new THREE.AxesHelper(window.innerWidth / 2);

const pointLight = new THREE.PointLight(0xffffff, 2.5, 1000); // Color, intensity, and distance
pointLight.position.set(200, 200, 200); // Position at the sun
pointLight.castShadow = true;
scene.add(pointLight);



let texture = ([
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/px.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/nx.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/py.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/ny.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/pz.png'), side : THREE.BackSide}),
	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/nz.png'), side : THREE.BackSide})
	]);
	
	

const ground = new THREE.Mesh(
	new THREE.BoxGeometry(1000,1000,1000),
	texture
);

const ball = new THREE.Mesh(
	new THREE.SphereGeometry(2, 64, 64),
	new THREE.MeshStandardMaterial({
		color : "orange",
		emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.1, // Adjust the intensity as needed
		})
		);
		ball.position.y += 4;
		ball.position.z += 50;
ball.castShadow = true;
ball.receiveShadow = true;

scene.add(tableGroup, ball);
scene.add(axesHelper);

const player = new THREE.Mesh(
	new THREE.BoxGeometry(20 , 10 , 2),
	new THREE.MeshNormalMaterial({
		// color : "cyan",
		// emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        // emissiveIntensity: 0.1, // Adjust the intensity as needed
}));
player.position.x = 0;
player.position.y = 6;
player.position.z = 97;

// player.castShadow = true;
// player.receiveShadow = true;
scene.add(player);

gui.add(player.position, "x", -58, 58);
gui.add(player.position, "y");
gui.add(player.position, "z", 0, 97);
gui.add(player, "visible");
gui.add(player.material, "wireframe");
// max is 174

const table = new THREE.Mesh(
	new THREE.BoxGeometry(140 , 2 , 200),
	new THREE.MeshStandardMaterial({
		color : "blue",
		emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.1, // Adjust the intensity as needed
}));
table.castShadow = true;
table.receiveShadow = true;

const out0 = new THREE.Mesh(
	new THREE.BoxGeometry(2 , 0.1, 200),
	new THREE.MeshBasicMaterial({color : "white"}));
	out0.position.y += 1;
	
	const out1 = new THREE.Mesh(
		new THREE.BoxGeometry(2 , 0.1 , 200),
	new THREE.MeshBasicMaterial({color : "white"}));
	out1.position.y += 1;
	out1.position.x += 70 - 1;
	
const out2 = new THREE.Mesh(
	new THREE.BoxGeometry(2 , 0.1 , 200),
	new THREE.MeshBasicMaterial({color : "white"}));
	out2.position.y += 1;
out2.position.x -= 70 - 1;
	
const out3 = new THREE.Mesh(
	new THREE.BoxGeometry(140 , 0.1 , 2),
	new THREE.MeshBasicMaterial({color : "white"}));
	out3.position.y += 1;
	out3.position.z += 100 - 1;
	
const out4 = new THREE.Mesh(
	new THREE.BoxGeometry(140 , 0.1 , 2),
	new THREE.MeshBasicMaterial({color : "white"}));
	out4.position.y += 1;
	out4.position.z -= 100 - 1;

	const fil = new THREE.Mesh(
		new THREE.BoxGeometry(140 , 13, 1, 32, 4),
	new THREE.MeshStandardMaterial( {
		emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.1, // Adjust the intensity as needed
        wireframe : true,
		side: THREE.DoubleSide
}));
fil.position.y = 8;

fil.castShadow = true;
fil.receiveShadow = true;

tableGroup.add(table, fil, out0,out1,out2,out3,out4);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 2000);
camera.position.z = 130;
// camera.position.z = 1;
camera.position.y = 80;
camera.position.x = 0;
scene.add(camera);

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);



const light1 = new THREE.SpotLight()
light1.position.set(ball.position.x, ball.position.y, ball.position.z);
// light1.angle = Math.PI / 2
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 2.0
light1.shadow.camera.far = 75
scene.add(light1)




const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;	
controls.target.y = 0.5;

renderer.render(scene, camera);

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth , window.innerHeight);
	camera.updateProjectionMatrix();
});

let cursorx = 0;
let cursorz = 0;

window.addEventListener("mousemove", (event) => {
    cursorx = (camera.position.z * (event.clientX / window.innerWidth) * (75 * (Math.PI / 180))) - 140;
    cursorz = (camera.position.z * (event.clientY / window.innerHeight) * (75 * (Math.PI / 180))) - window.innerHeight;

	// Convert screen coordinates to normalized device coordinates (-1 to +1)
	// const mouse = new THREE.Vector2(
	// 	(event.clientX / window.innerWidth) * 2 - 1,
	// 	-(event.clientY / window.innerHeight) * 2 + 1
	//   );

	//   // Convert normalized device coordinates to 3D coordinates
	//   const vector = new THREE.Vector3(mouse.x, mouse.y, player.position.z).unproject(camera);

	//   // Update the cube's position
	//   player.position.set(vector.x, vector.y, 0);
});



const keys = { 
	ArrowUp: false, 
	ArrowDown: false, 
	ArrowLeft: false, 
	ArrowRight: false 
};


// Event listeners for keydown and keyup events
document.addEventListener('keydown', (event) => {
	if (keys.hasOwnProperty(event.key)) {
		keys[event.key] = true;
	}
});

document.addEventListener('keyup', (event) => {
	if (keys.hasOwnProperty(event.key)) {
		keys[event.key] = false;
	}
});


// player.position.x = 60;
// player.position.z = 600;
	
const clock = new THREE.Clock();
function animate(){
	
	const elapsedTime = clock.getElapsedTime();

	// if (keys.ArrowUp) player.position.z -= 1.5;
	// if (keys.ArrowDown) player.position.z += 1.5;
	if (keys.ArrowLeft && player.position.x >= -58) player.position.x -= 2.5;
	if (keys.ArrowRight && player.position.x <= 58) player.position.x += 2.5;
	
	
	let speed = (Math.sin(elapsedTime * 13 ) + 1.3);
	ball.position.y = speed * 10;
	ball.position.x = Math.sin(elapsedTime) * 20;
	ball.position.z = Math.sin(elapsedTime * 2) * 96;
	
	
	light1.position.set(player.position.x , player.position.y + 2, player.position.z + 2);
	light1.angle = Math.PI / ((Math.sin(elapsedTime * 2) + 2 ) * 4);
	// console.log((Math.sin(elapsedTime) + 2 ) * 3);

	// console.log("scene x : " + cursorx);
	// console.log("window x : " , window.innerWidth);
	// console.log("window y : " , window.innerHeight);

	// console.log("camera z = ", camera.position.z);
	// console.log("")
	controls.update();
	renderer.render( scene, camera );
	window.requestAnimationFrame(animate);
};
animate();