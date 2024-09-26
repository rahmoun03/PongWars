// let section;
class GameStart extends HTMLElement {
  public
    section = 0;
  // this.section = {this.toggleMultiplayerOptions, this.toggleModes};
  constructor() {
    super();

    // Create Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // Create container div
    const container = document.createElement('div');
    container.classList.add('game-start-container');
    // Create buttons
    const playButton = this.createButton('Play');
    const multiplayerButton = this.createButton('Multiplayer'); 
    const onlineButton = this.createButton('Online', 'hidden');
    const localButton = this.createButton('Local', 'hidden');
    const classicButton = this.createButton('Classic', 'hidden');
    const starWarButton = this.createButton('StarWar', 'hidden');
    const timeAttackButton = this.createButton('Time Attack', 'hidden');
    const tournamentButton = this.createButton('Tournament');
    const backButton = this.createButton('Back', 'hidden');
    
    // Append buttons to container
    container.appendChild(playButton);
    container.appendChild(multiplayerButton);
    container.appendChild(onlineButton);
    container.appendChild(localButton);
    container.appendChild(classicButton);
    container.appendChild(starWarButton);
    container.appendChild(timeAttackButton);
    container.appendChild(tournamentButton);
    container.appendChild(backButton);
    
    
    // Attach styles
    const style = document.createElement('style');
    style.textContent = `
    .game-start-container {
      // transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-radius: 10px;
    }
    
    button {
      padding: 10px 20px;
      margin: 10px;
      font-size: 18px;
      color: #ffffff;
      background-color: darkred;
      // border: 1px solid darkred;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    button.hidden {
        display: none;
      }

      button:nth-child(9) {
        position: absolute;
        top: 10%;
        left: 10%;
      }
      
      button:hover {
        background-color: #21a1f1;
      }
      `;
      
      // Attach everything to the shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(container);
    }

    createButton(text, additionalClass = '') {
      const button = document.createElement('button');
      button.textContent = text;
      if (additionalClass) {
      button.classList.add(additionalClass);
    }
    button.addEventListener('click', () => this.handleButtonClick(text));
    return button;
  }

  handleButtonClick(buttonType) {
    switch (buttonType) {
      case 'Play':
        this.remove();
        document.getElementById('CC').style.display = 'none';	
        window.play();
        break;
      case 'Multiplayer':
        this.toggleMultiplayerOptions();
        this.section = 1;
        break;
      case 'Online':
        this.toggleModes();
        this.section = 2;
        break;
      case 'Local':
        this.toggleModes();
        this.section = 2;
        break;
      case 'Classic':
        console.log('classic');
        this.remove();
        document.getElementById('CC').style.display = 'none';	
        window.play();
        break;
      case 'StarWar':
        this.remove();
        document.getElementById('CC').style.display = 'none';	
        console.log('starWar');
        window.starWar();
        break;
      case 'Time Attack':
        console.log('Time Attack');
        break;
      case 'Turnament':
        console.log('Turnament');
        break;
      case 'Back':
        if(this.section == 1)
          this.toggleMultiplayerOptions();
        else if(this.section == 2)
        {
          this.toggleModes();
          this.section = 1;
        }
        break;
    }
    console.log(this.section);
  }

  toggleMultiplayerOptions() {
    this.shadowRoot.querySelector('button:nth-child(1)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(2)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(8)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(9)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(3)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(4)').classList.toggle('hidden');

  }
  toggleModes() {
    
    this.shadowRoot.querySelector('button:nth-child(3)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(4)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(5)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(6)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(7)').classList.toggle('hidden');
  }
}

// Define the web component
customElements.define('game-start', GameStart);
