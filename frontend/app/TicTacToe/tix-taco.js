import { render } from "../pong/js/render.js";
import { localTicTacToe } from "./local.js";
import { RemoteTicTacToe } from "./remote.js";

class GameTictac extends HTMLElement {

    constructor() {
        super();
        
    }

    // Observe the attributes 'width' and 'height'
    static get observedAttributes() {
        return ['width', 'height'];
    }

    // Update styles when attributes change
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'width') {
            this.style.setProperty('width', newValue);
        } else if (name === 'height') {
            this.style.setProperty('height', newValue);
        }
    }
    togameHome(){
        document.getElementById('toback').addEventListener('click' , () => {
            const content = document.getElementById('content')
            content.innerHTML = '<pongxo-page></pongxo-page>';
        });
    }
    togameLocal(){
        document.getElementById('tolocal').addEventListener('click' , () => {
            const content = document.getElementById('tictactoe_id')
            render(localTicTacToe(), content);
        });
    }
    togameRemote(){
        document.getElementById('toremote').addEventListener('click' , () => {
            const content = document.getElementById('tictactoe_id')
            render(RemoteTicTacToe(), content);
        });
    }
    styleing = `
    <style>
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            height: var(--custom-height, 100%);
            width: var(--custom-width, 100%);
        }

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
        .game-tictac {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position :relative;
            font-family: "Pong War", sans-serif;
            color: var(--white);
            height: 100%;
            width: 100%;
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
                height :80%;
                border-radius :0px;
                display :flex;
                justify-content: center;
                align-items: center;
            }
        }
        #game{
            color :#fff;
        }
    </style>
    `;
    beforGame = `
    <div class="menu" id="tictactoe_id">
        <div class="game-title" >Tic Tac Toe</div>
        <div style="width :100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction: column; gap:10px;" >
            <button id="tolocal" >Local</button>
            <button id="toremote" >Remote</button>
            <button style="background:#000;" id="toback" type="click">Back</button>
        </div>
    </div>
    `
    rander(){
        // const menu = beforGame();
        this.innerHTML = `
            ${this.styleing}
            ${this.beforGame}
        `
    }
    connectedCallback(){
        this.rander();
        this.togameHome();
        this.togameLocal();
        this.togameRemote();
    }
}

customElements.define('game-tictac', GameTictac);
