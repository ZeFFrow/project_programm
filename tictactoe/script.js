document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restart');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
        [0, 4, 8], [2, 4, 6]             // диагонали
    ];
    
    // Обработчик клика по ячейке
    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Если ячейка уже занята или игра не активна - выходим
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        // Обновляем состояние игры и отображаем ход
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'x' : 'o');
        
        // Проверяем на победу или ничью
        checkResult();
    };
    
    // Проверка результата игры
    const checkResult = () => {
        let roundWon = false;
        
        // Проверяем все выигрышные комбинации
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                // Подсвечиваем выигрышную комбинацию
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                break;
            }
        }
        
        // Если есть победитель
        if (roundWon) {
            status.textContent = `Победил игрок ${currentPlayer}!`;
            gameActive = false;
            return;
        }
        
        // Проверка на ничью
        if (!gameState.includes('')) {
            status.textContent = 'Ничья!';
            gameActive = false;
            return;
        }
        
        // Смена игрока
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Ход: ${currentPlayer}`;
    };
    
    // Сброс игры
    const restartGame = () => {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Ход: ${currentPlayer}`;
        
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'win');
        });
    };
    
    // Добавляем обработчики событий
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    restartBtn.addEventListener('click', restartGame);
});