Demo: https://jonslui.github.io/tictactoe_js/

## Tic-tac-toe

This version of Tic-tac-toe utilizes forms for character creation, sessionStorage, pubsub design, and variable difficulty through a combination of the minimax algorithm and random moves.

## Demo Video

![tictactoe_demo_gif](https://user-images.githubusercontent.com/34390833/114447176-54c8b380-9b8f-11eb-88c3-bc8623ca0326.gif)


## Usage

1. Follow this link: https://jonslui.github.io/tictactoe_js/, or download the gameflow.js, gameboard.js, form.js, pubsub.js, index.html, and tictactoe.css files.

2. Open the index.html file in your browser of choice.
![Player creation form](https://github.com/jonslui/tictactoe_js/blob/master/README_images/Player_creation_form.png)

3. Choose to play a game with two human players or one human and one AI player.
4. If playing against the AI, choose your opponent's difficulty level.
![Difficulty selection](https://github.com/jonslui/tictactoe_js/blob/master/README_images/Difficulty_selection.png)

5. Click a tile to select it. Try to get 3 in a row vertically, horizontally, or diagonally. Don't let your opponent win first!
![Completed game](https://github.com/jonslui/tictactoe_js/blob/master/README_images/Completed_game.png)

6. After a game has been completed, you can start another by clicking "New Game." If it was a winning game, it will be added the winning player's record below the board.
![Scoreboard](https://github.com/jonslui/tictactoe_js/blob/master/README_images/Scoreboard.png)

7. If you would like to adjust the AI difficulty, change players, or play order, you can click "Change Players" to reopen the form.

8. Keep an eye on your scoreboard, have fun, and compete to win!

## Variable Difficulty

I've added variable difficulty to the application by increasing and decreasing the probability that the AI opponent chooses the optimal move or random move according to their selected difficulty level. At the easiest difficulty, the AI player's moves are completely random. At the most difficult level, each move is the optimal move decided by the minimax formula.

## PubSub

I used the pubsub design method to allow communication between the Gameboard and Gameflow modules, allowing the majority of data to remain private.
