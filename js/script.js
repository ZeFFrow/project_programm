const gamesEl = document.querySelector(".gamesjs")

const GameCatalog = [
    {
        id: 1,
        link: "./tictactoe/main.html",
        img: "img/tictactoe.jpg",
        name: "Крестики-Нолики",
        description: "Классическая игра для двух игроков. Попробуйте выстроить три своих символа в ряд!"
    },
    {
        id: 2,
        link: "./llows/main.html",
        img: "img/llows.png",
        name: "Виселица",
        description: "Классическая игра 'Виселица', где нужно угадать загаданное слово по буквам, прежде чем будет нарисована полная виселица."
    },
    {
        id: 3,
        link: "./snake/main.html",
        img: "img/snake.png",
        name: "Змейка",
        description: "Управляйте змейкой, собирайте еду и становитесь длиннее. Избегайте столкновений!"
    },
    {
        id: 4,
        link: "./pong/main.html",
        img: "img/pong.jpg",
        name: "Пинг-понг",
        description: "Одиночный пинг-понг с ИИ, где ваша реакция и точность решают исход матча."
    }
]

function renderGames() {
    const games = GameCatalog
    
        games.map(game => {
        const gameEl = document.createElement("li")
    
        gameEl.classList.add("games__item", "game")
        gameEl.innerHTML = gameTemplate(game)
    
        gamesEl.appendChild(gameEl)
        })
}

function gameTemplate(game) {
    return `
    <div class="game-card">
            <div class="game-info">
                <img class="game-image" src="${game.img}">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <a href="${game.link}" class="btn">Играть</a>
            </div>
    </div>

  `
  }
  

renderGames()