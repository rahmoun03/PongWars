window.spaceShip = function () {
    const canvas = document.getElementById("spaceship");

    console.log(canvas);

    const gui = new dat.GUI();

    const loader = new THREE.GLTFLoader();
    const fbxLoader = new THREE.FBXLoader();

    const scene = new THREE.Scene();

    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    const axesHelper = new THREE.AxesHelper(width / 2);

    let helperBox;

    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);

    const renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true} );

    renderer.setSize(width, height);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 6);

    const directionalLight = new THREE.DirectionalLight(0x00aaff, 1, 10);

    const stats = new Stats();

    stats.showPanel(0);

    document.body.appendChild(stats.dom);

    directionalLight.position.set(0, 20, 10);

    scene.add(light);

    // scene.add(directionalLight);

    camera.position.set(2, 0.4, 10);

    let spaceShip = new THREE.Object3D();

    let ships = [];

    let planet = new THREE.Object3D();
    let blackHole = new THREE.Object3D();

    let Particles;

    const modelUrls = [
        './assets/spaceShips/spaceship.glb',
        './assets/spaceShips/namek_spaceship.glb',
        './assets/spaceShips/spaceship_chair.glb',
        './assets/spaceShips/toy_spaceship.glb',
        './assets/spaceShips/bubblecraft_-_spaceship.glb',
        './assets/spaceShips/low_poly_spaceship.glb',
        './assets/spaceShips/stylised_spaceship.glb'
    ];
    
    let loadedModelsCount = 0;

    loader.load("./assets/spaceShips/stylised_spaceship.glb", function (gltf) {
        console.log("aaaaaaaaaaaa");
        planet.add(gltf.scene);
        planet.scale.set(6, 6, 6);
        // scene.add(planet);




    });

    
    fbxLoader.load("./assets/planets/black-hole/source/blackhole.fbx", function (gltf) {
        blackHole.add(gltf);
        blackHole.scale.set(0.0001, 0.0001, 0.0001);

        console.log("black hole", blackHole);
        scene.add(blackHole);

        // const box = new THREE.Box3().setFromObject(blackHole);

        // // Calculate the size of the bounding box
        // const sphere = new THREE.Sphere();
        // box.getBoundingSphere(sphere);

        // console.log('Bounding Sphere Center:', sphere.center);
        // console.log('Bounding Sphere Radius:', sphere.radius);

        // helperBox = new THREE.Mesh(
        //     new THREE.SphereGeometry(sphere.radius + 1, 32),
        //     new THREE.MeshBasicMaterial({color : "white"})
        // );
        // scene.add(helperBox);

    });

    
    modelUrls.forEach(url => {
        loader.load(url, function (gltf) {
            const object3D = new THREE.Object3D();
            object3D.add(gltf.scene);
            ships.push(object3D);
            
            loadedModelsCount++;
    
            // Check if all models are loaded
            if (loadedModelsCount === modelUrls.length) {
                // createSpaceShip();
            }
        },);
    });
    
    function createSpaceShip() {        // Randomly select one model from the ships array
        const randomIndex = Math.floor(Math.random() * ships.length);
        spaceShip = ships[randomIndex];
    
        // Optionally position the model
        spaceShip.position.set(0, 0, 0); // Adjust position as needed
    
        // Add the selected model to the scene
        scene.add(spaceShip);
        console.log('Added model:', spaceShip);
    }

    const animateSpaceShip = function (time) {
        if (spaceShip) {
            // spaceShip.rotation.x += 0.01;
            spaceShip.position.y = Math.cos(time) * 0.5;
        }
    };

    const animateHelperBox = function () {
        if (helperBox) {
            // helperBox.rotation.x += 0.01;
            helperBox.rotation.y += 0.01;
        }
    };

    function createBox() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        helperBox = new THREE.Mesh(geometry, material);
        helperBox.position.set(-5, 0, 0);
        helperBox.visible = false;
        scene.add(helperBox);
    }

    function createParticls() {
        const count = 50000;
        let positions = new Float32Array(count * 3);
        let colors = new Float32Array(count * 3);

        for (let index = 0; index < count * 3; index++) {
            positions[index] = (Math.random() - 0.5) * 100;
            colors[index] = Math.random();
        }

        const ParticleGeometry = new THREE.BufferGeometry();
        ParticleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        ParticleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const ParticlesMaterial = new THREE.PointsMaterial({
                size: 0.3,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                depthWrite: false,
                // blending: THREE.additiveBlending,
                alphaMap : new THREE.TextureLoader().load('./assets/kenney_particle-pack/PNG (Transparent)/star_06.png'),
            });

        Particles = new THREE.Points(
            ParticleGeometry,
            ParticlesMaterial
        )
        Particles.rotation.x = Math.PI / 2;
        scene.add(Particles);
    }

    function onWindowResize() {
        width = window.innerWidth * 0.8;
        height = window.innerHeight * 0.8;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', onWindowResize);

    function animateParticles() {
        if (Particles) {
            Particles.rotation.z += 0.001;
        }
    }



    const animate = function () {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // planet.rotation.x += 0.001;
        blackHole.rotation.y += 0.001;

        animateSpaceShip(elapsedTime);
        animateHelperBox();
        animateParticles();
        controls.update();
        stats.update();
        camera.lookAt(helperBox.position);
        renderer.render(scene, camera);
    };

    // createSpaceShip();
    createParticls();
    createBox();
    animate();
}

window.spaceShip();
