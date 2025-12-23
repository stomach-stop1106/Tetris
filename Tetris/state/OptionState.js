class OptionState extends State {
    constructor() {
        super();
        this.optionRenderer = new OptionRenderer();
        // ボタンの上にマウスがあるかのフラグ
        this.isBackHovered = false;
    }

    update(manager) {
        // --- マウス判定 ---
        // ボタンの位置（Rendererと同じ数値にする）
        let btnW = 120;
        let btnH = 40;
        let btnX = width / 2 - btnW / 2;
        let btnY = height - 60;

        // マウスがボタン領域内にあるかチェック
        if (mouseX > btnX && mouseX < btnX + btnW &&
            mouseY > btnY && mouseY < btnY + btnH) {
            this.isBackHovered = true;
        } else {
            this.isBackHovered = false;
        }
    }

    render(manager) {
        this.optionRenderer.draw(this);
    }

    // ★追加: クリック時の処理
    onMousePressed(manager) {
        // もしボタンの上にマウスがあれば、タイトルに戻る
        if (this.isBackHovered) {
            manager.changeState(new MenuState());
        }
    }

    onKeyDown(key, manager) {
        // キーボードでも戻れるようにしておく
        if (key === ' ' || key === 'escape') {
            manager.changeState(new MenuState());
        }
    }
}