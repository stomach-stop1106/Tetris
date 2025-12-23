class PlayState extends State {
    constructor() {
        super();
    }

    enter(manager) {
        console.log("Game Start");
    }

    update(manager) {
        manager.game.update();
    }

    render(manager) {
        const game = manager.game;
        const renderer = manager.renderer;

        // 盤面
        renderer.drawBoard(game.board);

        // ゴースト（先に描画すると見やすい）
        if (game.ghost) {
            renderer.drawPolyomino(game.ghost, 0.3);
        }

        // 現在のブロック
        if (game.current) {
            renderer.drawPolyomino(game.current);
        }

        // ===== UI 表示 =====

        // スコア
        if (game.scoreManager) {
            renderer.drawScore(game.scoreManager);
        }

        // NEXT
        renderer.drawNextFrame();
        if (game.next) {
            renderer.drawNext(game.next);
        }

        // HOLD
        renderer.drawHoldFrame();
        if (game.hold) {
            renderer.drawHold(game.hold);
        }
    }
}
