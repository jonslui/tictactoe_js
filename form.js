var Form = (function(){

    document.getElementById("changePlayers").addEventListener("click", openForm);

    let aiPlayerButton = document.getElementById("ishumanplayer");
    aiPlayerButton.addEventListener("click", playerBNameBox);

    function playerBNameBox(){
        if(aiPlayerButton.checked == true){
            document.getElementById("playerBName").value = "Sparky";
        } else {
            document.getElementById("playerBName").value = "";
            document.getElementById("playerBName").placeholder = "Enter Player 2's name";
        }
    }

    function openForm(){
        // removes previous session storage data when a new form is opened
        sessionStorage.clear();

        // hide new game and change players buttons 
        document.getElementById("changePlayers").setAttribute('style', 'display: none;')
        document.getElementById("restartButton").setAttribute('style', 'display: none;')


        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "block";
    }

    function closeForm(form){
        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "none";

        // reveal new game and change players buttons 
        document.getElementById("changePlayers").setAttribute('style', 'display: block;')
        document.getElementById("restartButton").setAttribute('style', 'display: block;')


        // save to input data to session storage, when form submits and page reloads, createPlayers() function in players.js will be called
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