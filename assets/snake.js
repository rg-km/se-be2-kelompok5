const cvs = document.getElementById("snake")
const ctx = cvs.getContext("2d")

//custom random function
const random = (min, max) => {
    resultRandom = Math.floor(Math.random() * (max - min)) + min
    return resultRandom + box/2 - (resultRandom+box/2) % box
}

// create the unit
const box = 20

let canvas = {
    x: cvs.width,
    y: cvs.height,
}

let sound = true

let game

const foodImg = new Image()
foodImg.src = "assets/img/food.png"

const heartImg = new Image()
heartImg.src = "assets/img/hati.png"

const snakeGraphic = new Image()
snakeGraphic.src = "assets/img/snake-graphics.png"

// load audio files
var audio = document.getElementById("gameAudio")

let dead = "assets/audio/dead.mp3"
let eat = "assets/audio/eat.mp3"
let up = "assets/audio/up.mp3"
let right = "assets/audio/right.mp3"
let left = "assets/audio/left.mp3"
let down = "assets/audio/down.mp3"

// create the snake
let snake = []

// create the food
let food = {
    x: 0,
    y: 0,
}

//heart
let heart = {
    x: -99,
    y: -99,
}

// create the score var
let score = 0

// get 3 lives for the first time
let lives = 3

// save prime state
let primeState = false



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

let stateD = "" // untuk menyimpan arah dari frame sebelumnya

