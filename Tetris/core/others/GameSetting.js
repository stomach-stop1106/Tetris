class GameSetting{ //変更可能な設定を管理
    #blockSize; //盤面の基礎となるサイズ
    get blockSize() { return this.#blockSize }
    set blockSize(newValue) { this.#blockSize = newValue }

    #level = 1; //ゲームレベル
    get level() { return this.#level }
    set level(newValue) { this.#level = newValue }

    #canLevelUp = true; //レベルアップ可能か
    get canLevelUp() { return this.#canLevelUp }
    set canLevelUp(newValue) { this.#canLevelUp = newValue }
}