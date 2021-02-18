var Gameflow = (function(){
    
    const Player = (name) => {
        var state = { tilesOwned : [],
                    tileColor: null,
        }        

        function checkForWin(){

        }

        return Object.assign(
            {
                name,
                checkForWin,
                state,
            },
        )
    }


    function _addTile(tileId){
        currentPlayer.state.tilesOwned.push(tileId);
    }
    // pubsub: _addTile is called when a tile is clicked
    events.on('tileAdded', _addTile)


    function _nextPlayer(){
        if (currentPlayer == playerA){
            currentPlayer = playerB;
            currentColor.color = 'bTile';
        } else {
            currentPlayer = playerA;
            currentColor.color = 'aTile';
        };
    }
    // _nextPlayer is called when a tile is clicked
    events.on('changePlayer', _nextPlayer)



    // Driver
    const playerA = Player("jon");
    playerA.state.tileColor = 'aTile';
    const playerB = Player("bon");
    playerB.state.tileColor = 'bTile';

    var currentPlayer = playerA;
    var currentColor = {color: playerA.state.tileColor}

    return {
        currentColor,

        playerA,
        playerB,
    }

})()
