// Game elements
const gameBoard = document.getElementById('game-board');
const paddleLeft = document.getElementById('paddle-left');
const paddleRight = document.getElementById('paddle-right');
const ball = document.getElementById('ball');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const finalScoreElement = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const difficultyButtons = document.querySelectorAll('.difficulty');

// Sounds
const paddleHitSound = document.getElementById('paddle-hit');
const wallHitSound = document.getElementById('wall-hit');
const scoreSound = document.getElementById('score-sound');
const gameOverSound = document.getElementById('game-over-sound');

// Game variables
let gameWidth, gameHeight;
let paddleHeight = 100;
let paddleWidth = 15;
let ballSize = 20;
let playerScore = 0;
let computerScore = 0;
let gameRunning = false;
let difficulty = 'medium';
let gameInterval;

// Paddle positions
let leftPaddleY = 0;
let rightPaddleY = 0;

// Ball position and velocity
let ballX = 0;
let ballY = 0;
let ballSpeedX = 0;
let ballSpeedY = 0;

// Initialize game dimensions
function initGameDimensions() {
    gameWidth = gameBoard.offsetWidth;
    gameHeight = gameBoard.offsetHeight;
    
    // Center paddles
    leftPaddleY = (gameHeight - paddleHeight) / 2;
    rightPaddleY = (gameHeight - paddleHeight) / 2;
    
    // Center ball
    ballX = gameWidth / 2 - ballSize / 2;
    ballY = gameHeight / 2 - ballSize / 2;
    
    updatePositions();
}

// Update DOM elements positions
function updatePositions() {
    paddleLeft.style.top = leftPaddleY + 'px';
    paddleRight.style.top = rightPaddleY + 'px';
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

// Reset ball to center with random direction
function resetBall() {
    ballX = gameWidth / 2 - ballSize / 2;
    ballY = gameHeight / 2 - ballSize / 2;
    
    // Random direction but always towards the player who just scored
    const direction = Math.random() > 0.5 ? 1 : -1;
    ballSpeedX = 5 * direction;
    ballSpeedY = (Math.random() * 4 - 2); // Random angle between -2 and 2
}

// Start new game
function startGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreElement.textContent = '0';
    computerScoreElement.textContent = '0';
    
    initGameDimensions();
    resetBall();
    
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameRunning = true;
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 16); // ~60fps
}

// End game
function endGame(winner) {
    gameRunning = false;
    clearInterval(gameInterval);
    
    gameOverText.textContent = winner === 'player' ? 'YOU WIN!' : 'GAME OVER';
    finalScoreElement.textContent = `${playerScore} - ${computerScore}`;
    gameOverScreen.style.display = 'flex';
    
    gameOverSound.play();
}

