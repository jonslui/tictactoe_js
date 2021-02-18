var Gameplay = (function(){

})()

const Player = (name) => {
    var state = {   tilesOwned : [],
                    currentPlayer : false,
    }

    // bind to pubsub event
    // _addTile is called when a tile is clicked
    events.on('tileAdded', _addTile)

    // 
    events.on('changePlayer', _changePlayer)

    function _checkForWin(){
        
    }

    function _changePlayer(){
        if (state.currentPlayer == false){
            state.currentPlayer = true
        } else {
            state.currentPlayer = false;
        };
    }

    function _addTile(tileId){
        if(state.currentPlayer == true){
            state.tilesOwned.push(tileId);
        };
    }

    return Object.assign(
        {
            name,
            state,
        },
    )
}

const playerA = Player("jon");
const playerB = Player("bon");

// don't want currentPlayer to be public 
playerB.state.currentPlayer = true;


currentPlayer = playerB;