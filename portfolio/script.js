import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { cameraNear, color, LightsNode, metalness, normalMap, roughness, vertexColor } from "three/examples/jsm/nodes/Nodes.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let screenWidth, screenHeight;
let canvas, scene, camera, renderer, light;
let scrollY = 0;
let cursor = new THREE.Vector2();

let orbitControl;
let Particles;

function init() {
    
    canvas = document.getElementById("canvas");
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( {canvas, antialias : false} );
    renderer.setSize(screenWidth, screenHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);
    
    CreateCamera();
    lights();
    Controls();

    window.addEventListener("resize", () => {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight ;
        camera.aspect = screenWidth / screenHeight;
        renderer.setSize(screenWidth, screenHeight);
        camera.updateProjectionMatrix();
    });
    
    
    window.addEventListener("mousemove", (e) => {
        cursor.x = (e.clientX / screenWidth) * 2 - 1;
        cursor.y = -(e.clientY / screenHeight) * 2 + 1;
    });


    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
        console.log("scroll value : %f", scrollY / screenHeight)
    });
}


function Controls(){
    orbitControl = new OrbitControls(camera, renderer.domElement);
    orbitControl.enableDamping = true;
    // orbitControl.target.y = 0.5; 
    
}


function CreateCamera() {
    
    camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.1, 2000);
    camera.position.z = 5;
    camera.lookAt(0,0,0);
    scene.add(camera);
}





function animate() {

    Particles.rotation.x = -(scrollY / screenHeight) * 0.4;
    camera.position.x = (cursor.x * 0.5);
    camera.position.y = (cursor.y * 0.5);
    orbitControl.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}



function lights() {
    light = new THREE.PointLight(0xfff0dd, 1, 60);
    light.position.set(10, 10, 0);
    scene.add(light);
    
    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.2); // Color, intensity, and distance
    scene.add(AmbientLight);
}



function createObjects()
{
    const count = 5000;
    let positions = new Float32Array(count * 3);
    let colors = new Float32Array(count * 3);

    for (let index = 0; index < count * 3; index++) {
        positions[index] = (Math.random() - 0.5) * 10;
        colors[index] = Math.random();
    }

    const ParticleGeometry = new THREE.BufferGeometry();
    ParticleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ParticleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const ParticlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.additiveBlending,
            alphaMap : new THREE.TextureLoader().load('./assets/kenney_particle-pack/PNG (Transparent)/star_08.png'),
            
        });

    Particles = new THREE.Points(
        ParticleGeometry,
        ParticlesMaterial
    )
    scene.add(Particles);
}




init();
createObjects();
animate();