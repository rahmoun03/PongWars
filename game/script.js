// Mesh

import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { cameraNear, color, normalMap, roughness } from 'three/examples/jsm/nodes/Nodes.js';
import * as dat from 'lil-gui';
import { DirectionalLight } from 'three';
import { DirectionalLightHelper } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Plane } from 'three';



const canvas = document.getElementById("Mycanvas");
const gui = new dat.GUI();
const scene = new THREE.Scene();
const tableGroup = new THREE.Group();
let Width, Height;
Width = window.innerWidth * 0.8;
Height = window.innerHeight * 0.8;
let colorLight = 0xfcffb5;

const axesHelper = new THREE.AxesHelper(Width / 2);

/* Ambient light*/
const AmbientLight = new THREE.AmbientLight("white", 0.5); // Color, intensity, and distance
scene.add(AmbientLight);


scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 100 );

/* point light*/
// const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);// Color, intensity, and distance
// const pointLight1 = new THREE.PointLight(0xffee50, 2.5, 1000); // Color, intensity, and distance
// const pointLight2 = new THREE.PointLight(0xffffff, 2.5, 1000); // Color, intensity, and distance 
// pointLight.position.set(-100, 300, -200); // 
// pointLight1.position.set(100, 300, -100); // 
// pointLight2.position.set(30, 300, 100); // 
// pointLight.castShadow = true;
// scene.add(pointLight);


/* directional light*/
const directionalLight = new THREE.DirectionalLight("white");
directionalLight.position.x = -0.5;
directionalLight.position.y = 1;
directionalLight.position.z = -0.5;
directionalLight.castShadow = true;
scene.add(directionalLight);
const drh = new THREE.DirectionalLightHelper(directionalLight, 20);
// scene.add(drh);




let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

const gltfLoader = new GLTFLoader();

const EarthLand = new THREE.Object3D();
gltfLoader.load( './assets/land/sky_land/scene.gltf', function ( gltfScene ) {
	
	EarthLand.add(gltfScene.scene);
	
	EarthLand.scale.set(14,14,14);
	EarthLand.position.set(-2, -140, -40);
	EarthLand.rotation.y = 0.35;


	scene.add(EarthLand);
});


const player = new THREE.Object3D();
gltfLoader.load( './assets/racket/ping-pong/scene.gltf', function ( gltfScene ) {
	
	player.add(gltfScene.scene);
	
	player.receiveShadow = true;
	player.castShadow = true;

	player.position.y = 3.5;
	player.rotation.y += Math.PI / 2; 
	player.rotation.x += 3 * Math.PI / 2;
	
	console.log('this is the obj : ', player);
	scene.add(player) ;
});

let score = new THREE.Mesh(
	new THREE.TextGeometry("0 - 0"),
	new THREE.MeshNormalMaterial()
);

scene.add(score);

const table = new THREE.Object3D();
gltfLoader.load( './assets/tables/table_tennis_table/scene.gltf', function ( gltfScene ) {
	table.add(gltfScene.scene);


	// table.traverse((child) => {
    //     if (child.isMesh) {
    //         child.geometry.computeBoundingBox(); // Make sure the bounding box is up to date
            // const center = new THREE.Vector3();
            // child.geometry.boundingBox.getCenter(center);
            // child.geometry.center(); // Center the geometry

            // Adjust the position of the mesh so it remains in the same place after centering
            // child.position.copy(center);
    //     }
    // });
	
	table.receiveShadow = true;
	table.castShadow = true;
	

	// table.rotation.y = 0;
	// table.rotation.x = 0;
	// table.rotation.x = 0;
	
	// table.rotation.z = -0.5 ;
	// table.rotation.y = Math.PI / 2 ;
	// table.rotation.x = -1 ;
	// table.rotation.x = (11 * Math.PI / 6) + 0.143;
	// table.rotation.x = (7 * Math.PI / 6);	// 
	
	table.scale.set(7, 7, 7);
	
	const box = new THREE.Box3( ).setFromObject( table );
	console.log('box : ', box);
	
	const c = box.getCenter( new THREE.Vector3( ) );
	console.log('Center : ', c);
	
	const size = box.getSize( new THREE.Vector3( ) );
	console.log('size : ', size);

	// table.position.set( -c.x, (size.y / 2 + c.y) - 3.54, -c.z );
	table.position.set( 0, -10.5,0 );


	console.log('this is the obj : ', table);
	scene.add(table) ;
});

