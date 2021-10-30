const summonBtn = document.querySelector('.summon-btn'),
    cancelBtn = document.querySelector('.cancel'),
    title = document.querySelector('.title'),
    cardsContainer = document.querySelector('.cards-container'),
    restart = document.querySelector('.restart'),
    winCondition = [
        //horizontal
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //vertical
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //diagonal
        [0, 4, 8],
        [2, 4, 6]
    ]

let board = ['', '', '', '', '', '', '', '', ''],
    ghosts,
    idx = 0,
    turn = 0,
    playerTurn = true,
    gameEnded = false,
    misplayCoefficient = .1 // 0 => best play, 1 => always mistaken

cancelBtn.addEventListener('click', () => {
    cancelBtn.classList.add('vanish')
})

summonBtn.addEventListener('click', () => {
    summonBtn.style.opacity = 0
    cancelBtn.style.opacity = 0
    title.textContent = "Tic Tac Ghosts"
    cardsContainer.style.display = 'flex'
    restart.style.display = 'block'
    createBoard()
})

const createBoard = () => {
    for (i = 0; i < 9; i++) {
        setTimeout(() => {
            cardsContainer.innerHTML += `
        <div class="card selected" data-idx=${idx}>
            <i class="fas fa-ghost">
        </div>`
            idx++
            idx === 9 && ticTacToe()
        }, 250 * i)
    }
}

const ticTacToe = () => {
    ghosts = Array.from(document.querySelectorAll('.card'))

    ghosts.forEach(ghost => {
        ghost.classList.remove('selected')
        ghost.addEventListener('click', ghostChosen)
    })

}

function ghostChosen(compGhost) {
    let ghost

    playerTurn ? ghost = this : ghost = compGhost

    if (ghost.classList.contains('selected') || gameEnded) {
        return
    }

    ghost.classList.add('selected')
    ghost.style.color = playerTurn ? 'green' : 'orange'
    board[ghost.dataset.idx] = playerTurn ? 'player' : 'computer'

    checkWinConditions()
}

const checkWinConditions = () => {
    for (let i = 0; i < winCondition.length; i++) {

        if (board[winCondition[i][0]] === "" || board[winCondition[i][1]] === "" || board[winCondition[i][2]] === "") {
            continue
        }

        if (board[winCondition[i][0]] === board[winCondition[i][1]] && board[winCondition[i][1]] === board[winCondition[i][2]]) {
            console.log('winner : player ? ' + playerTurn)
            title.textContent = "You " + (playerTurn ? 'win' : "loose")
            gameEnded = true
            ghosts.forEach(ghost => {
                ghost.classList.add('selected')
            })
        }
    }

    if (turn === 8 && !gameEnded) {
        console.log('end')
        title.textContent = 'Draw game'
        gameEnded = true
        playerTurn = !playerTurn
    }

    turn++

    playerTurn = !playerTurn

    !playerTurn && computerTurn()
}

const computerTurn = () => {

    if (gameEnded) {
        return
    }

    let comPlay = 10



    if (turn === 1) {
        if (board[4] === '') {
            comChoice(4)
        }
        else {
            Math.random() < .3 ? comPlay = 1 : comPlay = 0
        }
    }

    else {
        checkGhosts('computer')

        comPlay === 10 && checkGhosts('player')
    }


    if (comPlay === 10) {

        for (let i = 0; i < winCondition.length; i++) {

            if (board[winCondition[i][0]] === 'computer' && board[winCondition[i][1]] === '' && board[winCondition[i][2]] === '') {
                comChoice(winCondition[i][2])
                break
            }
            if (board[winCondition[i][1]] === 'computer' && board[winCondition[i][0]] === '' && board[winCondition[i][2]] === '') {
                comChoice(winCondition[i][0])
                break
            }
            if (board[winCondition[i][2]] === 'computer' && board[winCondition[i][0]] === '' && board[winCondition[i][1]] === '') {
                comChoice(winCondition[i][0])
                break
            }
        }
    }

    if (comPlay === 10) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                comPlay = i
                break
            }
        }
    }

    function checkGhosts(name) {
        for (let i = 0; i < winCondition.length; i++) {

            if (board[winCondition[i][0]] === name) {
                if (board[winCondition[i][1]] === name && board[winCondition[i][2]] === '') {
                    comChoice(winCondition[i][2])
                    break
                }
                if (board[winCondition[i][2]] === name && board[winCondition[i][1]] === '') {
                    comChoice(winCondition[i][1])
                    break
                }
            }

            if (board[winCondition[i][0]] === '') {
                if (board[winCondition[i][1]] === name && board[winCondition[i][2]] === name) {
                    comChoice(winCondition[i][0])
                    break
                }
            }
        }
    }

    function comChoice(optimalPlay) {
        Math.random() < misplayCoefficient ? comPlay = 10 : comPlay = optimalPlay
    }

    setTimeout(() => ghostChosen(document.querySelector(`[data-idx="${comPlay}"]`)), 250)

}

restart.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''],
        turn = 0,
        playerTurn = true,
        gameEnded = false,
        title.textContent = 'Tic Tac Ghosts'

    ghosts.forEach(ghost => {
        ghost.classList.remove('selected')
        ghost.style.color = 'white'
    })
})