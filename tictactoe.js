var Gameboard = (function(){
    var gameboard = [{ id: 0 }, { id: 1 }, { id: 2 },
                    { id: 3 }, { id: 4 }, { id: 5 },
                    { id: 6 }, { id: 7 }, { id: 8 },
    ]                    

    var tictactoeBoard = document.querySelector(".tictactoeBoard")

    function _createBoard(){
        gameboard.forEach(tile => _createTile(tile));
    }

    function _createTile(tile){
        var newTile = document.createElement("div");
        newTile.setAttribute('id', tile.id);
        newTile.setAttribute('class','emptyTile');
        newTile.addEventListener("click", _setOwner);
        tictactoeBoard.appendChild(newTile);
    }
    
    function _setOwner() {
        // pubsub
        events.emit('tileAdded', this.id);
        events.emit('changePlayer');

        currentPlayer == playerA ? this.setAttribute('class', 'aTile') : this.setAttribute('class', 'bTile');
        this.removeEventListener("click", _setOwner);
    }

    _createBoard();

    return {

    }
    
})()


