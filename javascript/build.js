(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-27.
 *
 * * ToDo Make a gui that all the apps inherits.
 */

/**
 * Todo place the settings- and close icon so that the div does not gets a transparency
 */

'use strict';

class GUI{
    constructor(windowApp, counter) {
        this.windowApp = windowApp;
        this.counter = counter;
        this.wrapper = document.querySelector('#wrapper');
        this.gui();
    }

    /**
     * Creates the basic GUI layout
     */
    gui(){
        let template = document.querySelectorAll('template')[0];
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let pTag = document.createElement('p');
        pTag.setAttribute('class', this.windowApp + 'title');
        let pText = document.createTextNode(this.windowApp);
        pTag.appendChild(pText);

        appWindow.setAttribute('id', this.windowApp + this.counter);
        this.topBar = appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * (this.counter + 1) + 'px';
        appWindow.style.left =+ 105 * (this.counter + 1) + 'px';

        let removeZindex = document.getElementsByClassName('window');

        let zIndexCount = 0;
        for(let i = 0; i < removeZindex.length; i ++) {
            let foo = removeZindex[i].style.zIndex;

            if (parseInt(foo) > zIndexCount) {
                zIndexCount = parseInt(foo);
            }
        }

        appWindow.style.zIndex = zIndexCount;

        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/pwd/image/' + this.windowApp + '.png');

        if(this.windowApp === 'Game' || this.windowApp === 'Chat'){
            this.appSettings(appWindow);
        }

        appWindow.querySelector('#close').addEventListener('click', event =>{
            this.close(event.target);
        });

        this.move(appWindow.firstElementChild);

        this.wrapper.appendChild(appWindow);

    }

    /**
     * Makes a close button
     * @param node
     */
    close(node) {
        node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
    }

    /**
     * Adds settings icon
     * @param position
     */
    appSettings(position) {
        position.querySelector('.appsettings').setAttribute('id', this.windowApp + this.counter);
        position.querySelector('.appsettings').firstChild.setAttribute('src', '/pwd/image/Settings.png');
    }

    /**
     * Enables the window to move
     * @param selected
     */
    move(selected) {
        selected.addEventListener('mousedown', event =>{
            event.preventDefault();

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left);
            let windowPosY = parseInt(selected.parentNode.style.top);

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;

            let moveWindow = e => {
                let moveToX = e.pageX - offsetX;
                let moveToY = e.pageY - offsetY;
                selected.parentNode.style.top = moveToY + 'px';
                selected.parentNode.style.left = moveToX + 'px';
            };

            let removeEvent = x => {
                selected.parentNode.classList.remove('onmousedown');
                let removeZindex = document.getElementsByClassName('window');

                let zIndexCount = 0;
                for(let i = 0; i < removeZindex.length; i ++){
                    let foo = removeZindex[i].style.zIndex;

                    if(parseInt(foo) > zIndexCount){
                        zIndexCount = parseInt(foo);
                    }
                }
                selected.parentNode.style.zIndex = zIndexCount + 1;
                document.removeEventListener('mouseup', removeEvent);
                document.removeEventListener('mousemove', moveWindow);
            };

            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', removeEvent);
        });
    }

}

module.exports = GUI;

},{}],2:[function(require,module,exports){
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

        img.src = '/pwd/image/' + tile + '.png';
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
                    this.turn1.src = '/pwd/image/0.png';
                    this.turn2.src = '/pwd/image/0.png';

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

},{"./GUI":1}],3:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-28.
 *
 * ToDo close socket when window is closed
 */
'use strict';

const GUI = require('./GUI');

class Chat extends GUI{
    constructor(name, count){
        super(name, count);
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;
        this.createChatSettings();
        this.chatName = '';
        this.clientUserName = '';
        this.enterName();
        this.secretLangOption = false;
    }

