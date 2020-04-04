/*
toDo: 
menu (auto play in the background)
select difficulty, 
mode: 
-wall (count hits, store high score) or vs AI ( 10 points)
-self move both (count hits, store high score) + horizontal control and moving in opposite directions
like here:
https://codepen.io/ge1doot/pen/MwPVzN
-invisible paddles :o
- random money ball (changing color and 5points?)
*/

//defining canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

////table vars
//table size
canvas.width = 1000;
canvas.height = 500;
const cw = canvas.width;
const ch = canvas.height;
//offsets for correct mouse position
let topCanvas = canvas.offsetTop
let leftCanvas = canvas.offsetLeft

//middle-line
const lineW = 6;
const lineH = 16;

//paddles and ball sizes
const pH = 100; // height
const pW = 20; // width
const bS = 20; //ball size



//paddles
//distance from borders
const playerX = 70;
const aiX = 910;

//paddles starting position - in the middle
let playerY = ch / 2 - pH / 2;
let aiY = ch / 2 - pH / 2;

//ball
//ball starting position - in the middle
let ballX = cw / 2 - bS / 2;
let ballY = ch / 2 - bS / 2;

//ball initial speed/direction - random from 3-5
let ballSpeedX = Math.floor(Math.random() * 3) + 3;
let ballSpeedY = (Math.floor(Math.random() * 2) == 1) ? -(Math.floor(Math.random() * 3) + 3) : Math.floor(Math.random() * 3) + 3;

//gameplay 
const speedLimit = 23;
let aiLevel = 10;
let playerPoints = 0;
let aiPoints = 0;


function MainMenu() {
    table();
    drawMenu();
    ball();
    Req = window.requestAnimationFrame(MainMenu);
}

// window.requestAnimationFrame(MainMenu);

function drawMenu() {
    drawMenuBackground();
    //options
    ctx.fillStyle = "white"
    ctx.font = "30px Oxanium";
    ctx.fillText("○ Single", cw / 2 - 65, ch / 6 + 100)
    ctx.fillText("○ vs AI", cw / 2 - 65, ch / 6 + 200)



}


canvas.addEventListener("mousedown", mainClick)

function mainClick(e) {

    const mouseX = e.clientX - canvas.offsetLeft
    const mouseY = e.clientY - canvas.offsetTop

    if (bet(mouseX, 430, 555) && bet(mouseY, 150, 200)) {
        singleClick(e);
    } else if (bet(mouseX, 430, 555) && bet(mouseY, 250, 300)) {
        vsAiClick(e);
    }
}

function singleClick(e) {
    cancelAnimationFrame(Req)
}

function vsAiClick(e) {
    canvas.removeEventListener("mousedown", mainClick)
    cancelAnimationFrame(Req)
    menuAi()
}

function menuAi() {
    table();
    drawMenuAi();
    ball();
    Req = window.requestAnimationFrame(menuAi);
}


function drawMenuAi() {
    drawMenuBackground();
    //options
    ctx.fillStyle = "white"
    ctx.font = "30px Oxanium";
    ctx.fillText("Select Difficulty", 390, 130)
    ctx.fillText("○ Easy", 435, 130 + 50)
    ctx.fillText("○ Medium", 435, 130 + 100)
    ctx.fillText("○ Hard", 435, 130 + 150)
    ctx.fillText("<< Back", 420, 130 + 200)

}

function drawMenuBackground() {
    //background
    ctx.fillStyle = "black";
    ctx.fillRect(cw / 2 - 150, ch / 6, 300, 300);
    //white border
    ctx.strokeStyle = "white";
    ctx.lineWidth = "4";
    ctx.beginPath();
    ctx.rect(cw / 2 - 150, ch / 6, 300, 300);
    ctx.stroke();
}



/////////////////////////////////////////////////////
//versusAI
function versusAI() {
    GameOver();
    table();
    player();
    playerCollision();
    aiPosition();
    ai();
    aiCollision();
    ball();
    displayPoints();
    displayReset();

    window.requestAnimationFrame(versusAI);

}

window.requestAnimationFrame(versusAI);

//mouse move eventListener for player movement
canvas.addEventListener("mousemove", playerPosition);

//////functions
function table() {
    //table
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cw, ch);
    // lines in the middle
    ctx.fillStyle = "gray";
    for (let i = 20; i <= ch; i += lineH + 14) {
        ctx.fillRect(cw / 2 - lineW / 2, i, lineW, lineH);
    }
}

function ball() {
    //generating the ball on (ballX, ballY)
    ctx.fillStyle = "white";
    ctx.fillRect(ballX, ballY, bS, bS);

    ballX = ballX + ballSpeedX
    ballY = ballY + ballSpeedY

    //wall bounce
    if (ballY >= ch - bS || ballY <= 0) {
        ballSpeedY = -ballSpeedY;
        speedUP()
    }
    if (ballX >= cw - bS || ballX <= 0) {
        ballSpeedX = -ballSpeedX;
        speedUP()
    }
}

function speedUP() {
    if (Math.abs(ballSpeedX) < speedLimit) {
        (ballSpeedX > 0) ? ballSpeedX += .20: ballSpeedX -= .20
    };
    if (Math.abs(ballSpeedY) < speedLimit) {
        (ballSpeedY > 0) ? ballSpeedY += .20: ballSpeedY -= .20
    };

}

