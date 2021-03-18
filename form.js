var Form = (function(){

    document.getElementById("changePlayers").addEventListener("click", openForm);

    let aiPlayerACheckbox = document.getElementById("playeraisrobot");
    let aiPlayerBCheckbox = document.getElementById("playerbisrobot");
    aiPlayerBCheckbox.addEventListener("click", aiPlayerCheckbox);
    aiPlayerACheckbox.addEventListener("click", aiPlayerCheckbox);


    function aiPlayerCheckbox(){
        if(aiPlayerBCheckbox.checked == true){
            document.getElementById("playerBName").value = "Sparky";
            document.getElementById("difficulty5").setAttribute('required','');
            document.getElementById("difficultiesForB").setAttribute('style','display: block');
            document.getElementById("difficultieslabelplayerB").setAttribute('style','display: block');

            // hide the AI Player A checkbox + label if player B AI button is checked
            aiPlayerACheckbox.style.display = 'none';
            document.getElementById('playeraisrobot_label').style.display = 'none';
        } else if (aiPlayerACheckbox.checked == true){
            document.getElementById("playerAName").value = "Sparky";
            document.getElementById("difficulty1").setAttribute('required','');
            document.getElementById("difficultiesForA").setAttribute('style','display: block');
            document.getElementById("difficultieslabelplayerA").setAttribute('style','display: block');

            // hide the AI Player B checkbox + label if player A AI button is checked
            aiPlayerBCheckbox.style.display = 'none';
            document.getElementById('playerbisrobot_label').style.display = 'none';            
        } 
        else if (aiPlayerACheckbox.checked == false && aiPlayerBCheckbox.checked == false){
            document.getElementById("playerBName").value = "";
            document.getElementById("playerBName").placeholder = "Enter Player 2's name";
            document.getElementById("difficultiesForB").setAttribute('style','display: none');
            document.getElementById("difficultieslabelplayerB").setAttribute('style','display: none');
            document.getElementById("difficultiesForB").removeAttribute('required');


            document.getElementById("playerAName").value = "";
            document.getElementById("playerBName").placeholder = "Enter Player 1's name";
            document.getElementById("difficultiesForA").setAttribute('style','display: none');
            document.getElementById("difficultieslabelplayerA").setAttribute('style','display: none');
            document.getElementById("difficultiesForA").removeAttribute('required');

        
            // show player a checkbox + label if it is unchecked
            aiPlayerACheckbox.style.display = 'inline';
            aiPlayerBCheckbox.style.display = 'inline';
            document.getElementById('playeraisrobot_label').style.display = 'inline';
            document.getElementById('playerbisrobot_label').style.display = 'inline';
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

        // clear the board when form is opened
        events.emit('formOpened');

    }


    function getSelectedRadioBtnIndex(){
        if (aiPlayerACheckbox.checked == true){
            let difficultyRadioBtns = document.getElementsByName('difficultyForA')

            for(i=0; i < difficultyRadioBtns.length; i++){
                if(difficultyRadioBtns[i].checked == true){
                    return i;
                }
            }
        }else if (aiPlayerBCheckbox.checked == true){

        }
    }

    function closeForm(form){
        let inputForm = document.getElementById("myForm");
        inputForm.style.display = "none";

        let difficultyLevel = getSelectedRadioBtnIndex();

        // reveal new game and change players buttons 
        document.getElementById("changePlayers").setAttribute('style', 'display: block;')
        document.getElementById("restartButton").setAttribute('style', 'display: block;')


        // save to input data to session storage, when form submits and page reloads, createPlayers() function in players.js will be called
        sessionStorage.setItem('playerAName', form.playerAName.value);
        sessionStorage.setItem('playerARobot', aiPlayerACheckbox.checked);

        sessionStorage.setItem('playerBName', form.playerBName.value);
        sessionStorage.setItem('playerBRobot', aiPlayerBCheckbox.checked);

        if(aiPlayerACheckbox.checked == true){
            sessionStorage.setItem('playerADifficulty', difficultyLevel);
        }else if(aiPlayerBCheckbox.checked == true){
            sessionStorage.setItem('playerBDifficulty', difficultyLevel);
        }
    }

    if(sessionStorage.length == 0){
        openForm();
    }

    return {
        closeForm,
    }
})()