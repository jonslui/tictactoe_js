var Gameflow = (function(){

    availableTiles = ["0","1","2","3","4","5","6","7","8"]

    const Player = (name) => {
        var state = { tilesOwned : [],
                    tileColor: null,
                    ishuman: true,
        }    

        function checkForWin(){
            if(this.state.tilesOwned.length >= 3){
                if(this.state.tilesOwned.includes("0") == true){
                    if (waysToWinWith0(this.state.tilesOwned) == true){
                        alert(currentPlayer.name + " wins!");
                        events.emit('gameover');
                        return true;
                    };
                }

                if(this.state.tilesOwned.includes("4") == true){
                    if (waysToWinWith4(this.state.tilesOwned) == true){
                        alert(currentPlayer.name + " wins!");
                        events.emit('gameover');
                        return true;
                    }
                }

                if(this.state.tilesOwned.includes("8") == true){
                    if (waysToWinWith8(this.state.tilesOwned) == true){
                        alert(currentPlayer.name + " wins!");
                        events.emit('gameover');
                        return true;
                    }
                }

                // if the length of tilesOwned is 5, and it didn't pass true for the above functions, the game has been tied
                if(this.state.tilesOwned.length == 5){
                    alert("Tie!");
                    events.emit('gameover');
                    return true;
                }

                return false;               
            };
        }

        function waysToWinWith0(array){
           var row1 = ["1","2"];
           var column1 = ["3","6"];
           var diag1 = ["4","8"];

            if (row1.every(i => array.includes(i))){
                return true;
            } else if (column1.every(i => array.includes(i))){
                return true;
            } else if (diag1.every(i => array.includes(i))){
                return true;
            } else {
                return false;
            }
        }
        
        function waysToWinWith4(array){
            var row2 = ["3","5"];
            var column2 = ["1","7"];
            var diag2 = ["2","6"];

            if (row2.every(i => array.includes(i))){
                return true;
            } else if (column2.every(i => array.includes(i))){
                return true;
            } else if (diag2.every(i => array.includes(i))){
                return true;
            } else {
                return false;
            }
        }

        function waysToWinWith8(array){
            var row3 = ["6","7"];
            var column3 = ["2","5"];
            if (row3.every(i => array.includes(i))){
                return true;
            } else if (column3.every(i => array.includes(i))){
                return true;
            } else {
                return false;
            }
        }

        // removes tiles from the area when the "eraseBoard" event is sent to pubsub from tictactoe.js
        function _emptyTilesOwned(){
            state.tilesOwned = [];
        }
        events.on('eraseBoard', _emptyTilesOwned)

        return Object.assign(
            {
                name,
                checkForWin,
                state,
            },
        )
    }

    // pubsub: _addTile is called when a tile is clicked
    events.on('tileAdded', _addTile)
    // add a Tile to your array and checkForWin when a tile is clicked
    function _addTile(tileId){
        currentPlayer.state.tilesOwned.push(tileId);
        removeTileFromPossibleMoves(tileId)
    }


    // _nextPlayer is called when a tile is clicked
    // _nextPlayer calls checkForWin() to see if the currentPlayer's last move was a winning one,
    // If their last move was not a winning one, the function changes the current player.
    // If the next player is not a human, then randomMove() is called
    events.on('changePlayer', _nextPlayer)
    function _nextPlayer(){
        if (currentPlayer.checkForWin() == true){
           return;
           
        } else {
            if (currentPlayer == playerA){
                currentPlayer = playerB;
                currentColor.color = 'bTile';

                // automatically choose randomTile if playerB isn't human
                if (playerB.state.ishuman == false){
                    randomMove(availableTiles)
                }
            } else {
                currentPlayer = playerA;
                currentColor.color = 'aTile';
            };
        }
    }

    function createPlayers(){
        // create first human player
        var playerAName = prompt("Enter the name of Player 1: ");
        if (playerAName){
            playerA = Player(playerAName);
        } else {
            playerA = Player("Player 1");
        }
        playerA.state.tileColor = 'aTile';
    
        // create robot or human player
        var playerBName = prompt("Enter the name of Player 2, or click cancel for Robot: ");
        if (playerBName != null){
            playerB = Player(playerBName);
            playerB.state.tileColor = 'bTile';
        } else {
            playerB = Player("Sparky");
            playerB.state.tileColor = 'bTile';
            playerB.state.ishuman = false;
        }
    }


    function removeTileFromPossibleMoves(tileId){
        let index = availableTiles.indexOf(tileId);
        availableTiles.splice(index, 1);
    }


    function randomMove(array){
        // Choose a random index from the array with remaining moves
        var randomId = Math.floor(Math.random() * array.length);

        // emit event with the id from the random index to the Gameboard module
        events.emit('randomMove', array[randomId]);
    }


    function minimax(){
        // need array of empty spaces
        // already have array of tilesOwned for each player

    }

    var playerA = null;
    var playerB = null;
    createPlayers();


    var currentPlayer = playerA;
    var currentColor = {color: playerA.state.tileColor}

    return {
        currentColor
    }

})()

// work on minimax
    // change how availableTiles is saved in playerB, make it available within the whole module
    // just move availableTiles to a array in the Gameflow module, not attacked to any player

// move content from beginning of _nextPlayer into "checkForWin"?