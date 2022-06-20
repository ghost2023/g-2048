class Tile{
    constructor(weight, x, y){
        this.ele = document.createElement('div')
        this.ele.className = 'tile pic'
        this.setPos(x , y)
        this.setWeight(weight, true)
        BOARD.appendChild(this.ele)
    }
    setPos(x, y){
        if(this.y) this.ele.classList.remove('t-' + this.y)
        if(this.x) this.ele.classList.remove('l-' + this.x)
        this.x = x
        this.y = y
        this.ele.classList.add('t-' + this.y)
        this.ele.classList.add('l-' + this.x)
    }
    setWeight(w, isAdded = false){
        this.w = w
        this.ele.innerText = Math.pow(2,w)
        if(w < 3) this.ele.style.color = '#776e65'
        else this.ele.style.color = '#f9f6f2'
        this.ele.style.background = TILE_CLR[w - 1]
        if(isAdded) return
        this.ele.style.transform = 'scale(1.15)'
        this.ele.addEventListener('transitionend', () => this.ele.style.removeProperty('transform'))
    }
}

function newRandomPos(){
    refreshEmpty()
    let w = (Math.random() * 10) > 1 ? 1 : 2
    console.log(w)
    return [w, ...empty[Math.floor(Math.random() * empty.length)]]
}

function findTiles(x, y){
    return tiles.filter(item => item.x == x && item.y == y)
}

function refreshEmpty(){
    empty = [
        [ 0, 0 ], [ 0, 1 ],
        [ 0, 2 ], [ 0, 3 ],
        [ 1, 0 ], [ 1, 1 ],
        [ 1, 2 ], [ 1, 3 ],
        [ 2, 0 ], [ 2, 1 ],
        [ 2, 2 ], [ 2, 3 ],
        [ 3, 0 ], [ 3, 1 ],
        [ 3, 2 ], [ 3, 3 ]
    ]
    for(let tile of tiles){
        for(var i = 0; i < empty.length; i++) {
            if(empty[i][0] == tile.x && empty[i][1] == tile.y) {
                empty.splice(i, 1);
                break;
            }
        }
    }
}

function saveProgress(){
    if(stopGame) {
        localStorage.removeItem('tiles')
        localStorage.removeItem('score')
        return
    }
    let tilesCode = tiles.map(it => [it.w, it.x, it.y])
    localStorage.setItem('tiles', JSON.stringify(tilesCode))
}

function newGame(){
    for(let i of tiles){
        i.ele.remove()
    }
    tiles = []
    tiles.push(new Tile(...newRandomPos()));
    tiles.push(new Tile(...newRandomPos()))
    score = 0
    document.getElementById('score').innerText = score
    overlay.classList.add('h')
    overlay.classList.remove('overlay-win')
    overlay.classList.remove('overlay-gameover')
    stopGame = false
    saveProgress()
}


const TILE_SIZE = 121.25;
const TILE_CLR = ['#eee4da', '#eee1c9', '#f3b27a', '#f69664', '#f77c5f', '#f75f3b', '#edd073', '#edcc62', '#edc950', '#edc53f', '#edc22e']
const BOARD = document.querySelector('.board')
const newGameBtn = document.getElementById('new-game')
const overlay = document.querySelector('.overlay')

let tiles = []

let score = parseInt(localStorage.getItem('score')) || 0;
document.getElementById('score').innerText = score

let empty = [
    [ 0, 0 ], [ 0, 1 ],
    [ 0, 2 ], [ 0, 3 ],
    [ 1, 0 ], [ 1, 1 ],
    [ 1, 2 ], [ 1, 3 ],
    [ 2, 0 ], [ 2, 1 ],
    [ 2, 2 ], [ 2, 3 ],
    [ 3, 0 ], [ 3, 1 ],
    [ 3, 2 ], [ 3, 3 ]
  ]


let highscore = localStorage.getItem('highscore') || 0
document.getElementById('highscore').innerText = highscore

overlay.querySelector('#new-game').onclick = newGame
newGameBtn.onclick = newGame
let stopGame = false

if(localStorage.getItem('tiles')){
    let tilesCode = JSON.parse(localStorage.getItem('tiles'))
    for(let t of tilesCode){
        tiles.push(new Tile(...t))
    }
}
else newGame()

