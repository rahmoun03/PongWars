import { fetchUserData } from '../page/readData.js';


export function RemoteTicTacToe() {

    let usr_data, oppUsername = null;
    async function getData() {
        usr_data = await fetchUserData();
    } 
    getData().then(() => updateUserBadge(oppUsername));


    const style = document.createElement('style');
    style.textContent = `
    .game-TTT {
        color: #fff;
        font-family: 'Poppins', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        position: relative;
        overflow: hidden;
        max-width: 500px;
        width: 100%;
    }

    .game-container {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.1);
        width:100%;
        height:100%;
    }

    .btn-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .game-title-tictac {
        font-size: 2.8em;
        font-weight: 700;
        text-align: center;
        margin-bottom: 30px;
        background: linear-gradient(45deg, #00f2fe 0%, #4facfe 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(79, 172, 254, 0.5);
    }

    .status {
        font-size: 1.3em;
        text-align: center;
        margin: 20px 0;
        padding: 10px 20px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
    }

    .status.your-turn {
        background: rgba(0, 255, 255, 0.1);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
    }

    .status.opponent-turn {
        background: rgba(255, 0, 0, 0.1);
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
    }

    .board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 30px 0;
        padding: 20px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(5px);
    }

    .cell {
        font-family: 'Arial', sans-serif;
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .cell:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .cell:active {
        transform: translateY(0);
    }

    .cell.x-hover:not(:empty) {
        background: rgba(0, 255, 255, 0.1);
    }

    .cell.o-hover:not(:empty) {
        background: rgba(255, 0, 0, 0.1);
    }

    .cell[data-symbol="X"] {
        color: #00f2fe;
        text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
    }

    .cell[data-symbol="O"] {
        color: #ff4b4b;
        text-shadow: 0 0 10px rgba(255, 75, 75, 0.5);
    }

    .reset-btn {
        background: linear-gradient(45deg, #00f2fe 0%, #4facfe 100%);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
    }

    .reset-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
    }

    .reset-btn:active {
        transform: translateY(0);
    }

    .reset-btn:disabled {
        background: linear-gradient(45deg, #ccc 0%, #999 100%);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    @keyframes win-pulse-x {
        0% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.8);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
    }

    @keyframes win-pulse-o {
        0% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.8);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
        }
    }

    .win-X {
        animation: win-pulse-x 1.5s infinite;
        background: rgba(0, 255, 255, 0.2);
    }

    .win-O {
        animation: win-pulse-o 1.5s infinite;
        background: rgba(255, 75, 75, 0.2);
    }

    .player-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
    }

    .player-badge {
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9em;
        max-width: 9rem;
        overflow: hidden;
    }

    #player-x {
        background: rgba(0, 242, 254, 0.2);
        color: #00f2fe;
    }

    #player-o {
        background: rgba(255, 75, 75, 0.2);
        color: #ff4b4b;
    }

    .waiting-animation {
        display: inline-block;
        margin-left: 5px;
    }

    .waiting-animation::after {
        content: '...';
        animation: dots 1.5s steps(4, end) infinite;
    }

    @keyframes dots {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60% { content: '...'; }
        80%, 100% { content: ''; }
    }

    @media (max-width: 480px) {
        .game-container {
            padding: 15px;
        }

        .game-title-tictac {
            font-size: 2em;
        }

        .cell {
            font-size: 2em;
        }

        .status {
            font-size: 1.1em;
        }
    }
    `;

    const content = document.createElement('div');
    content.classList = "game-TTT";
    content.innerHTML = `
        <div class="game-container">
            <h1 class="game-title-tictac">Tic Tac Toe</h1>
            <div class="player-info">
                <span class="player-badge" id="player-x">Player X</span>
                <span class="player-badge" id="player-o">Player O</span>
            </div>
            <div class="status">Waiting for opponent<span class="waiting-animation"></span></div>
            <div class="board">
                <div class="cell" data-index="0"></div>
                <div class="cell" data-index="1"></div>
                <div class="cell" data-index="2"></div>
                <div class="cell" data-index="3"></div>
                <div class="cell" data-index="4"></div>
                <div class="cell" data-index="5"></div>
                <div class="cell" data-index="6"></div>
                <div class="cell" data-index="7"></div>
                <div class="cell" data-index="8"></div>
            </div>
            <div class="btn-container" >
                <button class="reset-btn" id="reset" disabled>Restart</button>
                <button class="reset-btn" id="new" >Back</button>
            </div>
        </div>
    `;

    const WS_URL = 'wss://' + window.location.host + '/TicTacToe/Remote/';
    const socket = new WebSocket(WS_URL);

    let board = Array(9).fill('');
    let role = null;
    let currentPlayer = 'X';
    let gameActive = false;
    let cells = content.querySelectorAll('.cell');
    let statusDisplay = content.querySelector('.status');
    let resetButton = content.querySelector('#reset');
    let newGame = content.querySelector('#new');


    function initializeGame() {
        cells.forEach(cell => {
            cell.addEventListener('click', () => handleCellClick(cell));
        });
        resetButton.addEventListener('click', resetGame);
        newGame.addEventListener('click',  home);
    }

    function handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        // Only allow moves if it's the player's turn and the cell is empty
        if (board[index] === '' && gameActive && currentPlayer === role) {
            socket.send(JSON.stringify({
                'index': index
            }));
            board[index] = role;
            updateCellAppearance(cell, role);
        }
    }

    function updateBoard(newBoard, newCurrentPlayer) {
        board = newBoard;
        currentPlayer = newCurrentPlayer;

        // Update UI
        cells.forEach((cell, index) => {
            const value = newBoard[index];
            if (value) {
                updateCellAppearance(cell, value);
            } else {
                // Clear cell if empty
                cell.textContent = '';
                cell.removeAttribute('data-symbol');
                cell.classList.remove('x-hover', 'o-hover');
            }
        });
    }

    function highlightWinningCells(winnerSymbol) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === winnerSymbol &&
                board[a] === board[b] &&
                board[a] === board[c]) {
                const winClass = `win-${winnerSymbol}`;
                cells[a].classList.add(winClass);
                cells[b].classList.add(winClass);
                cells[c].classList.add(winClass);
                break;
            }
        }
    }

    function updateStatus(message, type = '') {
        statusDisplay.textContent = message;
        statusDisplay.className = 'status ' + type;
    }


    function updateUserBadge(opp_username) {
        let badgeX = content.querySelector('#player-x');
        let badgeO = content.querySelector('#player-o');

        badgeX.textContent = usr_data.username ? usr_data.username : 'Player X' ;
        badgeO.textContent = opp_username ? opp_username : 'Player O' ;
    }

    function updateCellAppearance(cell, symbol) {
        cell.textContent = symbol;
        cell.setAttribute('data-symbol', symbol);
        
        // Add hover effects
        if (symbol === 'X') {
            cell.classList.add('x-hover');
            cell.classList.remove('o-hover');
        } else if (symbol === 'O') {
            cell.classList.add('o-hover');
            cell.classList.remove('x-hover');
        }
    }

    function resetGame() {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                'type': 'reset'
            }));
        } else {
            console.log(`Cannot reset game. WebSocket state: ${socket.readyState}`);
            // Maybe show a message to the user that they need to reconnect
            statusDisplay.textContent = "Connection lost. Please refresh the page.";
        }
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        
        switch (data.type) {
            case 'start':
                role = data.role;
                gameActive = true;
                resetButton.disabled = true;
                newGame.disabled = true;
                updateUserBadge(data.opp_username);
                clear();
                updateBoard(data.board, data.currentPlayer);
                updateStatus(
                    role === data.currentPlayer ? "Your turn" : "Opponent's turn",
                    role === data.currentPlayer ? 'your-turn' : 'opponent-turn'
                );
                break;
            case 'rejoin':
                role = data.role;
                gameActive = true;
                resetButton.disabled = true;
                newGame.disabled = true;
                updateUserBadge(data.opp_username);
                clear();
                updateBoard(data.board, data.currentPlayer);
                updateStatus(
                    role === data.currentPlayer ? "Your turn" : "Opponent's turn",
                    role === data.currentPlayer ? 'your-turn' : 'opponent-turn'
                );
                break;

            case 'game_update':
                updateBoard(data.board, data.currentPlayer);
                updateCellAppearance
                updateStatus(
                    data.currentPlayer === role ? "Your turn" : "Opponent's turn",
                    data.currentPlayer === role ? 'your-turn' : 'opponent-turn'
                );
                break;

            case 'game_over':
                gameActive = false;
                resetButton.disabled = false;
                newGame.disabled = false;
                if (data.winner) {
                    updateBoard(data.board, data.currentPlayer);
                    highlightWinningCells(data.winner);
                    updateStatus(
                        data.winner === role ? "🎉 You won! 🎉" : "You Lose!",
                        data.winner === role ? 'your-turn' : 'opponent-turn'
                    );
                } else if (data.draw) {
                    updateBoard(data.board, data.currentPlayer);
                    updateStatus("Game ended in a draw!", '');
                }
                break;
            case 'error':
                updateStatus(data.message, '');
                break;
            case 'disconnect.message':
                updateStatus(data.message, '');
                setTimeout(() => {
                    home();
                }, 3000);
                break;
            case 'opponent_disconnected':
                gameActive = false;
                updateUserBadge(null);
                updateStatus("Opponent disconnected. Waiting for new opponent...");
                resetButton.disabled = true;
                newGame.disabled = false;
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.removeAttribute('data-symbol');
                    cell.classList.remove('win-X', 'win-O', 'x-hover', 'o-hover');
                });
                break;
        }
    };
    socket.onclose = (e) => {
        console.log("disconnected ... ", e);
        newGame.disabled = false;
    };

    function clear(){
        cells.forEach((cell, index) => {
            cell.textContent = '';
            cell.removeAttribute('data-symbol');
            cell.classList.remove('x-hover', 'o-hover');
            cell.classList.remove('win-X', 'win-O');
        });
    }

    function home(){
        socket.close();
        const content = document.getElementById('content');
        content.innerHTML = '<game-tictac width="100%" height="100%"></game-tictac>';
    }


    initializeGame();

    const parent = document.createElement('div');
    parent.style.display = "flex";
    parent.style.justifyContent = "center";
    parent.style.alignItems = "center";
    parent.style.height = "100%";
    parent.style.width = "100%";
    parent.appendChild(style);
    parent.appendChild(content);

    return parent;
}