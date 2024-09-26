window.spaceShip = function () {
    const canvas = document.getElementById("spaceship");

    console.log(canvas);

    const gui = new dat.GUI();

    const loader = new THREE.GLTFLoader();

    const scene = new THREE.Scene();

    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    const axesHelper = new THREE.AxesHelper(width / 2);

    let helperBox;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);

    const renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true} );

    renderer.setSize(width, height);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 7);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    const stats = new Stats();

    stats.showPanel(1);

    document.body.appendChild(stats.dom);

    directionalLight.position.set(0, 1, 1);

    scene.add(light);

    scene.add(directionalLight);

    camera.position.set(2, 3, 10);

    const spaceShip = new THREE.Object3D();

    let ships = [];

    let Particles;

    loader.load('./assets/spaceShips/spaceship.glb', function (gltf) {
        // spaceShip = gltf.scene;
        ships.push(gltf.scene);
        // spaceShip.position.set(0, 0, 5);
        // scene.add(spaceShip);
        // console.log();
    });

    loader.load('./assets/spaceShips/namek_spaceship.glb', function (gltf) {

        spaceShip.scale.set(0.001, 0.001, 0.001);
        ships.push(gltf.scene);
    });

    loader.load('./assets/spaceShips/low_poly_spaceship.glb', function (gltf) {
        spaceShip.add(gltf.scene);
        // spaceShip.scale.set(0.5, 0.5, 0.5);
        ships.push(gltf.scene);
    });

    loader.load('./assets/spaceShips/toy_spaceship.glb', function (gltf) {
        spaceShip.scale.set(5, 5, 5);

        ships.push(gltf.scene);
    });

    function createSpaceShip() {
        // spaceShip.position.set(0, 0, 5);
        console.log(ships);
        scene.add(spaceShip);
    }

    const animateSpaceShip = function () {
        if (spaceShip) {
            // spaceShip.rotation.x += 0.01;
            spaceShip.rotation.y += 0.01;
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


        animateSpaceShip();
        animateHelperBox();
        animateParticles();
        controls.update();
        stats.update();
        camera.lookAt(helperBox.position);
        renderer.render(scene, camera);
    };

    createSpaceShip();
    createParticls();
    createBox();
    animate();
}

window.spaceShip();