    /**
     * Creates a GUI for the user to enter a chat name which will be saved in local storage
     */
    enterName() {
        let userName = localStorage.getItem('ChatUser');

        if(userName !== null){
            userName = JSON.parse(userName);
            this.chatName = userName.username;
            this.chatApp();

        }else{
            this.windowContent.className += ' username';
            let div = document.createElement('div');
            let divImg = document.createElement('div');
            let aTag = document.createElement('a');
            let img = document.createElement('img');
            let pTag = document.createElement('p');
            let pText = document.createTextNode('Enter a username:');

            let formTag = document.createElement('form');
            let inputTag = document.createElement('input');

            aTag.setAttribute('href', '#');
            img.setAttribute('src', '/pwd/image/accept.png');
            div.setAttribute('class', 'usernamefield');

            aTag.appendChild(img);
            divImg.appendChild(aTag);
            pTag.appendChild(pText);
            formTag.appendChild(inputTag);

            div.appendChild(pTag);
            div.appendChild(formTag);
            div.appendChild(divImg);

            this.windowContent.appendChild(div);

            aTag.addEventListener('click', event =>{
                let inputValue = this.windowContent.querySelector('input').value;

                if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){
                    let text = document.createTextNode('Not a valid username!');
                    let p = document.createElement('p');

                    p.appendChild(text);
                    this.windowContent.appendChild(p);
                }else{
                    this.userName = this.windowContent.querySelector('input').value;
                    let chatUsername = {username: this.userName};
                    localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
                    this.chatName = inputValue;
                    this.windowContent.classList.remove('enterusername');
                    this.windowContent.textContent = '';
                    this.chatApp();
                }
            });
        }
    }

    /**
     * Creates the GUI for the chat app
     */
    chatApp(){
        this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
        this.socket.addEventListener('message',  event => {
            this.receiveMessage(event);
        });

        let formDiv = document.createElement('div');
        let formTag = document.createElement('form');
        let inputTag = document.createElement('textarea');
        let sendImg = document.createElement('img');
        let sendATag = document.createElement('a');
        this.textField = document.createElement('div');

        this.textField.setAttribute('class', 'textfield');
        formDiv.setAttribute('class', 'chatStyles');
        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');
        sendATag.setAttribute('href', '#');
        sendATag.setAttribute('class', 'sendicon');
        sendImg.setAttribute('src', '/pwd/image/send.png');

        this.windowContent.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);
        sendATag.appendChild(sendImg);
        formDiv.appendChild(sendATag);
        this.windowContent.appendChild(formDiv);

        inputTag.addEventListener('keydown', event =>{
            if (event.which === 13){
                event.preventDefault();
                let clearInput = this.windowContent.querySelector('textarea');
                let inputValue = clearInput.value;
                if(inputValue.length > 0){
                    this.sendMessage(inputValue);
                    clearInput.value = '';
                }
            }
        });

        sendATag.addEventListener('click', event =>{
            let clearInput = this.windowContent.querySelector('textarea');
            let inputValue = clearInput.value;
            if(inputValue.length > 0){
                this.sendMessage(inputValue);
                clearInput.value = '';
            }
        })

    }

    /**
     * Creates chat settings
     */
    createChatSettings(){
        let count = 0;
        this.topBar.querySelector('.appsettings').addEventListener('mousedown', event =>{
            event.preventDefault();
            count += 1;
            if(count === 1){
                let chatSettingsDiv = document.createElement('div');
                let rovarsprak = document.createElement('input');
                let label = document.createElement('label');
                let pTag = document.createElement('p');
                let pText = document.createTextNode('(Not very secret)');

                label.appendChild(document.createTextNode('Rövarspråk'));
                rovarsprak.setAttribute('type', 'checkbox');
                rovarsprak.setAttribute('name', 'Rövarspråk');
                rovarsprak.setAttribute('value', 'true');
                rovarsprak.setAttribute('id', 'rovarsprak');
                chatSettingsDiv.setAttribute('class', 'chatsettings');

                chatSettingsDiv.appendChild(rovarsprak);
                chatSettingsDiv.appendChild(label);
                pTag.appendChild(pText);
                chatSettingsDiv.appendChild(pTag);

                if(this.secretLangOption === true){
                    rovarsprak.setAttribute('checked', 'true');
                }

                rovarsprak.addEventListener('click', event =>{
                    if(rovarsprak.checked === true){
                        this.secretLangOption = true;
                    }else{
                        this.secretLangOption = false;
                    }
                });

                let parentNode = this.topBar.parentNode;

                let children = parentNode.childNodes;

                parentNode.insertBefore(chatSettingsDiv, children[0]);

            }else if(count % 2 === 0){
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').style.display = 'none';
            }else{
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').style.display = 'inline-block';
            }
        })
    }

    /**
     *
     * @param text
     * @returns {string}
     */
    secretLang(text) {

        let konsonanter = ['B', 'b', 'C', 'c', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm',
                           'N', 'n', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's',  'T', 't', 'V', 'v', 'W', 'w', 'X', 'x', 'Z', 'z'];

        let newString = '';

        for(let i = 0; i < text.length; i ++){
            for(let j = 0; j < konsonanter.length; j ++){
                if(text[i] === konsonanter[j]){
                    newString += text[i] + 'o';
                }
            }
            newString += text[i];
        }
        return newString;
    }

    /**
     *
     * @param input
     */
    sendMessage(input){
        this.clientUserName = localStorage.getItem('ChatUser');
        this.clientUserName = JSON.parse(this.clientUserName);

        if (this.secretLangOption === true){
            input = this.secretLang(input);
        }
        let message = {
            "type": "message",
            "data" : input,
            "username": this.clientUserName.username,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        };
        this.socket.send(JSON.stringify(message));
    }

    /**
     *
     * @param receivedMessage
     */
    receiveMessage(receivedMessage) {
        let response = JSON.parse(receivedMessage.data);
        let div = document.createElement('div');
        let message = document.createElement('p');
        let senderName = document.createElement('p');
        let sender = document.createTextNode(response.username + ':');
        let text = document.createTextNode(response.data);
        let textP = document.createElement('p');

        textP.setAttribute('class', 'messagecontent');
        senderName.setAttribute('class', 'sendername');

        if(response.type !== 'heartbeat'){
            if(response.username === this.clientUserName.username){
                div.setAttribute('class', 'clientmessage')
            }else if(response.type === 'notification'){
                senderName.removeAttribute('class');
                div.setAttribute('class', 'servermessage');
            } else{
                div.setAttribute('class', 'chatreply')
            }
            senderName.appendChild(sender);
            message.appendChild(senderName);

            textP.appendChild(text);
            message.appendChild(textP);
            div.appendChild(message);

            this.windowContent.firstElementChild.appendChild(div);
        }
        this.windowContent.firstElementChild.scrollTop = this.windowContent.firstElementChild.scrollHeight;
    }
}

