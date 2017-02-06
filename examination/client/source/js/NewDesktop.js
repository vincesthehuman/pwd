/**
 * Created by vinces on 2016-12-26.
 */
'use strict';

const Chat = require('./NewChat');
const Game = require('./Memory');
const Settings = require('./Settings');


class NewDesktop {
    constructor(){
        this.windowAppCounter = document.getElementsByClassName('window');
    }
    apps(){
        let sidebar = document.querySelector('#wrapper').querySelector('#sidebar');

        let chat = sidebar.querySelector('#Chat');
        let game = sidebar.querySelector('#Game');
        let settings = sidebar.querySelector('#Settings');


        chat.addEventListener('click', event =>{
            event.preventDefault();
            new Chat(event.target.parentNode.id, this.windowAppCounter.length);
        });

        game.addEventListener('click', event =>{
            event.preventDefault();
            new Game(event.target.parentNode.id, this.windowAppCounter.length);
        });

        settings.addEventListener('click', event => {
            event.preventDefault();
            new Settings(event.target.parentNode.id, this.windowAppCounter.length);
        });
    }
}

module.exports = NewDesktop;
