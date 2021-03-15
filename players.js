var Gameflow = (function(){

    const Player = (name) => {
        var state = { tilesOwned : [],
                    tileColor: null,
                    ishuman: true,
                    difficulty: null,
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
    // If the next player is not a human, then call chooseAiMove()
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

                if (playerB.state.ishuman == false){
                    chooseAiMove();
                }
            } else {
                currentPlayer = playerA;
                currentColor.color = 'aTile';
            };
        }
    }

    // if difficulty level == 3 (unbeatable), only call findBestMove()
    // otherwise call randomMove() when Math.random is less than 1/difficulty
    function chooseAiMove(){
        if(playerB.state.difficulty == 3){
            findBestMove();
        } else {
            // multiplied by 2 to increase difficulty curve
            Math.random() < 1/(playerB.state.difficulty*2) ? randomMove() : findBestMove();
        }
    }

    function createPlayers(){
        // create first human player
        playerA = Player(sessionStorage.getItem('playerAName'));
        playerA.state.tileColor = 'aTile';
    
        // create second human player or ai
        playerB = Player(sessionStorage.getItem('playerBName'));
        playerB.state.tileColor = 'bTile';
        if (sessionStorage.getItem('playerBRobot') == "true"){
            playerB.state.ishuman = false;
            playerB.state.difficulty = parseInt(sessionStorage.getItem('playerBDifficulty'));
        } 

        currentColor = {color: playerA.state.tileColor};
        events.emit('playersCreated');
    }

    function getEmptyTiles(){
        let all_tiles = ["0","1","2","3","4","5","6","7","8"]
        
        let filled_tiles = []
        playerA.state.tilesOwned.forEach(tile => filled_tiles.push(tile));
        playerB.state.tilesOwned.forEach(tile => filled_tiles.push(tile));
        
        let empty_tiles = all_tiles.filter(tile => !filled_tiles.includes(tile));
        return empty_tiles;
    }

    function randomMove(){
        let empty_tiles = getEmptyTiles();
        let randomMove = empty_tiles[Math.floor(Math.random() * empty_tiles.length)];

        _addTile(randomMove, playerB);
    
        events.emit('aiMove', randomMove);
    }


    function findBestMove(){
        let bestEvaluation = -Infinity;
        let bestMove;
        let empty_tiles = getEmptyTiles();
        for(let i = 0; i < empty_tiles.length; i++){
            _addTile(empty_tiles[i], playerB);
            let evaluation = minimax(false, 0);
            playerB.state.tilesOwned.pop();
            
            if (evaluation > bestEvaluation) {
                bestEvaluation = evaluation;
                bestMove = empty_tiles[i];
            }
        }
        _addTile(bestMove, playerB);
        events.emit('aiMove', bestMove);
    }


    function minimax(isMaximizing, depth){
        // exit cases
        if(playerA.checkForWin() == true){
            return -10 - depth;
        }
        if(playerB.checkForWin() == true){
            return +10 - depth;
        }
        if(playerA.checkForWin() == "tie" || playerB.checkForWin() == "tie"){
            return 0;
        }
        
        if (isMaximizing){
            let bestEvaluation = -Infinity;
            let empty_tiles = getEmptyTiles();

            for(let i=0; i<empty_tiles.length; i++){
                _addTile(empty_tiles[i], playerB);
                let evaluation = minimax(false, depth + 1);
                playerB.state.tilesOwned.pop();
                
                bestEvaluation = Math.max(evaluation, bestEvaluation);
            }

            return bestEvaluation;
        } else {
            let bestEvaluation = +Infinity;
            let empty_tiles = getEmptyTiles();

            for(let i=0; i<empty_tiles.length; i++){
                _addTile(empty_tiles[i], playerA);
                let evaluation = minimax(true, depth + 1);
                playerA.state.tilesOwned.pop();

                bestEvaluation = Math.min(evaluation, bestEvaluation);
            }

            return bestEvaluation;
        }
    }

    // create player variables so they're refrenceable post creation
    var playerA;
    var playerB;
    var currentColor;


    // if data exists in sessionStorage call createPlayers, otherwise do nothing
    if (sessionStorage.length != 0) {
        createPlayers();
    }

    var currentPlayer = playerA;

    return {
        currentColor,
        playerB,
    }

})()



// TODO: 
// display past games in miniature below large board
// Make minmax work with robot player being player 1 -- just make starting player be playerB if player 1 is chosen to be a robot
// change file names through git: gameboard, gameflow, form
// stop tile hover effect once change players is clicked
// make pop up the width of tictactoeboard(500px)