module.exports = Chat;

},{"./GUI":1}],4:[function(require,module,exports){
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

},{"./Memory":2,"./NewChat":3,"./Settings":5}],5:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-28.
 */
const GUI = require('./GUI');

class Settings extends GUI{
    constructor(name, count){
        super(name, count);
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;
        this.createChatSettingsContent();
        this.changeTheme();
        this.message = document.createElement('p');
    }

    createChatSettingsContent() {
        let template = document.querySelectorAll('template')[5].content;
        let div = document.importNode(template, true);

        this.windowContent.appendChild(div);
        let username = this.windowContent.querySelector('#username');
        this.checkUserName(username);
    }

    /**
     *
     * @param username
     */
    checkUserName(username) {
        let clientUserName = localStorage.getItem('ChatUser');

        let name = JSON.parse(clientUserName);

        if(name === null){
            name = '';
        }

        let pTag = document.createElement('p');
        let pText = document.createTextNode(name.username);

        if(pText.textContent === 'undefined'){
            pTag.setAttribute('class', 'usernameNotSet');
        }

        pTag.appendChild(pText);
        username.appendChild(pTag);

        let button = this.windowContent.querySelectorAll('button')[0];

        let input = this.windowContent.querySelector('input');

        input.addEventListener('keydown', event =>{
            if (event.which === 13){
                this.verifyUsername(input);
            }
        });

        button.addEventListener('click', event =>{
            this.verifyUsername(input);
        });
    }

    /**
     *
     * @param input
     */
    verifyUsername(input){
        if(input.value.length <= 0 || input.value.length >= 25 || input.value === 'The Server'){
            let text = document.createTextNode('Not a valid username!');
            let p = document.createElement('p');

            p.appendChild(text);
            this.windowContent.appendChild(p);

            /**
             * ToDo remove the p-tag so that they don't stack
             */
        }else{
            this.userName = this.windowContent.querySelector('input').value;
            let chatUsername = {username: this.userName};
            localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
            let newName = this.windowContent.querySelector('#username');
            newName.textContent = this.userName;
            this.windowContent.querySelector('.settingsContent').querySelector('input').value = '';
        }
    }

