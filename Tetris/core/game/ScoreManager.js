class ScoreManager {
    constructor(setting){
        this._score = 0; //スコア
        this.level = setting.level; //レベル
        this._dropInterval = 1000 - (this.level - 1) * 100; //落下間隔
        this.maxLevel = 10; //最大レベル
        this.combo = -1; //コンボ数
        this.totalLines = 0; //合計消去ライン数
        this.linesPerLevel = 10; //レベルアップに必用なライン数

        //イベント購読
        eventBus.on("piece-locked", (data) => {
            this.onPieceLocked(data);
        });
        eventBus.on("hard-drop", ({dist}) => {
            this._score += dist * 2;
        });
    }

    onPieceLocked({ lines }){
        this.combo = (lines > 0) ? this.combo + 1 : -1; //コンボ継続判定
        let base = this.calcLineScore(lines);

        if(this.combo > 0){ //コンボ
            base += 50 * this.combo * this.level;
        }

        this._score += base * this.level;
        this.updateLevel(lines);
    }

    calcLineScore(lines){ //スコアを計算
        return [0, 100, 300, 500, 800, 1200][lines] || 0;
    } //tspinの判定が困難だったため消去ライン数のみで計算

    updateLevel(lines){ //レベルアップ判定
        this.totalLines += lines;
        if(this.totalLines >= this.linesPerLevel &&
            this.level < this.maxLevel){
            this.level++;
            this.totalLines -= this.linesPerLevel;
            this._dropInterval = 1000 - (this.level - 1) * 100;
        }
    }

    get score() { return this._score }
    get dropInterval() { return this._dropInterval }
}

