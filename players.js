var Gameflow = (function(){

    const Player = (name) => {
        var state = { tilesOwned : [],
                    tileColor: null,
                    ishuman: true,
        }    

        function checkForWin(){
            if(this.state.tilesOwned.length >= 3){
                if(this.state.tilesOwned.includes("0") == true){
                    if (waysToWinWith0(this.state.tilesOwned) == true){
                        return true;
                    };
                }

                if(this.state.tilesOwned.includes("4") == true){
                    if (waysToWinWith4(this.state.tilesOwned) == true){
                        return true;
                    }
                }

                if(this.state.tilesOwned.includes("8") == true){
                    if (waysToWinWith8(this.state.tilesOwned) == true){
                        return true;
                    }
                }

                // if the length of tilesOwned is 5, and it didn't pass true for the above functions, the game has been tied
                if(this.state.tilesOwned.length == 5){
                    return "tie";
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
    // add a Tile to player array and checkForWin when a tile is clicked
    function _addTile(tileId, player = currentPlayer){
        player.state.tilesOwned.push(tileId);
    }

    // _nextPlayer is called when a tile is clicked
    // _nextPlayer calls checkForWin() to see if the currentPlayer's last move was a winning one,
    // If their last move was not a winning one, the function changes the current player.
    // If the next player is not a human, then randomMove() is called
    events.on('changePlayer', _nextPlayer)
    function _nextPlayer(){
        if (currentPlayer.checkForWin() == true){
            events.emit('gameover');
            alert(currentPlayer.name + " wins!");
            return;   
        } else if(currentPlayer.checkForWin() == "tie") {
            events.emit('gameover');
            alert("Tie!");
            return;
        } else {
            if (currentPlayer == playerA){
                currentPlayer = playerB;
                currentColor.color = 'bTile';

                // automatically choose randomTile if playerB isn't human
                if (playerB.state.ishuman == false){
                    randomMove(getEmptyTiles())
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

    function randomMove(array){
        // Choose a random index from the array with remaining moves
        var randomId = Math.floor(Math.random() * array.length);

        // emit event with the id from the random index to the Gameboard module
        events.emit('randomMove', array[randomId]);
    }

    function getEmptyTiles(){
        let all_tiles = ["0","1","2","3","4","5","6","7","8"]
        
        let filled_tiles = []
        playerA.state.tilesOwned.forEach(tile => filled_tiles.push(tile));
        playerB.state.tilesOwned.forEach(tile => filled_tiles.push(tile));
        
        let empty_tiles = all_tiles.filter(tile => !filled_tiles.includes(tile));
        return empty_tiles;
    }

    function bestMove(){
        let bestEvaluation = -Infinity;
        let move;
        let empty_tiles = getEmptyTiles()
        for(i = 0; i < empty_tiles.length; i++){
            // add tile to array
            _addTile(empty_tiles[i], playerB);

            let evaluation = minimax(playerB, false);
            
            // remove tile move from array
            let index = playerB.state.tilesOwned.indexOf(empty_tiles[i]);
            if (index > -1) {
                playerB.state.tilesOwned.splice(index, 1);
            }

            if (evaluation > bestEvaluation) {
                bestEvaluation = evaluation;
                move = empty_tiles[i];
            }
        }
        _addTile(move, playerB);
        currentPlayer = playerA;

    }

    function minimax(player, isMaximizing){
        if(player.state.ishuman == false && player.checkForWin() == true){
            console.log("robot win");
            return +10;
        }
        if(player.state.ishuman == true && player.checkForWin() == true){
            console.log("human win");
            return -10;
        }

        if(player.checkForWin() == "tie"){
            console.log("tie");
            return 0;
        }
        
        if (isMaximizing == true){
            let bestEvaluation = -Infinity;
            let empty_tiles = getEmptyTiles();

            for(i=0; i<empty_tiles.length; i++){
                _addTile(empty_tiles[i], playerB);
                let evaluation = minimax(playerA, false);
                
                let index = playerB.state.tilesOwned.indexOf(empty_tiles[i]);
                if (index > -1) {
                    playerB.state.tilesOwned.splice(index, 1);
                }
                bestEvaluation = Math.max(evaluation, bestEvaluation);
            }

            return bestEvaluation;
        } else {
            let bestEvaluation = Infinity;
            let empty_tiles = getEmptyTiles();

            for(i=0; i<empty_tiles.length; i++){
                _addTile(empty_tiles[i], playerA);
                let evaluation = minimax(playerB, false);
                
                let index = playerA.state.tilesOwned.indexOf(empty_tiles[i]);
                if (index > -1) {
                    playerA.state.tilesOwned.splice(index, 1);
                }
                bestEvaluation = Math.min(evaluation, bestEvaluation);
            }

            return bestEvaluation;
        }
    }

    var playerA = null;
    var playerB = null;
    createPlayers();


    var currentPlayer = playerA;
    var currentColor = {color: playerA.state.tileColor}

    return {
        currentColor,
        getEmptyTiles,
        minimax,
        _addTile,
        playerA,
        playerB,
        bestMove,
    }

})()

// work on minimax
// https://www.youtube.com/watch?v=ovr2sTYhb1I was following this video
