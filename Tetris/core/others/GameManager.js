class GameManager{ //ゲームの状態遷移
    constructor(setting){ //初期設定
        //ゲームロジック関連
        this.setting = setting;
        this.board = new Board();
        this.game = new Game(this.setting, this.board);

        //描画・状態
        this.state = new PlayState();
        this.state.enter(this);
    }

    update(){ //現在の状態を実行
        this.state.update(this);
    }

    render(){ //描画
        this.state.render();
    }
    
    changeState(newState){ //状態遷移
        this.state = newState;
        this.state.enter(this);
    }
}