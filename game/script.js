// Mesh

import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { cameraNear, color, normalMap, roughness } from 'three/examples/jsm/nodes/Nodes.js';
import * as dat from 'lil-gui';
import { DirectionalLight } from 'three';
import { DirectionalLightHelper } from 'three';


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
const AmbientLight = new THREE.AmbientLight(0xfcffb5, 0.5); // Color, intensity, and distance
scene.add(AmbientLight);



/* point light*/
const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);// Color, intensity, and distance
const pointLight1 = new THREE.PointLight(0xffee50, 2.5, 1000); // Color, intensity, and distance
const pointLight2 = new THREE.PointLight(0xffffff, 2.5, 1000); // Color, intensity, and distance 
pointLight.position.set(-100, 300, -200); // 
pointLight1.position.set(100, 300, -100); // 
pointLight2.position.set(30, 300, 100); // 
pointLight.castShadow = true;
scene.add(pointLight);


/* directional light*/
const directionalLight = new THREE.DirectionalLight(0xffee50);
directionalLight.position.x = -0.5;
directionalLight.position.y = 1;
directionalLight.position.z = -0.5;
// scene.add(directionalLight);
const drh = new THREE.DirectionalLightHelper(directionalLight, 20);
scene.add(drh);




let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

// let texture = ([
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/px.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/nx.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/py.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/ny.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/pz.png'), side : THREE.BackSide}),
// 	new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('./CubeMap/nz.png'), side : THREE.BackSide})
// 	]);
// 	const ground = new THREE.Mesh(
// 		new THREE.BoxGeometry(100000,100000,100000),
// 		texture
// 	);
	
	
	
	const groundTexture = new THREE.TextureLoader().load("ground1.jpg");
	groundTexture.repeat.x = 16;
	groundTexture.repeat.y = 16;
	groundTexture.wrapS = THREE.repearWrapping;
	groundTexture.wrapT = THREE.repearWrapping;
	const ground = new THREE.Mesh(
		new THREE.PlaneGeometry(1000,1000,1000),
		new THREE.MeshStandardMaterial({map : groundTexture})
	);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -10;
	ground.receiveShadow = true;
	// scene.add(ground);



	let score = new THREE.Mesh(
		new THREE.TextGeometry("0 - 0"),
		new THREE.MeshNormalMaterial()
	);

	scene.add(score);


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
// scene.add(axesHelper);

const player = new THREE.Mesh(
	new THREE.BoxGeometry(20 , 10 , 2),
	new THREE.MeshNormalMaterial({
		// color : "cyan",
		// emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        // emissiveIntensity: 0.1, // Adjust the intensity as needed
}));
player.material.flatShading = true;
player.position.x = 0;
player.position.y = 12;
player.position.z = 97;
player.castShadow = true;
player.receiveShadow = true;



let plane = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000),
	new THREE.MeshBasicMaterial({visible : false}));
plane.rotation.x = -Math.PI / 2;
plane.position.y = 7;
plane.position.z = 60;
scene.add(plane);


// player.castShadow = true;
// player.receiveShadow = true;
scene.add(player);

// max is 174


const Theight = new THREE.TextureLoader().load("./tableAssets/Terrazzo_003_height.jpg");
const Tnormal = new THREE.TextureLoader().load("./tableAssets/Terrazzo_003_normal.jpg");
const Troughness = new THREE.TextureLoader().load("./tableAssets/Terrazzo_003_roughness.jpg");
const TambientOcclusion = new THREE.TextureLoader().load("./tableAssets/Terrazzo_003_ambientOcclusion.jpg");
const Tcolor = new THREE.TextureLoader().load("./tableAssets/Terrazzo_003_basecolor.jpg");
// const Tcolor = new THREE.TextureLoader().load("./tableAssets/table.jpg");

const Zlijheight = new THREE.TextureLoader().load("./tableAssets/Zlij/Tiles101_1K-JPG_Displacement.jpg");
const Zlijnormal = new THREE.TextureLoader().load("./tableAssets/Zlij/Tiles101_1K-JPG_NormalGL.jpg");
const Zlijroughness = new THREE.TextureLoader().load("./tableAssets/Zlij/Tiles101_1K-JPG_Roughness.jpg");
const ZlijambientOcclusion = new THREE.TextureLoader().load("./tableAssets/Zlij/Tiles101_1K-JPG_AmbientOcclusion.jpg");
const Zlijcolor = new THREE.TextureLoader().load("./tableAssets/Zlij/Tiles101_1K-JPG_Color.jpg");

Zlijcolor.repeat.x = 2;
Zlijcolor.repeat.y = 2;
Zlijcolor.wrapS = THREE.repearWrapping;
Zlijcolor.wrapT = THREE.repearWrapping;

Zlijheight.repeat.x = 2;
Zlijheight.repeat.y = 2;
Zlijheight.wrapS = THREE.repearWrapping;
Zlijheight.wrapT = THREE.repearWrapping;

Zlijroughness.repeat.x = 2;
Zlijroughness.repeat.y = 2;
Zlijroughness.wrapS = THREE.repearWrapping;
Zlijroughness.wrapT = THREE.repearWrapping;

ZlijambientOcclusion.repeat.x = 2;
ZlijambientOcclusion.repeat.y = 2;
ZlijambientOcclusion.wrapS = THREE.repearWrapping;
ZlijambientOcclusion.wrapT = THREE.repearWrapping;

