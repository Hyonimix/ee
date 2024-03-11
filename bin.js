/*
* 게임 로직 (이하 L)
*/

// 페이지 로드 시 실행
window.onload = function () {
    toggleBackButtonVisibility();
    startGame(); // 게임 시작 함수 호출
};

// 게임 시작 함수
function startGame() {
    // 예시: 현재 상황에 따른 선택지 설정
    let currentSituation = 'startChoice'; // 초기 상황 설정
    let choices = [];

    if (currentSituation === 'startChoice') {
        // 게임 시작 상황에서의 선택지
        choices = [
            { text: '게임 시작', action: 'startGame' },
            { text: '나중에 시작', action: 'continueGame' }
        ];
    }

    // 선택지를 화면에 출력
    displaySubText('선택할 수 있는 상황입니다.', choices);
}

// L 서브 화면에 텍스트 및 선택지를 출력하는 함수
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
            choiceButton.textContent = choice.text; // 선택지의 텍스트
            choiceButton.addEventListener('click', () => handleChoiceClick(choice.action)); // 선택지에 대한 클릭 이벤트 추가
            choiceItem.appendChild(choiceButton);
            choicesList.appendChild(choiceItem);
        });
        subText.appendChild(choicesList);
    }
}

// 선택지 클릭 이벤트 핸들러
function handleChoiceClick(action) {
    // 선택지에 따라 다른 동작 수행
    if (action === 'startGame') {
        // 게임 시작 동작 수행
        console.log('게임을 시작합니다.');
    } else if (action === 'continueGame') {
        // 게임 계속하기 동작 수행
        console.log('게임을 계속합니다.');
    } else {
        // 기타 선택지 동작 수행
        console.log('선택지에 대한 동작을 수행합니다.');
    }
}

// 예시: 현재 상황에 따른 선택지 설정
let currentSituation = 'startChoice'; // 초기 상황 설정
let choices = [];

if (currentSituation === 'startChoice') {
    // 게임 시작 상황에서의 선택지
    choices = [
        { text: '게임 시작', action: 'startGame' },
        { text: '나중에 시작', action: 'continueGame' }
    ];
}

// 선택지를 화면에 출력
displaySubText('선택할 수 있는 상황입니다.', choices);

/*
* 게임 핵심 바이너리 (이하 G)
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

window.PlayerStat = PlayerStat;

/*
* 전투 관련 (이하 B)
*/