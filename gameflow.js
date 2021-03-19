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


    // Is there a more elequent way to do this?
    // When restart button is clicked, currents must be set to playerA/Color
    document.getElementById("restartButton").addEventListener("click", changeCurrents);
    function changeCurrents(){
        currentPlayer = playerA;
        currentColor.color = "aTile";
        ifAiMakeFirstMove();
    }

    function createPlayers(){
        // create first human player
        playerA = Player(sessionStorage.getItem('playerAName'));
        playerA.state.tileColor = 'aTile';
        if(sessionStorage.getItem('playerARobot') == "true"){
            playerA.state.ishuman = false;
            playerA.state.difficulty = parseInt(sessionStorage.getItem('playerADifficulty'));
        }

    
        // create second human player or ai
        playerB = Player(sessionStorage.getItem('playerBName'));
        playerB.state.tileColor = 'bTile';
        if (sessionStorage.getItem('playerBRobot') == "true"){
            playerB.state.ishuman = false;
            playerB.state.difficulty = parseInt(sessionStorage.getItem('playerBDifficulty'));
        } 

        currentColor = {color: playerA.state.tileColor};
        currentPlayer = playerA;
        events.emit('playersCreated');
        
        ifAiMakeFirstMove();
    }

    //function calls after a brief pause in order to give Gameboard.createBoard time to complete
    function ifAiMakeFirstMove(){
        if (playerA.state.ishuman == false){
            setTimeout(function(){
                chooseAiMove();} , 0.1);
        }
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
            alert(currentPlayer.name + " wins!");
            events.emit('gameover', currentColor.color);
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

                if (playerA.state.ishuman == false){
                    chooseAiMove();
                }
            };
        }
    }


    // if difficulty level == 3 (unbeatable), only call findBestMove()
    // otherwise call randomMove() when Math.random is less than 1/difficulty
    function chooseAiMove(){
        if(currentPlayer.state.difficulty == 3){
            findBestMove();
        } else {
            // multiplied by 2 to increase difficulty curve
            Math.random() < 1/(currentPlayer.state.difficulty*2) ? randomMove(currentPlayer) : findBestMove();
        }
    }

    function getEmptyTiles(){
        let all_tiles = ["0","1","2","3","4","5","6","7","8"]
        
        let filled_tiles = []
        playerA.state.tilesOwned.forEach(tile => filled_tiles.push(tile));
        playerB.state.tilesOwned.forEach(tile => filled_tiles.push(tile));
        
        let empty_tiles = all_tiles.filter(tile => !filled_tiles.includes(tile));
        return empty_tiles;
    }

    function randomMove(player){
        let empty_tiles = getEmptyTiles();
        let randomMove = empty_tiles[Math.floor(Math.random() * empty_tiles.length)];

        _addTile(randomMove, player);
    
        events.emit('aiMove', randomMove);
    }


    function findBestMove(){
        let otherPlayer;
        currentPlayer == playerA ? otherPlayer = playerB : otherPlayer = playerA;
        let bestEvaluation = -Infinity;
        let bestMove;
        let empty_tiles = getEmptyTiles();
        for(let i = 0; i < empty_tiles.length; i++){
            _addTile(empty_tiles[i], currentPlayer);
            // maybe send a variable "nextPlayer" equal to the other player and submit it with minimax formula
            let evaluation = minimax(false, 0, otherPlayer);
            currentPlayer.state.tilesOwned.pop();

            if (evaluation > bestEvaluation) {
                bestEvaluation = evaluation;
                bestMove = empty_tiles[i];
            }

        }
        _addTile(bestMove, currentPlayer);
        events.emit('aiMove', bestMove);
    }


    function minimax(isMaximizing, depth, otherPlayer){
        // exit cases
        if(otherPlayer.checkForWin() == true){
            return -10 - depth;
        }
        if(currentPlayer.checkForWin() == true){
            return +10 - depth;
        }
        if(otherPlayer.checkForWin() == "tie" || currentPlayer.checkForWin() == "tie"){
            return 0;
        }
        
        if (isMaximizing){
            let bestEvaluation = -Infinity;
            let empty_tiles = getEmptyTiles();

            for(let i=0; i<empty_tiles.length; i++){
                _addTile(empty_tiles[i], currentPlayer);
                let evaluation = minimax(false, depth + 1, otherPlayer);
                currentPlayer.state.tilesOwned.pop();
                
                bestEvaluation = Math.max(evaluation, bestEvaluation);
            }

            return bestEvaluation;
        } else {
            let bestEvaluation = +Infinity;
            let empty_tiles = getEmptyTiles();

            for(let i=0; i<empty_tiles.length; i++){
                _addTile(empty_tiles[i], otherPlayer);
                let evaluation = minimax(true, depth + 1, otherPlayer);
                otherPlayer.state.tilesOwned.pop();

                bestEvaluation = Math.min(evaluation, bestEvaluation);
            }

            return bestEvaluation;
        }
    }

    // create player variables so they're refrenceable post creation
    var playerA;
    var playerB;
    var currentColor;
    var currentPlayer;


    // if data exists in sessionStorage call createPlayers, otherwise do nothing
    if (sessionStorage.length != 0) {
        createPlayers();
    }


    return {
        currentColor,
    }

})()



// TODO: 
// Change Player 1 and Player 2 at the bottom to their player names
