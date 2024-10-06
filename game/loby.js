// let section;
class GameStart extends HTMLElement {
  public
    section = 0;
    switchButton = new Audio("./sound/switch.mp3");
    click = new Audio("./sound/menu-click-89198.mp3");
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
    const testButton = this.createButton('test');
    
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
    container.appendChild(testButton);
    
    
    // Attach styles
    const style = document.createElement('style');
    style.textContent = `
    .game-start-container {
      left: 0px;
      width: 80vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    button {
      padding: 10px 10px;
      width: 30%;
      margin-bottom: 5px;
      font-family: "Press Start 2P", system-ui;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: white;
      background-color: rgba(56, 75, 112, 0.4);
      border: 1px solid rgba(56, 75, 112, 0);
      cursor: pointer;
      transition: 0.4s ease;
    }
    
    button.hidden {
      display: none;
    }

    button:nth-child(9) {
      background-color: rgba(56, 75, 112, 1);
    }

    button:nth-child(1) {
      color: #10ff10;
    }
      
    button:hover {
      background-color: rgba(152, 252, 217, 0.0);
      background-image: linear-gradient(to right, rgba(152, 252, 217, 1) , rgba(0,0,0, 0.0));
      color: #ffffff;
      width: 40%;
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
    
    button.addEventListener("mouseover", () => {
      console.log("hover button");
      this.switchButton.play();
    });
    return button;
  }


  handleButtonClick(buttonType) {
    this.click.play();
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
      case 'test':
        console.log('test');
        document.getElementById('CC').style.display = 'none';
        window.test();
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
    this.shadowRoot.querySelector('button:nth-child(8)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(9)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(1)').classList.toggle('hidden');
    this.shadowRoot.querySelector('button:nth-child(2)').classList.toggle('hidden');
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
