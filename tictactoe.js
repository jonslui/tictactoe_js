var Gameboard = (function(){
    var gameboard = [{ id: "0" }, { id: "1" }, { id: "2" },
                    { id: "3" }, { id: "4" }, { id: "5" },
                    { id: "6" }, { id: "7" }, { id: "8" },
    ]                    

    var tictactoeBoard = document.querySelector(".tictactoeBoard");
    document.getElementById("restartButton").addEventListener("click", _eraseBoard)

    events.on('playersCreated', _createBoard)
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


    // Recieve event with random available tile id emitted from Gameplay module
    events.on('foundBestMove', _setOwnerRobot);
    function _setOwnerRobot(bestMove){
        tile = document.getElementById(bestMove)

        tile.setAttribute('class', Gameflow.currentColor.color);
        events.emit('changePlayer');

        tile.removeEventListener("click", _setOwner);
    }


    // Used for human players
    function _setOwner() {
        this.setAttribute('class', Gameflow.currentColor.color);

        // pubsubs : emits trigger functions in players 
        events.emit('tileAdded', this.id);
        events.emit('changePlayer');
        
        this.removeEventListener("click", _setOwner);
    }

   
    events.on('gameover', removeClick);
    function removeClick(){
        tictactoeBoard.querySelectorAll('*').forEach(n => n.removeEventListener("click",_setOwner));
    }

    function _eraseBoard(){
        // remove all children from the tictactoeBoard div
        tictactoeBoard.querySelectorAll('*').forEach(n => n.remove());
        
        // send pubsub signal which will signal players to empty their arrays
        events.emit('eraseBoard')

        // recreate board for new game
        _createBoard();
    }


    // _createBoard();


    return {
        removeClick,
        _eraseBoard,
        _createBoard,
    }
    
})()