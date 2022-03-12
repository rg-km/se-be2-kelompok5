const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 20;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x: 9 * box,
    y: 10 * box,
};//Inisiasi letak kepala snake

// create the food

let Food = function(){
    this.x= Math.floor(Math.random() * 28 + 1) * box;
    this.y= Math.floor(Math.random() * 28 + 5) * box;//ada bug
};

let food1 = new Food();
let food2= new Food();

// create the score var

let score = 0;

//control the snake

let d;//untuk menyimpan arah sebelumnya

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        left.play();//memainkan suara
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
        up.play();
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
        right.play();
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
        down.play();
    }
}

// check collision function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw() {
    ctx.drawImage(ground, 0, 0);//draw area permainan

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "white";//green untuk kepala ular, white utk badan ular
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";//utk stroke
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(foodImg, food1.x, food1.y);//draw food
    ctx.drawImage(foodImg, food2.x, food2.y);
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (d == "LEFT") snakeX -= box;//untuk gerak ular ke kiri dsb
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    //if the snake eats the food
    if ((snakeX == food1.x && snakeY == food1.y)) {//jika letak kepala ular = letak makanan
        score++;
        eat.play();
        food1.x= Math.floor(Math.random() * 28 + 1) * box;//perbaikan
        food1.y= Math.floor(Math.random() * 28 + 5) * box;
        // we don't remove the tail
    }else if ((snakeX==food2.x && snakeY == food2.y)){
        score++;
        eat.play();
        food2.x= Math.floor(Math.random() * 28 + 1) * box;
        food2.y= Math.floor(Math.random() * 28 + 5) * box;
    }else {
        // remove the tail
        snake.pop();
    }

    // add new Head

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    // game over

    if (snakeX < box || snakeX > 28 * box || snakeY < 4 * box || snakeY > 28 * box || collision(newHead, snake)) {
        clearInterval(game);
        dead.play();
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);
}

// // call draw function every 100 ms

let game = setInterval(draw, 100);