// Update game state
function updateGame() {
    if (!gameRunning) return;
    
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= gameHeight - ballSize) {
        ballSpeedY = -ballSpeedY;
        wallHitSound.currentTime = 0;
        wallHitSound.play();
        
        // Add some randomness to bounce
        if (Math.random() > 0.7) {
            ballSpeedY *= 1.1;
        }
    }
    
    // Ball collision with paddles
    // Left paddle
    if (ballX <= paddleWidth + 20 && 
        ballY + ballSize >= leftPaddleY && 
        ballY <= leftPaddleY + paddleHeight) {
        
        // Calculate bounce angle based on where ball hits paddle
        const hitPosition = (ballY - leftPaddleY) / paddleHeight;
        const bounceAngle = hitPosition * Math.PI - Math.PI / 2; // -π/2 to π/2
        
        // Calculate new speed based on difficulty
        let speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
        speed *= 1.05; // Increase speed slightly with each hit
        
        // Limit max speed
        const maxSpeed = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 15 : 20;
        if (speed > maxSpeed) speed = maxSpeed;
        
        ballSpeedX = Math.cos(bounceAngle) * speed;
        ballSpeedY = Math.sin(bounceAngle) * speed;
        
        // Ensure ball moves to the right after hitting left paddle
        ballSpeedX = Math.abs(ballSpeedX);
        
        // Small correction to prevent sticking
        ballX = paddleWidth + 21;
        
        paddleHitSound.currentTime = 0;
        paddleHitSound.play();
    }
    
    // Right paddle
    if (ballX >= gameWidth - paddleWidth - 20 - ballSize && 
        ballY + ballSize >= rightPaddleY && 
        ballY <= rightPaddleY + paddleHeight) {
        
        // Calculate bounce angle based on where ball hits paddle
        const hitPosition = (ballY - rightPaddleY) / paddleHeight;
        const bounceAngle = hitPosition * Math.PI - Math.PI / 2; // -π/2 to π/2
        
        // Calculate new speed based on difficulty
        let speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
        speed *= 1.05; // Increase speed slightly with each hit
        
        // Limit max speed
        const maxSpeed = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 15 : 20;
        if (speed > maxSpeed) speed = maxSpeed;
        
        ballSpeedX = Math.cos(bounceAngle) * speed;
        ballSpeedY = Math.sin(bounceAngle) * speed;
        
        // Ensure ball moves to the left after hitting right paddle
        ballSpeedX = -Math.abs(ballSpeedX);
        
        // Small correction to prevent sticking
        ballX = gameWidth - paddleWidth - 21 - ballSize;
        
        paddleHitSound.currentTime = 0;
        paddleHitSound.play();
    }
    
    // Scoring
    if (ballX < 0) {
        computerScore++;
        computerScoreElement.textContent = computerScore;
        scoreSound.currentTime = 0;
        scoreSound.play();
        
        if (computerScore >= 5) {
            endGame('computer');
        } else {
            resetBall();
        }
    }
    
    if (ballX > gameWidth) {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        scoreSound.currentTime = 0;
        scoreSound.play();
        
        if (playerScore >= 5) {
            endGame('player');
        } else {
            resetBall();
        }
    }
    
    // Computer AI (right paddle)
    if (difficulty !== 'easy') {
        // Medium and hard AI
        const paddleCenter = rightPaddleY + paddleHeight / 2;
        const ballCenter = ballY + ballSize / 2;
        
        // Predict where ball will be
        let predictedY = ballCenter;
        if (ballSpeedX > 0) {
            const timeToReach = (gameWidth - paddleWidth - 20 - ballSize - ballX) / ballSpeedX;
            predictedY = ballCenter + ballSpeedY * timeToReach;
            
            // Keep within bounds
            predictedY = Math.max(paddleHeight / 2, Math.min(gameHeight - paddleHeight / 2, predictedY));
        }
        
        // Move towards predicted position
        const aiSpeed = difficulty === 'medium' ? 6 : 8;
        if (paddleCenter < predictedY - 10) {
            rightPaddleY += aiSpeed;
        } else if (paddleCenter > predictedY + 10) {
            rightPaddleY -= aiSpeed;
        }
    } else {
        // Easy AI - simply follows the ball
        const paddleCenter = rightPaddleY + paddleHeight / 2;
        const ballCenter = ballY + ballSize / 2;
        
        if (paddleCenter < ballCenter - 10) {
            rightPaddleY += 4;
        } else if (paddleCenter > ballCenter + 10) {
            rightPaddleY -= 4;
        }
    }
    
    // Keep paddles within bounds
    leftPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, leftPaddleY));
    rightPaddleY = Math.max(0, Math.min(gameHeight - paddleHeight, rightPaddleY));
    
    updatePositions();
}

// Event listeners
window.addEventListener('resize', initGameDimensions);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    const paddleSpeed = 8;
    
    // Player (left paddle) controls - W/S
    if (e.key === 'w' || e.key === 'W' || e.key === 'ц' || e.key === 'Ц') {
        leftPaddleY -= paddleSpeed;
    } else if (e.key === 's' || e.key === 'S' || e.key === 'ы' || e.key === 'Ы') {
        leftPaddleY += paddleSpeed;
    }
    
    // Computer (right paddle) controls - Arrow Up/Down (for testing)
    if (e.key === 'ArrowUp') {
        rightPaddleY -= paddleSpeed;
    } else if (e.key === 'ArrowDown') {
        rightPaddleY += paddleSpeed;
    }
});

// Start and restart buttons
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Difficulty buttons
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficulty = button.dataset.level;
        difficultyButtons.forEach(btn => btn.style.opacity = '0.6');
        button.style.opacity = '1';
    });
});

// Initialize game on load
window.addEventListener('load', () => {
    initGameDimensions();
    // Set medium difficulty as default
    document.querySelector('.difficulty[data-level="medium"]').style.opacity = '1';
});