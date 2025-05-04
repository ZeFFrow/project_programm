document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const wordDisplay = document.getElementById('word-display');
    const keyboard = document.getElementById('keyboard');
    const message = document.getElementById('message');
    const mistakesElement = document.getElementById('mistakes');
    const categoryElement = document.getElementById('category');
    const restartBtn = document.getElementById('restart');
    const bodyParts = document.querySelectorAll('.body-part');
    
    // Словарь слов по категориям
    const words = {
        'Животные': ['слон', 'жираф', 'крокодил', 'пантера', 'кенгуру', 'бегемот'],
        'Города': ['москва', 'сочи', 'казань', 'владивосток', 'екатеринбург', 'новосибирск'],
        'Профессии': ['врач', 'учитель', 'программист', 'инженер', 'пилот', 'повар'],
        'Фрукты': ['яблоко', 'апельсин', 'банан', 'киви', 'манго', 'ананас']
    };
    
    // Игровые переменные
    let selectedWord = '';
    let selectedCategory = '';
    let guessedLetters = [];
    let mistakes = 0;
    const maxMistakes = 6;
    let gameEnded = false;
    
    // Инициализация игры
    function initGame() {
        // Выбираем случайную категорию и слово
        const categories = Object.keys(words);
        selectedCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryWords = words[selectedCategory];
        selectedWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        
        // Сбрасываем состояние игры
        guessedLetters = [];
        mistakes = 0;
        gameEnded = false;
        
        // Обновляем интерфейс
        updateWordDisplay();
        updateKeyboard();
        updateMistakes();
        categoryElement.textContent = selectedCategory;
        message.textContent = '';
        
        // Скрываем части тела
        bodyParts.forEach(part => {
            part.style.display = 'none';
        });
        
        // Включаем все кнопки клавиатуры
        document.querySelectorAll('.key').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
    }
    
    // Обновление отображения слова
    function updateWordDisplay() {
        const display = selectedWord
            .split('')
            .map(letter => guessedLetters.includes(letter) ? letter : '_')
            .join(' ');
        
        wordDisplay.textContent = display;
        
        // Проверяем, угадано ли слово полностью
        if (!display.includes('_')) {
            gameEnded = true;
            message.textContent = 'Поздравляем! Вы выиграли!';
            message.style.color = '#2ecc71';
        }
    }
    
    // Обновление клавиатуры
    function updateKeyboard() {
        keyboard.innerHTML = '';
        
        // Создаем кнопки для всех букв алфавита
        'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.className = 'key';
            button.addEventListener('click', () => handleGuess(letter));
            
            if (guessedLetters.includes(letter)) {
                button.disabled = true;
                if (selectedWord.includes(letter)) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('incorrect');
                }
            }
            
            keyboard.appendChild(button);
        });
    }
    
    // Обработка выбора буквы
    function handleGuess(letter) {
        if (gameEnded) return;
        
        // Если буква уже выбиралась
        if (guessedLetters.includes(letter)) return;
        
        guessedLetters.push(letter);
        
        // Если буква есть в слове
        if (selectedWord.includes(letter)) {
            updateWordDisplay();
        } else {
            // Неправильная буква
            mistakes++;
            updateMistakes();
            showNextBodyPart();
            
            // Проверяем, проиграл ли игрок
            if (mistakes === maxMistakes) {
                gameEnded = true;
                message.textContent = `Игра окончена! Слово было: ${selectedWord}`;
                message.style.color = '#e74c3c';
                wordDisplay.textContent = selectedWord.split('').join(' ');
            }
        }
        
        // Обновляем клавиатуру
        updateKeyboard();
    }
    
    // Показываем следующую часть тела
    function showNextBodyPart() {
        if (mistakes <= maxMistakes) {
            bodyParts[mistakes - 1].style.display = 'block';
        }
    }
    
    // Обновляем счетчик ошибок
    function updateMistakes() {
        mistakesElement.textContent = `${mistakes}/${maxMistakes}`;
    }
    
    // Обработчик кнопки перезапуска
    restartBtn.addEventListener('click', initGame);
    
    // Запускаем игру при загрузке
    initGame();
    
    // Обработка нажатия клавиш на клавиатуре
    document.addEventListener('keydown', (e) => {
        if (e.key >= 'а' && e.key <= 'я') {
            const button = Array.from(document.querySelectorAll('.key'))
                .find(btn => btn.textContent === e.key);
            if (button && !button.disabled) {
                button.click();
            }
        }
    });
});