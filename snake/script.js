document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const messageElement = document.getElementById('message');
    const restartBtn = document.getElementById('restart');
    
    // Кнопки управления
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    // Настройки игры
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let speed = 7; // Скорость змейки
    
    // Игровые переменные
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameRunning = false;
    let gameLoopId;
    
    // Инициализация игры
    function initGame() {
        // Сбрасываем змейку
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        // Генерируем еду
        generateFood();
        
        // Сбрасываем направление и счет
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        
        // Обновляем интерфейс
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
        messageElement.textContent = '';
        
        // Запускаем игровой цикл, если он еще не запущен
        if (!gameRunning) {
            gameRunning = true;
            gameLoop();
        }
    }
    
    // Генерация еды
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Проверяем, чтобы еда не появилась на змейке
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                generateFood();
                return;
            }
        }
    }
    
    // Игровой цикл
    function gameLoop() {
        if (!gameRunning) return;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем сетку (опционально)
        drawGrid();
        
        // Двигаем змейку
        moveSnake();
        
        // Проверяем столкновения
        if (checkCollision()) {
            gameOver();
            return;
        }
        
        // Рисуем змейку и еду
        drawSnake();
        drawFood();
        
        // Обновляем счет
        scoreElement.textContent = score;
        
        // Запускаем следующий кадр
        gameLoopId = setTimeout(gameLoop, 1000 / speed);
    }
    
    // Рисуем сетку
    function drawGrid() {
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < tileCount; i++) {
            // Вертикальные линии
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            // Горизонтальные линии
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }
    
    // Движение змейки
    function moveSnake() {
        // Обновляем направление
        direction = nextDirection;
        
        // Получаем голову змейки
        const head = {x: snake[0].x, y: snake[0].y};
        
        // Изменяем положение головы в зависимости от направления
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Добавляем новую голову
        snake.unshift(head);
        
        // Проверяем, съела ли змейка еду
        if (head.x === food.x && head.y === food.y) {
            // Увеличиваем счет
            score++;
            
            // Обновляем рекорд
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Генерируем новую еду
            generateFood();
            
            // Увеличиваем скорость каждые 5 очков
            if (score % 5 === 0) {
                speed += 0.5;
            }
        } else {
            // Если еда не съедена, удаляем хвост
            snake.pop();
        }
    }
    
    // Рисуем змейку
    function drawSnake() {
        for (let i = 0; i < snake.length; i++) {
            // Голова змейки
            if (i === 0) {
                ctx.fillStyle = '#2ecc71';
            } else {
                // Тело змейки
                ctx.fillStyle = '#27ae60';
            }
            
            // Рисуем сегмент змейки
            ctx.fillRect(
                snake[i].x * gridSize, 
                snake[i].y * gridSize, 
                gridSize - 1, 
                gridSize - 1
            );
            
            // Границы сегментов
            ctx.strokeStyle = '#229954';
            ctx.strokeRect(
                snake[i].x * gridSize, 
                snake[i].y * gridSize, 
                gridSize - 1, 
                gridSize - 1
            );
        }
    }
    
    // Рисуем еду
    function drawFood() {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Проверка столкновений
    function checkCollision() {
        const head = snake[0];
        
        // Столкновение со стенками
        if (
            head.x < 0 || 
            head.y < 0 || 
            head.x >= tileCount || 
            head.y >= tileCount
        ) {
            return true;
        }
        
        // Столкновение с собой
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Конец игры
    function gameOver() {
        gameRunning = false;
        clearTimeout(gameLoopId);
        messageElement.textContent = 'Игра окончена! Ваш счет: ' + score;
        messageElement.style.color = '#e74c3c';
    }
    
    // Обработчики событий клавиатуры
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ':
                if (!gameRunning) initGame();
                break;
        }
    });
    
    // Обработчики кнопок управления
    upBtn.addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    
    downBtn.addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    
    leftBtn.addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    
    rightBtn.addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });
    
    // Кнопка перезапуска
    restartBtn.addEventListener('click', () => {
        speed = 7; // Сбрасываем скорость
        initGame();
    });
    
    // Запускаем игру при загрузке
    initGame();
});