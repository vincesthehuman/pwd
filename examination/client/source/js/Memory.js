/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const GUI = require('./GUI');

class Memory extends GUI{
    constructor(name, count){
        super(name, count);
        this.content = document.getElementById(name+count).lastElementChild;            //The content of the window created
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.rows = 0;      //How many rows of cards
        this.cols = 0;      //How many columns of cards
        this.turn1;         //First flipped cards
        this.turn2;         //Second flipped card
        this.lastTile;      //The last tile that was turned
        this.pairs = 0;     //Counter for how many pars the user has
        this.tries = 0;     //Sounter for how many tries the user have made
        this.createGameSettings(); //Starts of calling on this function
    }

    gameBoard(cols, container, tiles) {
        container.textContent = '';     //Clears the div

        let aTag;
        let template = document.querySelectorAll('template')[1].content.firstElementChild;
        let scoreTemplate = document.querySelectorAll('template')[4].content.firstElementChild;
        let divScore = document.importNode(scoreTemplate.firstElementChild, true);                  //Import the template for the "scoreboard"

        container.appendChild(divScore);

        for(let i = 0; i < tiles.length; i++){
            aTag = document.importNode(template.firstElementChild, true);       //Creates new tiles depending on how many tiles the client wants

            container.appendChild(aTag);
            aTag.setAttribute('class', 'memorybrick');

            let tile = tiles[i];

            aTag.addEventListener('click', event =>{
                let img = event.target.firstChild.nodeName === 'IMG' ? event : event.firstChild;    //Adds an eventlistener to every element

                this.turnBrick(tile, event.target.firstChild);
            });

            if((i + 1) % cols === 0){
                container.appendChild(document.createElement('br'));        //Adds a BR so that the cards are neatly organised
            }
        }
    }

    picArray(rows, cols) {
        let arr = [];

        for(let i = 1; i <= (rows * cols) / 2; i++){                    //Creates an array with the amount of cards that the client has chosen
            arr.push(i);
            arr.push(i);
        }

        let n = arr.length;
        let shuffledArr = [];

        while (n) {                                                     //Shuffles the array
            let i = Math.floor(Math.random() * n--);
            shuffledArr.push(arr.splice(i, 1)[0]);
        }

        return shuffledArr;     //Returns the shuffled array
    }

    turnBrick(tile, img) {          //The game logic
        if(this.turn2){     //Prevents so that the user can click on a 3rd or more cards
            return;
        }

        img.src = '/image/' + tile + '.png';                //Sets the source of the pic
        let message = this.content.firstElementChild;

        if(!this.turn1){
            this.turn1 = img;
            this.lastTile = tile;
            return;

        }else{
            if(img === this.turn1){
                return;
            }
            this.tries += 1;
            this.turn2 = img;

            message.textContent = '';
            let text = document.createTextNode('You have made ' + this.tries + ' tries so far!');

            message.appendChild(text);

            if(tile === this.lastTile){
                this.pairs += 1;

                if(this.pairs === (this.rows * this.cols) / 2){
                    message.textContent = '';
                    let text = document.createTextNode('You only needed ' + this.tries + ' tries to win! Click on the settings and start a new game!');
                    message.appendChild(text);
                }
                setTimeout(timeOut =>{
                    this.turn1.parentNode.classList.add('pair');
                    this.turn2.parentNode.classList.add('pair');

                    this.turn1 = null;
                    this.turn2 = null;

                },500);


            }else{
                window.setTimeout( e =>{
                    this.turn1.src = '/image/0.png';
                    this.turn2.src = '/image/0.png';

                    this.turn1 = null;
                    this.turn2 = null;
                }, 500)
            }
        }
    }

    createGameSettings(){
        if(this.rows === 0){        //If the user hasn't chosen any card for the game, an instruction on how to start the game is shown
            this.startGame();
        }
        let count = 0;
        this.topBar.querySelector('.appsettings').addEventListener('click', event =>{
            count += 1;
            if(count === 1){ //Checks if the user har clicked for the first time, then import the template
                let template = document.querySelectorAll('template')[2].content.firstElementChild;
                let div = document.importNode(template, true);

                div.addEventListener('click', event => {        //If any of the options is clicked, reset everything and start a new game
                    if(event.target.value === undefined){       //If the user accidentally clicks outside, ignore it.
                        return;
                    }
                    this.content.textContent = '';
                    this.pairs = 0;
                    this.tries = 0;
                    this.turn1 = null;
                    this.turn2 = null;
                    this.lastTile = null;
                    this.rows = event.target.value[0];
                    this.cols = event.target.value[1];
                    this.tiles = this.picArray(this.rows, this.cols);
                    this.gameBoard(this.cols, this.content, this.tiles);
                });

                let parentNode = this.topBar.parentNode;
                let children = parentNode.childNodes;
                parentNode.insertBefore(div, children[0]);

            }else if(count % 2 === 0){ //If this is the second time (even) clicked, hide the settings
                let parent = this.topBar.parentNode;
                parent.querySelector('.gamesettings').style.display = 'none';
            }else{
                let parent = this.topBar.parentNode;  //If this is a third time (uneven) clicked, display the settings again
                parent.querySelector('.gamesettings').style.display = 'inline-block';
            }

        })
    }

    startGame() {
        let template = document.querySelectorAll('template')[3].content.firstElementChild;  //Imports the instructions on how to start the game
        let div = document.importNode(template, true);

        this.content.appendChild(div);
    }

}

module.exports = Memory;
