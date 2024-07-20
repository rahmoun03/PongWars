import { Camera } from 'three';
import { Projector, ThreeMFLoader, Wireframe } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { cameraNear, color, modelNormalMatrix, modelViewMatrix, normalMap, uv, varying, vec2 } from 'three/examples/jsm/nodes/Nodes.js';


// Create the renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);




const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5);

const earthgroup = new THREE.Group();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01 , 3000);
camera.position.z = 25;
camera.position.y = 12;



const background = new THREE.TextureLoader().load('sular_system/bg.jpg');
scene.background = background;
scene.environment = background;




// blackhole 
const blackhole = new THREE.Group();
const circle = new THREE.Mesh(
    new THREE.RingGeometry(100, 300, 64),
    new THREE.MeshBasicMaterial({
        color : "white",
        side : THREE.DoubleSide
    })
);
circle.rotation.x = Math.PI / 2;



const blackpoint = new THREE.Mesh(
    new THREE.SphereGeometry(100, 64, 64),
    new THREE.MeshBasicMaterial({
        color : "black",
        opacity : 1
        // side : THREE.DoubleSide
    })
);

blackhole.add(circle, blackpoint);
scene.add(blackhole);






// Add a light source to the scene
const pointLight = new THREE.PointLight(0xffffff, 2.5, 1000); // Color, intensity, and distance
pointLight.position.set(0, 0, 0); // Position at the sun
pointLight.castShadow = true;
scene.add(pointLight);


//1

// Vertex shader
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;


const fragmentShader = `
    precision highp float;
    uniform float time;
    uniform sampler2D text;
    varying vec2 vUv;

    void main() {
        vec4 texel = texture(text, vUv);
        float glow = sin(time * 1.0) * 0.5 + 0.5;
        texel.rgb += glow * 0.5;
        gl_FragColor = texel;
    }
`;


// Uniforms
const uniforms = {
    time: { value: 0.0 },
    texture: { value: new THREE.TextureLoader().load('sular_system/sun.jpg') }
};

// Sun material with shaders
const sunMaterial = new THREE.MeshBasicMaterial({
    map : new THREE.TextureLoader().load('sular_system/sun.jpg') 
});

// Sun mesh
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 64),
    sunMaterial
);  

// sun.castShadow = true;


//2
const makemakeTexture = new THREE.TextureLoader().load('sular_system/makemake.jpg');
const makemake = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 64, 64),
    new THREE.MeshStandardMaterial({
        map : makemakeTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
    })
);

makemake.castShadow = true;
makemake.receiveShadow = true;

//3
const venusTexture = new THREE.TextureLoader().load('sular_system/venus.jpg');
const venus = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 64, 64),
    new THREE.MeshStandardMaterial({
        map : venusTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
        })
);
venus.castShadow = true;
venus.receiveShadow = true;


//4
const earthTexture = new THREE.TextureLoader().load('sular_system/earth.jpg');
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 64, 64),
    new THREE.MeshStandardMaterial({
        map : earthTexture,
        // normalMap : new THREE.TextureLoader().load('earth_normal.tif'),
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
    })
);
earth.castShadow = true;
earth.receiveShadow = true;

//5
const moonTexture = new THREE.TextureLoader().load('sular_system/moon.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 64, 64),
    new THREE.MeshStandardMaterial({
        map : moonTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
    })
);
moon.castShadow = true;
moon.receiveShadow = true;

//6
const marsTexture = new THREE.TextureLoader().load('sular_system/mars.jpg');
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 64, 64),
    new THREE.MeshStandardMaterial({
        map : marsTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
    })
    );
mars.castShadow = true;
mars.receiveShadow = true;

//7
const jupiterTexture = new THREE.TextureLoader().load('sular_system/jupiter.jpg');
const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
        map : jupiterTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
        })
);
jupiter.castShadow = true;
jupiter.receiveShadow = true;

//8
const saturnTexture = new THREE.TextureLoader().load('sular_system/saturn.jpg');
const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 64, 64),
    new THREE.MeshStandardMaterial({
        map : saturnTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
        })
);
saturn.receiveShadow = true;
saturn.castShadow = true;

const saturnRing = new THREE.Mesh(
    new THREE.RingGeometry(1.1, 1.15, 64),
    new THREE.MeshBasicMaterial({
        color : "white",
        side : THREE.DoubleSide
    })
);
saturnRing.rotation.x = Math.PI / 2;
scene.add(saturnRing);