function player() {
    //adding player's paddle
    ctx.fillStyle = "white";
    ctx.fillRect(playerX, playerY, pW, pH);
}

function ai() {
    //adding ai's paddle
    ctx.fillStyle = "white";
    ctx.fillRect(aiX, aiY, pW, pH);
}

function playerPosition(e) {
    playerY = e.clientY - topCanvas - pH / 2;
    // console.log(e);
    if (playerY <= 0) {
        playerY = 0;
    }
    if (playerY + pH >= ch) {
        playerY = ch - pH;
    }

}

function aiPosition() {
    var middlePaddle = aiY + pH / 2;
    var middleBall = ballY + bS / 2;

    if (ballX > 500) {
        if (Math.abs(middlePaddle - middleBall) > 200) {
            (ballY > aiY) ? aiY += 2 * aiLevel: aiY -= 2 * aiLevel;
        } else if (Math.abs(middlePaddle - middleBall) > 50) {
            (ballY > aiY) ? aiY += aiLevel: aiY -= aiLevel;
        }


    } else if (ballX <= 500 && ballX > 150) {
        (middlePaddle - middleBall > 100) ? aiY -= 3: aiY += 3;
    }

    if (aiY < 0) { aiY = 0 };
    if (aiY + pH > ch) { aiY = ch - pH }

}

function playerCollision() {


    if (Math.abs(ballX - (playerX + pW)) <= 5 || (ballX > playerX && ballX < playerX + pW)) {
        //top corner hit
        if (Math.abs((ballY + bS) - (playerY)) <= 5) {
            ballSpeedX = Math.abs(ballSpeedX);
            ballSpeedY = -Math.abs(ballSpeedY);
            speedUP();
            return;
        }
        //bottom corner hit
        if (Math.abs((ballY) - (playerY + pH)) <= 5) {
            ballSpeedX = Math.abs(ballSpeedX);
            ballSpeedY = Math.abs(ballSpeedY);
            speedUP();
            return;
        }
        //front hit
        if (playerY < ballY + bS && ballY < playerY + pH) {
            ballSpeedX = Math.abs(ballSpeedX);
            speedUP();
            return;
        }
    }
    //top/bottom hits
    if (ballX < playerX + pW && ballX + bS > playerX) {
        //top hit
        if (ballY + bS == playerY) {
            ballSpeedY = -Math.abs(ballSpeedY);
            speedUP();
            return;
        }
        //bottom hit 
        if (ballY == playerY + pH) {
            ballSpeedY = Math.abs(ballSpeedY);
            speedUP();
            return;
        }
    }


}

function aiCollision() {


    //top/bottom hits
    if (ballX < aiX + pW && ballX + bS > aiX) {
        //top hit
        if (Math.abs((ballY + bS) - (aiY)) <= 5) {
            ballSpeedY = -Math.abs(ballSpeedY);
            speedUP();
            return;
        }
        //bottom hit 
        if (Math.abs((ballY) - (aiY + pH)) <= 5) {
            ballSpeedY = Math.abs(ballSpeedY);
            speedUP();
            return;
        }
    }

    //front and corners
    if (Math.abs((ballX + bS) - (aiX)) <= 5 || (ballX + bS > aiX && ballX < aiX + pW)) {
        //top corner hit
        if (Math.abs((ballY + bS) - (aiY)) <= 5) {
            ballSpeedX = -Math.abs(ballSpeedX);
            ballSpeedY = -Math.abs(ballSpeedY);
            speedUP();
            return;
        }
        //bottom corner hit
        if (Math.abs((ballY) - (aiY + pH)) <= 5) {
            ballSpeedX = -Math.abs(ballSpeedX);
            ballSpeedY = Math.abs(ballSpeedY);
            speedUP();
            return;
        }
        //front hit
        if (aiY < ballY + bS && ballY < aiY + pH) {
            ballSpeedX = -Math.abs(ballSpeedX);
            speedUP();
            return;
        }
    }



}

function GameOver() {
    if (ballX < 1 || ballX + bS > cw - 1) {
        //position reset
        ballX = cw / 2 - bS / 2;
        ballY = ch / 2 - bS / 2;
        //speed reset
        if (ballSpeedX < 0) {
            ballSpeedX = Math.floor(Math.random() * 3) + 3;
            playerPoints++;
        } else {
            ballSpeedX = -(Math.floor(Math.random() * 3) + 3);
            aiPoints++;
        }


        ballSpeedY = (Math.floor(Math.random() * 2) == 1) ? -(Math.floor(Math.random() * 3) + 3) : Math.floor(Math.random() * 3) + 3;


    }
}

function displayPoints() {
    ctx.font = "30px Oxanium";
    ctx.fillText(playerPoints, 250, 30);
    ctx.fillText(aiPoints, 750, 30);
}

function displayReset() {
    ctx.fillStyle = "black"
    ctx.fillRect(460, 0, 80, 35)


    ctx.fillStyle = "white"
    ctx.fillText("Reset", 460, 30)
}

//reset button click
canvas.addEventListener("mousedown", pressReset);

function pressReset(e) {

    if (bet(e.clientX - leftCanvas, 460, 550) && bet(e.clientY - topCanvas, 0, 40)) {
        playerPoints = 0;
        aiPoints = 0;
    }
}
// bespoke between function
let bet = function(x, min, max) {
    return (x >= min && x <= max)
}