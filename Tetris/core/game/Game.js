class Game{ //ゲームの制御
    constructor(setting, board){
        //関連クラスの初期化
        this.strategy = new SevenBagStrategy();
        this.factory = new TetrominoFactory(this.strategy);
        
        this.poly = new PolyManager(this.factory, board);
        this.lock = new LockManager(board, this.poly);
        this.mover = new MoveManager(
            board,
            this.poly,
            () => this.lock.resetLockDelay()
        );
        this.effect = new EffectManager(board);
        this._score = new ScoreManager(setting);

        this.setting = setting;
        this.lastDropTime = millis(); //落下記録
    }

    update(){ //ゲームの更新
        if(millis() - this.lastDropTime > this._score.dropInterval){
            this.lastDropTime = millis();
            if(!this.mover.move(0, 1)){
                this.lock.startLockDelay();
            }
        }
        this.lock.updateLockDelay();
    }

    //ファザード
    move(dx, dy) { return this.mover.move(dx, dy) }
    rotateLeft() { return this.mover.rotateLeft() }
    rotateRight() { return this.mover.rotateRight() }

    spawnNext() { return this.poly.spawnNext()}
    swapHold() { return this.poly.swapHold() }
    updateGhost() { return this.poly.updateGhost() }
    get current() { return this.poly.current }
    get next() { return this.poly.next }
    get hold() { return this.poly.hold }
    get ghost() { return this.poly.ghost }
    //set factory(newValue) { this.poly.factory = newValue } 

    lockPiece() { return this.lock.lockPiece() }

    select(key) { return this.effect.select(key) }
    detonate() { return this.effect.detonate(this.setting.blockSize) }

    get score() { return this._score.score }
}