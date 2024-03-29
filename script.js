// 뒤로가기 버튼을 숨기거나 표시하는 함수
function toggleBackButtonVisibility() {
    var backButton = document.querySelector('.back-button');
    if (history.length > 1) {
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }
}

// 페이지 로드 시 실행
window.onload = function () {
    toggleBackButtonVisibility();
    displayText(); // 페이지 로드 시 텍스트 출력 함수 호출
    displaySubText('ゲームを始める', ['ゲームスタート']); // 초기 선택지 표시
};

// 뒤로가기 이벤트 발생 시 실행
window.onpopstate = function () {
    toggleBackButtonVisibility();
};

// main-screen을 1000ms 이내에 8번 클릭하면 새 창에 디버그 콘솔이 나타남
var clickCount = 0;
var timeout;

document.querySelector('.main-screen').addEventListener('click', function () {
    clickCount++;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        clickCount = 0;
    }, 1000);
    if (clickCount === 8) {
        window.open('./dbCnsl.html', 'debug-console', 'width=600,height=500');
    }
});

// 텍스트를 한 글자씩 출력하는 함수
function displayText() {
    const mainText = document.querySelector('.main-screen .retro-screen');
    const text = 'ゲームスタートを押してください。';
    let index = 0;

    function addText() {
        if (index < text.length) {
            mainText.textContent += text.charAt(index);
            index++;
            setTimeout(addText, 25); // 25ms마다 한 글자씩 출력
        }
    }

    addText(); // 함수 호출
}

// 서브 화면에 텍스트 및 선택지 출력하는 함수
function displaySubText(text, choices) {
    const subText = document.querySelector('.sub-screen .retro-screen');
    subText.innerHTML = ''; // 이전에 출력된 텍스트 및 선택지 초기화

    // 텍스트 출력
    const textElement = document.createElement('div');
    textElement.textContent = text;
    subText.appendChild(textElement);

    // 선택지 출력
    if (choices && choices.length > 0) {
        const choicesList = document.createElement('ul');
        choices.forEach((choice, index) => {
            const choiceItem = document.createElement('li');
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice;
            choiceButton.addEventListener('click', () => handleChoiceSelect(index));
            choiceItem.appendChild(choiceButton);
            choicesList.appendChild(choiceItem);
        });
        subText.appendChild(choicesList);
    }
}

// 선택지 클릭 이벤트 처리 함수
function handleChoiceSelect(index) {
    // 여기에 선택지에 따른 처리 로직 추가
    console.log('Selected choice:', index);
}

/*
* 디버그 콘솔 (이하 C)
*/

// C 디버그 콘솔
// const fs = require('fs');
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

// C location 명령
function displayLocationInfo() {
    fetch('./data/loc.json')
        .then(response => response.json())
        .then(data => {
            const currentLocation = data.locations.find(loc => loc.locCordX === player.playerLocX && loc.locCordY === player.playerLocY); // 현재 좌표에 해당하는 위치 정보 찾기
            if (currentLocation) {
                addToConsole(`Current location: ${currentLocation.locName} (${player.playerLocX}, ${player.playerLocY})`);
            } else {
                addToConsole(`Current location: unnamed (${player.playerLocX}, ${player.playerLocY})`);
            }
        })
        .catch(error => {
            addToConsole('Error reading location data.');
            console.error(error);
        });
}

// C showInventory 명령
function showInventory() {
    fetch('./data/item.json')
        .then(response => response.json())
        .then(data => {
            const itemData = data.items;
            const inventoryItems = player.playerInventory.map(itemCode => {
                const item = itemData.find(i => i.itemNo === itemCode);
                return item ? item.itemName : `Unknown Item (${itemCode})`;
            });
            if (inventoryItems.length > 0) {
                addToConsole('Player Inventory:');
                inventoryItems.forEach(item => {
                    addToConsole(`- ${item}`);
                });
            } else {
                addToConsole('Player inventory is empty.');
            }
        })
        .catch(error => {
            addToConsole('Error reading item data.');
            console.error(error);
        });
}

// C showWeapon 명령
function showWeapon() {
    fetch('./data/item.json')
        .then(response => response.json())
        .then(data => {
            const itemData = data.items;
            const weaponItem = itemData.find(item => item.itemNo === player.playerWeapon);
            if (weaponItem) {
                addToConsole(`Player equipped : ${weaponItem.itemName}`);
            } else {
                addToConsole('No weapon equipped.');
            }
        })
        .catch(error => {
            addToConsole('Error reading item data.');
            console.error(error);
        });
}

// C addItem 명령
function addItem(itemCode) {
    fetch('./data/item.json')
        .then(response => response.json())
        .then(data => {
            const itemData = data.items;
            const item = itemData.find(i => i.itemNo === parseInt(itemCode));
            if (item) {
                player.playerInventory.push(item.itemNo);
                addToConsole(`Added item: ${item.itemName}`);
            } else {
                addToConsole(`Item with code ${itemCode} not found.`);
            }
        })
        .catch(error => {
            addToConsole('Error reading item data.');
            console.error(error);
        });
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
            addToConsole('- addItem [itemCode]: Add an item to player inventory');
            addToConsole('- showInventory: Display player inventory');
            addToConsole('- showWeapon: Display equipped weapon');
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
            displayLocationInfo();
        } else if (action === 'showInventory') {
            showInventory();
        } else if (action === 'addItem') {
            addItem(target);
        } else if (action === 'showWeapon') {
            showWeapon();
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
