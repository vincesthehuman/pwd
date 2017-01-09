/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const GUI = require('./GUI');

class Memory extends GUI{
    constructor(name, count){
        super(name, count);
        this.content = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.rows = 0;
        this.cols = 0;
        this.turn1;
        this.turn2;
        this.lastTile;
        this.pairs = 0;
        this.tries = 0;
        this.createGameSettings();
    }

    gameBoard(cols, container, tiles) {
        let aTag;

        let template = document.querySelectorAll('template')[1].content.firstElementChild;

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

        return shuffledArr;
    }

    turnBrick(tile, img) {
        if(this.turn2){
            return;
        }

        img.src = '/image/' + tile + '.png';

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

            if(tile === this.lastTile){
                this.pairs += 1;

                if(this.pairs === (this.rows * this.cols) / 2){
                    console.log('You won on ' + this.tries + ' tries!!');
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
        this.topBar.querySelector('.appsettings').addEventListener('click', event =>{
            count += 1;
            if(count === 1){
                let template = document.querySelectorAll('template')[2].content.firstElementChild;
                let div = document.importNode(template, true);

                div.addEventListener('click', event => {
                    if(event.target.value === undefined){
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
        console.log('hello first game!')
    }

}

module.exports = Memory;
