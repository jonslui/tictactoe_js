var Gameboard = (function(){
    var gameboard = [{ id: "0" }, { id: "1" }, { id: "2" },
                    { id: "3" }, { id: "4" }, { id: "5" },
                    { id: "6" }, { id: "7" }, { id: "8" },
    ]                    

    var tictactoeBoard = document.querySelector(".tictactoeBoard");
    var pastGamesDisplay = document.querySelector(".pastGames")

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


    // Recieve event with tile id emitted from Gameplay module
    events.on('aiMove', _setOwnerRobot);
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
    
        addGameToPastGames();

        // remove all children from the tictactoeBoard div
        tictactoeBoard.querySelectorAll('*').forEach(n => n.remove());
        
        // send pubsub signal which will signal players to empty their arrays
        events.emit('eraseBoard')

        // recreate board for new game
        _createBoard();
    }

    // called from _eraseBoard (aka when new game button is clicked)
    function addGameToPastGames(){
        // append one completedGame to pastGames
        // add tiles from last game to the new completedGame
        var lastgame= document.createElement("div");
        lastgame.setAttribute('class', 'completedGame');
        pastGamesDisplay.appendChild(lastgame);
        tictactoeBoard.querySelectorAll('*').forEach(oldTile => addOldTileToLastGame(oldTile, lastgame));
    }

    function addOldTileToLastGame(oldTile, lastgame){
        let newTile = document.createElement("div");
        newTile.setAttribute('class', oldTile.className);
        lastgame.appendChild(newTile);
    }

    // eraseboard function minus createBoard, triggered when a form is opened. 
    // players don't empty their tiles because game will be reset at closeForm.
    events.on('formOpened', _eraseBoard2);
    function _eraseBoard2(){
        // remove all children from the tictactoeBoard div
        tictactoeBoard.querySelectorAll('*').forEach(n => n.remove());
    }

    return {
        removeClick,
    }
    
})()