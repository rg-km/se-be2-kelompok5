const cvs = document.getElementById("snake")
const ctx = cvs.getContext("2d")

//custom random function
const random = (min, max) => {
    resultRandom = Math.floor(Math.random() * (max - min)) + min
    return resultRandom + box/2 - (resultRandom+box/2) % box
}

//game speed (in ms)
let speed = 200

// create the unit
const box = 20

let canvas = {
    x: cvs.width,
    y: cvs.height,
}

let sound = true

let game

// create the score var
let score = 0

// get 3 lives for the first time
let lives = 3

let level = 1

let heartTimerCount = {
    now: 0,
    end: 0,
}

// save prime state
let primeState = false


const foodImg = new Image()
foodImg.src = "assets/img/food.png"

const heartImg = new Image()
heartImg.src = "assets/img/hati.png"

const snakeGraphic = new Image()
snakeGraphic.src = "assets/img/snake-graphics.png"

const duriImg = new Image()
duriImg.src = "assets/img/duri.png"

// load audio files
var audio = document.getElementById("gameAudio")

let dead = "assets/audio/dead.mp3"
let eat = "assets/audio/eat.mp3"
let up = "assets/audio/up.mp3"
let right = "assets/audio/right.mp3"
let left = "assets/audio/left.mp3"
let down = "assets/audio/down.mp3"
let levelUp = "assets/audio/level-up.wav"
let crash = "assets/audio/crash.wav"										 

// create the snake
let snake = []

let Food = function(){
    this.x = 0
    this.y =0
}
let duri = {
    x:0,
    y:0,
}
let Obstacles = function( ){
    this.x=[ ];
    this.y=[ ];
    this.isMade = false;
}

let obs1 = new Obstacles();//initialize obstacles
let obs2 = new Obstacles();
let obs3 = new Obstacles();
let obs4 = new Obstacles();

let food1 = new Food()
let food2 = new Food()

//heart
let heart = {
    x: -99,
    y: -99,
}



let d //untuk menyimpan arah sebelumnya

function direction(event) {
    let key = event.keyCode
    if (key == 37 && d != "RIGHT") {
        audio.src = left
        audio.play()//memainkan suara
        d = "LEFT"
    } else if (key == 38 && d != "DOWN") {
        d = "UP"
        audio.src = up
        audio.play()
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT"
        audio.src = right
        audio.play()
    } else if (key == 40 && d != "UP") {
        d = "DOWN"
        audio.src = down
        audio.play()
    }
}

// check collision function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true
        }
    }
    return false
}

function collisionObs(head, obs){
    for(let i = 0; i < obs.x.length; i++){
        for (let j = 0; j < obs.y.length; j++){
            if (head.x == obs.x[i] && head.y == obs.y[i]) {
                return true
            } 
        }
    }
    return false;
}

const isPrime = (num) => {
    if (primeState) return false
    if (num <= 1) return false
    for (let i = 2; i < num; i++) {
        if (num % i == 0) return false
    }
    primeState = true
    return true
}

const imagePos = {
    vertical : [128, 64],
    horizontal : [64, 0],
    topLeft : [0, 0],
    downLeft : [0, 64],
    topRight : [128, 0],
    downRight : [128, 128],
    faceTop : [192, 0],
    faceLeft : [192, 64],
    faceRight : [256, 0],
    faceBottom : [256, 64],
    tailBottom : [192, 128],
    tailRight : [192, 192],
    tailLeft : [256, 128],
    tailTop : [256, 192],
}


// menggambar kepala ular
const drawHead = (direct) => {
    switch(direct){
		default:
            ctx.drawImage(snakeGraphic, ...imagePos.faceTop, 64, 64, snake[0].x, snake[0].y, box, box);break;
        case "LEFT":
            ctx.drawImage(snakeGraphic, ...imagePos.faceLeft, 64, 64, snake[0].x, snake[0].y, box, box);break;
        case "UP":
            ctx.drawImage(snakeGraphic, ...imagePos.faceTop, 64, 64, snake[0].x, snake[0].y, box, box);break;
        case "RIGHT":
            ctx.drawImage(snakeGraphic, ...imagePos.faceRight, 64, 64, snake[0].x, snake[0].y, box, box);break;
        case "DOWN":
            ctx.drawImage(snakeGraphic, ...imagePos.faceBottom, 64, 64, snake[0].x, snake[0].y, box, box);break;
    }
}

