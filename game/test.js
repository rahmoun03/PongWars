import { pointUV } from 'three/examples/jsm/nodes/Nodes.js';
import {getParticleSystem} from './get_particles.js'
window.test = function () {
    const canvas = document.getElementById("Mycanvas");

    // const gui = new dat.GUI();
    let mixer;

    const loader = new THREE.FBXLoader();

    const scene = new THREE.Scene();

    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    const axesHelper = new THREE.AxesHelper(width / 2);
    scene.add(axesHelper);

    let ball = new THREE.Object3D();
    let particleSystem;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 10, 10);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer( {canvas, antialias: true} );

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    const grid = new THREE.GridHelper( 1000, 1000, 0xaaaaaa, 0xaaaaaa );
    grid.material.opacity = 1;
    grid.material.transparent = true;
    grid.position.y = 0;
    scene.add( grid );
    

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);


    const directionalLight = new THREE.DirectionalLight(0xfdfbd3, 10, 800);
    directionalLight.position.set(0, 500, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);



    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshNormalMaterial({})
    );
    // scene.add(cube);



    loader.load('assets/ball/fireballvfx.fbx' , (gltf) => {

        ball = gltf;
        console.log("3D : ", ball);

        ball.scale.set(0.005, 0.005, 0.005);
        scene.add(ball);
        
        // Create an AnimationMixer, and get the list of AnimationClip instances
        mixer = new THREE.AnimationMixer( ball );
        const clips = gltf.animations;
        
        console.log("animation", clips);
        
        // Play a specific animation
        // const clip = THREE.AnimationClip.findByName( clips, 'dance' );
        const action = mixer.clipAction( clips[0] );
        action.play();
        
        // clips.forEach( function ( clip ) {
            //     console.log("play animation!");
            //     mixer.clipAction( clip ).play();
            // } );
    });

        


    function boundries(){
        const boundaryUp = new THREE.Mesh(
            new THREE.BoxGeometry(10, 3, 1),
            new THREE.MeshNormalMaterial({})
        );
        boundaryUp.position.set(0, 0, -11);


        const boundaryDown = new THREE.Mesh(
            new THREE.BoxGeometry(10, 3, 1),
            new THREE.MeshNormalMaterial({})
        );
        boundaryDown.position.set(0, 0, 11);
        
        scene.add(boundaryDown, boundaryUp);

    }


    const VfxTest = getParticleSystem({
        camera,
        emitter: ball,
        parent: scene,
        rate: 10,
        texture: './assets/kenney_particle-pack/PNG (Transparent)/star_09.png'
    });
    const Points = scene.getChildByName("Points");
    Points.visible = false;

    function createParticles(position) {
        Points.position.copy(position);
        Points.visible = true;
        // Remove particles after a short duration
        setTimeout(() => {
            Points.visible = false;
        }, 500);
    }
    console.log("scene", Points);
    const velocity = new THREE.Vector3(0, 0, 0.2);


    const clock = new THREE.Clock();

    function animate()
    {
        window.requestAnimationFrame(animate);
        if (mixer) mixer.update(clock.getDelta());


        ball.position.add(velocity);

        if(ball.position.z <= -10)
        {
            velocity.z = -velocity.z;
            createParticles(ball.position);

        }
        else if(ball.position.z >= 10)
        {
            velocity.z = -velocity.z;
            createParticles(ball.position.add(new THREE.Vector3(0, 0, -0.5)));
        }
        VfxTest.update(0.016);
        renderer.render(scene, camera);
        controls.update();
    }
    boundries();
    animate();

}