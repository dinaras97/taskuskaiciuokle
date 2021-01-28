export default class Game {
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