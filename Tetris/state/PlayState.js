class PlayState extends State{
    enter(manager){
        this.renderer = new GameRenderer(manager.setting);
        this.board = manager.board;
        this.game = manager.game;
    }

    update(){
        this.game.update();
    }

    render(){
        this.renderer.drawBoard(this.board);
        this.renderer.drawPolyomino(this.game.current);
        this.renderer.drawPolyomino(this.game.ghost, 0.3);

        //以下修正対象
        // スコア
        //this.renderer.drawScoreFrame();
        if (this.game.score) {
            this.renderer.drawScore(this.game.score);
        }

        // NEXT
        this.renderer.drawNextFrame();
        if (this.game.next) {
            this.renderer.drawNext(this.game.next);
        }

        // HOLD
        this.renderer.drawHoldFrame();
        if (this.game.hold) {
            this.renderer.drawHold(this.game.hold);
        }
    }
}