    changeTheme(){

        if(this.windowContent.querySelector('.changeTheme') !== null){
            this.windowContent.removeChild(this.windowContent.querySelector('.changeTheme'));     //Clears the div
        }
        let template = document.querySelectorAll('template')[6].content;

        let themeOptions = document.importNode(template, true);

        this.windowContent.appendChild(themeOptions);

        let themeDiv = this.windowContent.querySelector('.changeTheme');

        themeDiv.addEventListener('click', event =>{
            event.preventDefault();
            let clicked = event.target.classList[0];

            if(event.target.nodeName !== 'A'){
                return;
            }

            console.log(event.target);

            let option1 = 'aliceblue';
            let option2 = '#F8BF28';
            let option3 = '#00aeff';

            let wrapper = document.querySelector('#wrapper');

            /**
             * ToDo set new background in LS, read from that, all the time in desktop
             *
             * todo give a border to the active pic in use right now
             *
             *
             * todo clean up the code, remove massive if-statement
             */

            if(clicked === 'option1'){
                wrapper.style.background = 0;
                wrapper.style.backgroundColor = option1;
            }else if(clicked === 'option2'){
                wrapper.style.background = 0;
                wrapper.style.backgroundColor = option2;
            }else if(clicked === 'option3'){
                wrapper.style.background = 0;
                wrapper.style.backgroundColor = option3;
            }else if(clicked === 'option4'){
                wrapper.style.background = 'url("/pwd/image/jakethedog.png") center';
            }
        })
    }

}