document.addEventListener("keydown", e => {
	e = e || window.event;

    if(stopGame) return
    let isMoved = false
    
    // DOWN
	if(e.key == 'ArrowDown'){
        for(let i = 0; i < 4; i++){
            let column = tiles.filter(item => item.x == i).sort((a, b) => b.y - a.y)
            if(!column.length) continue
            for(let tile of column){
                for (let j = tile.y + 1; j < 4; j++){
                    let tileBelow = findTiles(i, j)
                    if(tileBelow.length > 1) break
                    if(!tileBelow.length){
                        tile.setPos(i, j)
                        isMoved = true
                        continue
                    }
                    if(tileBelow[0].w == tile.w){
                        tile.setPos(i, j)
                        tileBelow[0].ele.style.zIndex = 20
                        tile.ele.style.zIndex = 10
                        isMoved = true
                        break
                    }
                    else break
                }
            }
        }
    }

    // UP
    else if(e.key == 'ArrowUp'){
        for(let i = 0; i < 4; i++){
            let column = tiles.filter(item => item.x == i).sort((a, b) => a.y - b.y)
            if(!column.length) continue
            for(let tile of column){
                for (let j = tile.y - 1; j >= 0; j--){
                    let tileAbove = findTiles(i, j)
                    if(tileAbove.length > 1) break
                    if(!tileAbove.length){
                        tile.setPos(i, j)
                        isMoved = true
                        continue
                    }
                    if(tileAbove[0].w == tile.w){
                        tile.setPos(i, j)
                        tileAbove[0].ele.style.zIndex = 20
                        tile.ele.style.zIndex = 10
                        isMoved = true
                        break
                    }
                    else break
                }
            }
        }
    }

    // RIGHT
    else if(e.key == 'ArrowRight'){
        for(let j = 0; j < 4; j++){
            let row = tiles.filter(item => item.y == j).sort((a, b) => b.x - a.x)

            if(!row.length) continue
            
            for(let tile of row){
                for (let i = tile.x + 1; i < 4; i++){
                    let tileRight = findTiles(i, j)
                    if(tileRight.length > 1) break
                    if(!tileRight.length){
                        tile.setPos(i, j)
                        isMoved = true
                        continue
                    }
                    if(tileRight[0].w == tile.w){
                        tile.setPos(i, j)
                        tileRight[0].ele.style.zIndex = 20
                        tile.ele.style.zIndex = 10
                        isMoved = true
                        break
                    }
                    else break
                }
            }
        }
    }

    // LEFT
    else if(e.key == 'ArrowLeft'){
        for(let j = 0; j < 4; j++){
            let row = tiles.filter(item => item.y == j).sort((a, b) => a.x - b.x)
            
            if(!row.length) continue

            for(let tile of row){
                for (let i = tile.x - 1; i >= 0; i--){
                    let tileLeft = findTiles(i, j)
                    if(tileLeft.length > 1) break
                    if(!tileLeft.length){
                        tile.setPos(i, j)
                        isMoved = true
                        continue
                    }
                    if(tileLeft[0].w == tile.w){
                        tile.setPos(i, j)
                        tileLeft[0].ele.style.zIndex = 20
                        tile.ele.style.zIndex = 10
                        isMoved = true
                        break
                    }
                    else break
                }
            }
        }
    }

    if(isMoved){
        tiles.push(new Tile(...newRandomPos()))
        
        //looking for tiles that are stacked
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                let tilesAt = findTiles(i, j)
                if(tilesAt.length < 2) continue
                let tile1 = tilesAt[0].ele.style.zIndex == 10 ? tilesAt[0] : tilesAt[1]
                let tile2 = tilesAt[1].ele.style.zIndex == 10 ? tilesAt[0] : tilesAt[1]
                tile2.setWeight(1 + tile2.w)
                if(tile2.w == 11){
                    stopGame = true
                    overlay.classList.add('overlay-win')
                    overlay.classList.toggle('h')
                    
                    overlay.querySelector('.game-status').innerText = 'You Win!'
                }
                score += Math.pow(2, tile2.w)
                document.getElementById('score').innerText = score
                if(score > highscore){
                    highscore = score
                    localStorage.setItem('highscore', score)
                    document.getElementById('highscore').innerText = score
                } 
                tile1.ele.addEventListener('transitionend', () => {
                    tile1.ele.remove()
                })
                
                tiles = tiles.filter(item => item != tile1)
            }
            localStorage.setItem('score', score)
        }

        //check if there still is an available move
        if(tiles.length == 16){
            let isNone = true

            // loop through tiles and look at adjacent tile if they are equal in weight
            tileLoop: for(let tile of tiles){
                let x = tile.x
                let y = tile.y

                for(let [i ,j] of [[-1,0], [0, -1], [0, 1], [1, 0]]){
                    let nx = x + i
                    let ny = y + j
                    if(nx < 0 || nx > 4 || ny < 0 || ny > 4) continue
                    let nextTile = findTiles(nx, ny)[0]
                    if(!nextTile) continue
                    if(nextTile.w == tile.w){
                        isNone = false
                        break tileLoop
                    }
                }
            }

            if(isNone){
                overlay.classList.add('overlay-gameover')
                overlay.classList.toggle('h')
                
                overlay.querySelector('.game-status').innerText = 'Game Over!'
            }
        }

        saveProgress()
    } 

});

document.querySelector('.border').oncontextmenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

let isDragging = false

let initial = {}

document.querySelector('.border').addEventListener('touchstart', e => {
    initial = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    } 
})

