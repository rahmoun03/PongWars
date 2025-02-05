import { render } from "./render.js";
import { menu } from "./loby.js";
import { fetchUserData } from "../../page/readData.js";

export function waitingPage(opp_data = null) {
    let usr_data;
    async function getData() {
        usr_data = await fetchUserData();
    }
    getData().then(() => updateUserCards());

    const waiting = document.createElement('div');
    const left_user = document.createElement('div');
    const right_user = document.createElement('div');
    const midel_info = document.createElement('div');
    const loader = document.createElement('div');
    const cancel = document.createElement('button');
    const style = document.createElement('style');

    waiting.classList = 'waiting';
    left_user.classList = 'left_user';
    right_user.classList = 'right_user';
    midel_info.classList = 'midel_info';
    loader.classList = 'loader';

    midel_info.textContent = 'Searching across the galaxy...';
    cancel.textContent = 'CANCEL';
    style.textContent = `
        @keyframes hyperspace {
            0% { transform: translateZ(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateZ(300px); opacity: 0; }
        }

        @keyframes space-float {
            0% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(1deg); }
            75% { transform: translateY(10px) rotate(-1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes hologram {
            0% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.8; transform: scale(1); }
        }

        @keyframes scanner {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(calc(2500%)); }
        }

        .waiting {
            font-family: "Pong War", 'Press Start 2P';
            display: flex;
            flex-direction: row;
            position: absolute;
            width: 100%;
            height: 100%;
            justify-content: space-around;
            perspective: 1000px;
            overflow: hidden;
        }


        .left_user, .right_user {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 25%;
            height: 80%;
            background: rgba(227, 5, 46, 0.05);
            border: 2px solid rgba(227, 5, 46, 0.3);
            border-radius: 5px;
            backdrop-filter: blur(5px);
            animation: space-float 6s ease-in-out infinite;
            padding: 20px;
            z-index: 2;
            position: relative;
            overflow: hidden;
        }

        .right_user::after {
            content: '';
            position: absolute;
            top: -30px;
            width: 100%;
            height: 30px;
            background: linear-gradient(to bottom, 
                rgba(143, 228, 225, 0.84),
                transparent);
            animation: scanner 2s linear infinite;
        }

        .left_user { animation-delay: 0s; }
        .right_user { animation-delay: 3s; }


        .right_user.no-after::after {
            content: none;
            animation: none;
        }


        .midel_info {
            font-family: 'Roboto';
            gap: 20px;
            display: flex;
            width: 30%;
            height: 100%;
            text-align: center;
            place-items: center;
            place-content: center;
            flex-direction: column;
            color: white;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 4px;
            z-index: 2;
            text-shadow: 0 0 10px var(--red);
        }

        .user_info {
            gap: 25px;
            display: flex;
            flex-direction: column;
            place-items: center;
            place-content: center;
            color: var(--red);
            font-size: 18px;
            padding: 30px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 15px;
            position: relative;
            animation: hologram 4s ease-in-out infinite;
        }

        .user_info::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--red), transparent, var(--red));
            border-radius: 15px;
            z-index: -1;
        }

        .user_image {
            width: 150px;
            height: 150px;
            background-color: rgba(255, 232, 31, 0.1);
            border: 4px solid var(--red);
            border-radius: 50%;
            object-fit: cover;
            transition: 0.5s ease;
            box-shadow: 0 0 20px rgba(227, 5, 46, 0.3);
            position: relative;
        }

        .user_image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                transparent, 
                rgba(64, 68, 68, 0.39), 
                transparent);
            animation: hologram 2s linear infinite;
        }

        .loader {
            position: relative;
            width: 60px;
            height: 10px;
        }

        .loader::before,
        .loader::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 4px solid transparent;
            border-top-color: var(--red);
        }

        .loader::before {
            animation: spin 2s linear infinite;
            border-left-color: rgba(227, 5, 46, 0.3);
        }

        .loader::after {
            animation: spin 1.5s linear infinite reverse;
            border-right-color: rgba(227, 5, 46, 0.3);
        }

        button {
            position: fixed;
            bottom: 5%;
            font-family: "Pong War";
            padding: 15px 30px;
            width: 250px;
            margin-bottom: 20px;
            letter-spacing: 2px;
            color: white;
            background-color: var(--red);
            border: 1px solid white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            z-index: 2;
            overflow: hidden;
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

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .waiting {
                height: 80%;
                flex-direction: column;
                align-items: center;
                padding-bottom: 20%;
                
            }
            
            .left_user, .right_user {
                width: 50%;
                height: 20%;
            }
            .user_image {
                width: 100px;
                height: 100px;
            }
            .midel_info {
                gap: 0px;
                font-size: 16px;
                width: 60%;
                height: 10%;
            }

            @keyframes scanner {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(calc(1000%)); }
            }
            
            button {
                width: 80%;
                max-width: 300px;
            }
        }
    `;

    function createUserCard(data) {
        const userInfo = document.createElement('div');
        const userImage = document.createElement('img');
        const userName = document.createElement('p');

        userInfo.classList.add('user_info');
        userImage.classList.add('user_image');

        if (!data) {
            userName.textContent = "SCANNING...";
            userName.style.color = 'silver';
        } else {
            userImage.src = data.image;
            userName.textContent = data.username.toUpperCase();
        }

        userInfo.appendChild(userImage);
        userInfo.appendChild(userName);
        return userInfo;
    }

    function updateUserCards() {
        left_user.innerHTML = '';
        right_user.innerHTML = '';

        left_user.appendChild(createUserCard(usr_data));
        right_user.appendChild(createUserCard(opp_data));

        if (usr_data && opp_data) {
            midel_info.textContent = 'MAY THE FORCE BE WITH YOU';
        }
    }

    midel_info.appendChild(loader);
    left_user.appendChild(createUserCard(null));
    right_user.appendChild(createUserCard(null));

    waiting.appendChild(style);
    waiting.appendChild(left_user);
    waiting.appendChild(midel_info);
    waiting.appendChild(right_user);
    
    if (!opp_data) {
        right_user.classList.remove('no-after');
        waiting.appendChild(cancel);
    }
    else
        right_user.classList.add('no-after');
    return waiting;
}