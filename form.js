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
        sessionStorage.clear();
        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "block";
    }

    function closeForm(form){
        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "none";

        // save to session storage
        sessionStorage.setItem('playerAName', form.playerAName.value);
        sessionStorage.setItem('playerBName', form.playerBName.value);
        sessionStorage.setItem('playerBRobot', aiPlayerButton.checked);
    }

    if(sessionStorage.length == 0){
        openForm();
    }

    return {
        closeForm,
    }
})()


// fix popup functionality so it covers up board instead of inserting above it
// remove "new game"/"change players" buttons when the form is up
// auto generate name when AI player is clicked so if player doesn't want to type one in they can use that one
// display past games in miniature below large board