function drawObstacles(x1,y1,x2,y2,objectX, objectY,made,obs){
    ctx.fillStyle="brown";
    for(let i = y1; i <= y2; i++){
        for(let j = x1; j <= x2; j++){
            ctx.fillRect(j*box,i*box,box,box);
            if(made !== true){
                objectX.push(j*box);
                objectY.push(i*box);
            }
            else{
                continue;
            }
        }
    }
    obs.isMade = true;
}


let stateD = "" // untuk menyimpan arah dari frame sebelumnya

// draw everything to the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.x, canvas.y)
    
    obs1.x=[]
    obs1.y=[]
    obs1.isMade=false

    obs2.x=[]
    obs2.y=[]
    obs2.isMade=false

    obs3.x=[]
    obs3.y=[]
    obs3.isMade=false

    obs4.x=[]
    obs4.y=[]
    obs4.isMade=false

    for (let i = 0; i < snake.length; i++) {
        if(snake[i+1] && snake[i-1]){
            // ketika objek memiliki 2 neighbor
            var sameX = o => snake[o].x == snake[i].x
            var sameY = o => snake[o].y == snake[i].y
            var biggerX = o => snake[o].x > snake[i].x
            var biggerY = o => snake[o].y > snake[i].y
            var smallerX = o => snake[o].x < snake[i].x
            var smallerY = o => snake[o].y < snake[i].y
            
            if((sameY(i+1) && biggerX(i+1) && sameX(i-1) && biggerY(i-1)) || (sameX(i+1) && biggerY(i+1) && sameY(i-1) && biggerX(i-1))){
                // ketika ular berubah arah dari kiri ke bawah dan dari atas ke kanan
                ctx.drawImage(snakeGraphic, ...imagePos.topLeft, 64, 64, snake[i].x, snake[i].y, box, box)
                continue
            }
            if((sameY(i+1) && biggerX(i+1) && sameX(i-1) && smallerY(i-1)) || (sameX(i+1) && smallerY(i+1) && sameY(i-1) && biggerX(i-1))){
                // ketika ular berubah arah dari kiri ke atas dan dari bawah ke kanan
                ctx.drawImage(snakeGraphic, ...imagePos.downLeft, 64, 64, snake[i].x, snake[i].y, box, box)
                continue
            }
            if((biggerY(i+1) && sameX(i+1) && smallerX(i-1) && sameY(i-1)) || (smallerX(i+1) && sameY(i+1) && biggerY(i-1) && sameX(i-1))){
                // ketika ular berubah arah dari atas ke kiri dan dari kanan ke bawah
                ctx.drawImage(snakeGraphic, ...imagePos.topRight, 64, 64, snake[i].x, snake[i].y, box, box)
                continue
            }
            if((smallerY(i+1) && sameX(i+1) && smallerX(i-1) && sameY(i-1)) || (smallerX(i+1) && sameY(i+1) && smallerY(i-1) && sameX(i-1))){
                // ketika ular berubah arah dari bawah ke kiri dan dari kanan ke atas
                ctx.drawImage(snakeGraphic, ...imagePos.downRight, 64, 64, snake[i].x, snake[i].y, box, box)
                continue
            }
            if(snake[i+1].x == snake[i].x){
                // badan vertical
                ctx.drawImage(snakeGraphic, ...imagePos.vertical, 64, 64, snake[i].x, snake[i].y, box, box)
            }
            if(snake[i+1].y == snake[i].y){
                // badan horizontal
                ctx.drawImage(snakeGraphic, ...imagePos.horizontal, 64, 64, snake[i].x, snake[i].y, box, box)
            }
        }else if(snake[i-1]){
            // ketika objek memiliki 1 neighbor didepan (untuk ekor)
            if(snake[i-1].x == snake[i].x && snake[i-1].y < snake[i].y){
                // ekor ketika ular arah ke atas
                ctx.drawImage(snakeGraphic, ...imagePos.tailBottom, 64, 64, snake[i].x, snake[i].y, box, box)
            }else if(snake[i-1].x == snake[i].x && snake[i-1].y > snake[i].y){
                // ekor ketika ular arah ke bawah
                ctx.drawImage(snakeGraphic, ...imagePos.tailTop, 64, 64, snake[i].x, snake[i].y, box, box)
            }else if(snake[i-1].y == snake[i].y && snake[i-1].x < snake[i].x){
                // ekor ketika ular arah ke kiri
                ctx.drawImage(snakeGraphic, ...imagePos.tailRight, 64, 64, snake[i].x, snake[i].y, box, box)
            }else if(snake[i-1].y == snake[i].y && snake[i-1].x > snake[i].x){
                // ekor ketika ular arah ke kanan
                ctx.drawImage(snakeGraphic, ...imagePos.tailLeft, 64, 64, snake[i].x, snake[i].y, box, box)
            }
        }else{
            // ketika objek memiliki 1 neighbor dibelakang (untuk kepala)
            if(stateD != d){
                // untuk menunda perubahan arah kepala satu frame
                drawHead(stateD)
                stateD = d
            }else{
                drawHead(d)
            }
        }



    }

    switch (level) {
        case 1: break;
        case 2:
            drawObstacles(5,4,13,4,obs1.x,obs1.y,obs1.isMade,obs1);
        break;
        case 3:
            drawObstacles(5,4,13,4,obs1.x,obs1.y,obs1.isMade,obs1);
            drawObstacles(5,15,13,15,obs2.x,obs2.y,obs2.isMade,obs2);
        break;
        case 4:
            drawObstacles(5,4,13,4,obs1.x,obs1.y,obs1.isMade,obs1);
            drawObstacles(5,15,13,15,obs2.x,obs2.y,obs2.isMade,obs2);
            drawObstacles(4,7,4,10,obs3.x,obs3.y,obs3.isMade,obs3);
        break;
        case 5:
            drawObstacles(5,4,13,4,obs1.x,obs1.y,obs1.isMade,obs1);
            drawObstacles(5,15,13,15,obs2.x,obs2.y,obs2.isMade,obs2);
            drawObstacles(4,7,4,10,obs3.x,obs3.y,obs3.isMade,obs3);
            drawObstacles(14,9,14,11,obs4.x,obs4.y,obs4.isMade,obs4);
        break;
    
        default:
            break;
    }

    ctx.drawImage(foodImg, food1.x, food1.y, box, box)//draw food
    ctx.drawImage(foodImg, food2.x, food2.y, box, box)//draw food

    ctx.drawImage(duriImg, duri.x,duri.y,box,box)//draw duri

    /* drawObstacles(5,4,13,4,obs1.x,obs1.y,obs1.isMade,obs1);
    drawObstacles(5,15,13,15,obs2.x,obs2.y,obs2.isMade,obs2);
    drawObstacles(4,7,4,10,obs3.x,obs3.y,obs3.isMade,obs3);
    drawObstacles(14,9,14,11,obs4.x,obs4.y,obs4.isMade,obs4); */

    const obsLvl = () => {
        drawObstacles(5,4,13,4,obs1.x,obs1.y,obs1.isMade,obs1);
        drawObstacles(5,15,13,15,obs2.x,obs2.y,obs2.isMade,obs2);
        drawObstacles(4,7,4,10,obs3.x,obs3.y,obs3.isMade,obs3);
        drawObstacles(14,9,14,11,obs4.x,obs4.y,obs4.isMade,obs4);
    };

    // old head position
    let snakeX = snake[0].x
    let snakeY = snake[0].y

    // which direction
    if (d == "LEFT") snakeX -= box//untuk gerak ular ke kiri dsb
    if (d == "UP") snakeY -= box
    if (d == "RIGHT") snakeX += box
    if (d == "DOWN") snakeY += box

    //if the snake eats the food
    if (snakeX == food1.x && snakeY == food1.y) {//jika letak kepala ular = letak makanan
        score++
        audio.src = eat
        audio.play()
        food1 = {
            x: random(box, canvas.x-(box+15)),
            y: random(box, canvas.y-(box+15)),
        }
        primeState = false
        // we don't remove the tail
    } else if (snakeX == food2.x && snakeY == food2.y) {//jika letak kepala ular = letak makanan
        score++
        audio.src = eat
        audio.play()
        food2 = {
            x: random(box, canvas.x-(box+15)),
            y: random(box, canvas.y-(box+15)),
        }
        primeState = false
        // we don't remove the tail
    }
    else {
        // remove the tail
        snake.pop()
    }

    if (snakeX == duri.x && snakeY == duri.y ) {
        lives--
        if(lives < 0){
            gameOver()
        }
    }

    // spawn heart
    if (isPrime(score)) {
        heart.x = random(box, canvas.x-(box+15))
        heart.y = random(box, canvas.y-(box+15))
        heartTimerCount.now = 0
    }
    //level
    if (score <= 5) {
        level = 1
    } else if (score <= 10) {
        level = 2
    } else if (score <= 15) {
        level = 3
    }else if (score <= 20) {
        level = 4
    } else if (score <= 25) {
        level = 5
    }

    if (heartTimerCount.now < heartTimerCount.end) {
        ctx.drawImage(heartImg, heart.x, heart.y, box, box)//draw heart
        //if the snake eats the heart
        if (snakeX == heart.x && snakeY == heart.y) {
            lives++
            audio.src = eat
            audio.play()
            heartTimerCount.now = heartTimerCount.end
        }
    }

    heartTimerCount.now++

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    // game over
    if (snakeX < 0 || snakeX == cvs.width || snakeY < 0 || snakeY == cvs.height || collision(newHead, snake)|| collisionObs(newHead, obs1)||collisionObs(newHead, obs2)||collisionObs(newHead,obs3)||collisionObs(newHead,obs4)) {
        gameOver()
    }

    snake.unshift(newHead)

    document.getElementById('score').innerText = score
    document.getElementById('lives').innerText = lives
	document.getElementById('speed').innerText = speed
    document.getElementById('level').innerText = level


    //console.log(obs1);
    // console.log(obs2);
    // console.log(obs3);


}

