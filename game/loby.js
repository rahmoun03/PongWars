import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import Stats from 'three/addons/libs/stats.module.js';
// import { rendererReference } from 'three/webgpu';


const canvas = document.getElementById("Mycanvas");

const gui = new dat.GUI();

const loader = new GLTFLoader();

const scene = new THREE.Scene();

let width = window.innerWidth * 0.8;
let height = window.innerHeight * 0.8;

const axesHelper = new THREE.AxesHelper(width / 2);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);

const renderer = new THREE.WebGLRenderer( {canvas, antialias: true} );

let controls;

const background = new THREE.Object3D();

const player = new THREE.Object3D();
let clips, mixer, grid, plane, idleAction;

const materials = [];

let clock = new THREE.Clock()
// stats
const stats = new Stats();



window.addEventListener("resize", () => {
    width = window.innerWidth * 0.8;
    height = window.innerHeight * 0.8;
    camera.aspect = width / height;
    renderer.setSize(width , height);
    camera.updateProjectionMatrix();
});


/*************  start code  *************/
init();
lights();
setBackground();
setPlayer();
animate();
guiControl();
/*****************************************/





/*--------------  functions  -------------*/
function init() {
    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(3, 10, 20);
    scene.background = new THREE.Color( 0xa0a0a9 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 10, 80 );
    grid = new THREE.GridHelper( 1000, 100, 0x000000, 0x000000 );
    grid.material.opacity = 1;
    grid.material.transparent = true;
    scene.add( grid );
    
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( stats.dom );
    
    scene.add(camera, axesHelper);
}

function guiControl(){
    gui.add(camera.position, "x",);
    gui.add(camera.position, "y");  
    gui.add(camera.position, "z");
    gui.add(grid, "visible").name("grid");
    gui.add(plane, "visible").name("plane");
    gui.add(axesHelper, "visible").name("helper");

    // const animationFolder = gui.addFolder('Animation');
    // animationFolder.add(idleAction, 'timeScale', 0, 2).name('Speed');
    // animationFolder.add({ play: () => idleAction.play() }, 'play').name('Play');
    // animationFolder.add({ stop: () => idleAction.stop() }, 'stop').name('Stop');
    // animationFolder.open();

    // materials.forEach((material, index) => {
    //     const materialFolder = gui.addFolder(`Material ${index + 1}`);
    //     materialFolder.addColor({ color: `#${material.color.getHexString()}` }, 'color')
    //       .name('Color')
    //       .onChange((value) => material.color.set(value));
    //     materialFolder.add(material, 'skinning').name('Skinning').onChange(() => {
    //       material.needsUpdate = true;
    //     });
    //     materialFolder.open();
    //   });
    
      const visibilityFolder = gui.addFolder('Visibility');
      visibilityFolder.add(model, 'visible').name('Model Visible');
      visibilityFolder.open();
}

function setPlayer() {
    loader.load( './assets/player/Astronaut2.glb', function ( gltfScene ) {
        const action = "CharacterArmature|Walk";
        player.add(gltfScene.scene);
        console.log("player : ", gltfScene.animations); 
        
        // player.scale.set(1, 1, 1);
        // player.position.set(0, 1, 0);

        // player.rotation.y = 0.1;

    
        player.traverse((child) => {
            console.log("child : ", child.name);
            if (child.isMesh) {
                child.material.skinning = true;
                child.castShadow = true;
                materials.push(child.material);
            }
                // child.receiveShadow = true;
        });
        // console.log("", player.getObjectByName("Cube"));
        // player.getObjectByName("Cube").clipShadows = true;
        // player.getObjectByName("Cube").alphaToCoverage = true;
        // player.getObjectByName("BarbaraTheBee").material.color.set("red");

        // player.castShadow = true;
        
        // animation 
        clips = gltfScene.animations;
        if(clips.lenght === 0)
            window.alert("no animation founded in this model !");
        else
        {
            
            mixer = new THREE.AnimationMixer(player);
            const idleClip = THREE.AnimationClip.findByName(clips, action);
            
            
            if (idleClip) {
                console.log("idleClip : ", idleClip);
                idleAction = mixer.clipAction(idleClip);
                console.log("idle Action : ", idleAction);
                idleAction.play();

                const animationFolder = gui.addFolder('Animation');
                animationFolder.add(idleAction, 'timeScale', 0, 2).name('Speed');
                animationFolder.add({ play: () => idleAction.play() }, 'play').name('Play');
                animationFolder.add({ stop: () => idleAction.stop() }, 'stop').name('Stop');
                animationFolder.open();

                materials.forEach((material, index) => {
                    const materialFolder = gui.addFolder(`Material ${index + 1}`);
                    materialFolder.addColor({ color: `#${material.color.getHexString()}` }, 'color')
                    .name('Color')
                    .onChange((value) => material.color.set(value));
                    materialFolder.add(material, 'skinning').name('Skinning').onChange(() => {
                    material.needsUpdate = true;
                    });
                    materialFolder.open();
                });
            } else {
                window.alert("no idle Action founded with this name ", action ," !.");
            }
        }
        console.log("modele : ", player);
        scene.add(player);
    });
    
}

function setBackground() {
    // loader.load( './assets/land/sky_land/scene.gltf', function ( gltfScene ) {
        
    //     background.add(gltfScene.scene);
        
    //     background.scale.set(14,14,14);
    //     background.position.set(-3, -130.3, -40);
    //     background.rotation.y = 0.43;

    //     background.traverse((child) => {
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     });

    //     scene.add(background);
    // });

    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshPhongMaterial( { color: "brown"} )
    );
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
}

function lights()
{
    // const ambientLight = new THREE.AmbientLight("white", 0.5);
    // scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("fdfbd3", 1);
    directionalLight.position.set(-0.5, 20, 10.5);
    
    // directionalLight.shadow.mapSize.width = 512; // default
    // directionalLight.shadow.mapSize.height = 512; // default
    // directionalLight.shadow.camera.near = 0.5; // default
    // directionalLight.shadow.camera.far = 500;
    // directionalLight.intensity = 1.2;
    // directionalLight.angle = 0.45;
    // directionalLight.penumbra = 0.3;
    
    directionalLight.castShadow = true;

    scene.add(directionalLight);
    
    // const hemiLight = new THREE.HemisphereLight( "#fdfbd3", 0x8d8d8d, 0.8);
    // hemiLight.position.set( 0, 20, 0 );
    // hemiLight.castShadow = true;
    // scene.add( hemiLight );
}

function animate () 
{

    window.requestAnimationFrame(animate);
    if(mixer)
        mixer.update(clock.getDelta());

    camera.lookAt(player.position.x, player.position.y + 6, player.position.z);
    controls.update();
	renderer.render( scene, camera );
}
/*****************************************/
