class GameSetting{ //変更可能な設定を管理
    #blockSize;
    get blockSize() { return this.#blockSize }
    set blockSize(newValue) { this.#blockSize = newValue }

    #level = 1;
    get level() { return this.#level }
    set level(newValue) { this.#level = newValue }
}