const ball = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshStandardMaterial({
	color : "orange",
	emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
	emissiveIntensity: 0.1, // Adjust the intensity as needed
	})
	);
	ball.position.set(0,0.5,1);
ball.castShadow = true;
ball.receiveShadow = true;

scene.add(ball);
scene.add(axesHelper);



let plane = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100),
	new THREE.MeshNormalMaterial({}));
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
plane.position.z = 6;
scene.add(plane);

const camera = new THREE.PerspectiveCamera(75, Width / Height, 0.1 , 2000);
camera.position.z = 100 ;
camera.position.y = 50;
camera.position.x = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer( {canvas ,antialias: true } );
renderer.setSize(Width, Height);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// renderer.toneMapping = THREE.NoToneMapping;



// const Spotlight = new THREE.SpotLight()
// Spotlight.position.set(ball.position.x, ball.position.y, ball.position.z);
// Spotlight.angle = Math.PI / 2
// Spotlight.penumbra = 0.5
// Spotlight.castShadow = true
// Spotlight.shadow.mapSize.width = 1024
// Spotlight.shadow.mapSize.height = 1024
// Spotlight.shadow.camera.near = 2.0
// Spotlight.shadow.camera.far = 75
// scene.add(Spotlight);

// let lightProbe = new THREE.LightProbe();
// lightProbe.visible = false;
// scene.add( lightProbe );

// const lightFolder = gui.addFolder('Lights');

gui.add(camera.position, "x",);
gui.add(camera.position, "y");
gui.add(camera.position, "z");
// gui.add(player, "visible").name("player");
gui.add(plane.material, "visible").name("plane");
// gui.add(player.material, "wireframe");
// lightFolder.add(AmbientLight, "visible").name("ambientLight");
// lightFolder.add(pointLight, "visible").name("pointtLight");
// lightFolder.add(lightProbe, "visible").name("LightProbe");
// lightFolder.add(directionalLight, "visible").name("directionalLight");
// lightFolder.add(drh, "visible").name("light Helper");






const controls = new OrbitControls( camera, renderer.domElement );
// const controls = new ArcballControls( camera, renderer.domElement, scene );

// controls.enableDamping = true;	
// controls.target.y = 0.5;

renderer.render(scene, camera);

window.addEventListener("resize", () => {
	Width = window.innerWidth * 0.80;
	Height = window.innerHeight * 0.80;
	camera.aspect = Width / Height;
	renderer.setSize(Width , Height);
	camera.updateProjectionMatrix();
});

let cursorx = 0;
let cursorz = 0;


window.addEventListener('mousemove', onMouseMove, false);



const keys = { 
	a: false, 
	d: false, 
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

	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// table.rotation.x += 0.1;
	// table.rotation.z += 0.1;
	// table.rotation.y += 0.05;

	// console.log("y : ", table.rotation.y);
	// let speed = (Math.sin(elapsedTime * 13 ) + 1.3);
	// ball.position.y = speed * 10;
	// ball.position.x = Math.sin(elapsedTime * 1.2) * 50;
	// ball.position.z = Math.sin(elapsedTime * 0.8) * 96;
	
	
	// Spotlight.position.set(player.position.x , player.position.y + 2, player.position.z + 2);
	// Spotlight.angle = Math.PI / ((Math.sin(elapsedTime * 2) + 2 ) * 4);

	// console.log("")
	controls.update();
	renderer.render( scene, camera );
	window.requestAnimationFrame(animate);
};

animate();



function onMouseMove(event) {

	const rect = canvas.getBoundingClientRect();
	// Normalize mouse coordinates
	mouse.x = ((event.clientX - rect.left) / Width) * 2 - 1;
	mouse.y = -((event.clientY - rect.top) / Height) * 2 + 1;

	// Update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// Calculate objects intersecting the picking ray
	let intersects = raycaster.intersectObject(plane);

	if (intersects.length > 0) {
		let intersect = intersects[0];
		if(200 >= intersect.point.x && intersect.point.x >= -200) player.position.x = intersect.point.x;
		if(200 >= intersect.point.z && intersect.point.z >= 0) player.position.z = intersect.point.z;
		if(intersect.point.x >= 200) player.position.x = 200;
		if(intersect.point.x <= -200) player.position.x = -200;
		if(intersect.point.z >= 200) player.position.z = 200;
		if(intersect.point.z <= 0) player.position.z = 0;

		// console.log("player x : " ,intersect.point.x);
		// console.log("player y : " ,player.position.y);
		// console.log("player z : " ,intersect.point.z);
	}
}