class Game {
    constructor() {
        this.players = []

        if (localStorage.getItem('players'))
            JSON.parse(localStorage.getItem('players')).map(p => {
                let player = new Player(p.firstname, p.lastname, p.points)
                this.players.push(player)
            })
        
        this.round = localStorage.getItem('round') || 0
    }

    newRound() {
        this.round++
        this.players.map(player => player.newRound())
        localStorage.setItem('round', this.round)
        localStorage.setItem('players', JSON.stringify(this.players))
    }

    addPlayer(player) {
        this.players.push(player)
        localStorage.setItem('players', JSON.stringify(this.players))

        if (this.round !== 0)
            for (let i = 0; i < this.round; i++)
                player.newRound()
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p.firstname !== player.firstname && p.lastname !== player.lastname)
        localStorage.setItem('players', this.players)

        if (this.players.length < 2) {
            this.round = 0
            localStorage.setItem('round', 0)
            this.players.map(player => player.points = [])
        }
    }

    sortPlayers() {
        this.players.sort((a, b) => {
            if (a.lastname < b.lastname)
                return -1
        })

        this.players.sort((a, b) => {
            if (a.firstname < b.firstname)
                return -1
        })

        this.players.sort((a, b) => {
            if (a.calculatePoints() > b.calculatePoints())
                return -1
        })
    }

    leaderboard() {
        this.sortPlayers()
        return this.players
    }
}

class Player {
    constructor(firstname, lastname, points = []) {
        this.firstname = firstname
        this.lastname = lastname
        this.points = points
    }

    addPoints(round, points) {
        this.points[round - 1] += points

        if (this.points[round - 1] < 0)
            this.points[round - 1] = 0
    }

    removePoints(round, points) {
        this.points[round - 1] -= points

        if (this.points[round - 1] < 0)
            this.points[round - 1] = 0
    }

    setPoints(round, points) {
        this.points[round - 1] = points

        if (this.points[round - 1] < 0)
            this.points[round - 1] = 0
    }

    newRound() {
        this.points.push(0)
    }

    calculatePoints() {
        if (this.points.length > 0)
            return this.points.reduce((a, b) => a + b)
        
        return 0
    }

    info() {
        return {
            firstname: this.firstname,
            lastname: this.lastname,
            points: this.calculatePoints()
        }
    }
}

let gameForm = document.querySelector('#gameForm')
let pointsForm = document.querySelector('#pointsForm')
let gamePlayersList = document.querySelector('#gamePlayersList')
let playersSelect = pointsForm.elements['playersSelect']
let startGameBtn = gameForm.elements['startGameBtn']
let roundTitle = document.querySelector('#roundTitle')
let stats = document.querySelector('#stats')

let game = new Game()
renderPlayersList()
renderPlayersSelect()
renderRoundBtn()
renderStats()

gameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let firstname = gameForm.elements['firstname'].value
    let lastname = gameForm.elements['lastname'].value
    
    if (!firstname || !lastname || firstname.length > 32 || lastname.length > 32)
        return
    
    let player = new Player(firstname, lastname)
    
    if (playerExist(player))
        return
    
    game.addPlayer(player)
    gameForm.reset()
    renderPlayersList()
    renderPlayersSelect()
    renderStats()
    gameForm.elements['firstname'].focus()
})

startGameBtn.addEventListener('click', () => {
    if (game.players.length < 2)
        return
    
    game.newRound()
    
    renderRoundBtn()
    renderStats()
})

pointsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let points = pointsForm.elements['points'].value
    let player = playersSelect.value

    if (!player)
        return
    
    player = JSON.parse(player)

    if (!playersSelect.value || !points)
        return

    points = parseInt(points)

    if (points === 0)
        return
    
    player = playerExist(new Player(player.firstname, player.lastname))

    if (!player)
        return

    addPoints(player, points)
    renderPlayersList()
    renderStats()
    pointsForm.reset()
    location.href = "#header"
})

pointsForm.elements['removePlayer'].addEventListener('click', () => {
    let player = playersSelect.value

    if (!player)
        return
    
    player = JSON.parse(playersSelect.value)
    
    if (!player)
        return

    player = new Player(player.firstname, player.lastname)

    if (!confirm(`Ar tikrai norite pašalinti žaidėją ${player.firstname} ${player.lastname}?`))
        return

    game.removePlayer(player)
    renderPlayersList()
    renderPlayersSelect()
    renderRoundBtn()
})

function playerExist(player) {
    if (!player)
        return
    
    let existing = game.players.filter(p => p.firstname.toLowerCase() === player.firstname.toLowerCase()
        && p.lastname.toLowerCase() === player.lastname.toLowerCase())

    if (existing.length !== 0)
        return existing[0]
    
    return false
}

function addPoints(player, points) {
    if (game.round > 0) {
        player.addPoints(game.round, points)
        localStorage.setItem('players', JSON.stringify(game.players))
    }
}

function renderPlayersList() {
    gamePlayersList.innerHTML = ''
    let number = 1;

    game.leaderboard().map(player => {
        gamePlayersList.innerHTML +=
            `<tr>
                <td>${number++}</td>
                <td>${player.firstname}</td>
                <td>${player.lastname}</td>
                <td>${player.calculatePoints()}</td>
            </tr>`
    })
}

function renderPlayersSelect() {
    playersSelect.innerHTML = '<option value="" disabled selected>Pasirinkite žaidėją</option>'

    game.players.map(player => {
        playersSelect.innerHTML +=
            `<option value='${JSON.stringify({firstname: player.firstname, lastname: player.lastname})}'>${player.firstname} ${player.lastname}</option>`
    })
}

function renderRoundBtn() {
    roundTitle.innerText = `Raundas: ${game.round}`

    if (game.round > 0)
        startGameBtn.value = 'Naujas raundas'
    else
        startGameBtn.value = 'Naujas žaidimas'
}

function renderStats() {
    stats.innerHTML = ''

    game.players.map(player => {
        stats.innerHTML +=
        `
            <li>${player.firstname} ${player.lastname} ${player.points}</li>
        `
    })
}