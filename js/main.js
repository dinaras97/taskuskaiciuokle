class Game {
    constructor() {
        this.players = []
        this.round = 0
    }

    newRound() {
        this.round++
        this.players.map(player => player.newRound())
    }

    addPlayer(player) {
        this.players.push(player)

        if (this.round !== 0)
            for (let i = 0; i < this.round; i++)
                player.newRound()
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

    info() {
        this.sortPlayers()
        return this.players
    }
}

class Player {
    constructor(firstname, lastname) {
        this.firstname = firstname
        this.lastname = lastname
        this.points = [ ]
    }

    addPoints(round, points) {
        this.points[round - 1] += points
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

let form = document.querySelector('#gameForm')
let inputs = form.elements
let gamePlayersList = document.querySelector('#gamePlayersList')

let game = new Game()

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let firstname = inputs['firstname'].value
    let lastname = inputs['lastname'].value
    
    if (firstname && lastname && firstname.length <= 32 && lastname.length <= 32) {
        let player = new Player(firstname, lastname)
        if (!playerExist(player)) {
            game.addPlayer(player)
            form.reset()
            updatePlayersList(player)
        }
    }
})

function playerExist(player) {
    let existing = game.players.filter(p => p.firstname.toLowerCase() === player.firstname.toLowerCase()
        && p.lastname.toLowerCase() === player.lastname.toLowerCase())

    if (existing.length > 0)
        return true
    
    return false
}

function updatePlayersList(player) {
    gamePlayersList.innerHTML = ''

    game.info().map(player => {
        gamePlayersList.innerHTML += `<li>${player.firstname} ${player.lastname} ${player.calculatePoints()}</li>`
    })
}