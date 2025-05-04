document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const playerScoreElement = document.getElementById('player-score');
    const aiScoreElement = document.getElementById('ai-score');
    const pauseBtn = document.getElementById('pause-btn');
    const restartBtn = document.getElementById('restart-btn');
    const difficultySelect = document.getElementById('difficulty');
    
    // Настройки игры
    const PADDLE_WIDTH = 15;
    const PADDLE_HEIGHT = 100;
    const BALL_SIZE = 12;
    const PADDLE_OFFSET = 30;
    const WINNING_SCORE = 5;
    
    // Игровые объекты
    const playerPaddle = {
        x: PADDLE_OFFSET,
        y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        speed: 8,
        dy: 0
    };
    
    const aiPaddle = {
        x: canvas.width - PADDLE_OFFSET - PADDLE_WIDTH,
        y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        speed: 5, // Будет изменяться в зависимости от сложности
        dy: 0
    };
    
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: BALL_SIZE,
        speed: 4,
        dx: 4,
        dy: 4
    };
    
    // Состояние игры
    let playerScore = 0;
    let aiScore = 0;
    let gamePaused = false;
    let gameOver = false;
    let difficulty = 'medium';
    
    // Инициализация игры
    function init() {
        // Сбрасываем позиции
        resetBall();
        resetPaddles();
        
        // Сбрасываем счет
        playerScore = 0;
        aiScore = 0;
        updateScore();
        
        // Сбрасываем состояние
        gamePaused = false;
        gameOver = false;
        pauseBtn.textContent = 'Пауза (P)';
        
        // Устанавливаем сложность
        setDifficulty();
        
        // Запускаем игровой цикл
        if (!animationId) {
            gameLoop();
        }
    }
    
    // Игровой цикл
    let animationId;
    function gameLoop() {
        if (gameOver) return;
        
        if (!gamePaused) {
            update();
        }
        
        draw();
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Обновление игрового состояния
    function update() {
        // Двигаем ракетки
        movePaddles();
        
        // Двигаем мяч
        moveBall();
        
        // AI для противника
        aiMovement();
    }
    
    // Отрисовка игры
    function draw() {
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем разделительную линию
        drawDashedLine();
        
        // Рисуем ракетки
        drawPaddle(playerPaddle);
        drawPaddle(aiPaddle);
        
        // Рисуем мяч
        drawBall();
        
        // Если игра на паузе
        if (gamePaused) {
            drawPauseText();
        }
        
        // Если игра окончена
        if (gameOver) {
            drawGameOverText();
        }
    }
    
    // Рисуем разделительную линию
    function drawDashedLine() {
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Рисуем ракетку
    function drawPaddle(paddle) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        // Добавляем градиент для эффекта объема
        const gradient = ctx.createLinearGradient(
            paddle.x, paddle.y, 
            paddle.x + paddle.width, paddle.y
        );
        gradient.addColorStop(0, '#2E7D32');
        gradient.addColorStop(1, '#66BB6A');
        ctx.fillStyle = gradient;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    
    // Рисуем мяч
    function drawBall() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Добавляем свечение
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    // Рисуем текст паузы
    function drawPauseText() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ПАУЗА', canvas.width / 2, canvas.height / 2);
    }
    
    // Рисуем текст окончания игры
    function drawGameOverText() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            playerScore > aiScore ? 'ВЫ ПОБЕДИЛИ!' : 'ВЫ ПРОИГРАЛИ!', 
            canvas.width / 2, 
            canvas.height / 2 - 40
        );
        
        ctx.font = '24px Arial';
        ctx.fillText(
            `Счет: ${playerScore} - ${aiScore}`, 
            canvas.width / 2, 
            canvas.height / 2 + 20
        );
        
        ctx.fillText(
            'Нажмите R для новой игры', 
            canvas.width / 2, 
            canvas.height / 2 + 60
        );
    }
    
    // Движение ракеток
    function movePaddles() {
        // Игрок
        playerPaddle.y += playerPaddle.dy;
        
        // Ограничиваем движение ракетки игрока
        if (playerPaddle.y < 0) {
            playerPaddle.y = 0;
        } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
            playerPaddle.y = canvas.height - playerPaddle.height;
        }
        
        // AI
        aiPaddle.y += aiPaddle.dy;
        
        // Ограничиваем движение ракетки AI
        if (aiPaddle.y < 0) {
            aiPaddle.y = 0;
        } else if (aiPaddle.y + aiPaddle.height > canvas.height) {
            aiPaddle.y = canvas.height - aiPaddle.height;
        }
    }
    
    // Движение мяча
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Столкновение с верхней и нижней стенкой
        if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
            ball.dy *= -1;
        }
        
        // Столкновение с ракеткой игрока
        if (
            ball.x - ball.size < playerPaddle.x + playerPaddle.width &&
            ball.y > playerPaddle.y &&
            ball.y < playerPaddle.y + playerPaddle.height &&
            ball.dx < 0
        ) {
            const hitPosition = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
            const angle = hitPosition * Math.PI / 4;
            
            ball.dx = ball.speed * Math.cos(angle);
            ball.dy = ball.speed * Math.sin(angle);
            
            // Увеличиваем скорость после удара
            ball.speed += 0.2;
        }
        
        // Столкновение с ракеткой AI
        if (
            ball.x + ball.size > aiPaddle.x &&
            ball.y > aiPaddle.y &&
            ball.y < aiPaddle.y + aiPaddle.height &&
            ball.dx > 0
        ) {
            const hitPosition = (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);
            const angle = hitPosition * Math.PI / 4;
            
            ball.dx = -ball.speed * Math.cos(angle);
            ball.dy = ball.speed * Math.sin(angle);
            
            // Увеличиваем скорость после удара
            ball.speed += 0.2;
        }
        
        // Гол за игрока (мяч ушел за AI)
        if (ball.x + ball.size > canvas.width) {
            playerScore++;
            updateScore();
            resetBall();
        }
        
        // Гол за AI (мяч ушел за игрока)
        if (ball.x - ball.size < 0) {
            aiScore++;
            updateScore();
            resetBall();
        }
        
        // Проверяем окончание игры
        if (playerScore >= WINNING_SCORE || aiScore >= WINNING_SCORE) {
            gameOver = true;
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    // AI для противника
    function aiMovement() {
        // Простое следование за мячом с учетом сложности
        const aiPaddleCenter = aiPaddle.y + aiPaddle.height / 2;
        const ballCenter = ball.y;
        
        // В зависимости от сложности меняем точность AI
        let reactionFactor;
        switch (difficulty) {
            case 'easy':
                reactionFactor = 0.3;
                aiPaddle.speed = 4;
                break;
            case 'medium':
                reactionFactor = 0.7;
                aiPaddle.speed = 5;
                break;
            case 'hard':
                reactionFactor = 0.9;
                aiPaddle.speed = 6;
                break;
        }
        
        if (ballCenter < aiPaddleCenter - 10) {
            aiPaddle.dy = -aiPaddle.speed * reactionFactor;
        } else if (ballCenter > aiPaddleCenter + 10) {
            aiPaddle.dy = aiPaddle.speed * reactionFactor;
        } else {
            aiPaddle.dy = 0;
        }
    }
    
    // Сброс мяча после гола
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speed = 4;
        
        // Случайное направление
        const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        ball.dx = direction * ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
    }
    
    // Сброс позиций ракеток
    function resetPaddles() {
        playerPaddle.y = canvas.height / 2 - playerPaddle.height / 2;
        aiPaddle.y = canvas.height / 2 - aiPaddle.height / 2;
    }
    
    // Обновление счета
    function updateScore() {
        playerScoreElement.textContent = playerScore;
        aiScoreElement.textContent = aiScore;
    }
    
    // Установка сложности
    function setDifficulty() {
        difficulty = difficultySelect.value;
    }
    
    // Обработчики событий клавиатуры
    const keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Пауза по P
        if (e.key === 'p' || e.key === 'P' || e.key === 'з' || e.key === 'З') {
            togglePause();
        }
        
        // Рестарт по R
        if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
            init();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Обработка нажатий клавиш для управления
    function handleKeyPresses() {
        // Игрок 1 (W/S или стрелки вверх/вниз)
        playerPaddle.dy = 0;
        
        if (keys['w'] || keys['W'] || keys['ArrowUp'] || keys['ц'] || keys['Ц']) {
            playerPaddle.dy = -playerPaddle.speed;
        }
        
        if (keys['s'] || keys['S'] || keys['ArrowDown'] || keys['ы'] || keys['Ы']) {
            playerPaddle.dy = playerPaddle.speed;
        }
    }
    
    // Переключение паузы
    function togglePause() {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Продолжить (P)' : 'Пауза (P)';
        
        if (!gamePaused && !gameOver && !animationId) {
            gameLoop();
        }
    }
    
    // Обработчики кнопок
    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', init);
    difficultySelect.addEventListener('change', setDifficulty);
    
    // Запускаем игру
    init();
    
    // Основной цикл обработки ввода
    function inputLoop() {
        handleKeyPresses();
        requestAnimationFrame(inputLoop);
    }
    
    inputLoop();
});