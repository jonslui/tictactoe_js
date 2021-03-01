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


    // add a Tile to your array and checkForWin when a tile is clicked
    function _addTile(tileId){
        currentPlayer.state.tilesOwned.push(tileId);
        
        // if player B is a robot, call function and remove the last tile chosen playerB's availableTiles array
        if (playerB.state.availableTiles){
            removeTileFromPossibleMoves(tileId);
        }

        if (currentPlayer.checkForWin() == true){
            alert(currentPlayer.name + " wins!");
            events.emit('gameover');
        } else if (currentPlayer.checkForWin() == "tie"){
            alert("tie");
            events.emit('gameover');
        }
    }
    // pubsub: _addTile is called when a tile is clicked
    events.on('tileAdded', _addTile)


    function _nextPlayer(){
        if (currentPlayer == playerA){
            currentPlayer = playerB;
            currentColor.color = 'bTile';

            // randomMove(playerB.state.availableTiles)
            // includ minimax/choose random
            // then recall from the choose random function?
            if (playerB.state.ishuman == false){
                randomMove(playerB.state.availableTiles)
            }
           


        } else {
            currentPlayer = playerA;
            currentColor.color = 'aTile';
        };
    }
    // _nextPlayer is called when a tile is clicked
    events.on('changePlayer', _nextPlayer)

    function createPlayers(){
        // create first human player
        var playerAName = prompt("Enter the name of Player 1: ");
        playerA = Player(playerAName);
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
            playerB.state.availableTiles = ["0","1","2","3","4","5","6","7","8"]
        }
    }

    function removeTileFromPossibleMoves(tileId){
        // console.log(tileId)
        let index = playerB.state.availableTiles.indexOf(tileId);
        // console.log(index);
        playerB.state.availableTiles.splice(index, 1);
        console.log(playerB.state.availableTiles);
    }


    function randomMove(array){
        // Choose a random index from the array with remaining moves
        var randomId = Math.floor(Math.random() * array.length);

        // emit event with the id from the random index to the Gameboard module
        events.emit('randomMove', array[randomId]);
    }


    var playerA = null;
    var playerB = null;
    createPlayers();


    var currentPlayer = playerA;
    var currentColor = {color: playerA.state.tileColor}

    return {
        currentColor,
    }

})()

// create random move function
// work on minimax




// _nextPlayer()
// randomMove()
// removeTileFromPossibleMoves()
// checkforWin()
// _nextPlayer()