// 플레이어 정보
class playerStat {
    constructor() {
        // 이름
        this.playerName = "Jevil"; // 디폴트 이름 Jevil

        // 클래스
        this.playerClass = 0; // 초기 클래스 0 (없음)

        // 생명력 = HP
        this.hp = 100;  // 초기 값

        // 행동력 = AP
        this.ap = 100;  // 초기 값

        // 체력 (대미지 경감)
        this.end = 50;  // 초기 값

        // 근력 (맨손 대미지 증가,부족시 특정 무기(대형 근접무기 등) 사용불가, 특정 선택지 출현)
        this.str = 50;  // 초기 값

        // 감각 (아이템 및 적 발견 확률 증가, 무기 대미지와 사거리 증가, 총기 대미지와 사거리 추가 증가, 특정 선택지 출현)
        this.per = 50;  // 초기 값

        // 상태이상
        this.status = [];

        // 장비 중인 무기
        this.weapon = 0; // 초기 장비코드 0 (맨손)

        // 소지품
        this.inventory = [];

        // 플래그
        this.flag = [];

        // 플레이어 좌표
        this.x = 0;
        this.y = 0;

        // 게임을 시작한 이후 진행된 턴 수
        this.turn = 0;

        // 현재 게임 내 시간
        this.gameTime = 0; // 0:심야, 1:아침, 2:낮, 3:저녁, 4:밤
    }
}