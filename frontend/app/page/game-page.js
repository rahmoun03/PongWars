
import {fetchUserData , getCookie ,logout} from './readData.js';

import { navigateTo } from '../routing.js';
import { submitTournament } from '../pong/js/submitTournament.js';

function getBadgeColor(rank) {
    // switch(rank) {
    //     case 1: return 'warning';
    //     case 2: return 'secondary';
    //     case 3: return 'bronze';
    //     case 4: return 'blue';
    //     default: return 'default';
    if (rank == 1) {
        console.log("--> : " + rank)
        return "bg-bronze";
    }
    if (rank == 2) {
        console.log("--> : " + rank)
        return "bg-blue";
    }
    if (rank == 3) {
        console.log("--> : " + rank)
        return "bg-success";
    }
    if (rank == 4) {
        console.log("--> : " + rank)
        return "bg-warning";
    }
}
   

var web3 = null;
        
var accounts = null;

// async function init() {
export async function init() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);

        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const btnwallet = document.getElementById('connectwallet');
            const first4 = accounts[0].slice(0, 4);
            const last4 = accounts[0].slice(-4);
            const result = `${first4}...${last4}`;
            btnwallet.textContent = result;
            const info  = await fetchUserData();

            const container = document.getElementById('container');
            container.className = "dropdown";
            container.innerHTML = `
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        ${result}
                    </button>
                    <div style="width:20vw; height:80vh; background : var(--blue);" class="dropdown-menu" >
                        <div class="" style="width:90%; height:10%; display:flex; align-items: center; justify-content: center; gap:5px;">
                            <img id="img_eth" style="object-fit: cover; display:block; width: 40px; height: 40px; border-radius: 50%;" src="${info.image}">
                            <span>${result}</span> 
                        </div>
                        <div style="height:70%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px;">
                            <button id="submitBtn" class="btn btn-primary" style="width: 80%;">Submit</button>
                            <button id="getBtn" class="btn btn-info" style="color :#fff; width: 80%;">Get</button>
                        </div>
                        <div style="height:10%; width:100%; display: flex; justify-content: center; align-items: center;">
                            <button id="disconnect" type="button" class="flag btn-home btn btn-secondary" style="font-size:100%; width:50%; height:50%; border-radius:5px; border:none; background:var(--red); display: flex; justify-content: center; align-items: center;">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners for the new buttons
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.style.display = "none";
            const getBtn = document.getElementById('getBtn');

            // submitBtn.addEventListener('click', () => {
            //     try {
            //         // Add your submit logic here
            //         showNotification('success', 'Operation completed successfully!');
            //     } catch (error) {
            //         showNotification('error', 'An error occurred during submission.');
            //     }
            // });

            getBtn.addEventListener('click', async () => {
                try{
                    const data = await submitTournament("getScore");
                    // console.log("xxxxx ", data);
                    
    
                    const tournamentData = data.map((tournament, index) => ({
                        tournament: tournament.name,
                        time : new Date(tournament.timestamp * 1000).toLocaleString(),
                        
                        players: [
                            { address: tournament.players[0].name, rank: tournament.players[0].rank, points: tournament.players[0].score },
                            { address: tournament.players[1].name, rank: tournament.players[1].rank, points: tournament.players[1].score },
                            { address: tournament.players[2].name, rank: tournament.players[2].rank, points: tournament.players[2].score },
                            { address: tournament.players[3].name, rank: tournament.players[3].rank, points: tournament.players[3].score }
                        ]
                    }));
                    // Sample tournament data - replace with your actual data
          
    
                    // Create and show popup with tournament table
                    const popup = document.createElement('div');
                    popup.className = 'modal fade show';
                    popup.style.display = 'block';
                    popup.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    
                    // Generate tournament tables HTML
                    const tournamentsHTML = tournamentData.map(tournament => `
                        <div class="tournament-section mb-4">
                            <h6  class="tournament-title text-light mb-3"> Tournament Name : <span style="color:#787878;">${tournament.tournament}</span></h6>
                            <span style="color:#787878	; font-size :15px;" >${tournament.time}</span> 
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead style="">
                                        <tr class="" style="" >
                                            <th>Rank</th>
                                            <th>Player</th>
                                            <th>Score</th>
                                        </tr>                               
                                    </thead>
                                    <tbody>
                                        ${tournament.players.map(player => `
                                            <tr>
                                                <td>
                                                    <span class="badge ${getBadgeColor(player.rank)}"> #${player.rank}</span>
                                                </td>
                                                <td class="text-light">${player.address}</td>
                                                <td class="text-light">${player.points}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `).join('');
            
                popup.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content bg-dark">
                            <div class="modal-header" style="background : var(--blue); border:none;">
                                <h5 class="modal-title text-light">Tournament Rankings</h5>
                                <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                            </div>
                            <div class="modal-body bg-dark text-light">
                                ${tournamentsHTML}
                            </div>
                            <div class="modal-footer" style="background : var(--blue); border:none;">
                                <button style="background : var(--red); border :none;" type="button" class="btn btn-outline-light" onclick="this.closest('.modal').remove()">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                const style = document.createElement('style');
                style.textContent = `
                    .bg-bronze {
                        background : var(--red);
                    }
                    .bg-blue{
                        background : blue;
                    }
                    .tournament-section {
                        padding-bottom: 1rem;
                    }
                    .tournament-section:last-child {
                        border-bottom: none;
                    }
                    .table-dark {
                        background-color: #1a237e;
                        color: #fff;
                    }
                    .table-dark tbody tr:hover {
                        background-color: #283593;
                    }
                    .modal-content {
                        border: none;
                    }
                    .modal-body {
                        background : var(--blue)  !important;
                    }
                `;
                document.head.appendChild(style);
                
                document.body.appendChild(popup);
                }catch(error){
                    const popup = document.createElement('div');
                    popup.className = 'modal fade show';
                    popup.style.display = 'block';
                    popup.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    popup.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content bg-dark">
                            <div class="modal-header" style="background : var(--blue); border:none;">
                                <h5 class="modal-title text-light">Tournament Rankings</h5>
                                <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                            </div>
                            <div class="modal-body bg-dark text-light">
                        <div class="tournament-section mb-4">
                            <h6 class="tournament-title text-light mb-3"></h6>
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead style="">
     
                                    </thead>
                                    <tbody>
                                        <p style="color:var(--red); text-align:center;" >No Tournament Yet</p>
                                    </tbody>
                                </table>
                            </div>
                        </div>                                
                        </div>
                            <div class="modal-footer" style="background : var(--blue); border:none;">
                                <button style="background : var(--red); border :none;" type="button" class="btn btn-outline-light" onclick="this.closest('.modal').remove()">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                const style = document.createElement('style');
                style.textContent = `
                    .bg-bronze {
                        background : var(--red);
                    }
                    .bg-blue{
                        background : blue;
                    }
                    .tournament-section {
                        padding-bottom: 1rem;
                    }
                    .tournament-section:last-child {
                        border-bottom: none;
                    }
                    .table-dark {
                        background-color: #1a237e;
                        color: #fff;
                    }
                    .table-dark tbody tr:hover {
                        background-color: #283593;
                    }
                    .modal-content {
                        border: none;
                    }
                    .modal-body {
                        background : var(--blue)  !important;
                    }
                `;
                document.head.appendChild(style);
                document.body.appendChild(popup);

                }
                // Add custom CSS for dark theme
            });

            // Add notification system
            const showNotification = (type, message) => {
                const notification = document.createElement('div');
                notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} notification`;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px;
                    border-radius: 4px;
                    z-index: 1000;
                    color :#fff;
                    background : var(--red);
                `;
                notification.textContent = message;
                document.body.appendChild(notification);

                // Remove notification after 3 seconds
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            };

            disconnectWallet(); // Ensure the disconnect logic is set up
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        console.log('Please install MetaMask!');
    }
}
function disconnectWallet() {
    const btnDisconnect = document.getElementById('disconnect');
    if (btnDisconnect) {
        // Remove any existing listeners to avoid duplicates
        btnDisconnect.removeEventListener('click', handleDisconnect);

        // Add a new listener for disconnect
        btnDisconnect.addEventListener('click', handleDisconnect, { once: true });
    }
}

