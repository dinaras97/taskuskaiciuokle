import Game from './game.js'
import Player from './player.js'

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