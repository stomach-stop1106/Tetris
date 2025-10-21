let manager;
let inputHandler

function setup(){
    manager = new GameManager();
    inputHandler = new InputHandler(manager);
    createDisplay();
}

function draw(){
    background(255);
    manager.update();
    manager.render();
}

function keyPressed(){
    if(inputHandler){
        inputHandler.handle(key);
    }
}

function createDisplay(){ //ゲーム画面を生成
    const boardWidth = 16;
    const boardHeight = 22;

    let blockSize = floor(min(
        windowWidth / boardWidth,
        windowHeight / boardHeight
    ));

    canvas = createCanvas(
        blockSize * boardWidth,
        blockSize * boardHeight
    );

    canvas.position(
        (windowWidth - width) / 2,
        (windowHeight - height) / 2
    );

    manager.setBlockSize(blockSize);
}

function windowResized(){ //画面を再生成
    createDisplay();
}

class GameManager{ //ゲームの状態遷移
    constructor(){ //初期設定
        this.factory = new TetrominoFactory();
        this.board = new Board(10,20)
        this.game = new Game(this.factory, this.board);

        this.renderer = new Renderer();

        this.state = new PlayState();
        this.state.enter(this);
    }

    setBlockSize(blockSize){
        this.renderer.setBlockSize(blockSize);
    }

    update(){ //現在の状態を実行
        this.state.update(this);
    }
    render(){ //描画
        this.state.render(this);
    }
    setState(newState){ //状態遷移
        this.state = newState;
        this.state.enter(this);
    }
}

class GameState{ //Stateパターン
    enter(manager){} //状態に入ったときの処理
    update(manager){} //毎フレームの処理
    render(manager){} //描画処理
}

class MenuState extends GameState{}
class PlayState extends GameState{
    enter(manager){
        this.manager = manager;
        this.game = manager.game;
        this.renderer = manager.renderer;
    }

    update(manager){
        this.game.update();
    }
    render(manager){
        this.renderer.drawBoard(this.game.board);
        this.renderer.drawPolyomino(this.game.current);
    }
}

class GameOverState extends GameState{}

class Game{ //ゲームのロジック
    constructor(factory, board){
        this.factory = factory;
        this.board = board;
        this.current = this.factory.createRandom(); //今のブロック
        this.next = this.factory.createRandom(); //次のブロック

        this.dropInterval = 1000; //落下間隔
        this.lastDropTime = millis();
    }

    update(){
        if(millis() - this.lastDropTime > this.dropInterval){
            this.lastDropTime = millis();
            if(!this.move(0, 1)){
                this.board.fix(this.current);
                this.board.clearLines();
                this.spawnNext();
                if(!this.board.canSpawn(this.current)){ //ゲームオーバー
                    //ゲームオーバー処理未実装
                }
            }
        }

    }

    move(dx, dy){ //移動
        const moved = this.current.cloneMoved(dx, dy);
        if(this.board.canPlace(moved)){
            this.current = moved;
            return true;
        }
        return false;
    }

    rotateRight(){ //右回転
        const rotated = this.current.cloneRotatedRight();
        if(this.board.canPlace(rotated)){
            this.current = rotated;
        }
    }

    rotateLeft(){ //左回転
        const rotated = this.current.cloneRotatedLeft();
        if(this.board.canPlace(rotated)){
            this.current = rotated;
        }
    }

    spawnNext(){ //次のブロックを生成
        this.current = this.next;
        this.next = this.factory.createRandom();
    }
}

class Polyomino{ //ブロックの基本操作
    constructor(type, shape, color, x = 4, y = 0){
        this.type = type; //ブロックの種類
        this.shape = shape; //ブロックの形
        this.color = color; //ブロックの色
        this.x = x; //初期座標
        this.y = y;
    }

    getPosition(){ //形から座標を取得
        return this.shape.map(([sx, sy]) => [this.x + sx, this.y + sy]);
    }

    clone(){ //コピーを返す
        const shapeCopy = this.shape.map(([sx, sy]) => [sx, sy]);
        return new this.constructor(
            this.type,
            shapeCopy,
            this.color,
            this.x,
            this.y
        );
    }

    cloneMoved(dx, dy){ //移動したコピーを返す
        const shapeCopy = this.shape.map(([sx, sy]) => [sx, sy]);
        return new this.constructor(
            this.type,
            shapeCopy,
            this.color,
            this.x + dx,
            this.y + dy
        );
    }

