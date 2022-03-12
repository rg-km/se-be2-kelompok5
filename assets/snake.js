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

// create the score var
let score = 0


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

// draw everything to the canvas

function draw() {
    ctx.clearRect(0, 0, canvas.x, canvas.y)

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "green" : "white"//green untuk kepala ular, white utk badan ular
        ctx.fillRect(snake[i].x, snake[i].y, box, box)

        ctx.strokeStyle = "red"//utk stroke
        ctx.strokeRect(snake[i].x, snake[i].y, box, box)
    }

    ctx.drawImage(foodImg, food.x, food.y)//draw food

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
            x: random(0, cvs.width),
            y: random(0, cvs.height-box),
        }
        // we don't remove the tail
    } else {
        // remove the tail
        snake.pop()
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
    ctx.font = "45px Changa one"
    // ctx.fillText(score, 2 * box, 1.6 * box)
    document.getElementById('score').innerText = score
    // document.getElementById('lives').innerText = random(0, 100)
}

const clearGame = () => {
    snake = []
    d= ""
    snake[0] = {
        x: random(0, cvs.width-box),
        y: random(0, cvs.height-box),
    }
    food = {
        x: random(0, cvs.width-box),
        y: random(0, cvs.height-box),
    }
    score = 0
    // draw()
}

const start = () => {
    clearGame()
    //call draw function every 100 ms
    document.addEventListener("keydown", direction)
    game = setInterval(draw, 100)
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