module.exports = Settings;

},{"./GUI":1}],6:[function(require,module,exports){
/**
 *
 * Created by vinces on 2016-12-14.
 */

'use strict';

const NewDesktop = require('./NewDesktop');

const Desktop = new NewDesktop();

Desktop.apps();

},{"./NewDesktop":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI3LlxuICpcbiAqICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cbi8qKlxuICogVG9kbyBwbGFjZSB0aGUgc2V0dGluZ3MtIGFuZCBjbG9zZSBpY29uIHNvIHRoYXQgdGhlIGRpdiBkb2VzIG5vdCBnZXRzIGEgdHJhbnNwYXJlbmN5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHVUl7XG4gICAgY29uc3RydWN0b3Iod2luZG93QXBwLCBjb3VudGVyKSB7XG4gICAgICAgIHRoaXMud2luZG93QXBwID0gd2luZG93QXBwO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSBjb3VudGVyO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIGJhc2ljIEdVSSBsYXlvdXRcbiAgICAgKi9cbiAgICBndWkoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVswXTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIHBUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsIHRoaXMud2luZG93QXBwICsgJ3RpdGxlJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMud2luZG93QXBwKTtcbiAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG5cbiAgICAgICAgYXBwV2luZG93LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIHRoaXMudG9wQmFyID0gYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbmRvdyAnICsgdGhpcy53aW5kb3dBcHApO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS50b3AgPSsgNDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9KyAxMDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnO1xuXG4gICAgICAgIGxldCByZW1vdmVaaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3cnKTtcblxuICAgICAgICBsZXQgekluZGV4Q291bnQgPSAwO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcmVtb3ZlWmluZGV4Lmxlbmd0aDsgaSArKykge1xuICAgICAgICAgICAgbGV0IGZvbyA9IHJlbW92ZVppbmRleFtpXS5zdHlsZS56SW5kZXg7XG5cbiAgICAgICAgICAgIGlmIChwYXJzZUludChmb28pID4gekluZGV4Q291bnQpIHtcbiAgICAgICAgICAgICAgICB6SW5kZXhDb3VudCA9IHBhcnNlSW50KGZvbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUuekluZGV4ID0gekluZGV4Q291bnQ7XG5cbiAgICAgICAgYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGljb24nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIHRoaXMud2luZG93QXBwICsgJy5wbmcnKTtcblxuICAgICAgICBpZih0aGlzLndpbmRvd0FwcCA9PT0gJ0dhbWUnIHx8IHRoaXMud2luZG93QXBwID09PSAnQ2hhdCcpe1xuICAgICAgICAgICAgdGhpcy5hcHBTZXR0aW5ncyhhcHBXaW5kb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW92ZShhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBjbG9zZSBidXR0b25cbiAgICAgKiBAcGFyYW0gbm9kZVxuICAgICAqL1xuICAgIGNsb3NlKG5vZGUpIHtcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBzZXR0aW5ncyBpY29uXG4gICAgICogQHBhcmFtIHBvc2l0aW9uXG4gICAgICovXG4gICAgYXBwU2V0dGluZ3MocG9zaXRpb24pIHtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvU2V0dGluZ3MucG5nJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5hYmxlcyB0aGUgd2luZG93IHRvIG1vdmVcbiAgICAgKiBAcGFyYW0gc2VsZWN0ZWRcbiAgICAgKi9cbiAgICBtb3ZlKHNlbGVjdGVkKSB7XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdvbm1vdXNlZG93bicpO1xuXG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWCA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWSA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wKTtcblxuICAgICAgICAgICAgbGV0IG9mZnNldFggPSBldmVudC5wYWdlWCAtIHdpbmRvd1Bvc1g7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IGV2ZW50LnBhZ2VZIC0gd2luZG93UG9zWTtcblxuICAgICAgICAgICAgbGV0IG1vdmVXaW5kb3cgPSBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWCA9IGUucGFnZVggLSBvZmZzZXRYO1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9ZID0gZS5wYWdlWSAtIG9mZnNldFk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AgPSBtb3ZlVG9ZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQgPSBtb3ZlVG9YICsgJ3B4JztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IHggPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnb25tb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlWmluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgekluZGV4Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCByZW1vdmVaaW5kZXgubGVuZ3RoOyBpICsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvbyA9IHJlbW92ZVppbmRleFtpXS5zdHlsZS56SW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocGFyc2VJbnQoZm9vKSA+IHpJbmRleENvdW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleENvdW50ID0gcGFyc2VJbnQoZm9vKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnpJbmRleCA9IHpJbmRleENvdW50ICsgMTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVtb3ZlRXZlbnQpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVtb3ZlRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHVUk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgTWVtb3J5IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLnJvd3MgPSAwO1xuICAgICAgICB0aGlzLmNvbHMgPSAwO1xuICAgICAgICB0aGlzLnR1cm4xO1xuICAgICAgICB0aGlzLnR1cm4yO1xuICAgICAgICB0aGlzLmxhc3RUaWxlO1xuICAgICAgICB0aGlzLnBhaXJzID0gMDtcbiAgICAgICAgdGhpcy50cmllcyA9IDA7XG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZVNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29sc1xuICAgICAqIEBwYXJhbSBjb250YWluZXJcbiAgICAgKiBAcGFyYW0gdGlsZXNcbiAgICAgKi9cbiAgICBnYW1lQm9hcmQoY29scywgY29udGFpbmVyLCB0aWxlcykge1xuICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSAnJztcblxuICAgICAgICBsZXQgYVRhZztcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVsxXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgc2NvcmVUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgbGV0IGRpdlNjb3JlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzY29yZVRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2U2NvcmUpO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBhVGFnID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZW1vcnlicmljaycpO1xuXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVzW2ldO1xuXG4gICAgICAgICAgICBhVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IGV2ZW50LnRhcmdldC5maXJzdENoaWxkLm5vZGVOYW1lID09PSAnSU1HJyA/IGV2ZW50IDogZXZlbnQuZmlyc3RDaGlsZDtcblxuICAgICAgICAgICAgICAgIHRoaXMudHVybkJyaWNrKHRpbGUsIGV2ZW50LnRhcmdldC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZigoaSArIDEpICUgY29scyA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm93c1xuICAgICAqIEBwYXJhbSBjb2xzXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIHBpY0FycmF5KHJvd3MsIGNvbHMpIHtcbiAgICAgICAgbGV0IGFyciA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKyl7XG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBsZXQgc2h1ZmZsZWRBcnIgPSBbXTtcblxuICAgICAgICB3aGlsZSAobikge1xuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuLS0pO1xuICAgICAgICAgICAgc2h1ZmZsZWRBcnIucHVzaChhcnIuc3BsaWNlKGksIDEpWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaHVmZmxlZEFycjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWxlXG4gICAgICogQHBhcmFtIGltZ1xuICAgICAqL1xuICAgIHR1cm5Ccmljayh0aWxlLCBpbWcpIHtcbiAgICAgICAgaWYodGhpcy50dXJuMil7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbWcuc3JjID0gJy9pbWFnZS8nICsgdGlsZSArICcucG5nJztcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB0aGlzLndpbmRvd0NvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgaWYoIXRoaXMudHVybjEpe1xuICAgICAgICAgICAgdGhpcy50dXJuMSA9IGltZztcbiAgICAgICAgICAgIHRoaXMubGFzdFRpbGUgPSB0aWxlO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgaWYoaW1nID09PSB0aGlzLnR1cm4xKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRyaWVzICs9IDE7XG4gICAgICAgICAgICB0aGlzLnR1cm4yID0gaW1nO1xuXG4gICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdZb3UgaGF2ZSBtYWRlICcgKyB0aGlzLnRyaWVzICsgJyB0cmllcyBzbyBmYXIhJyk7XG5cbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dCk7XG5cbiAgICAgICAgICAgIGlmKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpe1xuICAgICAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGFpcnMgPT09ICh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpIC8gMil7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZU91dCA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1lvdSBvbmx5IG5lZWRlZCAnICsgdGhpcy50cmllcyArICcgdHJpZXMgdG8gd2luIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3Jlc2V0QnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSAnUGxheSBhZ2Fpbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzZXRHYW1lID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXNldEJ1dHRvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzZXRHYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2V0R2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFpcnMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMgPSB0aGlzLnBpY0FycmF5KHRoaXMucm93cywgdGhpcy5jb2xzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZCh0aGlzLmNvbHMsIHRoaXMud2luZG93Q29udGVudCwgdGhpcy50aWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZU91dCA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB9LDUwMCk7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoIGUgPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUdhbWVTZXR0aW5ncygpe1xuICAgICAgICBpZih0aGlzLnJvd3MgPT09IDApe1xuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgPT09IDEpe1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMl0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWlycyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd3MgPSBldmVudC50YXJnZXQudmFsdWVbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29scyA9IGV2ZW50LnRhcmdldC52YWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcyA9IHRoaXMucGljQXJyYXkodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZCh0aGlzLmNvbHMsIHRoaXMud2luZG93Q29udGVudCwgdGhpcy50aWxlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdiwgY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihjb3VudCAlIDIgPT09IDApe1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzNdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7ICAvL0ltcG9ydHMgdGhlIGluc3RydWN0aW9ucyBvbiBob3cgdG8gc3RhcnQgdGhlIGdhbWVcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqXG4gKiBUb0RvIGNsb3NlIHNvY2tldCB3aGVuIHdpbmRvdyBpcyBjbG9zZWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBDaGF0IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXRTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLmNoYXROYW1lID0gJyc7XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5lbnRlck5hbWUoKTtcbiAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIEdVSSBmb3IgdGhlIHVzZXIgdG8gZW50ZXIgYSBjaGF0IG5hbWUgd2hpY2ggd2lsbCBiZSBzYXZlZCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICovXG4gICAgZW50ZXJOYW1lKCkge1xuICAgICAgICBsZXQgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTtcblxuICAgICAgICBpZih1c2VyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB1c2VyTmFtZSA9IEpTT04ucGFyc2UodXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IHVzZXJOYW1lLnVzZXJuYW1lO1xuICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOb3QgYSB2YWxpZCB1c2VybmFtZSEnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIEdVSSBmb3IgdGhlIGNoYXQgYXBwXG4gICAgICovXG4gICAgY2hhdEFwcCgpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvJyk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAgZXZlbnQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWNlaXZlTWVzc2FnZShldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmb3JtRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgICAgICBsZXQgc2VuZEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBsZXQgc2VuZEFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHRoaXMudGV4dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGhpcy50ZXh0RmllbGQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0ZXh0ZmllbGQnKTtcbiAgICAgICAgZm9ybURpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRTdHlsZXMnKTtcbiAgICAgICAgZm9ybVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Zvcm1zdHlsZScpO1xuICAgICAgICBpbnB1dFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRpbnB1dCcpO1xuICAgICAgICBzZW5kQVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICBzZW5kQVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbmRpY29uJyk7XG4gICAgICAgIHNlbmRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL3NlbmQucG5nJyk7XG5cbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcbiAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgIHNlbmRBVGFnLmFwcGVuZENoaWxkKHNlbmRJbWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKHNlbmRBVGFnKTtcbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKGZvcm1EaXYpO1xuXG4gICAgICAgIGlucHV0VGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VuZEFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBjaGF0IHNldHRpbmdzXG4gICAgICovXG4gICAgY3JlYXRlQ2hhdFNldHRpbmdzKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICBpZihjb3VudCA9PT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IGNoYXRTZXR0aW5nc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGxldCByb3ZhcnNwcmFrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcoTm90IHZlcnkgc2VjcmV0KScpO1xuXG4gICAgICAgICAgICAgICAgbGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1LDtnZhcnNwcsOlaycpKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCduYW1lJywgJ1LDtnZhcnNwcsOlaycpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd2YWx1ZScsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3JvdmFyc3ByYWsnKTtcbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0c2V0dGluZ3MnKTtcblxuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChyb3ZhcnNwcmFrKTtcbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICAgICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKHJvdmFyc3ByYWsuY2hlY2tlZCA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBwYXJlbnROb2RlLmNoaWxkTm9kZXM7XG5cbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGF0U2V0dGluZ3NEaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY291bnQgJSAyID09PSAwKXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0ZXh0XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBzZWNyZXRMYW5nKHRleHQpIHtcblxuICAgICAgICBsZXQga29uc29uYW50ZXIgPSBbJ0InLCAnYicsICdDJywgJ2MnLCAnRCcsICdkJywgJ0YnLCAnZicsICdHJywgJ2cnLCAnSCcsICdoJywgJ0onLCAnaicsICdLJywgJ2snLCAnTCcsICdsJywgJ00nLCAnbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnTicsICduJywgJ1AnLCAncCcsICdRJywgJ3EnLCAnUicsICdyJywgJ1MnLCAncycsICAnVCcsICd0JywgJ1YnLCAndicsICdXJywgJ3cnLCAnWCcsICd4JywgJ1onLCAneiddO1xuXG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSAnJztcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkgKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGtvbnNvbmFudGVyLmxlbmd0aDsgaiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGV4dFtpXSA9PT0ga29uc29uYW50ZXJbal0pe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXSArICdvJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgc2VuZE1lc3NhZ2UoaW5wdXQpe1xuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBKU09OLnBhcnNlKHRoaXMuY2xpZW50VXNlck5hbWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnNlY3JldExhbmdPcHRpb24gPT09IHRydWUpe1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLnNlY3JldExhbmcoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBpbnB1dCxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy5jbGllbnRVc2VyTmFtZS51c2VybmFtZSxcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWNlaXZlZE1lc3NhZ2VcbiAgICAgKi9cbiAgICByZWNlaXZlTWVzc2FnZShyZWNlaXZlZE1lc3NhZ2UpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZWNlaXZlZE1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UudXNlcm5hbWUgKyAnOicpO1xuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBsZXQgdGV4dFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgdGV4dFAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZXNzYWdlY29udGVudCcpO1xuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lKXtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnR5cGUgPT09ICdub3RpZmljYXRpb24nKXtcbiAgICAgICAgICAgICAgICBzZW5kZXJOYW1lLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXJ2ZXJtZXNzYWdlJyk7XG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHJlcGx5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRlck5hbWUuYXBwZW5kQ2hpbGQoc2VuZGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG5cbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLndpbmRvd0NvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cblxuY2xhc3MgTmV3RGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy53aW5kb3dBcHBDb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG4gICAgfVxuICAgIGFwcHMoKXtcbiAgICAgICAgbGV0IHNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpLnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyJyk7XG5cbiAgICAgICAgbGV0IGNoYXQgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNDaGF0Jyk7XG4gICAgICAgIGxldCBnYW1lID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjR2FtZScpO1xuICAgICAgICBsZXQgc2V0dGluZ3MgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNTZXR0aW5ncycpO1xuXG5cbiAgICAgICAgY2hhdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG5ldyBDaGF0KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG5ldyBHYW1lKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0dGluZ3MuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbmV3IFNldHRpbmdzKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0Rlc2t0b3A7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKi9cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIFNldHRpbmdzIGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLmNyZWF0ZUNoYXRTZXR0aW5nc0NvbnRlbnQoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VUaGVtZSgpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgfVxuXG4gICAgY3JlYXRlQ2hhdFNldHRpbmdzQ29udGVudCgpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVs1XS5jb250ZW50O1xuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIGxldCB1c2VybmFtZSA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCcjdXNlcm5hbWUnKTtcbiAgICAgICAgdGhpcy5jaGVja1VzZXJOYW1lKHVzZXJuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB1c2VybmFtZVxuICAgICAqL1xuICAgIGNoZWNrVXNlck5hbWUodXNlcm5hbWUpIHtcbiAgICAgICAgbGV0IGNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBKU09OLnBhcnNlKGNsaWVudFVzZXJOYW1lKTtcblxuICAgICAgICBpZihuYW1lID09PSBudWxsKXtcbiAgICAgICAgICAgIG5hbWUgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYW1lLnVzZXJuYW1lKTtcblxuICAgICAgICBpZihwVGV4dC50ZXh0Q29udGVudCA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgcFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3VzZXJuYW1lTm90U2V0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgdXNlcm5hbWUuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKVswXTtcblxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcblxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT57XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKXtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcmlmeVVzZXJuYW1lKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICB0aGlzLnZlcmlmeVVzZXJuYW1lKGlucHV0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICB2ZXJpZnlVc2VybmFtZShpbnB1dCl7XG4gICAgICAgIGlmKGlucHV0LnZhbHVlLmxlbmd0aCA8PSAwIHx8IGlucHV0LnZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dC52YWx1ZSA9PT0gJ1RoZSBTZXJ2ZXInKXtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ05vdCBhIHZhbGlkIHVzZXJuYW1lIScpO1xuICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQocCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVG9EbyByZW1vdmUgdGhlIHAtdGFnIHNvIHRoYXQgdGhleSBkb24ndCBzdGFja1xuICAgICAgICAgICAgICovXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy51c2VyTmFtZSA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuICAgICAgICAgICAgbGV0IGNoYXRVc2VybmFtZSA9IHt1c2VybmFtZTogdGhpcy51c2VyTmFtZX07XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTtcbiAgICAgICAgICAgIGxldCBuZXdOYW1lID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpO1xuICAgICAgICAgICAgbmV3TmFtZS50ZXh0Q29udGVudCA9IHRoaXMudXNlck5hbWU7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmdzQ29udGVudCcpLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZVRoZW1lKCl7XG5cbiAgICAgICAgaWYodGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFuZ2VUaGVtZScpICE9PSBudWxsKXtcbiAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNoYW5nZVRoZW1lJykpOyAgICAgLy9DbGVhcnMgdGhlIGRpdlxuICAgICAgICB9XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNl0uY29udGVudDtcblxuICAgICAgICBsZXQgdGhlbWVPcHRpb25zID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKHRoZW1lT3B0aW9ucyk7XG5cbiAgICAgICAgbGV0IHRoZW1lRGl2ID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFuZ2VUaGVtZScpO1xuXG4gICAgICAgIHRoZW1lRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGNsaWNrZWQgPSBldmVudC50YXJnZXQuY2xhc3NMaXN0WzBdO1xuXG4gICAgICAgICAgICBpZihldmVudC50YXJnZXQubm9kZU5hbWUgIT09ICdBJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICBsZXQgb3B0aW9uMSA9ICdhbGljZWJsdWUnO1xuICAgICAgICAgICAgbGV0IG9wdGlvbjIgPSAnI0Y4QkYyOCc7XG4gICAgICAgICAgICBsZXQgb3B0aW9uMyA9ICcjMDBhZWZmJztcblxuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFRvRG8gc2V0IG5ldyBiYWNrZ3JvdW5kIGluIExTLCByZWFkIGZyb20gdGhhdCwgYWxsIHRoZSB0aW1lIGluIGRlc2t0b3BcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiB0b2RvIGdpdmUgYSBib3JkZXIgdG8gdGhlIGFjdGl2ZSBwaWMgaW4gdXNlIHJpZ2h0IG5vd1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiB0b2RvIGNsZWFuIHVwIHRoZSBjb2RlLCByZW1vdmUgbWFzc2l2ZSBpZi1zdGF0ZW1lbnRcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBpZihjbGlja2VkID09PSAnb3B0aW9uMScpe1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb24xO1xuICAgICAgICAgICAgfWVsc2UgaWYoY2xpY2tlZCA9PT0gJ29wdGlvbjInKXtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmQgPSAwO1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9uMjtcbiAgICAgICAgICAgIH1lbHNlIGlmKGNsaWNrZWQgPT09ICdvcHRpb24zJyl7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wdGlvbjM7XG4gICAgICAgICAgICB9ZWxzZSBpZihjbGlja2VkID09PSAnb3B0aW9uNCcpe1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZCA9ICd1cmwoXCIvaW1hZ2UvamFrZXRoZWRvZy5wbmdcIikgY2VudGVyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIi8qKlxuICpcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBOZXdEZXNrdG9wID0gcmVxdWlyZSgnLi9OZXdEZXNrdG9wJyk7XG5cbmNvbnN0IERlc2t0b3AgPSBuZXcgTmV3RGVza3RvcCgpO1xuXG5EZXNrdG9wLmFwcHMoKTtcbiJdfQ==