    cloneRotatedRight(){ //右回転したコピーを返す
        const shapeCopy = this.shape.map(([x, y]) => [-y, x]);
        return new this.constructor(
            this.type,
            shapeCopy,
            this.color,
            this.x,
            this.y
        );
    }
    cloneRotatedLeft(){ //左回転したコピーを返す
        const shapeCopy = this.shape.map(([x, y]) => [y, -x]);
        return new this.constructor(
            this.type,
            shapeCopy,
            this.color,
            this.x,
            this.y
        );
    }
}

class Tetromino extends Polyomino{
    constructor(type, shape, color, x, y){
        super(type, shape, color, x, y);
    }
}

class Pentomino extends Polyomino{}
class Hexomino extends Polyomino{}

class Factory{ //Factoryパターン
    create(type){ //ブロックを生成
        const shape = this.shapes[type];
        const color = this.colors[type];
        return new this.Product(type, shape, color);
    }

    createRandom(){ //ランダムにブロックを生成
        const types = Object.keys(this.shapes);
        const type = types[Math.floor(Math.random() * types.length)];
        return this.create(type);
    }
}

class TetrominoFactory extends Factory{
    constructor(){
        super();
        this.Product = Tetromino;
        this.shapes = { //キーと形情報
            I: [[0, 0], [1, 0], [2, 0], [3, 0]],
            O: [[0, 0], [1, 0], [0, 1], [1, 1]],
            T: [[1, 0], [0, 1], [1, 1], [2, 1]],
            S: [[1, 0], [2, 0], [0, 1], [1, 1]],
            Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
            J: [[0, 0], [0, 1], [1, 1], [2, 1]],
            L: [[2, 0], [0, 1], [1, 1], [2, 1]]
        };
        this.colors = { //キーと形
            I: "cyan",
            O: "yellow",
            T: "purple",
            S: "green",
            Z: "red",
            J: "blue",
            L: "orange"
        };
    }
}

class PentominoFactory extends Factory{}
class HexominoFactory extends Factory{}

class Board{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
    }

    createGrid(){ //盤面を作る
        return Array.from({length: this.height}, () =>
        Array(this.width).fill(null));

    }

    fix(polyomino){ //ブロックを固定
        for(const [x, y] of polyomino.getPosition()){
            if(
                x >= 0 && x < this.width &&
                y >= 0 && y < this.height
            ){
                this.grid[y][x] = {
                    type: polyomino.type,
                    color: polyomino.color
                };
            }
        }
    }

    clearLines(){ //埋まった行を削除
        this.grid = this.grid.filter(row => row.some(cell => !cell));
        const linesCleared = this.height - this.grid.length;
        while(this.grid.length < this.height){
            this.grid.unshift(Array(this.width).fill(null));
        }
        return linesCleared;
    }

    canPlace(polyomino){ //配置可能か
        for(const [x, y] of polyomino.getPosition()){
            if (x < 0 || x >= this.width || y >= this.height) return false;
            if (y >= 0 && this.grid[y][x]) return false;
        }
        return true;
    }
    
    canSpawn(polyomino){ //続行可能か
        return this.canPlace(polyomino);
    }
}

class Renderer{
    setBlockSize(blockSize){
        this.blockSize = blockSize;
    }

    drawBoard(board){ //ボードを描画
        const w =  board.width;
        const h = board.height;

        for(let i = 0; i < h; i++){
            for(let j = 0; j < w; j++){
                const cell = board.grid[i][j];
                if(cell){
                    fill(cell.color);
                }else{
                    fill("white");
                }
                rect(
                    j * this.blockSize,
                    i * this.blockSize,
                    this.blockSize,
                    this.blockSize,
                );
            }
        }
    }

    drawPolyomino(polyomino){ //ブロックを描画
        fill(polyomino.color);
        stroke(0);
        strokeWeight(1);
        for(const [x, y] of polyomino.getPosition()){
            rect(
                x * this.blockSize,
                y * this.blockSize,
                this.blockSize,
                this.blockSize
            );
        }
    }
}

class InputHandler{
    constructor(manager){
        this.manager = manager;
    }

    handle(key){
        const game = this.manager.game;

        switch(key){ //キーごとの操作
            case "w": while(game.move(0, 1)){} break;
            case "a": game.move(-1, 0); break;
            case "s": game.move(0, 1); break;
            case "d": game.move(1, 0); break;
            case "e": game.rotateRight(); break;
            case "q": game.rotateLeft(); break;
        }
    }
}