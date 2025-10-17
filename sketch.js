let manager;
const boardWidth = 16;
const boardHeight = 22;

function setup(){
    manager = new GameManager();
    createDisplay();
}

function draw(){
    background(220);
    manager.update();
    manager.render();
}

function createDisplay(){ //ゲーム画面を生成
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
        this.input = new InputHandler();

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

class GameState{ //インタフェース
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

class Game{ //ゲームのロジック
    constructor(factory, board){
        this.factory = factory;
        this.board = board;
        this.current = this.factory.createRandom(); //今のブロック
        this.next = this.factory.createRandom(); //次のブロック

        /*
        this.currentBlock = null;
        this.nextBlocks = [];
        this.holdBlock = null;
        this.canHold = true;

        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
        this.isGameOver = false;
        */
        //機能追加したら必要になるかも
    }

    update(){
        if(!this.tryMove(0,1)){
            this.board.fix(this.current);
            this.board.clearLines();
            this.spawnNext();
            if(!this.board.canSpawn(this.current)){
                //ゲームオーバー処理未実装
            }
        }

    }

    tryMove(dx, dy){ //移動できるか判定
        const moved = this.current.cloneMoved(dx, dy);
        if(this.board.canPlace(moved)){
            this.current = moved;
            return true;
        }
        return false;
    }

    spawnNext(){ //次のブロックを生成
        this.current = this.next;
        this.next = this.factory.createRandom();
    }
}

class Polyomino{ //ブロックの基本操作
    constructor(type, shape, x = 4, y = 0){
        this.type = type; //ブロックの種類
        this.shape = shape; //ブロックの形
        this.x = x; //初期座標
        this.y = y;
    }

    getPosition(){ //形情報から座標を取得
        return this.shape.map(([sx, sy]) => [this.x + sx, this.y + sy]);
    }

    move(dx, dy){ //移動
        this.x += dx;
        this.y += dy;
    }

    rotateRight(){ //右回転
        this.shape = this.shape.map(([x, y]) => [-y, x]);
    }
    //処理が雑すぎる(壁やオブジェクトを貫通する)ので要改善
}

class Tetromino extends Polyomino{
    constructor(type, shape, x, y){
        super(type, shape, x, y);
    }

    cloneMoved(dx, dy){
        return new Tetromino(
            this.type,
            this.shape,
            this.x + dx,
            this.y + dy
        );
    }
}

class Factory{
    create(type){ //ブロックを生成
        const shape = this.shapes[type];
        if(!shape){
            throw new Error("形が存在しません");
        }
        // const color = this.getColor(type);
        return new this.Product(type, shape);
    }
    //ブロックの色未実装

    createRandom(){ //ランダムにブロックを生成
        const types = Object.keys(this.shapes);
        const type = types[Math.floor(Math.random() * types.length)];
        return this.create(type);
    }
    //7回に1回各ブロックが生成未実装
}
//生成ルールは新しくクラスを作ることで追加する(Stratagyパターン)

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
    }
}

class Pentomino extends Polyomino{}
class Hexomino extends Polyomino{}

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
                this.grid[y][x] = polyomino.type;
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
                const type = board.grid[i][j];
                if(type){
                    fill("gray");
                }else{
                    fill("white");
                    rect(
                        j * this.blockSize,
                        i * this.blockSize,
                        this.blockSize,
                        this.blockSize,
                    );
                }
            }
        }
    }
    //毎秒描画なので画像として保存したい

    drawPolyomino(polyomino){ //ブロックを描画
        fill("blue");
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

class InputHandler{}