const clearGame = () => {
    snake = []
    d= ""
    snake[0] = {
        x: random(box, canvas.x-box),
        y: random(box, canvas.y-box),
    }
    food1 = {
        x: random(box, canvas.x-(box+15)),
        y: random(box, canvas.y-(box+15)),
    }
    food2 = {
        x: random(box, canvas.x-(box+15)),
        y: random(box, canvas.y-(box+15)),
    }
    duri ={
        x: random(box, canvas.x-(box+5)),
        y: random(box, canvas.y-(box+5)),
    }
    score = 0
    // console.log[obs1.x]
    // console.log[obs1.y]


    // draw()
    
}

const start = () => {
    clearGame()
    
    lives = 3

    //call draw function every 100 ms
    document.addEventListener("keydown", direction)
	heartTimerCount.now = 0
    heartTimerCount.end = 4000 / speed
    game = setInterval(draw, speed)
    
} 

const pause = () => {
    clearInterval(game)
}

const resume = () => {
    game = setInterval(draw, 200)
}

const gameOver = () => {
    audio.src = dead
    audio.play()
    document.removeEventListener("keydown", direction)
    document.getElementById("mid_menu").style.display='none'
    document.getElementById("play_menu").style.display='block'
    clearInterval(game)
    alert("Game Over")
    // clearGame()
}

const restart = () => {
    gameOver()
    clearGame()
    // start()
}

const toggleSound = () => {
    if (sound) {
        sound = false
        console.log("off")
        document.getElementById("gameAudio").muted  = true
        document.getElementById("sound_on").style.display='inline'
        document.getElementById("sound_off").style.display='none'
    } else {
        sound = true
        console.log("on")
        document.getElementById("gameAudio").muted  = false
        document.getElementById("sound_on").style.display='none'
        document.getElementById("sound_off").style.display='inline'
    }
}

clearGame()