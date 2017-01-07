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


        chat.addEventListener('click', event =>{                                //Creates a new chat upon a click, chat will inherit structure from AppGui creating a new chat window
            let chat = new Chat(event.target.parentNode.id, this.windowAppCounter.length);
        });

        game.addEventListener('click', event =>{
            let game = new Game(event.target.parentNode.id, this.windowAppCounter.length);
            // ToDO Create a new game upon a click, game will inherit structure from AppGui creating a new game window
        });

        settings.addEventListener('click', event => {
            let settings = new Settings(event.target.parentNode.id);
            // ToDO Create a new Settings upon a click, settings will inherit structure from AppGui creating a new settings window
        });
    }
}

module.exports = NewDesktop;