async function handleDisconnect() {
    console.log("HERE WE DISCONNECT THE WALLET");

    if (typeof window.ethereum !== 'undefined') {
        try {
            // Reset web3 instance
            web3 = null;
            accounts = null;

            // Clear wallet-related data
            localStorage.clear();
            sessionStorage.clear();

            console.log('Wallet disconnected');

            // Update the UI to show the "Connect Wallet" button
            const container = document.getElementById('container');
            container.innerHTML = `
                <button 
                    class="btn btn-secondary" 
                    type="button" 
                    id="connectwallet" 
                    style="background: var(--red); border: none;">
                    Connect Wallet
                </button>
            `;

            // Reattach the click event for wallet connection
            const btnWallet = document.getElementById('connectwallet');
            btnWallet.addEventListener('click', () => {
                console.log("HERE WE ADD WALLET");
                init();
            }, { once: true });
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    } else {
        console.error("No wallet provider found.");
    }
}


class gamePage extends HTMLElement {

    navar = `
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
                width :100vw;
                height :100vh;
                border-radius :0px;
                display :flex;
            }

    }`
    constructor(){
        super();
    }
 

    info = [];
    rander(){     
        const uuss = async () => {
            if (!getCookie('access')){
                navigateTo('/login');
            }
                this.info  = await fetchUserData();
            // if (info){
                // document.getElementById('img_eth').src = info.image;
                
            // }
    
        }
        uuss();   
        this.innerHTML = `
            <style>
            ${this.navar}
            #content{
                display :flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border-radius :5px;
            }
            pongxo-page{
                width :100%;
                height :100%;
                padding :0;
                margin :0;
                display :flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                flex-direction: column;
                gap :10px;
            }
            #game{ 
                    color: #fff; 
                }
        .scroll-item{
            display :flex;
            flex-direction: column-reverse;
            gap :10px;
        }
        .scroll-item {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 14rem;
            height: 17rem;
            margin: 0 15px;
            background:  linear-gradient(0deg, 
            rgb(4, 28,68, 1) 100%, 
            rgba(56, 75, 112, 0.2) 100%
             );
            color: white;
            font-size: 24px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .track-items{
            width :200px;
            height :200px;
            background:rgb(0 0 0 / 0.5);
            border-radius: 5px;
        }
        @media (min-width: 320px) and (max-width: 720px) {
            pongxo-page{
                flex-direction: column;
            }
            .games{
                flex-direction: column;
            }
          }
            </style>
                <div id="container" style="width: 90%; height: 5%; display: flex; justify-content: right; align-items: center;">
                        <button 
                            class="btn btn-secondary" 
                            type="button" 
                            id="connectwallet" 
                            style="background: var(--red); border: none;">
                            Connect Wallet
                        </button>
                </div>
            <div class="games" style="height:90%; gap: 10px; display:flex; justify-content: center;align-items: center;" >
                <div class="scroll-item">
                <button id="topong" style="background:var(--red); border :none;" class="btn-home btn btn-secondary " >Pong</button>
                <div class="track-items" >
                <img style="position :static;"  class="w-100 h-100" src="/images/pong.png">
                </div>
                </div>
                <div class="scroll-item">
                <button id="toxo" style="background:var(--red); border :none;" class="btn-home btn btn-secondary " >TicTacTeo</button>
                <div class="track-items" >
                <img  class="w-100 h-100" src="/images/xo.png">
                </div>
                </div>
            </div>
        `;
        this.topong();
        this.connectWallet(1);
    }
    connectWallet(flag) {
        if (flag === 1) {
            const btnwallet = document.getElementById('connectwallet');
            btnwallet.addEventListener('click', () => {
                console.log("HERE WE ADD WALLET");
                init();
            }, { once: true }); // Ensures the event runs only once
        } else {
            console.log('BEFORE CLICK');
            disconnectWallet();
        }
    }
    
    topong(){
        document.getElementById('topong').addEventListener('click' , e => {
            const content = document.getElementById('content');
            content.innerHTML = '<game-pong></game-pong>';
        });
        document.getElementById('toxo').addEventListener('click' , e => {
            const content = document.getElementById('content');
            content.innerHTML = '<game-tictac width="100%" height="100%"></game-tictac>';
        });
    }
    connectedCallback(){
        // console.log("token is : " + getCookie('access'));
        if (!getCookie('access')){
            navigateTo('/login');
        }
        this.rander();
        logout();
    }
}

customElements.define('pongxo-page',gamePage);