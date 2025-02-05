

import {fetchUserData , addordelete ,fetchFriendsData,fetchMatchData, getCookie ,logout, fetchStatsData, fetchNoFriendsData, getnotification} from './readData.js';

// import {fetchMatchData} from './readData.js';

import { navigateTo } from '../routing.js';



function serachBar(){
    return `
    <style>
        #search-container {
            margin: 20px auto;
            width: 100%;
            display :flex;
            justify-content :center;
            align-items :center;
            flex-direction: column;
        }
        input[type="text"] {
            width: 100%;
            pad        page.addEventListener('click' , (e) => {
                betweenPage();
                navigateTo('/game');
        });ding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            color :#000;
        }
        #results {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
        }
        #results ul {
            list-style-type: none;
            padding: 0;
        }
        #results li {
            font-family: Arial, sans-serif;
            color: #fff;
            font-size: 16px;
            padding: 5px 0;
            cursor: pointer; /* Pointer cursor to indicate clickable items */
            text-decoration: none;
        }
        #results li:hover {
            background-color: #f0f0f0; /* Highlight on hover */
        }
        /* Popup Styles */
        #popup {
            display: none; /* Hidden by default */
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 2px solid #ccc;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            border-radius: 8px;
            text-align: center;
        }
        /* Overlay to dim background */
        #overlay {
            display: none; /* Hidden by default */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
    </style>
    <div id="search-container" style="flex-direction: column; width :100%;" >
        <div style="width :100%; height :100%;" >
            <input style="padding:5px; color :#000; text-aling:center;font-size:16px; font-family: sans-serif;" type="text" id="search-bar" placeholder="Search here..." />
            <div id="results"></div>
            <button style="background :gray;" type="click" id="backtoprof" class="btn-home btn btn-secondary " >Back</button>
        </div>
    </div>
    `;
}
function profSection(name, img , bool) {
    var type;
    type = 'add friend';
    return `
    <style>
        /* Add your custom styles here if needed */
    </style>
    <div id="profadd" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 100%;">
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
            <img style="position: static; width: 80px; height: 80px; border-radius: 50%;" src="${img}" alt="${name}'s profile picture">
            <span>${name}</span>
        </div>
        <div class="newfriend" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
            <button type="click" id="addnewfriend" style="background-color: #4CAF50;" class="btn-home btn btn-secondary">${type}</button>
            <button style="background :gray;" type="click" id="backtosearch" class="btn-home btn btn-secondary">Back</button>
        </div>
    </div>
    `;
}

function addnewFriend(name){
        const newfriend = document.getElementById('addnewfriend')
    if (newfriend){
        newfriend.addEventListener('click' , (e) => {
            const data = {
                to_user : name,
                form_user :"",
                action : "sent",
                status : ""
            }
            addordelete(data,'POST','friendship');
            window.notificationSocket.send(JSON.stringify(data));
            document.querySelector('.logout-popup').style.display = 'none';
            showAlert('Send request successefully','success')
        });
    }
}

