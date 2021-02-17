var Gameboard = (function(){
    var gameboard = [{ id: 0, owner: null },
                    { id: 1, owner: null },
                    { id: 2, owner: null },
                    { id: 3, owner: null },
                    { id: 4, owner: null },
                    { id: 5, owner: null },
                    { id: 6, owner: null },
                    { id: 7, owner: null },
                    { id: 8, owner: null },
    ]                    

    function winTracker(tileId){
        
    }
    var tictactoeBoard = document.querySelector(".tictactoeBoard")

    function assignOwner(player, tileId){
        gameboard[tileId].owner = player;
        printBoard();
    }

    function createBoard(){
        gameboard.forEach(tile => createTile(tile));
    }

    function createTile(tile){
        var newTile = document.createElement("div");
        newTile.setAttribute('id', tile.id);
        newTile.setAttribute('class','emptyTile');
        newTile.addEventListener("click", setOwner);
        tictactoeBoard.appendChild(newTile);
    }
    
    function setOwner() {
        // console.log(gameboard[this.id].owner);
        // pull data about whos turn it is from outside the module
        this.removeEventListener("click", setOwner);
    }

    createBoard();

    return {

    }
    
})()


// create players
