export default class Player {
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