function deleteFriend(name){
    const newfriend = document.getElementById('deletefriend')
    if (newfriend){
        newfriend.addEventListener('click' , (e) => {
            console.log("HANDEL ADD NEW FRIEND HERE");
            const data = {
                to_user : name,
                form_user :"",
                action : "remove",
                status : ""
            }
            addordelete(data,'POST','friendship');
            document.querySelector('.logout-popup').style.display = 'none';
            showAlert('deleted successefully','info')
        });
    }
}
function slidProf(info){
    // const searchBarr = serachBar();
    // const prof = profSection();
    // data = document.querySelector('.forsddProf');

    const name = info.name;
    const img = info.img;
    return `
        <style>
        .logout-popup {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5000;
            justify-content: center;
            align-items: center;
            gap :10px;
            background-color: rgba(0, 0, 0, 0.8);
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
        #forprof{
            display :none;
        }
    </style>
        <div id="logoutPopup" class="logout-popup">
            <div class="logout-popup-content">
            <div id="profadd" style="display :flex; flex-direction: column; align-items :center; justify-content:center; gap :10px; width:100%; height :100%;" >
                <div style="width:100%; height :100%; display :flex; flex-direction: column; align-items :center; justify-content:center; gap :10px;">
                    <img style="position :static;  width: 80px; height: 80px; border-radius: 50%;"  src="${img}" >
                    <span>${name}</span>
                </div>
                <div style="width:100%; height :100%; display :flex; flex-direction: column; align-items :center; justify-content:center; gap :10px;" >
                    <button type="click" id="deletefriend" style="background : var(--red);" class="btn-home btn btn-secondary " >delete</button>
                    <button style="background :gray;" type="click" id="toprof" class="btn-home btn btn-secondary " >Back</button>
                </div>
            </div>
            </div>
        </div>
                `
                
}
function slidFriend(){
    const searchBarr = serachBar();
    // const prof = profSection();
    return `
        <style>
        .logout-popup {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5000;
            justify-content: center;
            align-items: center;
            gap :10px;
            background-color: rgba(0, 0, 0, 0.8);
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
        #forprof{
            display :none;
        }
    </style>
        <div id="logoutPopup" class="logout-popup">
            <div class="logout-popup-content">
                ${searchBarr}
            </div>
        </div>
                `
                
}

const addFriends = () => {
    const elem = document.getElementsByClassName('.img-profile')
    const popuping = slidFriend();
    // const data = [
    //     {img :"/images/ah.png", status : true ,name :"ahbajaou",}
    // ]
    return     elem.innerHTML = `

    <div  class="addfriend d-flex justify-content-center align-items-center" style="gap :10px; background:var(--dark); border-radius :5px;" >
        <button  type="click" class="flag btn-home btn btn-secondary " style="font-size :100%; border-radius :5px;  background:var(--red); display: flex; justify-content: center; align-items: center;" >
            <i style="color: #fff;" class="fa fa-user-plus" aria-hidden="true"></i>
        </button>
        <span class="forAdd" style="" ></span>
        <div class="scrollable-div" style="" >

        </div>
    </div>
    `;
}

function handleNotification(){
    const notificationIcon = document.getElementById("notificationIcon");
    const html = profSection();
    notificationIcon.style.animation = "none";
    notificationIcon.style.color = "#fff"

    window.notificationSocket.onmessage = (message) => {
            notificationIcon.style.animation = "scaleNotification 1s ease-in-out infinite";
            notificationIcon.style.color = "var(--red)"
    };
    document.querySelector('.notif').addEventListener('click' , async (e) => {
            notificationIcon.style.animation = "none";
            notificationIcon.style.color = "#fff"

            const  hey = await getnotification('friendship')
            const allnotif = hey.map(item => ({ username: item.from_user.username }));
            const fillnoti =  document.querySelector('#seenotification');
            let  data = '';
            allnotif.forEach(elem => {
                data += `
                     <li><a style="display:flex; justify-content:space-between;" class="dropdown-item">
                     ${elem.username}
                     <div>
                     <i id="addhim" data-name=${elem.username} class="fa-regular fa-circle-check"></i>
                     <i id="refusehim" data-name=${elem.username} class="fa-regular fa-circle-xmark"></i>
                     </div>
                     </a>
                     </li>
                 `;
            })
        fillnoti.innerHTML = data;
        const addhim = document.querySelectorAll('#addhim')
        addhim.forEach(elem =>{
            elem.addEventListener('click' , (e) =>{
                // console.log("ADD HIME HERE " + elem.dataset.name);
                const data = {
                    to_user : elem.dataset.name,
                    form_user :"",
                    action : "accepted",
                    status : ""
                }
                addordelete(data,'POST','friendship');
                showAlert('accepted','info')

            })
        })
        const refusehim = document.querySelectorAll('#refusehim')
        refusehim.forEach(elem =>{
            elem.addEventListener('click' , (e) =>{
                // console.log("refusehim HERE " + elem.dataset.name);
                const data = {
                    to_user : elem.dataset.name,
                    form_user :"",
                    action : "rejected",
                    status : ""
                }
                addordelete(data,'POST','friendship');
                showAlert('rejected','info')  
            })
        })
 
    });
}
class profilePage extends HTMLElement {
    statsHistory = [];
    frienSection = addFriends();

