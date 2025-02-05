
import {fetchUserData , getCookie , logoutUser} from './readData.js';

import { navigateTo } from '../routing.js';

class LogoutPage extends HTMLElement {
    constructor() {
        super();
    }

    render() {
        this.innerHTML = `
            <style>
        .container {
            text-align: center;
            position: relative;
            width: 100%;
            padding: 20px;
        }

            h1 {
                font-size: 120px;
                margin: 0;
                color: #fff;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }

            p {
                font-size: 24px;
                margin: 20px 0;
                color: #ccc;
            }

            .home-btn {
                padding: 12px 24px;
                font-size: 18px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
                text-decoration: none;
            }

            .home-btn:hover {
                background-color: #45a049;
            }
.home-btn:hover {
            background-color: #45a049;
        }

        .game-area {
            width: min(90vw, 400px);
            height: min(45vw, 200px);
            border: 2px solid #fff;
            margin: 40px auto;
            position: relative;
            background-color: #000;
            touch-action: none;
        }

        .paddle {
            width: min(2.5vw, 10px);
            height: min(15vw, 60px);
            background-color: #fff;
            position: absolute;
            top: 35%;
        }

        #leftPaddle {
            left: min(2.5vw, 10px);
        }

        #rightPaddle {
            right: min(2.5vw, 10px);
        }

        .ball {
            width: min(3.75vw, 15px);
            height: min(3.75vw, 15px);
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 46%;
            left: 48%;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .game-area {
                margin: 20px auto;
            }
        }

        /* Touch controls */
        .touch-controls {
            display: none;
            justify-content: space-between;
            width: min(90vw, 400px);
            margin: 20px auto;
        }

        .touch-btn {
            background-color: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            touch-action: none;
        }

        @media (max-width: 768px) {
            .touch-controls {
                display: flex;
            }
        }
            .nav-bar{
                display :none;
            }
        </style>
        <div class="container" style="display:flex; justify-content:center; align-items:center; flex-direction:column;" >
            <h1 style="color:var(--red); -webkit-text-stroke: 2px #fff;" >404</h1>
            <p>Oops! Page not found</p>
                <div class="game-area">
                    <div class="paddle" id="leftPaddle"></div>
                    <div class="ball"></div>
                    <div class="paddle" id="rightPaddle"></div>
                </div>
            <a  style="background:var(--red);" class="home-btn">Back to Home</a>
        </div>
            `
            const ball = document.querySelector('.ball');
            const leftPaddle = document.querySelector('#leftPaddle');
            const rightPaddle = document.querySelector('#rightPaddle');
            const gameArea = document.querySelector('.game-area');
    
            let ballX = 192;
            let ballY = 92;
            let ballSpeedX = 3;
            let ballSpeedY = 3;
            let leftPaddleY = 70;
            let rightPaddleY = 70;
            let paddleSpeed = 2;
            let gameAreaRect = gameArea.getBoundingClientRect();
            
            function updateGame() {
                // Update ball position
                ballX += ballSpeedX;
                ballY += ballSpeedY;
    
                // Ball collision with top and bottom
                if (ballY <= 0 || ballY >= gameAreaRect.height - 15) {
                    ballSpeedY = -ballSpeedY;
                }
    
                // Ball collision with paddles
                if (
                    (ballX <= 20 && ballY + 15 >= leftPaddleY && ballY <= leftPaddleY + 60) ||
                    (ballX >= gameAreaRect.width - 25 && ballY + 15 >= rightPaddleY && ballY <= rightPaddleY + 60)
                ) {
                    ballSpeedX = -ballSpeedX;
                }
    
                // Reset ball if it goes past paddles
                if (ballX < 0 || ballX > gameAreaRect.width - 15) {
                    ballX = 192;
                    ballY = 92;
                }
    
                // Auto-move paddles
                const paddleCenter = 30;
                if (leftPaddleY + paddleCenter < ballY) {
                    leftPaddleY += paddleSpeed;
                } else {
                    leftPaddleY -= paddleSpeed;
                }
    
                if (rightPaddleY + paddleCenter < ballY) {
                    rightPaddleY += paddleSpeed;
                } else {
                    rightPaddleY -= paddleSpeed;
                }
    
                // Keep paddles within game area
                leftPaddleY = Math.max(0, Math.min(leftPaddleY, gameAreaRect.height - 60));
                rightPaddleY = Math.max(0, Math.min(rightPaddleY, gameAreaRect.height - 60));
    
                // Update elements
                ball.style.left = `${ballX}px`;
                ball.style.top = `${ballY}px`;
                leftPaddle.style.top = `${leftPaddleY}px`;
                rightPaddle.style.top = `${rightPaddleY}px`;
    
                requestAnimationFrame(updateGame);
            }
    
            // Start the game loop
            updateGame();
    
            // Update game area dimensions on window resize
            window.addEventListener('resize', () => {
                gameAreaRect = gameArea.getBoundingClientRect();
            });
            document.querySelector('.home-btn').addEventListener('click' , (e) => {
                navigateTo('/home')
            });
    }

    connectedCallback() {

        this.render(); // Correct method name

    }
}

customElements.define('not-found', LogoutPage);
