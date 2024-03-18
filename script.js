// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let isPaused = false;

// Draw game map, snake, food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment, index) => {
    const snakeElement = createGameElement("div", "snake");
    if (index === 0) {
      snakeElement.className += " snake-head"; // Add snake-head class to the head
    }
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    foodElement.style.backgroundColor = "#ff0000"; // Set the color of the food (red in this case)
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  if (isPaused) return; // Pause the game if isPaused is true

  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y = (head.y - 1 + gridSize) % gridSize; // Move up and wrap around vertically
      break;
    case "down":
      head.y = (head.y + 1) % gridSize; // Move down and wrap around vertically
      break;
    case "left":
      head.x = (head.x - 1 + gridSize) % gridSize; // Move left and wrap around horizontally
      break;
    case "right":
      head.x = (head.x + 1) % gridSize; // Move right and wrap around horizontally
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Pause game function
function pauseGame() {
  isPaused = !isPaused; // Toggle isPaused
  if (isPaused) {
    clearInterval(gameInterval);
    instructionText.textContent = "Press spacebar to resume";
    instructionText.style.display = "block";
  } else {
    instructionText.style.display = "none";
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  }
}

// Keypress event listener
document.addEventListener("keydown", (event) => {
  if (!gameStarted && (event.code === "Space" || event.key === " ")) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
      case " ":
        if (gameStarted) pauseGame(); // Pause the game when spacebar is pressed
        break;
    }
  }
});

function increaseSpeed() {
  if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 5;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0) head.x = gridSize - 1; // Wrap around horizontally
  if (head.x >= gridSize) head.x = 0; // Wrap around horizontally
  if (head.y < 0) head.y = gridSize - 1; // Wrap around vertically
  if (head.y >= gridSize) head.y = 0; // Wrap around vertically

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  isPaused = false; // Reset isPaused on game stop
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