    template = `
        <div class="content-profile ">
                <div class="cart-profile ">
                <div class="info-profile" >
                        <div style="width :30px; height :200px;display:flex; align-items: start; justify-content: center;" >
                            <div class="dropdown notif" style="height :30px; width :30px; border-radius:50%; background:var(--dark); display:flex; align-items: center; justify-content: center; " >
                                <i id="notificationIcon" style="color :; margin: 0; padding: 0; position: static; vertical-align: middle;" data-bs-toggle="dropdown" class=" fa-solid fa-bell"></i>
                                <ul id="seenotification" style="overflow-y:auto; height :200px; width:200px; z-index:3000; background:var(--dark);" class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
                                    
                                </ul>
                            </div>
                        </div>
                        <div style="height :100%; width :100%; display:flex; align-items: center; justify-content: center; flex-direction: column;" >
                            <img id="img_intra" src="" >
                            <h3 id='username' ></h3>
                            <button id="tosetting" type="click" class="btn-home btn btn-secondary " >Edit</button>
                        </div>
                    </div>
                    <div class="lvl-profile">
                        <div class="bio-profile">
                            <h5>Bio</h5>
                            <h5 id="BIO" ></h5>
                            <br>
                        </div>
                        <div class="lvl">
                            <div class="progress">
                                <div id="progcon" class="progress-bar progress-bar-info progress-bar-striped active" style=" box-shadow:none;"></div>
                                <div id="progvalue" class="progress-value">0%</div>
                            </div>
                        </div>

                    </div>
                    <div  class="img-profile d-flex justify-content-center align-items-center ">
                        ${this.frienSection}
                    </div>
                </div>
        </div>
    `;
    templatStyle = `
        <style>
                @keyframes scaleNotification {
                    0% {
                        transform: scale(1); /* Initial size */
                    }
                    50% {
                        transform: scale(1.2); /* Enlarged */
                    }
                    100% {
                        transform: scale(1); /* Back to normal */
                    }
                }

                #notificationIcon {
                    animation: scaleNotification 0.5s ease-in-out infinite;
                    color :var(--red);
                }
                
                #notificationIcon.animate {
                    animation: none;
                    color :#fff;
                }
            .nav-bar{
                display :flex;

                }
                #prof{
   
                    color: #fff; 
                }
                /* Webkit Browsers (Chrome, Edge, Safari) */
                .scrollable-div::-webkit-scrollbar {
                    width: 6px; /* Narrow scrollbar for a mobile-like feel */
                }
        
                .scrollable-div::-webkit-scrollbar-thumb {
                    background: var(--red); /* Thumb color */
                    border-radius: 10px; /* Rounded thumb for a smooth look */
                }
        
                .scrollable-div::-webkit-scrollbar-thumb:hover {
                    background: #fff; /* Darker color on hover */
                }
        
                .scrollable-div::-webkit-scrollbar-track {
                    background: transparent; /* Transparent track for minimalistic style */
                }
            .flag .fa-solid {
                margin: 0;
                padding: 0;
                position: static; /* Reset any default positioning */
                vertical-align: middle; /* Ensure alignment within the flexbox */
            }
            .content-profile{
                gap:5px;
            }
            .cart-profile{
            height :39vh;
            background: linear-gradient(-80deg, 
            rgb(4, 28,68, 1) 5%, 
            rgba(56, 75, 112, 0.2) 100%
            );
            border-radius:5px;
            overflow :hidden;
            padding :5px;
            z-index :2000;
                display :flex;
                justify-content: center;
                align-items: center;
                gap:15px;
            
            }
            .info-profile{
                height :100%;
                flex-basis: 40%;
                display :flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                gap :0px;
            }
            .lvl-profile{
                height :80%;
                flex-basis: 50%;
                display :flex;
                justify-content: center;
                flex-direction: column;
                gap :0px;
            }
            .lvl-profile .lvl-prof{
                  opacity:0.4;
            }
            .achev{
                gap :8px;
                display :flex;
                align-items: center;
                margin-top :15px;
            }
            .achev h5 {
                position :relative;
                top: 46px;
                height :60px;
            }
            .btn-secondary{
                width :70%;
            }
            .ach{
                width :60px;
                height :60px;
                border-radius :10px;
                background-color: rgba(255, 255, 255, 0.384);
            }
            .info-profile img{
                max-width: 130px;
                height: 130px;
                object-fit: cover;
                border-radius:50%;
            }
        .btn-home{
            width :200px;
            height:50px;
            background-color: rgba(228, 5, 47, 1);

            border-radius:12px;
            border :none;
            font-size:100%;
            z-index :2000;
        }
            .img-profile{
                height :100%;
                flex-basis: 10%; 
            }
            .img-profile img{
                width :40vw;
                height :41vh;
                position :absolute;
                top :0%;
                left :59%;
            }
            .achevmet-piece{
                display :flex;
                flex-direction: row;
                gap :5px;
            }
            .progress{
                height: 15px;
                width :320px;
                 background:rgb(0 0 0 / 0.5);
                margin: 0;
                overflow: visible;
                border-radius: 10px;
            }
            .progress .progress-bar{
                border-radius: 10px;
                 background:var(--red);
                 box-shadow :none;
                 
            }
            .progress .progress-value{
                position: relative;
                left: 0px;
                top: -15px;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                letter-spacing: 2px;
            }
            .progress-bar.active{
            animation: reverse progress-bar-stripes 0.40s linear infinite, animate-positive 2s;
            }
            @-webkit-keyframes animate-positive{
            0% { width: 0%; }
            }
            @keyframes animate-positive {
            0% { width: 0%; }
            }
            .addfriend{
                height :95%;
                width :85%;
                flex-direction: column;
            }
            .flag{
                width :70%;
                height :10%;
            }
            .sign{
                position :relative;
                top:-15%;
                left:15%;
                width :10px;
                height :10px;
                border-radius :50%;
                z-index :3000;
                border :1px solid ;
            }
            .profsign{
                height :32%;
            }
            .scrollable-div{
                overflow-x :hidden; 
                overflow-y: auto;
                height :80%;
                width :95%;
            }
            @media (min-width: 320px) and (max-width: 1024px) {
                    .img-profile{
                        display :none;
                    }
                    .cart-profile{
                        flex-direction: column-reverse;
                        height :50%;
                        width :100vw;
                        border-radius:0px;
                    }
                    .info-profile{
                        height :80%;
                    }
                .scrollable-div::-webkit-scrollbar {
                    height :2px;
                }
                    .addfriend{
                        height :65px;
                        width :100%;
                        flex-direction: row;
                    }
                    .flag{
                        width :16%;
                        height :50px;
                    }
                    .profsign{
                        height :70px;
                        
                    }
                    .sign{
                        left:30%;
                    }
                    .scrollable-div{
                        display :flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: row;
                        gap :10px;
                        overflow-x :auto; 
                        overflow-y: hidden;
                        height :100%;
                        width :95%;
                    }
                    .img-profile{
                        height :15%;
                        width :100%; 
                    }
            }
        </style>
    `;

