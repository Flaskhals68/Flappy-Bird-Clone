//Eventlistners för knapptryck
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false)


var myGamePiece;
var myObstacles = [];
var groundPiece;
var ground = [];
var scoreUpdate = 0;
var scoreIncrease;
var isScoreIncreased;
var width = window.width;
var height = window.height;
var scoreIncreaseidth = false;
var gameRunning = false;
var keyPressed = false;

//Startar spelet
function startGame() {
    document.getElementById("startMenu").style.display = "none";
    myGamePiece = new component(80, 80, 510, 120, "gamePiece");
    myGameArea.start();
}

//En variablel för spelytan
var myGameArea = {
    canvas: document.createElement("canvas"),

    //Skapar spelytan
    start: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 4;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 3);
        document.getElementById("score").innerHTML = "0";
        gameRunning = true;


    },
    //Clearar spelytan för att kunna placera object på nya platser
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //Stoppar spelet
    stop: function() {
        clearInterval(this.interval);
        gameRunning = false;
        document.getElementById("score").classList = "scoreEnded";
        document.getElementById("score").innerHTML = "SCORE: " + scoreUpdate.toString();
        document.getElementById("introText").innerHTML = "GAME OVER";
        document.getElementById("startMenu").style.display = "block";
        document.getElementById("startMenu").classList = "gameEndedMenu";
        document.getElementById("startButton").classList = "restartButton";
        document.getElementById("startButton").innerHTML = "PLAY AGAIN";
        //Startar om spelet
        document.getElementById("startButton").onclick = function replay() {
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles.splice(i);
            }
            document.getElementById("score").classList = "scoreRunning";
            document.getElementById("startMenu").style.display = "none";
            myGamePiece.y = 120;
            myGamePiece.speedY = 0;
            scoreUpdate = 0;
            myGameArea.start();
        }
    }
}

//En klass för spelare, hinder och marken
function component(width, height, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.gravity = 0.04;
    this.x = x;
    this.y = y;
    var image = new Image();

    //Ritar ut respektive objekt
    this.update = function() {
            ctx = myGameArea.context;

            if (this.type == "gamePiece") {
                image.src = "Pictures/bird.png"
                ctx.drawImage(image, this.x, this.y, this.width, this.height)
            } else if (this.type == "obsticleDown") {
                image.src = "Pictures/KallePipeDown.png"
                ctx.drawImage(image, this.x, this.y, this.width, this.height)
            } else if (this.type == "obsticleUp") {
                image.src = "Pictures/KallePipeUp.png"
                ctx.drawImage(image, this.x, this.y, this.width, this.height)
            } else if (this.type == "groundpiece") {
                image.src = "Pictures/ground7.png"
                ctx.drawImage(image, this.x, this.y, this.width, this.height)
            }
        }
        //Uppdaterar objektet
    this.newPos = function() {
            this.x += this.speedX;
        }
        //Uppdaterar spelarens position
    this.newPlayerPos = function() {
            if (myGamePiece.y < 0) {
                myGamePiece.y = 0;
            }
            this.speedY += this.gravity;
            this.y += this.speedY;
        }
        //Kontrollerar om spelaren kraschar med ett annat objekt
    this.crashWith = function(pipe) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var pipeLeft = pipe.x;
        var pipeRight = pipe.x + (pipe.width);
        var pipeTop = pipe.y;
        var pipeBottom = pipe.y + (pipe.height);
        var crash = false;
        if (mybottom > pipeTop && mytop < pipeBottom && myright > pipeLeft && myleft < pipeRight) {
            crash = true;
        } else if (mybottom > myGameArea.canvas.height - 80) {
            crash = true;
        }
        return crash;
    }
}
//Uppdaterar spelytan
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(400)) {
        x = myGameArea.canvas.width;
        minHeight = 50;
        maxHeight = 425;
        start = (Math.random() * (maxHeight - minHeight + 1) + minHeight);
        height = 2000;
        gap = 200;
        myObstacles.push(new component(80, height, x, start - 2000, "obsticleUp"));
        myObstacles.push(new component(80, height, x, start + gap, "obsticleDown"));
    }
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].speedX = -1.5;
        myObstacles[i].newPos();
        myObstacles[i].update();
        if (myObstacles[i].x + myObstacles[i].width < 0) {
            myObstacles.shift();
        }
    }

    if (myGameArea.frameNo == 1 || ground[0].x <= 0 && everyinterval(100)) {
        height = 250;
        width = 1990;
        if (ground.length == 0) {
            x = 0;
        } else {
            x = ground[0].x + width;
        }
        y = 850;
        ground.push(new component(width, height, x, y, "groundpiece"));
    }
    for (i = 0; i < ground.length; i++) {
        ground[i].speedX = -1.5;
        ground[i].newPos();
        ground[i].update();
        if (ground[i].x + ground[i].width < 0) {
            ground.shift();
        }
    }
    isScoreIncreased = updateScore(myObstacles);
    if (isScoreIncreased) {
        scoreUpdate++;
        document.getElementById("score").innerHTML = scoreUpdate.toString();
    }
    myGamePiece.newPlayerPos();
    myGamePiece.update();
}

function updateScore(myObstacles) {
    scoreIncrease = false;
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.x == myObstacles[i].x && myObstacles[i].type == "obsticleUp") {
            scoreIncrease = true;
        }
    }
    return scoreIncrease;
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function keyDown() {
    if (gameRunning) {
        var keyCode = event.keyCode;
        if (keyPressed == false) {
            switch (keyCode) {
                case 32: //spacebar
                    myGamePiece.speedY = -2.8;
                    keyPressed = true;
                    break;
            }
        }
    }
}

function keyUp() {
    if (gameRunning) {
        keyPressed = false;
    }
}

function clearmove() {
    myGamePiece.speedY = 0;
}