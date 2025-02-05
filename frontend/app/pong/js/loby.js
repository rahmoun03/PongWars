
import { render } from './render.js';
import { ai_mode } from './aimode.js';
import { local_1vs1 } from './local_1vs1.js';
import { online_1vs1 } from './online_1vs1.js';
import { tournamentlocal } from './localTournament.js';

export function menu() {

  // let  switchButton = new Audio('../sound/switch.mp3');
  let click = new Audio('../sound/menu-click-89198.mp3');
  // Attach styles
  const style = document.createElement('style');
  style.textContent = `
    .menu {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width : 100%;
    }

    .game-title {
      position: absolute;
      top: 50px;
      display: flex;
      font-family: "Pong War", "Freeware";
      font-weight: bold;
      font-size: 8vw;
      margin-bottom: 20px;
      text-align: center;
      color: var(--red);
      text-shadow: 2px 0 white, -2px 0 white, 0 2px white, 0 -2px white,
              1px 1px white, -1px -1px white, 1px -1px white, -1px 1px white;

    }
    .game-buttons-container {
      left: 0px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items :center;
      gap :10px;
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

    button:nth-child(6) {
      background-color: var(--blue);
    }

    button.hidden {
      display: none;
    }

  }`;


  let  section = 0;
  const menu = document.createElement('div');
  menu.classList.add('menu');

  // Create container div
  const container = document.createElement('div');
  const title = document.createElement('div');
  container.classList.add('game-buttons-container');
  title.classList.add('game-title');
  title.textContent = "Pong Wars";

  // Create buttons
  const aiButton = createButton('AI Mode');
  const multiplayerButton = createButton('Multiplayer'); 
  const onlineButton = createButton('Online', 'hidden');
  const localButton = createButton('Local', 'hidden');
  const tournamentButton = createButton('Tournament');
  const backButton = createButton('Back');

  // Append buttons to container
  container.appendChild(aiButton);
  container.appendChild(multiplayerButton);
  container.appendChild(onlineButton);
  container.appendChild(localButton);
  container.appendChild(tournamentButton);
  container.appendChild(backButton);


  
  function createButton(text, additionalClass = '') {
    const button = document.createElement('button');
    button.textContent = text;
    if (additionalClass) {
      button.classList.add(additionalClass);
    }

    button.addEventListener('click', () => handleButtonClick(text));
    
    button.addEventListener("mouseover", () => {
      // switchButton.play();
    });
    return button;
  }

  function handleButtonClick(buttonType) {
    // click.play();
    switch (buttonType) {
      case 'AI Mode':
        ai_mode();
        break;
      case 'Multiplayer':
        toggleMultiplayerOptions();
        section = 1;
        break;
      case 'Online':
        section = 0;
        online_1vs1();
        break;
      case 'Local':
        section = 0;
        local_1vs1();
        break;
      case 'Tournament':
        console.log('Tournament');
        section = 0;
        render(tournamentlocal(), document.body.querySelector('game-pong').shadowRoot.querySelector('.game-pong'));
        break;
      case 'Back':
        if(section == 1){
          toggleMultiplayerOptions();
          section = 0;
        }
        else if (section == 0)
          togameHome();
        break;
    }
    console.log(section);
  }

  function toggleMultiplayerOptions() {
    container.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('hidden');
    });
    backButton.classList.toggle('hidden');
  }
  
  function togameHome(){
      console.log('TO GAME PAGE')
      const content = document.getElementById('content')
      content.innerHTML = '<pongxo-page></pongxo-page>';
  }

  menu.appendChild(style);
  menu.appendChild(title);
  menu.appendChild(container);
  return menu;
}
