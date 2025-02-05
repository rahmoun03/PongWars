import { render } from './render.js';
import { menu } from './loby.js';
import { GameOver } from './gameOver.js';


class GamePage extends HTMLElement {

    constructor() {
        super();

        // Create Shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });


        // Create container div
        const main = document.createElement('div');
        main.classList.add('game-pong');

        // create style

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                height: 100%;
                width: 100%;
            }
            .game-pong {
                display: flex;
                position :relative;
                font-family: "Pong War", sans-serif;
                color: #fff;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(main);
        console.log("render menu pong");
        render(menu(), main);
    }

    connectedCallback(){

        this.innerHTML = `
            <style>
            @media (min-width: 320px) and (max-width: 1024px) {
                .nav-bar{
                    width: 100%;
                    display: flex;
                    height :8%;
                    background-color: rgb(0 0 0 / 0.5);
                    color: #293247;
                    justify-content: space-evenly;
                    align-items: center;
                    flex-direction: row;
                    border-radius :0px;
                    position: fixed;
                    padding-bottom: 5%;
                    bottom :0;
                    z-index :1000;
                }
                .nav-02{
                    margin-top:30px;
                }
                .nav-02 .fa-right-from-bracket{
                    display :none;
                }
                nav a{
                    text-decoration: none;
                    background: none;

                }
                .fafa{
                    display :none;
                }
                .img-home{
                    display :none;
                }
                body{
                    flex-direction: column-reverse;
                }
                #content{
                    position :relative;
                    width :100%;
                    height :100%;
                    border-radius :0px;
                    display :flex;
                }
            }
            #game{
                color :#fff;
            }
            </style>
        `
    }
}

customElements.define('game-pong', GamePage);