Zlijnormal.repeat.x = 2;
Zlijnormal.repeat.y = 2;
Zlijnormal.wrapS = THREE.repearWrapping;
Zlijnormal.wrapT = THREE.repearWrapping;

// const sunMaterial = new THREE.MeshBasicMaterial({
//     map : new THREE.TextureLoader().load('sun.jpg') 
// });

// Sun mesh
// const sun = new THREE.Mesh(
//     new THREE.SphereGeometry(100, 64, 64),
//     sunMaterial
// );

// sun.position.copy(pointLight.position);
// scene.add(sun);

const table = new THREE.Mesh(
	new THREE.BoxGeometry(140 , 2 , 200),
	new THREE.MeshStandardMaterial({
		// color : "blue",
		map : Zlijcolor,
		aoMap : ZlijambientOcclusion,
		aoMapIntensity : 1,
		displacmentMap: Zlijheight,
		// metalness : 0,
		// envMap: sunMaterial.map,
		// emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        // emissiveIntensity: 0.1, // Adjust the intensity as needed
		normalMap : Zlijnormal,
		roughness : 0.15,
		roughnessMap : Zlijroughness
		}));
		// table.geometry.setAttribute(
		// 	"uv2",
		// 	new THREE.BufferAttribute(table.geometry.attributes.uv.array, 2)
		// );
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
		
		const camera = new THREE.PerspectiveCamera(75, Width / Height, 0.1 , 2000);
		camera.position.z = 140;
		camera.position.y = 70;
		// camera.position.x = 0;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		scene.add(camera);
		
		const renderer = new THREE.WebGLRenderer( {canvas ,antialias: true } );
		renderer.setSize(Width, Height);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.shadowMap.enabled = true;
		document.body.appendChild(renderer.domElement);

		renderer.toneMapping = THREE.NoToneMapping;

		
		
		const Spotlight = new THREE.SpotLight()
		Spotlight.position.set(ball.position.x, ball.position.y, ball.position.z);
		// Spotlight.angle = Math.PI / 2
		Spotlight.penumbra = 0.5
		Spotlight.castShadow = true
		Spotlight.shadow.mapSize.width = 1024
		Spotlight.shadow.mapSize.height = 1024
		Spotlight.shadow.camera.near = 2.0
		Spotlight.shadow.camera.far = 75
		// scene.add(Spotlight);

		let lightProbe = new THREE.LightProbe();
		lightProbe.visible = false;
		scene.add( lightProbe );

const lightFolder = gui.addFolder('Lights');

gui.add(camera.position, "x",);
gui.add(camera.position, "y");
gui.add(camera.position, "z");
gui.add(player, "visible").name("player");
gui.add(plane.material, "visible").name("plane");
gui.add(player.material, "wireframe");
lightFolder.add(AmbientLight, "visible").name("ambientLight");
lightFolder.add(pointLight, "visible").name("pointtLight");
lightFolder.add(lightProbe, "visible").name("LightProbe");
lightFolder.add(directionalLight, "visible").name("directionalLight");
lightFolder.add(drh, "visible").name("light Helper");






// const controls = new OrbitControls( camera, renderer.domElement );
const controls = new ArcballControls( camera, renderer.domElement, scene );

controls.enableDamping = true;	
controls.target.y = 0.5;

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

// window.addEventListener("mousemove", (event) => {
//     cursorx = (camera.position.z * (event.clientX / Width) * (75 * (Math.PI / 180))) - 140;
//     cursorz = (camera.position.z * (event.clientY / Height) * (75 * (Math.PI / 180))) - Height;

	// Convert screen coordinates to normalized device coordinates (-1 to +1)
	// const mouse = new THREE.Vector2(
	// 	(event.clientX / Width) * 2 - 1,
	// 	-(event.clientY / Height) * 2 + 1
	//   );

	//   // Convert normalized device coordinates to 3D coordinates
	//   const vector = new THREE.Vector3(mouse.x, mouse.y, player.position.z).unproject(camera);

	//   // Update the cube's position
	//   player.position.set(vector.x, vector.y, 0);
// });

window.addEventListener('mousemove', onMouseMove, false);



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


	// if (keys.ArrowLeft && player.position.x >= -200) player.position.x -= 2.5;
	// if (keys.ArrowRight && player.position.x <= 200) player.position.x += 2.5;
	// if(player.position.x < -30 ) camera.position.x = player.position.x  / 4;
	// else if(player.position.x > 30 ) camera.position.x = player.position.x / 4;
	// else camera.position.x = 0;

	// camera.position.x = ball.position.x / 3;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	
	let speed = (Math.sin(elapsedTime * 13 ) + 1.3);
	ball.position.y = speed * 10;
	ball.position.x = Math.sin(elapsedTime * 1.2) * 50;
	ball.position.z = Math.sin(elapsedTime * 0.8) * 96;
	
	
	Spotlight.position.set(player.position.x , player.position.y + 2, player.position.z + 2);
	Spotlight.angle = Math.PI / ((Math.sin(elapsedTime * 2) + 2 ) * 4);
	// console.log((Math.sin(elapsedTime) + 2 ) * 3);

	// console.log("scene x : " + cursorx);
	// console.log("window x : " , Width);
	// console.log("window y : " , Height);

	// console.log("camera z = ", camera.position.z);
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