import { render  } from "./render.js";
import { GameOver } from "./gameOver.js";


function gameCanvas() {
    const canvas = document.createElement('canvas');
    
    return canvas;
}

function createcountdown() {
    const countdown = document.createElement('div');
    countdown.classList.add('countdown');
    countdown.style.display = 'none';

    return countdown;
}



export function ai_mode()
{

    const style = document.createElement('style');
    style.textContent = `
        .pongCanvas canvas {
            background-color: transparent;
            display: block;
            width: 100%;
            height: 100%;
        }
        .pongCanvas .countdown {
            color: var(--red);
            text-shadow: 2px 0 white, -2px 0 white, 0 2px white, 0 -2px white,
                1px 1px white, -1px -1px white, 1px -1px white, -1px 1px white;
            position: absolute;
            top: 0;
            left: 0;
            text-align: center;
            place-content: center;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 0, 0, 0);
        }
        .pongCanvas {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
        }





        .controls-container {
            position: fixed;
            bottom: 8%;
            left: 0;
            right: 0;
            justify-content: space-between;
            padding: 20px 40px;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
            z-index: 1000;
        }

        .control-btn {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid #00f7ff;
            background: linear-gradient(135deg, #2b0150, #000428);
            box-shadow: 0 0 20px #00f7ff,
                        inset 0 0 15px rgba(0, 247, 255, 0.5);
            cursor: pointer;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            -webkit-tap-highlight-color: transparent;
        }

        .control-btn::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 247, 255, 0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .control-btn:active::before {
            opacity: 1;
        }
        .control-btn:active {
            transform: scale(0.92);
            box-shadow: 0 0 30px #00f7ff,
                        inset 0 0 20px rgba(0, 247, 255, 0.7);
        }   

        .arrow {
            color: #00f7ff;
            font-size: 3rem;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            user-select: none;
            animation: pulse 2s infinite;
            filter: drop-shadow(0 0 5px #00f7ff);
        }


        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
      
        .controls-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                to bottom,
                transparent 50%,
                rgba(0, 0, 0, 0.1) 50%
            );
            background-size: 100% 4px;
            pointer-events: none;
            z-index: -1;
        }
    `;

    const controlButtons = document.createElement('div');
    controlButtons.className = 'controls-container';
    controlButtons.innerHTML = `
        <button class="control-btn left">
            <div class="arrow">←</div>
        </button>
        <button class="control-btn right">
            <div class="arrow">→</div>
        </button>
    `;
    const leftBtn = controlButtons.querySelector('.control-btn.left');
    const rightBtn = controlButtons.querySelector('.control-btn.right');





    // Mouse events
    leftBtn.addEventListener('mousedown', () => handleMoveStart('left'));
    rightBtn.addEventListener('mousedown', () => handleMoveStart('right')); 

    document.addEventListener('touchend', handleMoveEnd);
    document.addEventListener('mouseup', handleMoveEnd);


    const gamePage = document.body.querySelector('game-pong');

    const countdownElement = createcountdown();

    const pongCanvas = document.createElement('div');
    const canvas = gameCanvas();

    pongCanvas.classList.add('pongCanvas');
    pongCanvas.appendChild(style);
    pongCanvas.appendChild(canvas);
    pongCanvas.appendChild(countdownElement);
    pongCanvas.appendChild(controlButtons)
    
    const ai_URL = 'wss://'+window.location.host+'/ws/ai/';
    let wsOpen = false;
    const selectedMode = "AI MODE";
    let ball_config, ball;
    let plane, paddle, score, animationId, table_config, leftWall, rightWall, scoreManager;
    let playerDirection = 0;
    let player1 , player2;
    let renderer, controls;
    
    
    const TableG = new THREE.Group();
    const FontLoader = new THREE.FontLoader();
    
    let tableWidth, tableHeight;
    // Enhanced scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000011, 0.0025);
    // scene.background = new THREE.Color(0x000011);


    const spotLight = new THREE.SpotLight(0xffffff, 0.2);
    spotLight.position.set(0, 100, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    render(pongCanvas, gamePage.shadowRoot.querySelector('.game-pong'));

    let width = canvas.clientWidth ;
    let height = canvas.clientHeight ;

    console.log("sizes : ", canvas.clientWidth, canvas.clientHeight);
    
    

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 15, 35);
    scene.add(camera);


    renderer = new THREE.WebGLRenderer( {canvas, antialias: true} );
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    pongCanvas.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    resizeCanvas();


    // Particle system for background
    function createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        for (let i = 0; i < 5000; i++) {
            vertices.push(
                Math.random() * 500 - 250,
                Math.random() * 500 - 250,
                Math.random() * 500 - 250
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            depthWrite: false,
            alphaMap : new THREE.TextureLoader().load('/app/pong/assets/kenney_particle-pack/PNG (Transparent)/star_06.png'),
        });

        return new THREE.Points(geometry, material);
    }
    
    const starfield = createStarfield();
    scene.add(starfield);
    
    
    const socket = new WebSocket(ai_URL);
    // Handle WebSocket events
    socket.onopen = () => {
        wsOpen = true;
        console.log("Connected to the WebSocket!");
        socket.send(JSON.stringify({
            type: "countdown",
			width: width,
			height: height
        }));
    };
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "start") {

            table_config = data.table;
            paddle = data.paddle;
            ball_config = data.ball;
            score = data.score;

            table();
            ballCreation();
            playerCreation();
            scoreManager = new ScoreManager(scene);

            startCountdown(3, () => {
                animate();
                socket.send(JSON.stringify({
                    type: "start_game",
                }));
                console.log("sending start_game");
            });
        }
        if (data.type === "update") {
            player1.position.x = data.player1.x;
            player2.position.x = data.player2.x;
            ball.position.x = data.ball.x;
            ball.position.z = data.ball.z;
            score = data.score;
        }

        if (data.type === "goal") {
            player1.position.x = data.player1.x;
            player2.position.x = data.player2.x;
            ball.position.x = data.ball.x;
            ball.position.z = data.ball.z;
            score = data.score;

            shakeCamera();
            scoreManager.addPoint(score);
        }
        if (data.type === "game_over") {
            gameOver(data.winner, data.score);
            scoreManager.reset();
        }
    };
    socket.onclose = () => {
        wsOpen = false;
        console.log("WebSocket closed!");
    };
    socket.onerror = () => {
        wsOpen = false;
        console.log("Connection Error for WebSocket!");
    }



    document.addEventListener("keydown", movePaddle);
    document.addEventListener("keyup", stopPaddle);
    function movePaddle(e)
    {
        console.log("move paddle", e.key);
        if(e.key === 'ArrowLeft') playerDirection = -1;
        if(e.key === 'ArrowRight') playerDirection = 1;
    }
    function stopPaddle(e)
    {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight")
            playerDirection = 0;
    }


    // Touch events
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleMoveStart('left');
    });
  
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleMoveStart('right');
    });

    function handleMoveStart(dir) {
        if(dir === 'left')
            playerDirection = -1;
        if(dir === 'right')
            playerDirection = 1;
    }
  
    function handleMoveEnd() {
        playerDirection = 0;
        console.log('Stopped moving');
    }












    function adjustCameraPosition(camera, aspect) {
        let targetZ = (aspect < 1) ? 35 * (1 / aspect) : 35;
        let targetY = (aspect < 1) ? 15 * (1 / aspect) : 15;
        camera.position.z = Math.max(35, Math.min(targetZ, 50)); // Clamped to prevent extreme zooms
        camera.position.y = Math.max(15, Math.min(targetY, 30)); // Clamped to prevent extreme zooms
    }
    

    function adjustFOV(camera, aspect) {
        // Define base FOV for a standard aspect ratio (e.g., 16:9)
        const baseFOV = 75; // Adjust this base FOV to your preference
        const aspectRatioThreshold = 1.5; // A typical threshold to distinguish large from small screens
    
        if (aspect > aspectRatioThreshold) {
            // For larger screens (wider aspect ratios), decrease the FOV to zoom in
            camera.fov = baseFOV - (aspect - aspectRatioThreshold) * 5;
        } else {
            // For smaller screens, increase the FOV to widen the view
            camera.fov = baseFOV + (aspectRatioThreshold - aspect) * 5;
        }
    
        // Ensure the FOV recontrolButtonss within a reasonable range
        camera.fov = Math.max(75, Math.min(camera.fov, 80)); // Clamping FOV between 45 and 75
    
        // Update the projection matrix with the new FOV
        camera.updateProjectionMatrix();
    }

    function resizeCanvas() {
        width = pongCanvas.clientWidth ;
        height = pongCanvas.clientHeight ;
        const aspect = (width / height);

        console.log("width :: ", width)
        
        if(width <= 720)
            controlButtons.style.display = 'flex';
        else
            controlButtons.style.display = 'none';


        adjustFOV(camera, aspect);
        adjustCameraPosition(camera, aspect);

        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width , height);

        console.log("camera on z: ", camera.position.z);
        console.log("camera on y: ", camera.position.y);
        console.log("camera fov : ", camera.fov);
        
    }

    window.addEventListener("resize", resizeCanvas);

















    function table() {
        tableHeight = table_config.tableHeight;
        tableWidth = table_config.tableWidth;
        plane = new THREE.Mesh(
            new THREE.PlaneGeometry(tableWidth, tableHeight),
            new THREE.MeshPhysicalMaterial( {
                side: THREE.DoubleSide,
                reflectivity: 0,
                transmission: 1.0,
                roughness: 0.2,
                metalness: 0,
                clearcoat: 0.3,
                clearcoatRoughness: 0.25,
                color: new THREE.Color(0xffffff),
                ior: 1.2,
            } )
        );
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(0, -0.49, 0);
        TableG.add(plane);
        tableBound(tableWidth, tableHeight);
        createWalls(tableWidth, tableHeight);
        scene.add(TableG);
    }

    function tableBound(tableWidth, tableHeight){

    //////////////////////////////////////////////////
        const tableCenter = new THREE.Mesh(
            new THREE.PlaneGeometry(tableWidth, 0.2),
            new THREE.MeshBasicMaterial({color: "white"})
        );
        tableCenter.receiveShadow = true;
        tableCenter.rotation.x = -Math.PI / 2;
        tableCenter.position.set(0, plane.position.y + 0.01, 0);
        TableG.add(tableCenter);
    /////////////////////////////////////////////////
        const boundM = new THREE.Mesh(
            new THREE.PlaneGeometry(tableWidth, 0.1),
            new THREE.MeshBasicMaterial({color: "white"})
        );
        boundM.receiveShadow = true;
        boundM.rotation.x = -Math.PI / 2;
        boundM.position.set(0, plane.position.y + 0.01, tableHeight / 2);
        TableG.add(boundM);
    ///////////////////////////////////////////////////////
        const boundY = new THREE.Mesh(
            new THREE.PlaneGeometry(tableWidth, 0.1),
            new THREE.MeshBasicMaterial({color: "white"})
        );
        boundY.receiveShadow = true;
        boundY.rotation.x = -Math.PI / 2;
        boundY.position.set(0, plane.position.y + 0.01, -(tableHeight / 2));
        TableG.add(boundY);
    }

    function createWalls(tableWidth, tableHeight) {
        const walls = new THREE.Group();
    
        const wallGeometry = new THREE.BoxGeometry(1, 2, tableHeight);
        const glowShader = {
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    float pattern = sin(vUv.y * 20.0 + time * 3.0) * 0.5 + 0.5;
                    gl_FragColor = vec4(color, (pattern + pulse) * 0.5);
                }
            `
        };
    
        function createWall(position, color) {
            const wall = new THREE.Group();
            
            // Main wall
            const wallMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                shininess: 100
            });
            const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
            wallMesh.castShadow = true;
            
            // Energy field
            const energyMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(color) }
                },
                vertexShader: glowShader.vertexShader,
                fragmentShader: glowShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide
            });
    
            const energyField = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 2.2, tableHeight + 1),
                energyMaterial
            );
    
            wall.add(wallMesh, energyField);
            wall.position.copy(position);
    
            // Add light
            const wallLight = new THREE.RectAreaLight(color, 2, tableHeight + 1, 2);
            wallLight.position.copy(position);
            wallLight.position.x = position.x < 0 ? 0.5 : -0.5;
            wallLight.rotation.y = (position.x < 0 ? -Math.PI / 2 : Math.PI / 2);
            // wall.rotation.y = Math.PI / 2;
            wall.add(wallLight);

            
            return wall;
        }
    
        // Create walls with different colors
        leftWall = createWall(
            new THREE.Vector3(-tableWidth / 2 + 0.5, 0, 0),
            0xff0044
        );
        rightWall = createWall(
            new THREE.Vector3(tableWidth / 2 - 0.5, 0, 0),
            0xff0044
        );
    
        walls.add(leftWall, rightWall);
    
        TableG.add(walls);
    }

    function createBallWithTrail(config) {
        const ballGroup = new THREE.Group();
        
        const sphereGeometry = new THREE.SphereGeometry(config.radius, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8800,
            emissive: 0xff4400,
            shininess: 100
        });
        
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.castShadow = true;
        
        ballGroup.add(sphereMesh);
        
        // Add glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { value: 0.5 },
                p: { value: 4.5 },
                glowColor: { value: new THREE.Color(0xff4400) },
                time: { value: 0 },
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float c;
                uniform float p;
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
                    intensity *= abs(sin(time * 0.01));
                    gl_FragColor = vec4(glowColor, intensity);
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });
        
        const glowMesh = new THREE.Mesh(
            new THREE.SphereGeometry(config.radius * 1.2, 32, 32),
            glowMaterial
        );
        
        ballGroup.add(glowMesh);
        return ballGroup;
    }


    function ballCreation() {

        ball = createBallWithTrail(ball_config);
        ball.position.set(ball_config.x, ball_config.y + 0.1, ball_config.z);
        scene.add(ball);
    } 

    // Enhanced paddle creation with effects
    function createPaddle(color, emissiveColor) {
        const paddleGroup = new THREE.Group();
        
        const paddleGeometry = new THREE.BoxGeometry(paddle.width, paddle.height, paddle.deep);
        const paddleMaterial = new THREE.MeshPhongMaterial({
            color: color,
            emissive: emissiveColor,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        
        const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddleMesh.castShadow = true;
        paddleGroup.add(paddleMesh);
        
        // Add energy field effect
        const energyGeometry = new THREE.BoxGeometry(paddle.width + 0.5, paddle.height + 0.5, paddle.deep + 0.5);
        const energyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(color) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                void main() {
                    float pattern = sin(vUv.y * 20.0 + time) * 0.5 + 0.5;
                    gl_FragColor = vec4(color, pattern * 0.3);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const energyField = new THREE.Mesh(energyGeometry, energyMaterial);
        energyField.rotation.x = Math.PI / 2;
        paddleGroup.add(energyField);
        
        return paddleGroup;
    }

    function playerCreation() {
        player1 = createPaddle("cyan", "cyan");
        player1.position.set(0, 0, (tableHeight / 2) - (paddle.deep / 2));
        scene.add(player1);

        player2 = createPaddle(new THREE.Color("#e3052e"), new THREE.Color("#e3052e"));
        player2.position.set(0, 0, -(tableHeight / 2) + (paddle.deep / 2));
        scene.add(player2);
    }

    class ScoreManager {
        constructor(scene) {
            this.scene = scene;
            this.scores = {
                player1: 0,
                player2: 0,
                maxScore: 5
            };
            this.scoreMeshes = {
                player1: null,
                player2: null
            };

            // Initialize score displays
            this.loadFont();
        }
    
        loadFont() {
            FontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                this.font = font;
                this.createScoreDisplays();
            });
        }
    
        createScoreDisplays() {
            // Player 1 Score
            const player1Score = new THREE.TextGeometry(`${this.scores.player1}`, {
                font: this.font,
                size: 10,
                height: 0.1,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 3
            });
    
            this.scoreMeshes.player1 = new THREE.Mesh(
                player1Score,
                new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    emissive: 0x444444
                })
            );
            this.scoreMeshes.player1.position.set(-3.5, -0.2, 14);
            this.scoreMeshes.player1.rotation.x = -Math.PI / 2;
            this.scene.add(this.scoreMeshes.player1);
    
            // Player 2 Score
            const player2Score = new THREE.TextGeometry(`${this.scores.player2}`, {
                font: this.font,
                size: 10,
                height: 0.1,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 3
            });
    
            this.scoreMeshes.player2 = new THREE.Mesh(
                player2Score,
                new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    emissive: 0x444444
                })
            );
            this.scoreMeshes.player2.position.set(3.5, -0.2, -14);
            this.scoreMeshes.player2.rotation.y = Math.PI;
            this.scoreMeshes.player2.rotation.x = Math.PI / 2;
            this.scene.add(this.scoreMeshes.player2);
        }
    
        addPoint(score) {
            this.scores = score;
            for (const player in this.scoreMeshes) {
                if (this.scoreMeshes[player]) {
                    this.scene.remove(this.scoreMeshes[player]);
                }
            }
            this.createScoreDisplays();
        }
        reset() {
            this.scores.player1 = 0;
            this.scores.player2 = 0;
            this.updateScore();
        }
    
        updateScore() {
            for (const player in this.scoreMeshes) {
                if (this.scoreMeshes[player]) {
                    this.scene.remove(this.scoreMeshes[player]);
                }
            }
            this.createScoreDisplays();
        }
    }

    function updateCamera() {
        camera.position.lerp(
          new THREE.Vector3(player1.position.x * 0.5, camera.position.y, camera.position.z),
          0.05
        );
    }

    function animate (time)
    {
        animationId = requestAnimationFrame(animate);

        updateCamera();
        // Update starfield
        starfield.rotation.y += 0.0009;

        // Update paddle energy fields
        player1.children[1].material.uniforms.time.value = time * 0.001;
        player2.children[1].material.uniforms.time.value = time * 0.001

        // Update ball trail
        if (ball) {
            const trailMaterial = ball.children[1].material;
            trailMaterial.uniforms.time.value = time * 0.001;
        }

        // walls animation
        leftWall.children[1].material.uniforms.time.value = time * 0.001;
        rightWall.children[1].material.uniforms.time.value = time * 0.001;

        controls.update();
        renderer.render( scene, camera );
        if (wsOpen)
            sendPaddlePosition();

    }

    function sendPaddlePosition() {
        console.log("sending  data ...");
        socket.send(JSON.stringify({
            type: "update_paddle",
            direction : playerDirection,
            mode: selectedMode,
        }));
    }

    function shakeCamera() {
        const originalPosition = camera.position.clone();
        const shakeStrength = 0.3;
        const shakeDuration = 200; // in milliseconds
    
        const startTime = Date.now();
        function shake() {
            const elapsed = Date.now() - startTime;
            if (elapsed < shakeDuration) {
                camera.position.x = originalPosition.x + ((Math.random() - 1) * 2) * shakeStrength;
                camera.position.y = originalPosition.y + ((Math.random() - 1) * 2) * shakeStrength;
                camera.position.z = originalPosition.z + ((Math.random() - 1) * 2) * shakeStrength;
                requestAnimationFrame(shake);
            } else {
                camera.position.copy(originalPosition); // Reset camera position
            }
        }
        shake();
    }


    function startCountdown(duration, onComplete) {
        resizeCanvas();
        countdownElement.style.display = 'flex'; // Hide the countdown element

        let timeLeft = duration;
        let opacity = 1; // Initial opacity for fading effect
        let scale = 1; // Initial scale for size animation
    
    
        // Update the countdown every second
        const interval = setInterval(() => {
            renderer.render( scene, camera );

            countdownElement.style.fillStyle = `rgba(255, 255, 255, ${opacity})`; // Fading effect
            countdownElement.style.font = `${100 * scale}px "Pong War", "Freeware"`; // Dynamic scaling
            countdownElement.textContent = timeLeft > 0 ? timeLeft : "GO!"; // Display the time
            scale += 0.1; // Gradually increase size
            opacity -= 0.1; // Gradually fade out
    
            if (opacity <= 0) {
                scale = 1; // Reset size
                opacity = 1; // Reset opacity
                timeLeft-- ; // Move to the next countdown value
            }


            if (timeLeft < 0) {
                clearInterval(interval); // Stop the countdown
                countdownElement.style.display = 'none'; // Hide the countdown element
                onComplete(); // Trigger the game start
            }
        }, 60);
    }

    // Enhanced game over effect
    function gameOver(winner, score) {
        // Create multiple explosion layers
        function createExplosionLayer(radius, particleCount, speed) {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const velocities = [];
            
            // Create random particles in a sphere
            for(let i = 0; i < particleCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const r = radius * Math.random();
                
                vertices.push(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
                );
                
                // Add random velocity for each particle
                velocities.push(
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed
                );
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            
            const explosion = new THREE.Points(
                geometry,
                new THREE.PointsMaterial({
                    color: winner === 'player1' ? 0x00ff00 : 0xff0000,
                    size: 0.5,
                    transparent: true,
                    opacity: 1
                })
            );
            
            explosion.userData.velocities = velocities;
            return explosion;
        }
        
        // Create multiple layers of explosion
        const explosionLayers = [
            createExplosionLayer(20, 1000, 2),  // Core explosion
            createExplosionLayer(15, 500, 1.5), // Middle layer
            createExplosionLayer(10, 250, 1)    // Outer layer
        ];
        
        explosionLayers.forEach(layer => scene.add(layer));
        
        // Animate explosion
        let time = 0;
        function animateExplosion() {
            time += 0.016; // Approximately 60 FPS
            
            explosionLayers.forEach(layer => {
                const positions = layer.geometry.attributes.position.array;
                
                // Update each particle position based on velocity
                for(let i = 0; i < positions.length; i += 3) {
                    positions[i] += layer.userData.velocities[i] * time;
                    positions[i+1] += layer.userData.velocities[i+1] * time;
                    positions[i+2] += layer.userData.velocities[i+2] * time;
                }
                
                layer.geometry.attributes.position.needsUpdate = true;
                layer.material.opacity = Math.max(0, 1 - time);
            });
            
            if(time < 1) {
                requestAnimationFrame(animateExplosion);
            } else {
                // Clean up and show game over screen
                explosionLayers.forEach(layer => scene.remove(layer));
                wsOpen = false;
                cancelAnimationFrame(animationId);
                socket.close();
                render(GameOver(winner, score, "ai"), 
                    gamePage.shadowRoot.querySelector('.game-pong'));
            }
        }
        
        animateExplosion();
    }
}
