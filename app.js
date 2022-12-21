// Set up canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set up ball
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// Set up bricks
const brickRowCount = 4;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, color: getRandomColor() };
  }
}

// Set up paddle
const paddleHeight = 10;
let paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;

// Set up keyboard controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
if (e.key === 'Right' || e.key === 'ArrowRight') {
rightPressed = true;
}
else if (e.key === 'Left' || e.key === 'ArrowLeft') {
leftPressed = true;
}
}

function keyUpHandler(e) {
if (e.key === 'Right' || e.key === 'ArrowRight') {
rightPressed = false;
}
else if (e.key === 'Left' || e.key === 'ArrowLeft') {
leftPressed = false;
}
}

// Function to generate a random color
function getRandomColor() {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

// Draw functions
function drawBall() {
ctx.beginPath();
ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
ctx.fillStyle = '#191919'/*'#0095DD'*/;
ctx.fill();
ctx.closePath();
}

function drawPaddle() {
ctx.beginPath();
ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
ctx.fillStyle = '#191919'/*'#0095DD'*/;
ctx.fill();
ctx.closePath();
}

function drawBricks() {
for (let c = 0; c < brickColumnCount; c++) {
for (let r = 0; r < brickRowCount; r++) {
  if (bricks[c][r].status === 1) {
    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
    bricks[c][r].x = brickX;
    bricks[c][r].y = brickY;
    ctx.beginPath();
    ctx.rect(brickX, brickY, brickWidth, brickHeight);
    ctx.fillStyle = bricks[c][r].color;
    ctx.fill();
    ctx.closePath();}
      }
  }
}

let gameEnded = false;

function checkForWin() {
  let bricksRemaining = 0;
  for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
          bricksRemaining++;
      }
      }
  }

  if (bricksRemaining === 0 && !gameEnded) {
      gameEnded = true;
      const scoreElement = document.getElementById('score');
      const finalScore = scoreElement.textContent.split(': ')[1];
      window.alert(`You win, nice! Your final score was: ${finalScore}`);
      location.reload();
  }
  }


// Collision detection
function collisionDetection() {
for (let c = 0; c < brickColumnCount; c++) {
for (let r = 0; r < brickRowCount; r++) {
  let b = bricks[c][r];
  if (b.status === 1) {
    if (x > b.x - ballRadius && x < b.x + brickWidth + ballRadius && y > b.y - ballRadius && y < b.y + brickHeight + ballRadius) {
      dy = -dy;
      b.status = 0;
      score++;
      document.getElementById('score').innerHTML = 'Score: ' + score;
      dx *= 1.08;
      dy *= 1.08;
      paddleWidth *= 0.96;
      //drawBricks(); // Update the brick colors
    }
  }
}
}
checkForWin();
}

// Draw the game
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBricks();
drawBall();
drawPaddle();
collisionDetection();

// Bounce the ball off the walls
if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
dx = -dx;
}
if (y + dy < ballRadius) {
dy = -dy;
}
else if (y + dy > canvas.height - ballRadius) {
// Check if the ball is within the bounds of the paddle
if (x > paddleX && x < paddleX + paddleWidth && y > canvas.height - paddleHeight - ballRadius) {
  dy = -dy;
}
else {
  // Show game over alert and restart the game
  alert('Game over');
  gameOver = true;
  document.location.reload();
}
}

// Move the paddle
if (rightPressed && paddleX < canvas.width - paddleWidth) {
paddleX += 7;
}
else if (leftPressed && paddleX > 0) {
paddleX -= 7;
}

// Move the ball
x += dx;
y += dy;
}

// Run the game loop
let gameOver = false;
let score = 0;

function gameLoop() {
if (!gameOver) {
draw();
requestAnimationFrame(gameLoop);
}
}

gameLoop();