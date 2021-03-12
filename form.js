var Form = (function(){

    document.getElementById("changePlayers").addEventListener("click", openForm);

    let aiPlayerButton = document.getElementById("ishumanplayer");
    aiPlayerButton.addEventListener("click", playerBNameBox);

    function playerBNameBox(){
        if(aiPlayerButton.checked == true){
            document.getElementById("playerBName").placeholder = "Enter AI Player's name";
        } else {
            document.getElementById("playerBName").placeholder = "Enter Player 2's name";
        }
    }

    function openForm(){
        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "block";
    }

    function closeForm(form){
        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "none";

        let playerA = {}
        let playerB = {}
        playerA.name = form.playerAName.value;
        playerB.name = form.playerBName.value;
        playerB.isrobot = aiPlayerButton.checked;
        
        events.emit('formComplete', [playerA, playerB]);
    }

    openForm();

    return {
        closeForm,
    }
})()