// draw everything to the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.x, canvas.y)

    for (let i = 0; i < snake.length; i++) {

        if(snake[i+1] && snake[i-1]){
            // ketika objek memiliki 2 neighbor
            if((
                snake[i+1].y == snake[i].y && 
                snake[i+1].x > snake[i].x &&
                snake[i-1].x == snake[i].x &&
                snake[i-1].y > snake[i].y) ||
                (
                snake[i+1].x == snake[i].x && 
                snake[i+1].y > snake[i].y &&
                snake[i-1].y == snake[i].y &&
                snake[i-1].x > snake[i].x)
                ){

                // ketika ular berubah arah dari kiri ke bawah dan dari atas ke kanan
                ctx.drawImage(snakeGraphic, ...imagePos.topLeft, 64, 64, snake[i].x, snake[i].y, box, box);
                continue;
            }
            if((
                snake[i+1].y == snake[i].y && 
                snake[i+1].x > snake[i].x &&
                snake[i-1].x == snake[i].x &&
                snake[i-1].y < snake[i].y) ||
                (
                snake[i+1].x == snake[i].x &&
                snake[i+1].y < snake[i].y &&
                snake[i-1].y == snake[i].y &&
                snake[i-1].x > snake[i].x)
                ){

                // ketika ular berubah arah dari kiri ke atas dan dari bawah ke kanan
                ctx.drawImage(snakeGraphic, ...imagePos.downLeft, 64, 64, snake[i].x, snake[i].y, box, box);
                continue;
            }
            if((
                snake[i+1].y > snake[i].y && 
                snake[i+1].x == snake[i].x &&
                snake[i-1].x < snake[i].x &&
                snake[i-1].y == snake[i].y) ||
                (
                snake[i+1].x < snake[i].x &&
                snake[i+1].y == snake[i].y &&
                snake[i-1].y > snake[i].y &&
                snake[i-1].x == snake[i].x)
                ){
                
                // ketika ular berubah arah dari atas ke kiri dan dari kanan ke bawah
                ctx.drawImage(snakeGraphic, ...imagePos.topRight, 64, 64, snake[i].x, snake[i].y, box, box);
                continue;
            }
            if((
                snake[i+1].y < snake[i].y && 
                snake[i+1].x == snake[i].x &&
                snake[i-1].x < snake[i].x &&
                snake[i-1].y == snake[i].y) ||
                (
                snake[i+1].x < snake[i].x &&
                snake[i+1].y == snake[i].y &&
                snake[i-1].y < snake[i].y &&
                snake[i-1].x == snake[i].x)
                ){

                // ketika ular berubah arah dari bawah ke kiri dan dari kanan ke atas
                ctx.drawImage(snakeGraphic, ...imagePos.downRight, 64, 64, snake[i].x, snake[i].y, box, box);
                continue;
            }
            
            if(snake[i+1].x == snake[i].x){
                // badan vertical
                ctx.drawImage(snakeGraphic, ...imagePos.vertical, 64, 64, snake[i].x, snake[i].y, box, box);
            }
            if(snake[i+1].y == snake[i].y){
                // badan horizontal
                ctx.drawImage(snakeGraphic, ...imagePos.horizontal, 64, 64, snake[i].x, snake[i].y, box, box);
            }

        }else if(snake[i+1]){
            // ketika objek memiliki 1 neighbor dibelakang (untuk kepala)
            if(stateD != d){
                // untuk menunda perubahan arah kepala satu frame
                drawHead(stateD)
                stateD = d
            }else{
                drawHead(d)
            }
        }else if(snake[i-1]){
            // ketika objek memiliki 1 neighbor didepan (untuk ekor)
            if(snake[i-1].x == snake[i].x && snake[i-1].y < snake[i].y){
                // ekor ketika ular arah ke atas
                ctx.drawImage(snakeGraphic, ...imagePos.tailBottom, 64, 64, snake[i].x, snake[i].y, box, box);
            }else if(snake[i-1].x == snake[i].x && snake[i-1].y > snake[i].y){
                // ekor ketika ular arah ke bawah
                ctx.drawImage(snakeGraphic, ...imagePos.tailTop, 64, 64, snake[i].x, snake[i].y, box, box);
            }else if(snake[i-1].y == snake[i].y && snake[i-1].x < snake[i].x){
                // ekor ketika ular arah ke kiri
                ctx.drawImage(snakeGraphic, ...imagePos.tailRight, 64, 64, snake[i].x, snake[i].y, box, box);
            }else if(snake[i-1].y == snake[i].y && snake[i-1].x > snake[i].x){
                // ekor ketika ular arah ke kanan
                ctx.drawImage(snakeGraphic, ...imagePos.tailLeft, 64, 64, snake[i].x, snake[i].y, box, box);
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

    ctx.drawImage(foodImg, food.x, food.y, box, box)//draw food

    // old head position
    let snakeX = snake[0].x
    let snakeY = snake[0].y

    // which direction
    if (d == "LEFT") snakeX -= box//untuk gerak ular ke kiri dsb
    if (d == "UP") snakeY -= box
    if (d == "RIGHT") snakeX += box
    if (d == "DOWN") snakeY += box

    //if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {//jika letak kepala ular = letak makanan
        score++
        audio.src = eat
        audio.play()
        food = {
            x: random(0, canvas.x-(box+15)),
            y: random(0, canvas.y-(box+15)),
        }
        primeState = false
        // we don't remove the tail
    } else {
        // remove the tail
        snake.pop()
    }

    // spawn heart
    if (isPrime(score)) {
        heart.x = random(0, canvas.x-(box+15))
        heart.y = random(0, canvas.y-(box+15))
    }

    ctx.drawImage(heartImg, heart.x, heart.y, box, box)//draw food
    
    //if the snake eats the heart
    if (snakeX == heart.x && snakeY == heart.y) {
        lives++
        heart.x = -99
        heart.y = -99
        audio.src = eat
        audio.play()
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    // game over
    if (snakeX < 0 || snakeX == cvs.width || snakeY < 0 || snakeY == cvs.height || collision(newHead, snake)) {
        gameOver()
    }

    snake.unshift(newHead)

    ctx.fillStyle = "white"
    ctx.font = "45px Change one"
    // ctx.fillText(score, 2 * box, 1.6 * box)
    document.getElementById('score').innerText = score
    document.getElementById('lives').innerText = lives
}

const clearGame = () => {
    snake = []
    d= ""
    snake[0] = {
        x: random(0, cvs.width-box),
        y: random(0, cvs.height-box),
    }
    food = {
        x: random(0, cvs.width-(box+15)),
        y: random(0, cvs.height-(box+15)),
    }
    score = 0
    // draw()
}

const start = () => {
    clearGame()
    lives = 3
    //call draw function every 100 ms
    document.addEventListener("keydown", direction)
    game = setInterval(draw, 200)
} 

const pause = () => {
    clearInterval(game)
}

const resume = () => {
    game = setInterval(draw, 100)
}

const gameOver = () => {
    audio.src = dead
    audio.play()
    document.removeEventListener("keydown", direction)
    document.getElementById("mid_menu").style.display='none'
    document.getElementById("play_menu").style.display='block'
    clearInterval(game)
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