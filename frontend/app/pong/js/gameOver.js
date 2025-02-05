import { render } from "./render.js";
import { menu } from "./loby.js";
import { navigateTo } from '../../routing.js';
import { online_1vs1 } from './online_1vs1.js';
import { local_1vs1 } from './local_1vs1.js';
import { ai_mode } from './aimode.js';


let context = {
    player1: 5,
    player2: 5
};

export function GameOver(winnerContent = "WIN", scoreContent = context, type = null) {
    const gamePage = document.body.querySelector('game-pong');
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% {
                clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
                transform: translate(0);
            }
            2%, 6% {
                clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
                transform: translate(-5px);
            }
            4%, 8% {
                clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
                transform: translate(5px);
            }
            10% { transform: translate(0); }
        }

        @keyframes floating {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        @keyframes bg-pulse {
            0% { opacity: 0.3; }
            50% { opacity: 0.5; }
            100% { opacity: 0.3; }
        }

        .game-over {
            font-family: "Pong War";
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .game-over::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                linear-gradient(90deg, rgba(4, 28, 68, 0.5) 1px, transparent 1px) 0 0 / 20px 20px,
                linear-gradient(0deg, rgba(4, 28, 68, 0.5) 1px, transparent 1px) 0 0 / 20px 20px;
            animation: bg-pulse 4s infinite;
            pointer-events: none;
        }

        .game-over::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                transparent,
                rgba(227, 5, 46, 0.1),
                transparent
            );
            animation: scanline 4s linear infinite;
            pointer-events: none;
        }

        .game-over-title {
            font-family: "Pong War", "Freeware";
            font-weight: bold;
            font-size: 8vw;
            margin-bottom: 20px;
            color: var(--red);
            text-shadow: 
                2px 2px 0 white,
                -2px -2px 0 white,
                2px -2px 0 white,
                -2px 2px 0 white;
            position: relative;
            animation: floating 4s ease-in-out infinite;
        }

        .game-over-title::before,
        .game-over-title::after {
            content: 'GAME OVER';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .game-over-title::before {
            color: rgba(227, 5, 46, 0.7);
            animation: glitch 4s infinite linear;
        }

        .winner-text {
            font-size: 3vw;
            margin: 20px 0;
            color: white;
            text-shadow: 0 0 10px rgba(227, 5, 46, 0.8);
            letter-spacing: 2px;
        }

        .score-text {
            font-size: 4vw;
            margin: 20px 0;
            color: white;
            text-shadow: 0 0 10px rgba(227, 5, 46, 0.8);
            background: var(--dark);
            padding: 15px 30px;
            border-radius: 10px;
            border: 2px solid var(--red);
            letter-spacing: 4px;
        }

        .button-container {
            display: flex;
            gap: 20px;
            margin-top: 30px;
            position: relative;
            z-index: 1;
        }

        button {
            font-family: "Pong War";
            padding: 15px 30px;
            width: 200px;
            letter-spacing: 2px;
            color: white;
            background-color: var(--red);
            border: 2px solid white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
        }

        button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transition: 0.5s;
        }

        button:hover {
            background-color: #ff1f1f;
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(227, 5, 46, 0.5);
        }

        button:hover::before {
            left: 100%;
        }

        @media (max-width: 768px) {
            .game-over-title {
                font-size: 12vw;
            }
            .winner-text {
                font-size: 6vw;
            }
            .score-text {
                font-size: 8vw;
            }
            .button-container {
                flex-direction: column;
            }
        }
    `;

    const gameOver = document.createElement('div');
    const gameOverText = document.createElement('p');
    const winner = document.createElement('p');
    const score = document.createElement('p');
    const buttonContainer = document.createElement('div');
    const playAgainButton = document.createElement('button');
    const homeButton = document.createElement('button');

    gameOver.classList.add('game-over');
    gameOverText.classList.add('game-over-title');
    winner.classList.add('winner-text');
    score.classList.add('score-text');
    buttonContainer.classList.add('button-container');

    gameOverText.textContent = 'GAME OVER';
    winner.textContent = `YOU ${winnerContent}`;
    score.textContent = `${scoreContent.player1} - ${scoreContent.player2}`;
    playAgainButton.textContent = 'Play Again';
    homeButton.textContent = 'Home';

    buttonContainer.appendChild(playAgainButton);
    buttonContainer.appendChild(homeButton);

    gameOver.appendChild(style);
    gameOver.appendChild(gameOverText);
    gameOver.appendChild(winner);
    gameOver.appendChild(score);
    gameOver.appendChild(buttonContainer);

    playAgainButton.onclick = () => {
        console.log("play again");
        switch (type) {
            case ("online") :
                online_1vs1();
                break;
            case ("local") :
                local_1vs1();
                break;
            case ("ai") :
                ai_mode();
                break;
            default:
                render(menu, gamePage.shadowRoot.querySelector('.game-pong'));
        }
    };

    homeButton.onclick = () => {
        navigateTo('/home');
        console.log("to home");
    };
    
    return gameOver;
}