//9
const uranusTexture = new THREE.TextureLoader().load('sular_system/uranus.jpg');
const uranus = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 64, 64),
    new THREE.MeshStandardMaterial({
        map : uranusTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
        })
);
uranus.castShadow = true;
uranus.receiveShadow = true;

//10
const neptuneTexture = new THREE.TextureLoader().load('sular_system/neptune.jpg');
const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 64, 64),
    new THREE.MeshStandardMaterial({
        map : neptuneTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
        })
);
neptune.castShadow = true;
neptune.receiveShadow = true;

//11
const plutoTexture = new THREE.TextureLoader().load('sular_system/pluto.jpg');
const pluto = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 64, 64),
    new THREE.MeshStandardMaterial({
        map : plutoTexture,
        emissive: new THREE.Color(0xffffff), // Add emissive light to make it appear brighter
        emissiveIntensity: 0.01, // Adjust the intensity as needed
        })
);
pluto.castShadow = true;
pluto.receiveShadow = true;

earthgroup.add(moon, earth);
scene.add(camera, sun, earthgroup, makemake, venus, mars, jupiter, saturn, uranus, neptune, pluto);


camera.lookAt(sun);
renderer.render(scene, camera);


const controls = new OrbitControls( camera, renderer.domElement );

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth , window.innerHeight);
	camera.updateProjectionMatrix();
});

let cursorx = 0;
let cursory = 0;

window.addEventListener("mousemove", (event) => {
    cursorx = event.clientX / window.innerWidth - 0.5;
    cursory = event.clientY / window.innerHeight - 0.5;
});


const clock = new THREE.Clock();

function animate()
{
    const elapsedTime = clock.getElapsedTime();


    // sunMaterial.uniforms.time.value = elapsedTime;

    makemake.position.x = Math.cos(elapsedTime * 0.1) * 5;
    makemake.position.z = Math.sin(elapsedTime * 0.1) * 5;
    makemake.rotation.y = elapsedTime * 0.5;
    
    venus.position.x = Math.cos(elapsedTime * 0.13) * 7;
    venus.position.z = Math.sin(elapsedTime * 0.13) * 7;
    venus.rotation.y = elapsedTime * 0.5;
    
    earth.position.x = Math.cos(elapsedTime * 0.15) * 10.8;
    earth.position.z = Math.sin(elapsedTime * 0.15) * 10.8;
    earth.rotation.y = elapsedTime * 0.5;

    mars.position.x = Math.cos(elapsedTime * 0.11) * 13.8;
    mars.position.z = Math.sin(elapsedTime * 0.11) * 13.8;
    mars.rotation.y = elapsedTime * 0.5;

    jupiter.position.x = Math.cos(elapsedTime * 0.16) * 15;
    jupiter.position.z = Math.sin(elapsedTime * 0.16) * 15;
    jupiter.rotation.y = elapsedTime * 0.5;
    
    saturn.position.x = Math.cos(elapsedTime * 0.14) * 17.5;
    saturn.position.z = Math.sin(elapsedTime * 0.14) * 17.5;
    saturn.rotation.y = elapsedTime * 0.5;
    saturnRing.position.x = saturn.position.x;
    saturnRing.position.y = saturn.position.y;
    saturnRing.position.z = saturn.position.z;



    uranus.position.x = Math.cos(elapsedTime * 0.13) * 19.5;
    uranus.position.z = Math.sin(elapsedTime * 0.13) * 19.5;
    uranus.rotation.y = elapsedTime * 0.5;

    neptune.position.x = Math.cos(elapsedTime * 0.2) * 21;
    neptune.position.z = Math.sin(elapsedTime * 0.2) * 21;
    neptune.rotation.y = elapsedTime * 0.5;

    pluto.position.x = Math.cos(elapsedTime * 0.17) * 22.4;
    pluto.position.z = Math.sin(elapsedTime * 0.17) * 22.4;
    pluto.rotation.y = elapsedTime * 0.5;

    moon.position.x = earth.position.x + Math.cos(elapsedTime * 1) * 1.8;
    moon.position.z = earth.position.z + Math.sin(elapsedTime * 1) * 1.8;
    moon.position.y = earth.position.y; 
    
    sun.rotation.y = elapsedTime * 0.5;

    // camera.position.x = cursorx * 10;
    // camera.position.y = cursory * 10;

    controls.update();
    renderer.render( scene, camera );
    window.requestAnimationFrame(animate);
};
animate();