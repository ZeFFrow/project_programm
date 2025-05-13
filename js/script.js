const gamesEl = document.querySelector(".games")

const GameCatalog = [
    {
        id: 1,
        link: "./tictactoe/main.html",
        img: "img/tictactoe.jpg",
        name: "Крестики-Нолики"
    },
    {
        id: 2,
        link: "./llows/main.html",
        img: "img/llows.png",
        name: "Виселица"
    },
    {
        id: 3,
        link: "./snake/main.html",
        img: "img/snake.png",
        name: "Змейка"
    },
    {
        id: 4,
        link: "./pong/main.html",
        img: "img/pong.jpg",
        name: "Пинг-понг"
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
    <div class="game">
        <a href="${game.link}">
            <img class="game__logo" src="${game.img}">
        </a>
        <h2 class="game__name">${game.name}</h2>
    </div>
  `
  }
  

renderGames()
  