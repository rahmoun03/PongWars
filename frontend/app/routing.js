// Render function to load the appropriate content

import {checkLogin} from './page/readData.js';

class LoadingScreen {
    constructor(text = 'Loading...') {
      this.element = this.create(text);
    }

    create(text) {
      const loader = document.createElement('div');
      loader.className = 'loading-screen';
      loader.innerHTML = `
      <style>
    .loading-screen {
      position: absolute;
      background: #000;
      width :100%;
      height :100%;
      animation: gradientBG 15s ease infinite;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 3000;
    }

    .loader {
      width: 200px;
      height: 60px;
      border-radius: 4px;
      position: relative;
    }

    .ball {
      width: 8px;
      height: 8px;
      background: #007bff;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      animation: bounce 1.5s linear infinite;
      box-shadow: 0 0 10px #007bff;
    }

    .paddle {
      width: 8px;
      height: 30px;
      background: var(--red);
      box-shadow: 0 0 10px var(--red);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .paddle-left { left: 0; }
    .paddle-right { right: 0; }

    @keyframes bounce {
      0%, 100% { left: 8px; }
      50% { left: calc(100% - 16px); }
    }

    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .loading-text {
      margin-top: 20px;
      color: #fff;
      font-family: Arial;
    }
      </style>
        <div class="loader">
        <div class="main" ></div>
          <div class="paddle paddle-left"></div>
          <div class="ball"></div>
          <div class="paddle paddle-right"></div>
        </div>
      `;
      return loader;
    }

    show() {
      document.body.appendChild(this.element);
    }

    hide() {
      this.element.remove();
    }

  }

  // Usage example - wrapped in DOMContentLoaded
  export const betweenPage = (() => {
    const loader = new LoadingScreen('Loading your content...');
    loader.show();
    
    setTimeout(() => loader.hide(), 1500);
  });

  function render(path) {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear existing content
    console.log("Navigating to " + path);
  
    // The page rendering logic
    switch (path) {
      case '/':
        // Call the loading screen for the home page
        // Add your content here after the loading screen
        content.innerHTML = '<getstarted-page></getstarted-page>';
        break;
      case '/home':
        betweenPage();  // Call the loading screen for the home page
        content.innerHTML = '<home-page></home-page>';
        break;
      case '/prof':
        betweenPage();
        content.innerHTML = '<profile-page></profile-page>';
        break;
      case '/login':
        betweenPage();
        content.innerHTML = '<login-page></login-page>';
        break;
      case '/game':
        betweenPage();
        content.innerHTML = '<pongxo-page></pongxo-page>';
        break;
      case '/setting':
        betweenPage();
        content.innerHTML = '<setting-page></setting-page>';
        break;
      // case '/logout':
      //   betweenPage();
      //   content.innerHTML = '<logout-page></logout-page>';
      //   break;
      default:
        content.innerHTML = `<not-found></not-found>`;
        break;
    }
  }

// Router function to determine the current path and render it
const router = () => {
    const path = location.pathname; // Get the current path from the URL
    render(path);
};

// Navigate to a specific URL programmatically
export const navigateTo = (url) => {
    history.pushState(null, null, url); // Add new state to the browser history
    router(); // Update the view
};

// Listen for browser back/forward navigation
window.addEventListener('popstate', () => {
    router(); // Re-render the appropriate page when history changes
});

// Initialize routing and set up event listeners
document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener('click', (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href); // Intercept clicks on elements with the `data-link` attribute
        }
    });

    router(); // Render the initial view on page load
});