    winorLose = `
    <div class="winorlose">
        <table class="table editTabel" >
            <thead>
                <tr>
                    <th scope="col">Player</th>
                    <th scope="col">Score</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Score</th>
                    <th scope="col">Player</th>
                </tr>
            </thead>
            <tbody class="players" >

            </tbody>
        </table>
    </div>
    `;
    winorLoseStyle = `
        <style>
            .winorlose{
                position: relative;
                overflow-y: auto;
            }

            .winorlose::-webkit-scrollbar {
                width: 4px; /* Narrow scrollbar for a mobile-like feel */
                height: 4px;
            }

            .winorlose::-webkit-scrollbar-thumb {
                background: var(--red); /* Thumb color */
                border-radius: 5px; /* Rounded thumb for a smooth look */
            }

            .winorlose::-webkit-scrollbar-thumb:hover {
                background: #fff; /* Darker color on hover */
            }

            .winorlose::-webkit-scrollbar-track {
                background: transparent; /* Transparent track for minimalistic style */
            }
            .userleft{
                width :100%;
                height :75px;
                display :flex;
                justify-content: center;
                align-items :center;
                flex-direction: row;
                gap :5%;
            }
            .userInfo{
                height :100%;
                width :10vw;
                display :flex;
                justify-content: center;
                align-items :center;
                flex-direction: row;
                gap :5%;
            }
            .userPart{
               min-height :50vh;
            }
            .name-user{
                width :100px;
            }
            .name-userright{
                text-align: right;
            }
            .winIcon{
                width :100px;
                height :300px;
                position :relative;
                left :0;
                top :-15px;
                display :flex;
                justify-content: center;
                align-items :center;
                
            }
            .winIcon img{
                width :30%;
                heigth :30%;
               
            }
            .imgIcon{
                width :200px;
                height :100px;
                display :flex;
                justify-content: center;
                align-items :center;
                flex-direction: column;
                
            }
            .img-user{
                width :60px;
                height :550px;
                border-radius :15px;
                border :5px solid rgba(56, 75, 112, 1);
                overflow: hidden;
            }
            .img-user img{
                width :100%;
                height :100%;
            }
            .score-user{
                width :30px;
                height :50px;
                border-radius :10px;
                background :rgba(217, 217, 217, 0.1);
                display :flex;
                justify-content: center;
                align-items :center;
            }
            .time-user{
                width :20%;
                height :100%;
                display :flex;
                justify-content: center;
                align-items :center;
                flex-direction: column;
            }
            .time-user h6{
                text-align :center;
            }
            .noonehere{
                display :none;
            }
            .noonehere{
                display :none;
            }
            .time-user img {
                width :38%;
                height :80%;
            }
             @media (min-width: 320px) and (max-width: 1024px) {
                        .name-user{
                            display :none;
                        }
                        .winorlose{
                            width :100vw;
                            height :50vh;
                            background: none;
                            overflow-y: auto;
                        }
                        .userInfo{
                            flex-basis: 10%;
                            gap :1%;
                        }
                        .imgIcon{
                            width :90px;
                        }
                        .userInfo{
                            height :100%;
                            width :40vw;
                        }
                    .time-user{
                        width :30%;
                    }
                
                .noonehere{
                    display :flex;
                }
                .winIcon{
                    display :flex;
                    flex-direction: column;
                    height :100%;
                }
            .imgIcon{
                height :130px;
            }
             }
        </style>
    `;
    gameRank = `
        <div class="gameRank">
            <div class="cycle-progress" >

            </div>
            <div class="cont-progress" >
                    <div class="cart" >
                        <h4>Total Win</h4>
                        <p id="win" >0</p>
                        <h4 id="winone" >0%</h4>
                    </div>
                    <div class="cart" >
                        <h4>Total Lose</h4>
                        <p id="lose" >0</p>
                        <h4 id="loseone" >0%</h4>
                    </div>
            </div>
        </div>
        <style>
            .cart{
                width :80%;
                height :45%;
                display :flex;
                align-items: left;
                justify-content: space-around;
                flex-direction: column;
                 background:rgb(0 0 0 / 0.5);
                border-radius :10px;
                padding :10px;
            }
        
        </style>
    `;
    gamerankStyle = `
    <style>
        .gameRank{
                width :50%;
                height :50vh;
                display :flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                background: var(--bluenes);
                border-radius :5px;
                z-index :2000;
            }
        .cycle-progress{
            display :flex;
            align-items: center;
            justify-content: center;
            width :45%;
            height :100%;
            gap :20px;
        }
        .cont-progress{
            width :55%;
            height :90%;
            display :flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap :10px;
            
        }
        @media (min-width: 320px) and (max-width: 1024px) {
                .gameRank{
                    width :100vw;
                    height :70vh;
                    border-radius :0px;
                    flex-direction: column
                }
            .cycle-progress{
                display :flex;
                width :100%;
                height :40%;
             }
            .cont-progress{
                width :100%;
                height :100%;
            }
    }
    </style>
    `;
    cycleProgress = `
    <div class="circle-progress">
        <svg class="circle" width="200" height="200">
            <circle class="circle-bg" cx="100" cy="100" r="85"></circle>
            <circle class="circle-progress-path" cx="100" cy="100" r="85"></circle>
        </svg>
        <div class="circle-value">0%</div>
    </div>
<style>
  :root {
      --value: 20; /* Default value */
    }

        .circle-progress {
            width: 200px;
            height: 200px;
            position: relative;
        }

        .circle {
            transform: rotate(-90deg);
        }

        .circle-bg {
            fill: none;
            stroke: var(--dark);
            stroke-width: 12;
        }

        .circle-progress-path {
            fill: none;
            stroke: var(--red);
            stroke-width: 12;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.5s ease;
        }

        .circle-value {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
         
        }
</style>


    `
    templatTwo = `
        <div class="static-profile">
            ${this.winorLose}
            ${this.gameRank}
        </div>
    `;
    templatwoStyle = `
        <style>
            .static-profile{
                height :56vh;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius :25px;
                gap :20px;
            }
            .winorlose{
                width :50%;
                height :50vh;
                display :flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                background:var(--bluenes);
                border-radius :5px;
                gap :30px;
            }
             @media (min-width: 320px) and (max-width: 1024px) {
                .static-profile{
                    flex-direction: column;
                    height :130vh;
                    border-radius :0px;
                }
             }
        </style>
    `;
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
                z-index :2001;
            }
            .nav-02{
                margin-top:30px;
            }
            .nav-02 .fa-right-from-bracket{
                display :none;
            }
            nav a{
                text-decoration: none;
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
    narotu = [];
    constructor() {
        super();
    }
    async statsPlayer() {
        // Fetch match data
        this.narotu = (await fetchMatchData()).matchHistory;
    
        if (!this.narotu || this.narotu.length === 0) {
            console.log('No match history data found.');
            return;
        }
    
        const onevsone = document.querySelector('.players');
        let from = '';
    
        // Process each match and construct the table rows
        console.table("match history : ",  this.narotu);
        this.narotu.forEach(match => {
            const player1 = match.user1;
            const player2 = match.user2;
            const winner = match.winner.username;
            const loser = winner === player1.username ? player2.username : player1.username;
            const time = match.created.split('T'); // Split the time string at ":"
            const date = time[0]; // Format as HH:mm
            const hourAndMinutes = time[1].split(':'); // Format as HH:mm

    
            from += `
                <tr>
                    <td>
                        <div>
                            <img src="${player1.image}" alt="${player1.username}" style="object-fit: cover; display:block;  width:55px; height: 55px;  border-radius: 50%; ">
                            <span>${player1.username}</span>
                        </div>
                    </td>
                    <td>
                        <div>${match.user1_score}</div>
                    </td>
                    <td>
                        <div>${(match.is_draw ? "draw" : (winner === player1.username ? 'Win' : 'Lose'))}</div>
                    </td>
                    <td>
                        <div>
                            <div>${date}</div>
                            <div>${hourAndMinutes[0]}:${hourAndMinutes[1]}</div>
                        </div>
                    </td>
                    <td>
                        <div>${(match.is_draw ? "draw" : (winner === player2.username ? 'Win' : 'Lose'))}</div>                    </td>
                    <td>
                        <div>${match.user2_score}</div>
                    </td>
                    <td>
                        <div style="" >
                            <img  src="${player2.image}" alt="${player2.username}" style="object-fit: cover; display:block;  width:55px; height: 55px; border-radius: 50%; ">
                            <span>${player2.username}</span>
                        </div>
                    </td>
                </tr>
            `;
        });
    
        // Render the table rows in the DOM
        onevsone.innerHTML = from;
    }
    slidFriend() {
        const friendSection = document.querySelector('.flag'); // Access the first element with the class
        friendSection.addEventListener('click', (e) => {
            // Reset or manipulate DOM content here as needed
            const searchBarContainer = document.querySelector('.forAdd');
            searchBarContainer.innerHTML = slidFriend(); // Update content inside forAdd
    
            // Rebind the events after updating the content inside .forAdd
            this.bindSearchBarEvents();  // Call function to rebind events
        });
    }
    
    async bindSearchBarEvents() {
        const searchBar = document.getElementById('search-bar');
        const resultsDiv = document.getElementById('results');
        const popup = document.getElementById('popup');
        const popupText = document.getElementById('popup-text');
        const overlay = document.getElementById('overlay');
        //here where we add the search for no friend
        const nofriend = await fetchNoFriendsData();

        nofriend.forEach(elem => {
            console.log(elem.username)
            console.log(elem.image)
        })
        async function displayResults(query) {
            resultsDiv.innerHTML = ''; // Clear previous results
            
            if (query) {
                // Fetch the no friends data asynchronously
                const nofriend = await fetchNoFriendsData();
        
                // Filter the no friends data based on the query (search by first_name, last_name, or username)
                const filteredData = nofriend.filter(item => {
                    // Combine first_name and last_name for full name search or search by username/email
                    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
                    const username = item.username.toLowerCase();
                    const email = item.email.toLowerCase();
                    return fullName.includes(query.toLowerCase()) || username.includes(query.toLowerCase()) || email.includes(query.toLowerCase());
                });
        
                // Display results based on the filtered data
                if (filteredData.length) {
                    resultsDiv.innerHTML = `
                        <ul>
                            ${filteredData
                                .map(
                                    item =>
                                        `<li data-name="${item.username}" data-img="${item.image}" class="search-result">
                                            ${item.username}
                                        </li>`
                                )
                                .join('')}
                        </ul>`;
                } else {
                    resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
                }
            }
        }
        
    
        // Event delegation for dynamically generated search result items
        if (resultsDiv) {
            resultsDiv.addEventListener('click', (e) => {
                const clickedElement = e.target.closest('.search-result');
                if (clickedElement) {
                    const name = clickedElement.getAttribute('data-name');
                    const img = clickedElement.getAttribute('data-img');
    
                    // Replace the container with the dynamic profile section
                    document.querySelector('#search-container').style.display = "none";
                    const content = document.querySelector('.logout-popup-content');
                    if (content) {
                        content.innerHTML = '';
                        content.innerHTML = profSection(name, img,false);
                    }
    
                    // Add functionality to buttons
                    document.querySelector('#backtosearch').addEventListener('click', () => {
                        document.querySelector('.forAdd').innerHTML = slidFriend();
                        this.bindSearchBarEvents();
                    });
                    addnewFriend(name);
                }
            });
        }
    
        // Add event listener to search bar
        if (searchBar) {
            searchBar.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                displayResults(query); // Show matching results
            });
        }
    
        // Add click listener for the 'back to profile' button
        document.querySelector('#backtoprof').addEventListener('click', () => {
            document.querySelector('.logout-popup').style.display = 'none';
        });
    }
    
    
    openProfile() {
        
        const openProfileElements = document.querySelectorAll('.profsign'); // Select all span elements with the class 'profsign'
        
        console.log("---------------------------------" + openProfileElements);
        openProfileElements.forEach(field => {
            field.addEventListener('click', (e) => {
                // Get data attributes from the clicked element
                const name = field.querySelector('.forsddProf').dataset.name;
                const img = field.querySelector('.forsddProf').dataset.img;
        
                // Pass the data dynamically to slidProf and display the popup
                const profilePopup = slidProf({ name, img });
                document.body.insertAdjacentHTML('beforeend', profilePopup);
        
                // Add functionality to the back button
                const backToSearch = document.querySelector('#toprof');
                backToSearch.addEventListener('click', () => {
                    document.querySelector('#logoutPopup').remove(); // Close the popup
                });
                deleteFriend(name);
            });
        });
        
    }
    
    async stockFriends() {
        //add your friend here
        const myfriend = await fetchFriendsData()
        console.table(myfriend);
        this.statsHistory = myfriend.friends
        const main = document.querySelector('.scrollable-div');
        let prof = '';
       let  index = 0;
       this.statsHistory.forEach((info) => {
           // index++;
         prof += `
           <span type"click" class="profsign d-flex justify-content-center align-items-center flex-column" data-index="${index}">
           <img id="openprof" type="click" style="position: static; width: 50px; height: 50px; border-radius: 50%;" src="${info.image}">
           <span id="" data-name="${info.username}" data-img="${info.image}" class="forsddProf" style=""></span>
           <span class="sign" style="background: ; border :none;"></span> 
            </span>
            `;
        });
        main.innerHTML = prof;
        this.openProfile()
    }
    cycleValue;
    render() {
        const uuss = async () => {
            if (!getCookie('access')){
                navigateTo('/login');
            }
            this.info = await fetchUserData();
            if (this.info){
                if (this.info.image){
                    document.getElementById('img_intra').src = this.info.image
                }
                document.getElementById('username').textContent = this.info.username
                document.getElementById('BIO').textContent = this.info.bio
                
                const stats = await fetchStatsData(); // Fetch the stats data

                    if (stats){
                        document.getElementById('win').textContent = stats.wins;
                        document.getElementById('winone').textContent = "";
                        document.getElementById('lose').textContent = stats.losses;
                        document.getElementById('loseone').textContent = "";

                        const newValue = (stats.wins / (stats.wins + stats.losses) * 100);
                        document.getElementById('progcon').style.width = Math.round((this.info.score * 100) / 777)+"%";
                        document.getElementById('progvalue').textContent = Math.round((this.info.score * 100) / 777) + "%";





                        const circle = document.querySelector('.circle-progress-path');
                        const valueDisplay = document.querySelector('.circle-value');

                        const radius = circle.r.baseVal.value;
                        const circumference = 2 * Math.PI * radius;

                        // Set initial values
                        circle.style.strokeDasharray = circumference;
                        circle.style.strokeDashoffset = circumference;
                        function setProgress(percent) {
                            // Ensure percent is between 0 and 100
                            percent = Math.min(100, Math.max(0, percent));
                            
                            const offset = circumference - (percent / 100 * circumference);
                            circle.style.strokeDashoffset = offset;
                            valueDisplay.textContent = Math.round(percent) + '%';
                        }

                        let progress = 0;
                        const interval = setInterval(() => {
                            progress += 1;
                            setProgress(progress);
                            if (progress >= newValue) clearInterval(interval);
                        }, 30);

                }else{
                    document.getElementById('win').textContent = "0";
                    document.getElementById('winone').textContent = "";
                    document.getElementById('lose').textContent = "0";
                    document.getElementById('loseone').textContent = "";
                    document.getElementById('cycleValue').textContent = "0";
                }

            }
            else{
                navigateTo('/login');
            }
        }
        uuss();
        window.notificationSocket = new WebSocket('wss://'+window.location.host+'/wss/notif/');


        window.notificationSocket.onclose = (event) => {
                if (!event.wasClean) {
                        console.log("Connection closed unexpectedly");
                    }
                };
        window.notificationSocket.onopen = (event) => {
            console.log("notification Connetcted ...");
        };

        this.innerHTML = `
            ${this.template}
            ${this.templatTwo}
            ${this.templatStyle}
            ${this.templatwoStyle}
            ${this.winorLoseStyle}
            ${this.gamerankStyle}
            <style>
            ${this.navar}
                .editTabel{
                    position: absolute;
                    top: 0;
                    height :95%;
                }
                table.table tbody tr:nth-child(odd) { 
                    background-color: var(--dark); 
                }

                table.table tbody tr:nth-child(even) {
                    background-color: var(--blue); 
                }

                .table>thead {
                    position: sticky;
                    top:0;
                }
            
                table.table td, table.table th {
                    padding: 2%;
                    text-align: center;
                }

            
                table.table {
                    border-collapse: collapse;
                    width: 100%;
                    font-size :75%;
                }

                table.table tbody tr {
                    border-bottom: 1px solid var(--dark);
                }
                table.table td div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            </style>
        `;

        this.querySelector('.cycle-progress').innerHTML = this.cycleProgress;   
 
            const backToSearch = document.querySelector('#tosetting');
            backToSearch.addEventListener('click', () => {
                navigateTo('/setting')
            });
    }
    connectedCallback() {
        this.render();
        console.log('this is value of : ' + this.cycleValue)
        this.statsPlayer();
        this.slidFriend();
        this.stockFriends();
        logout();

        handleNotification();
    }
}

customElements.define('profile-page', profilePage);

