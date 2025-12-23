class OptionRenderer {
    draw(state) {
        background(50, 50, 80);

        fill(255);
        textAlign(CENTER, CENTER);
        
        // --- タイトル ---
        textSize(32);
        text("オプション", width / 2, height / 4);

        // --- 内容 ---
        textSize(20);
        text("スピード : 通常 (サンプル)", width / 2, height / 2);

        // --- キー操作ガイド ---
        textSize(16);
        fill(200);
        text("Spaceキー または Escキー で戻る", width / 2, height - 100);

        // --- 戻るボタンの描画 ---
        // ボタンの位置とサイズ
        let btnW = 120;
        let btnH = 40;
        let btnX = width / 2 - btnW / 2;
        let btnY = height - 60;

        // ホバー時は色を変える（stateから情報をもらう）
        if (state.isBackHovered) {
            fill(255, 200, 0); // ホバー時（オレンジ黄色）
            stroke(255);
        } else {
            fill(100); // 通常時（グレー）
            stroke(200);
        }
        
        // ボタンの枠
        rect(btnX, btnY, btnW, btnH, 10); // 角丸

        // ボタンの文字
        noStroke();
        fill(255);
        textSize(18);
        text("戻る", width / 2, btnY + btnH / 2);
    }
}