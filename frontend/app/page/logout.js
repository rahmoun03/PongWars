
import {fetchUserData , getCookie , logoutUser} from './readData.js';

import { navigateTo } from '../routing.js';

class LogoutPage extends HTMLElement {
    constructor() {
        super();
    }

    render() {
        this.innerHTML = `
        <style>
        .logout-popup {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 3000;
            justify-content: center;
            align-items: center;
            background: var(--dark);
        }

        .logout-popup-content {
            background: var(--blue);
            padding: 30px;
            border-radius: 5px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 90%;
        }
        .btn-home{
            background: var(--red);
        }
        .paratext{
            font-size :90%;
        }
        .confirmtext{
            color :var(--red);   
        }
        #logout{
            color: #fff; 
        }
    </style>

        <!-- Logout Popup -->
        <div id="logoutPopup" class="logout-popup">
            <div  class="logout-popup-content">
                <h2 style="color:var(--red); -webkit-text-stroke: 1px #fff;" class="confirmtext" >Confirm Logout</h2>
                <p class="paratext" style="color:gray; font-family: sans-serif; font-size :16px;" >Are you sure you want to log out?</p>
                <button type="click" id="tologout" class="btn-home btn btn-secondary " >Logout</button>
            </div>
        </div>
        `;

    }
    backhome(){
        document.querySelector('.logout-popup').addEventListener('click' , (e) =>{
            document.querySelector('.logout-popup').remove();
        });
    }
    async tolog(){
        const log = document.querySelector("#tologout")
        log.addEventListener('click' , async (e) =>{
            console.log('start log out');
            const info = await fetchUserData();
            logoutUser(info.username);
            navigateTo('/login');
            
        });
    }
    connectedCallback() {
        if (!getCookie('access')){
            navigateTo('/login');
        }
        this.render(); // Correct method name
        this.tolog();
        this.backhome();
    }
}

customElements.define('logout-page', LogoutPage);
