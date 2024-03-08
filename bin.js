/*
* 게임 핵심 코드 (이하 G)
*/

// G 플레이어 정보
class playerStat {
    constructor() {
        // 이름
        this.playerName = "Jevil"; // 디폴트 이름 Jevil

        // 클래스
        this.playerClass = 0; // 초기 클래스 0 (없음)

        // 생명력 = HP
        this.playerHP = 100;

        // 행동력 = AP
        this.playerAP = 100;

        // 체력 (대미지 경감)
        this.endurance = 50;

        // 근력 (맨손 대미지 증가,부족시 특정 무기(대형 근접무기 등) 사용불가, 특정 선택지 출현)
        this.strength = 50;

        // 감각 (아이템 및 적 발견 확률 증가, 무기 대미지와 사거리 증가, 총기 대미지와 사거리 추가 증가, 특정 선택지 출현)
        this.perception = 50;

        // 상태이상
        this.playerStatus = [];

        // 장비 중인 무기
        this.playerWeapon = 0; // 초기 장비코드 0 (맨손)

        // 소지품
        this.playerInventory = [];

        // 플래그
        this.playerFlag = [];

        // 플레이어 좌표
        this.playerLocX = 0;
        this.playerLocY = 0;

        // 게임을 시작한 이후 진행된 턴 수
        this.playedTurn = 0;

        // 현재 게임 내 시간
        this.gameNowTime = 0; // 0:심야, 1:아침, 2:낮, 3:저녁, 4:밤

        // 입력 히스토리
        this.inputHistory = [];
        this.historyIndex = -1; // 현재 입력 히스토리의 인덱스
    }
}

/*
* 디버그 콘솔 (이하 C)
*/

// C 디버그 콘솔
const consoleDiv = document.getElementById('console');
const input = document.getElementById('input');

let player = new playerStat();

// C 메시지 출력
function addToConsole(message) {
    consoleDiv.innerHTML += `<div>${message}</div>`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// C info 명령
function displaySystemInfo() {
    addToConsole('System Information:');
    addToConsole(`${navigator.platform}`); // OS
    addToConsole(`${navigator.appVersion}`); // 브라우저
}

// C player 명령
function displayPlayerInfo() {
    addToConsole('Player Information:');
    addToConsole(`- Name: ${player.playerName}`);
    addToConsole(`- Class: ${player.playerClass}`);
    addToConsole(`- HP: ${player.playerHP}`);
    addToConsole(`- AP: ${player.playerAP}`);
    addToConsole(`- Endurance: ${player.endurance}`);
    addToConsole(`- Strength: ${player.strength}`);
    addToConsole(`- Perception: ${player.perception}`);
    // Add more player stats as needed
}

// C reset 명령
function resetLocalStorage() {
    addToConsole('Warning: This will reset all data. Do you want to proceed? Press "Y" key to confirm or "N" key to cancel.');

    let awaitingInput = true;

    const handleUserInput = (event) => {
        if (!awaitingInput) return;

        const userInput = event.target.value.trim().toLowerCase();
        if (userInput === 'y') {
            localStorage.removeItem('gameState');
            location.reload();
        } else if (userInput === 'n') {
            addToConsole('Reset operation canceled.');
        } else {
            addToConsole('Invalid input. Press "Y" key to confirm or "N" key to cancel.');
        }

        input.value = '';

        awaitingInput = false;
    };

    input.addEventListener('keyup', handleUserInput);
}

// C cls 명령
function clearConsole() {
    consoleDiv.innerHTML = '';
}

// C exit 명령
function exitConsole() {
    window.close();
}

// C 히스토리 기능
function addToHistory(command) {
    player.inputHistory.push(command);
    player.historyIndex = player.inputHistory.length;
}

// C 히스토리 기능 키입력
function navigateHistory(direction) {
    if (player.inputHistory.length === 0) return;

    if (direction === 'up') {
        if (player.historyIndex > 0) {
            player.historyIndex--;
        }
    } else if (direction === 'down') {
        if (player.historyIndex < player.inputHistory.length) {
            player.historyIndex++;
        }
    }
    input.value = player.inputHistory[player.historyIndex] || '';
}

// C 명령 입력
input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const command = input.value;
        addToConsole(`<span>&gt; ${command}</span>`);
        input.value = '';

        addToHistory(command); // 내가 입력한 히스토리 기록

        const parts = command.split(' ');
        const action = parts[0];
        const target = parts[1];
        const value = parts.slice(2).join(' ');

        if (action === 'help') {
            addToConsole('Available commands:');
            addToConsole('- help: Display available commands');
            addToConsole('- info: Display system information');
            addToConsole('- player: Display player information');
            addToConsole('- get [var]: Get the value of a variable');
            addToConsole('- set [var] [value]: Set the value of a variable');
            addToConsole('- goto [x] [y]: Set player coordinates to specified values');
            addToConsole('- location: Display current player coordinates');
            addToConsole('- reset: Reset local storage (clear saved game state)');
            addToConsole('- cls: Clear console');
            addToConsole('- exit: Exit console');
        } else if (action === 'info') {
            displaySystemInfo();
        } else if (action === 'player') {
            displayPlayerInfo();
        } else if (action === 'get') {
            if (target in player) {
                const value = player[target];
                addToConsole(`${target}: ${value}`);
            } else {
                addToConsole(`Variable '${target}' not found`);
            }
        } else if (action === 'set') {
            if (target in player) {
                player[target] = value;
                addToConsole(`Set '${target}' to '${value}'`);
            } else {
                addToConsole(`Variable '${target}' not found`);
            }
        } else if (action === 'goto') {
            if (!isNaN(target) && !isNaN(value)) {
                player.playerLocX = parseFloat(target);
                player.playerLocY = parseFloat(value);
                addToConsole(`Player coordinates set to (${target}, ${value})`);
            } else {
                addToConsole('Invalid coordinates. Please specify numeric values for X and Y.');
            }
        } else if (action === 'location') {
            addToConsole(`Current player coordinates: (${player.playerLocX}, ${player.playerLocY})`);
        } else if (action === 'reset') {
            resetLocalStorage();
        } else if (action === 'cls') {
            clearConsole();
        } else if (action === 'exit') {
            exitConsole();
        } else {
            addToConsole(`Command '${command}' not recognized`);
        }
    } else if (event.key === 'ArrowUp') {
        navigateHistory('up');
    } else if (event.key === 'ArrowDown') {
        navigateHistory('down');
    }
});