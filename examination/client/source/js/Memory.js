/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const GUI = require('./GUI');

class Memory extends GUI{
    constructor(name, count){
        super(name, count);
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;
        this.rows = 0;
        this.cols = 0;
        this.turn1;
        this.turn2;
        this.lastTile;
        this.pairs = 0;
        this.tries = 0;
        this.createGameSettings();
    }

    /**
     *
     * @param cols
     * @param container
     * @param tiles
     */
    gameBoard(cols, container, tiles) {
        container.textContent = '';

        let aTag;
        let template = document.querySelectorAll('template')[1].content.firstElementChild;
        let scoreTemplate = document.querySelectorAll('template')[4].content.firstElementChild;
        let divScore = document.importNode(scoreTemplate.firstElementChild, true);

        container.appendChild(divScore);

        for(let i = 0; i < tiles.length; i++){
            aTag = document.importNode(template.firstElementChild, true);

            container.appendChild(aTag);
            aTag.setAttribute('class', 'memorybrick');

            let tile = tiles[i];

            aTag.addEventListener('click', event =>{
                let img = event.target.firstChild.nodeName === 'IMG' ? event : event.firstChild;

                this.turnBrick(tile, event.target.firstChild);
            });

            if((i + 1) % cols === 0){
                container.appendChild(document.createElement('br'));
            }
        }
    }

    /**
     *
     * @param rows
     * @param cols
     * @returns {Array}
     */
    picArray(rows, cols) {
        let arr = [];

        for(let i = 1; i <= (rows * cols) / 2; i++){
            arr.push(i);
            arr.push(i);
        }

        let n = arr.length;
        let shuffledArr = [];

        while (n) {
            let i = Math.floor(Math.random() * n--);
            shuffledArr.push(arr.splice(i, 1)[0]);
        }

        return shuffledArr;
    }

    /**
     *
     * @param tile
     * @param img
     */
    turnBrick(tile, img) {
        if(this.turn2){
            return;
        }

        img.src = '/image/' + tile + '.png';
        let message = this.windowContent.firstElementChild;

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
                    setTimeout(timeOut =>{
                        message.textContent = '';
                        let text = document.createTextNode('You only needed ' + this.tries + ' tries to win!');
                        let button = document.createElement('button');
                        button.setAttribute('type', 'button');
                        button.setAttribute('id', 'resetButton');
                        button.textContent = 'Play again';
                        message.appendChild(text);
                        message.appendChild(button);

                        let resetGame = this.windowContent.querySelector('#resetButton');
                        console.log(resetGame);
                        resetGame.addEventListener('click', event => {
                            event.preventDefault();
                            this.windowContent.textContent = '';
                            this.pairs = 0;
                            this.tries = 0;
                            this.turn1 = null;
                            this.turn2 = null;
                            this.lastTile = null;
                            this.tiles = this.picArray(this.rows, this.cols);
                            this.gameBoard(this.cols, this.windowContent, this.tiles);
                        })

                    }, 500);
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
        if(this.rows === 0){
            this.startGame();
        }
        let count = 0;
        this.topBar.querySelector('.appsettings').addEventListener('mousedown', event =>{
            event.preventDefault();
            count += 1;
            if(count === 1){
                let template = document.querySelectorAll('template')[2].content.firstElementChild;
                let div = document.importNode(template, true);

                div.addEventListener('click', event => {
                    if(event.target.value === undefined){
                        return;
                    }
                    this.windowContent.textContent = '';
                    this.pairs = 0;
                    this.tries = 0;
                    this.turn1 = null;
                    this.turn2 = null;
                    this.lastTile = null;
                    this.rows = event.target.value[0];
                    this.cols = event.target.value[1];
                    this.tiles = this.picArray(this.rows, this.cols);
                    this.gameBoard(this.cols, this.windowContent, this.tiles);
                });

                let parentNode = this.topBar.parentNode;
                let children = parentNode.childNodes;
                parentNode.insertBefore(div, children[0]);

            }else if(count % 2 === 0){
                let parent = this.topBar.parentNode;
                parent.querySelector('.gamesettings').style.display = 'none';
            }else{
                let parent = this.topBar.parentNode;
                parent.querySelector('.gamesettings').style.display = 'inline-block';
            }

        })
    }

    startGame() {
        let template = document.querySelectorAll('template')[3].content.firstElementChild;  //Imports the instructions on how to start the game
        let div = document.importNode(template, true);

        this.windowContent.appendChild(div);
    }

}

module.exports = Memory;