document.querySelector('.border').addEventListener('touchend', e => {
    let x = initial.x - e.changedTouches[0].clientX
    let y = initial.y - e.changedTouches[0].clientY
    
    if(stopGame) return
    let isMoved = false

    if(Math.abs(x) > Math.abs(y)){
        if(x > 0){
            for(let j = 0; j < 4; j++){
                let row = tiles.filter(item => item.y == j).sort((a, b) => a.x - b.x)
                
                if(!row.length) continue
    
                for(let tile of row){
                    for (let i = tile.x - 1; i >= 0; i--){
                        let tileLeft = findTiles(i, j)
                        if(tileLeft.length > 1) break
                        if(!tileLeft.length){
                            tile.setPos(i, j)
                            isMoved = true
                            continue
                        }
                        if(tileLeft[0].w == tile.w){
                            tile.setPos(i, j)
                            tileLeft[0].ele.style.zIndex = 20
                            tile.ele.style.zIndex = 10
                            isMoved = true
                            break
                        }
                        else break
                    }
                }
            }
        }
        else {
            for(let j = 0; j < 4; j++){
                let row = tiles.filter(item => item.y == j).sort((a, b) => b.x - a.x)
    
                if(!row.length) continue
                
                for(let tile of row){
                    for (let i = tile.x + 1; i < 4; i++){
                        let tileRight = findTiles(i, j)
                        if(tileRight.length > 1) break
                        if(!tileRight.length){
                            tile.setPos(i, j)
                            isMoved = true
                            continue
                        }
                        if(tileRight[0].w == tile.w){
                            tile.setPos(i, j)
                            tileRight[0].ele.style.zIndex = 20
                            tile.ele.style.zIndex = 10
                            isMoved = true
                            break
                        }
                        else break
                    }
                }
            }
        }
    }

    else{
        if(y < 0){
            for(let i = 0; i < 4; i++){
                let column = tiles.filter(item => item.x == i).sort((a, b) => b.y - a.y)
                if(!column.length) continue
                for(let tile of column){
                    for (let j = tile.y + 1; j < 4; j++){
                        let tileBelow = findTiles(i, j)
                        if(tileBelow.length > 1) break
                        if(!tileBelow.length){
                            tile.setPos(i, j)
                            isMoved = true
                            continue
                        }
                        if(tileBelow[0].w == tile.w){
                            tile.setPos(i, j)
                            tileBelow[0].ele.style.zIndex = 20
                            tile.ele.style.zIndex = 10
                            isMoved = true
                            break
                        }
                        else break
                    }
                }
            }
        }
        else{
            for(let i = 0; i < 4; i++){
                let column = tiles.filter(item => item.x == i).sort((a, b) => a.y - b.y)
                if(!column.length) continue
                for(let tile of column){
                    for (let j = tile.y - 1; j >= 0; j--){
                        let tileAbove = findTiles(i, j)
                        if(tileAbove.length > 1) break
                        if(!tileAbove.length){
                            tile.setPos(i, j)
                            isMoved = true
                            continue
                        }
                        if(tileAbove[0].w == tile.w){
                            tile.setPos(i, j)
                            tileAbove[0].ele.style.zIndex = 20
                            tile.ele.style.zIndex = 10
                            isMoved = true
                            break
                        }
                        else break
                    }
                }
            }
        }
    }

    if(isMoved){
        tiles.push(new Tile(...newRandomPos()))
        
        //looking for tiles that are stacked
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                let tilesAt = findTiles(i, j)
                if(tilesAt.length < 2) continue
                let tile1 = tilesAt[0].ele.style.zIndex == 10 ? tilesAt[0] : tilesAt[1]
                let tile2 = tilesAt[1].ele.style.zIndex == 10 ? tilesAt[0] : tilesAt[1]
                tile2.setWeight(1 + tile2.w)
                if(tile2.w == 11){
                    stopGame = true
                    overlay.classList.add('overlay-win')
                    overlay.classList.toggle('h')
                    
                    overlay.querySelector('.game-status').innerText = 'You Win!'
                }
                score += Math.pow(2, tile2.w)
                document.getElementById('score').innerText = score
                if(score > highscore){
                    highscore = score
                    localStorage.setItem('highscore', score)
                    document.getElementById('highscore').innerText = score
                } 
                tile1.ele.addEventListener('transitionend', () => {
                    tile1.ele.remove()
                })
                
                tiles = tiles.filter(item => item != tile1)
            }
            localStorage.setItem('score', score)
        }

        //check if there still is an available move
        if(tiles.length == 16){
            let isNone = true

            // loop through tiles and look at adjacent tile if they are equal in weight
            tileLoop: for(let tile of tiles){
                let x = tile.x
                let y = tile.y

                for(let [i ,j] of [[-1,0], [0, -1], [0, 1], [1, 0]]){
                    let nx = x + i
                    let ny = y + j
                    if(nx < 0 || nx > 4 || ny < 0 || ny > 4) continue
                    let nextTile = findTiles(nx, ny)[0]
                    if(!nextTile) continue
                    if(nextTile.w == tile.w){
                        isNone = false
                        break tileLoop
                    }
                }
            }

            if(isNone){
                overlay.classList.add('overlay-gameover')
                overlay.classList.toggle('h')
                
                overlay.querySelector('.game-status').innerText = 'Game Over!'
            }
        }

        saveProgress()
    } 

})