(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-27.
 *
 * * ToDo Make a gui that all the apps inherits.
 */


'use strict';

class GUI{
    constructor(windowApp, counter) {
        this.windowApp = windowApp;
        this.counter = counter;
        this.wrapper = document.querySelector('#wrapper');
        this.gui();
    }

    gui(){
        let template = document.querySelectorAll('template')[0];
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let pTag = document.createElement('p');
        let pText = document.createTextNode(this.windowApp);
        pTag.appendChild(pText);

        appWindow.setAttribute('id', this.windowApp + this.counter);
        this.topBar = appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * (this.counter + 1) + 'px';
        appWindow.style.left =+ 105 * (this.counter + 1) + 'px';
        appWindow.style.zIndex = this.counter;

        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.windowApp + '.png');

        if(this.windowApp === 'Game' || this.windowApp === 'Chat'){                            //Adds a settings option
            this.appSettings(appWindow);
        }

        appWindow.querySelector('#close').addEventListener('click', event =>{                  //Adds a function to close window
            this.close(event.target);
        });

        this.move(appWindow.firstElementChild);

        this.wrapper.appendChild(appWindow);

    }

    close(node) {       //Removes the parent node of the parent node (the Window selected)
        node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
    }

    appSettings(position) {
        position.querySelector('.appsettings').setAttribute('id', this.windowApp + this.counter);
        position.querySelector('.appsettings').firstChild.setAttribute('src', '/image/Settings.png');
    }

    move(selected) {    //Makes it possible for the user to move the window
        selected.addEventListener('mousedown', event =>{

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left, 10);
            let windowPosY = parseInt(selected.parentNode.style.top, 10);

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
                let removeZindex = document.getElementsByClassName('window');       //Counts all open windows in the wrapper

                let zIndexCount = 0;
                for(let i = 0; i < removeZindex.length; i ++){                      //Gives a new z-index
                    let foo = removeZindex[i].style.zIndex;

                    if(parseInt(foo) > zIndexCount){                                //If
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
                    let text = document.createTextNode('You only needed ' + this.tries + ' tries to win!');
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
        let template = document.querySelectorAll('template')[3].content.firstElementChild;
        let div = document.importNode(template, true);

        this.content.appendChild(div);
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
        this.content = document.getElementById(name+count).lastElementChild;                                            //Lets the app know which window is which
        this.topBar = document.getElementById(name+count).firstElementChild;                                            //The topbar of the chat-app
        this.createChatSettings();
        this.chatName = '';
        this.clientUserName = '';
        this.enterName();
        this.secretLangOption = false;
    }
    enterName() {
        let userName = localStorage.getItem('ChatUser');

        if(userName !== null){
            userName = JSON.parse(userName);
            this.chatName = userName.username;
            this.chatApp();

        }else{
            this.content.className += ' username';
            let div = document.createElement('div');
            let divImg = document.createElement('div');
            let aTag = document.createElement('a');
            let img = document.createElement('img');
            let pTag = document.createElement('p');
            let pText = document.createTextNode('Enter a username:');

            let formTag = document.createElement('form');
            let inputTag = document.createElement('input');

            aTag.setAttribute('href', '#');
            img.setAttribute('src', '/image/accept.png');
            div.setAttribute('class', 'usernamefield');

            aTag.appendChild(img);
            divImg.appendChild(aTag);
            pTag.appendChild(pText);
            formTag.appendChild(inputTag);

            div.appendChild(pTag);
            div.appendChild(formTag);
            div.appendChild(divImg);

            this.content.appendChild(div);

            aTag.addEventListener('click', event =>{
                let inputValue = this.content.querySelector('input').value;

                if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){
                    alert('Not a valid username dude!')
                }else{
                    this.userName = this.content.querySelector('input').value;
                    let chatUsername = {username: this.userName};
                    localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
                    this.chatName = inputValue;
                    this.content.classList.remove('enterusername');
                    this.content.textContent = '';
                    this.chatApp();
                }
            });
        }
    }

    chatApp(){
        this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
        this.socket.addEventListener('message',  event => {                                                             //Opens up a new socket and starts receiving the messages
            this.recieveMessage(event);
        });

        let formDiv = document.createElement('div');
        let formTag = document.createElement('form');
        let inputTag = document.createElement('textarea');                                                              //Creates elements necessary for the chat-app
        let sendImg = document.createElement('img');
        let sendATag = document.createElement('a');
        this.textField = document.createElement('div');

        this.textField.setAttribute('class', 'textfield');                                                              //Adds styling
        formDiv.setAttribute('class', 'chatStyles');
        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');
        sendATag.setAttribute('href', '#');
        sendATag.setAttribute('class', 'sendicon');                                                                     //Takes a image and uses it to send messages
        sendImg.setAttribute('src', '/image/send.png');

        this.content.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);                                                                                   //Appends all the newly created elements
        sendATag.appendChild(sendImg);
        formDiv.appendChild(sendATag);
        this.content.appendChild(formDiv);

        inputTag.addEventListener('keydown', event =>{                                                                  //Adds an event listener to the enter-key when typing, send the message when pressed
            if (event.which === 13){
                event.preventDefault();
                let clearInput = this.content.querySelector('textarea');
                let inputValue = clearInput.value;
                if(inputValue.length > 0){
                    this.sendMessage(inputValue);
                    clearInput.value = '';
                }
            }
        });

        sendATag.addEventListener('click', event =>{                                                                        //Adds an event listener to the send icon to send message
            let clearInput = this.content.querySelector('textarea');
            let inputValue = clearInput.value;
            if(inputValue.length > 0){
                this.sendMessage(inputValue);
                clearInput.value = '';
            }
        })

    }

    createChatSettings(){
        let count = 0;
        this.topBar.querySelector('.appsettings').addEventListener('click', event =>{
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

                if(this.secretLangOption === true){                     //Checks if Rövarspråk is true, then the box should be checked
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

    secretLang(text) {                  //The message turns into a 'secret' message

        let konsonanter = ['B', 'b', 'C', 'c', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm',
                           'N', 'n', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's',  'T', 't', 'V', 'v', 'W', 'w', 'X', 'x', 'Z', 'z'];

        let newString = '';

        for(let i = 0; i < text.length; i ++){
            for(let j = 0; j < konsonanter.length; j ++){
                if(text[i] === konsonanter[j]){
                    newString += text[i] + 'o';             //Adds an 'o' to all consonants
                }
            }
            newString += text[i];
        }
        return newString;
    }

    sendMessage(input){                                                                                                 //Sends the message as JSON via websocket
        this.clientUserName = localStorage.getItem('ChatUser');                                                         //Checks the username every time a message is sent
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

    recieveMessage(e) {                                                                                                 //When new messages is received, display it in the chat window
        let response = JSON.parse(e.data);
        let div = document.createElement('div');
        let message = document.createElement('p');
        let senderName = document.createElement('p');
        let sender = document.createTextNode(response.username + ':');
        let text = document.createTextNode(response.data);
        let textP = document.createElement('p');

        textP.setAttribute('class', 'messagecontent');
        senderName.setAttribute('class', 'sendername');

        if(response.type !== 'heartbeat'){
            if(response.username === this.clientUserName.username){                                                     //If username is equal to the client user name, add client class
                div.setAttribute('class', 'clientmessage')
            }else if(response.username === 'The Server'){                                                               //Adds a class to server messages so user can tell difference
                senderName.removeAttribute('class');
                div.setAttribute('class', 'servermessage');
            } else{                                                                                                     //Adds a class to the replies with names not equal to the client username
                div.setAttribute('class', 'chatreply')
            }
            senderName.appendChild(sender);
            message.appendChild(senderName);

            textP.appendChild(text);
            message.appendChild(textP);
            div.appendChild(message);

            this.content.firstElementChild.appendChild(div);
        }
        this.content.firstElementChild.scrollTop = this.content.firstElementChild.scrollHeight;                         //Scrolls and shows the latest message received
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
           new Chat(event.target.parentNode.id, this.windowAppCounter.length);
        });                 //Creates a new chat upon a click, chat will inherit structure from AppGui creating a new chat window

        game.addEventListener('click', event =>{
            new Game(event.target.parentNode.id, this.windowAppCounter.length);
        });                 //Creates a new game upon a click, chat will inherit structure from AppGui creating a new chat window

        settings.addEventListener('click', event => {
            new Settings(event.target.parentNode.id, this.windowAppCounter.length);
        });            //Creates a new chat upon a click, chat will inherit structure from AppGui creating a new chat window
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yNy5cbiAqXG4gKiAqIFRvRG8gTWFrZSBhIGd1aSB0aGF0IGFsbCB0aGUgYXBwcyBpbmhlcml0cy5cbiAqL1xuXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgR1VJe1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvd0FwcCwgY291bnRlcikge1xuICAgICAgICB0aGlzLndpbmRvd0FwcCA9IHdpbmRvd0FwcDtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gY291bnRlcjtcbiAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5ndWkoKTtcbiAgICB9XG5cbiAgICBndWkoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVswXTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMud2luZG93QXBwKTtcbiAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG5cbiAgICAgICAgYXBwV2luZG93LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIHRoaXMudG9wQmFyID0gYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbmRvdyAnICsgdGhpcy53aW5kb3dBcHApO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS50b3AgPSsgNDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9KyAxMDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUuekluZGV4ID0gdGhpcy5jb3VudGVyO1xuXG4gICAgICAgIGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BpY29uJykuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlLycgKyB0aGlzLndpbmRvd0FwcCArICcucG5nJyk7XG5cbiAgICAgICAgaWYodGhpcy53aW5kb3dBcHAgPT09ICdHYW1lJyB8fCB0aGlzLndpbmRvd0FwcCA9PT0gJ0NoYXQnKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgc2V0dGluZ3Mgb3B0aW9uXG4gICAgICAgICAgICB0aGlzLmFwcFNldHRpbmdzKGFwcFdpbmRvdyk7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignI2Nsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBmdW5jdGlvbiB0byBjbG9zZSB3aW5kb3dcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGFwcFdpbmRvdyk7XG5cbiAgICB9XG5cbiAgICBjbG9zZShub2RlKSB7ICAgICAgIC8vUmVtb3ZlcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhcmVudCBub2RlICh0aGUgV2luZG93IHNlbGVjdGVkKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICB9XG5cbiAgICBhcHBTZXR0aW5ncyhwb3NpdGlvbikge1xuICAgICAgICBwb3NpdGlvbi5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy53aW5kb3dBcHAgKyB0aGlzLmNvdW50ZXIpO1xuICAgICAgICBwb3NpdGlvbi5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9TZXR0aW5ncy5wbmcnKTtcbiAgICB9XG5cbiAgICBtb3ZlKHNlbGVjdGVkKSB7ICAgIC8vTWFrZXMgaXQgcG9zc2libGUgZm9yIHRoZSB1c2VyIHRvIG1vdmUgdGhlIHdpbmRvd1xuICAgICAgICBzZWxlY3RlZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcblxuICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdvbm1vdXNlZG93bicpO1xuXG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWCA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1kgPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCwgMTApO1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IGV2ZW50LnBhZ2VYIC0gd2luZG93UG9zWDtcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gZXZlbnQucGFnZVkgLSB3aW5kb3dQb3NZO1xuXG4gICAgICAgICAgICBsZXQgbW92ZVdpbmRvdyA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9YID0gZS5wYWdlWCAtIG9mZnNldFg7XG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1kgPSBlLnBhZ2VZIC0gb2Zmc2V0WTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCA9IG1vdmVUb1kgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCA9IG1vdmVUb1ggKyAncHgnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHJlbW92ZUV2ZW50ID0geCA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdvbm1vdXNlZG93bicpO1xuICAgICAgICAgICAgICAgIGxldCByZW1vdmVaaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3cnKTsgICAgICAgLy9Db3VudHMgYWxsIG9wZW4gd2luZG93cyBpbiB0aGUgd3JhcHBlclxuXG4gICAgICAgICAgICAgICAgbGV0IHpJbmRleENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcmVtb3ZlWmluZGV4Lmxlbmd0aDsgaSArKyl7ICAgICAgICAgICAgICAgICAgICAgIC8vR2l2ZXMgYSBuZXcgei1pbmRleFxuICAgICAgICAgICAgICAgICAgICBsZXQgZm9vID0gcmVtb3ZlWmluZGV4W2ldLnN0eWxlLnpJbmRleDtcblxuICAgICAgICAgICAgICAgICAgICBpZihwYXJzZUludChmb28pID4gekluZGV4Q291bnQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZlxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4Q291bnQgPSBwYXJzZUludChmb28pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUuekluZGV4ID0gekluZGV4Q291bnQgKyAxO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdVSTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBNZW1vcnkgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgLy9UaGUgdG9wYmFyIG9mIHRoZSBnYW1lLWFwcFxuICAgICAgICB0aGlzLnJvd3MgPSAwO1xuICAgICAgICB0aGlzLmNvbHMgPSAwO1xuICAgICAgICB0aGlzLnR1cm4xO1xuICAgICAgICB0aGlzLnR1cm4yO1xuICAgICAgICB0aGlzLmxhc3RUaWxlO1xuICAgICAgICB0aGlzLnBhaXJzID0gMDtcbiAgICAgICAgdGhpcy50cmllcyA9IDA7XG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZVNldHRpbmdzKCk7XG4gICAgfVxuXG4gICAgZ2FtZUJvYXJkKGNvbHMsIGNvbnRhaW5lciwgdGlsZXMpIHtcbiAgICAgICAgY29udGFpbmVyLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIGxldCBhVGFnO1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMV0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICBsZXQgc2NvcmVUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgbGV0IGRpdlNjb3JlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzY29yZVRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdlNjb3JlKTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgYVRhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVtb3J5YnJpY2snKTtcblxuICAgICAgICAgICAgbGV0IHRpbGUgPSB0aWxlc1tpXTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBldmVudC50YXJnZXQuZmlyc3RDaGlsZC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudCA6IGV2ZW50LmZpcnN0Q2hpbGQ7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnR1cm5Ccmljayh0aWxlLCBldmVudC50YXJnZXQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYoKGkgKyAxKSAlIGNvbHMgPT09IDApe1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBpY0FycmF5KHJvd3MsIGNvbHMpIHtcbiAgICAgICAgbGV0IGFyciA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKyl7ICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgYW1vdW50IG9mIGNhcmRzIHRoYXQgdGhlIGNsaWVudCBoYXMgY2hvc2VuXG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBsZXQgc2h1ZmZsZWRBcnIgPSBbXTtcblxuICAgICAgICB3aGlsZSAobikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TaHVmZmxlcyB0aGUgYXJyYXlcbiAgICAgICAgICAgIGxldCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbi0tKTtcbiAgICAgICAgICAgIHNodWZmbGVkQXJyLnB1c2goYXJyLnNwbGljZShpLCAxKVswXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2h1ZmZsZWRBcnI7XG4gICAgfVxuXG4gICAgdHVybkJyaWNrKHRpbGUsIGltZykge1xuICAgICAgICBpZih0aGlzLnR1cm4yKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5zcmMgPSAnL2ltYWdlLycgKyB0aWxlICsgJy5wbmcnO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICBpZighdGhpcy50dXJuMSl7XG4gICAgICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZihpbWcgPT09IHRoaXMudHVybjEpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJpZXMgKz0gMTtcbiAgICAgICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1lvdSBoYXZlIG1hZGUgJyArIHRoaXMudHJpZXMgKyAnIHRyaWVzIHNvIGZhciEnKTtcblxuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0KTtcblxuICAgICAgICAgICAgaWYodGlsZSA9PT0gdGhpcy5sYXN0VGlsZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wYWlycyA9PT0gKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKXtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdZb3Ugb25seSBuZWVkZWQgJyArIHRoaXMudHJpZXMgKyAnIHRyaWVzIHRvIHdpbiEnKTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aW1lT3V0ID0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncGFpcicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncGFpcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIH0sNTAwKTtcblxuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCggZSA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5zcmMgPSAnL2ltYWdlLzAucG5nJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5zcmMgPSAnL2ltYWdlLzAucG5nJztcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlR2FtZVNldHRpbmdzKCl7XG4gICAgICAgIGlmKHRoaXMucm93cyA9PT0gMCl7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgPT09IDEpe1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMl0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWlycyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd3MgPSBldmVudC50YXJnZXQudmFsdWVbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29scyA9IGV2ZW50LnRhcmdldC52YWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcyA9IHRoaXMucGljQXJyYXkodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZCh0aGlzLmNvbHMsIHRoaXMuY29udGVudCwgdGhpcy50aWxlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdiwgY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihjb3VudCAlIDIgPT09IDApe1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzNdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKlxuICogVG9EbyBjbG9zZSBzb2NrZXQgd2hlbiB3aW5kb3cgaXMgY2xvc2VkXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgQ2hhdCBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGV0cyB0aGUgYXBwIGtub3cgd2hpY2ggd2luZG93IGlzIHdoaWNoXG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGNoYXQtYXBwXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhdFNldHRpbmdzKCk7XG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmVudGVyTmFtZSgpO1xuICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSBmYWxzZTtcbiAgICB9XG4gICAgZW50ZXJOYW1lKCkge1xuICAgICAgICBsZXQgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTtcblxuICAgICAgICBpZih1c2VyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB1c2VyTmFtZSA9IEpTT04ucGFyc2UodXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IHVzZXJOYW1lLnVzZXJuYW1lO1xuICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnTm90IGEgdmFsaWQgdXNlcm5hbWUgZHVkZSEnKVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYXRBcHAoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuICAgICAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgIGV2ZW50ID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9PcGVucyB1cCBhIG5ldyBzb2NrZXQgYW5kIHN0YXJ0cyByZWNlaXZpbmcgdGhlIG1lc3NhZ2VzXG4gICAgICAgICAgICB0aGlzLnJlY2lldmVNZXNzYWdlKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZvcm1EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgZWxlbWVudHMgbmVjZXNzYXJ5IGZvciB0aGUgY2hhdC1hcHBcbiAgICAgICAgbGV0IHNlbmRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgbGV0IHNlbmRBVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB0aGlzLnRleHRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRoaXMudGV4dEZpZWxkLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGV4dGZpZWxkJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgc3R5bGluZ1xuICAgICAgICBmb3JtRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdFN0eWxlcycpO1xuICAgICAgICBmb3JtVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZm9ybXN0eWxlJyk7XG4gICAgICAgIGlucHV0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdGlucHV0Jyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGljb24nKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Rha2VzIGEgaW1hZ2UgYW5kIHVzZXMgaXQgdG8gc2VuZCBtZXNzYWdlc1xuICAgICAgICBzZW5kSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9zZW5kLnBuZycpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BcHBlbmRzIGFsbCB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgICBzZW5kQVRhZy5hcHBlbmRDaGlsZChzZW5kSW1nKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChzZW5kQVRhZyk7XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcblxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBlbnRlci1rZXkgd2hlbiB0eXBpbmcsIHNlbmQgdGhlIG1lc3NhZ2Ugd2hlbiBwcmVzc2VkXG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKXtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbmRBVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBzZW5kIGljb24gdG8gc2VuZCBtZXNzYWdlXG4gICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGNyZWF0ZUNoYXRTZXR0aW5ncygpe1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmKGNvdW50ID09PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFNldHRpbmdzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbGV0IHJvdmFyc3ByYWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyhOb3QgdmVyeSBzZWNyZXQpJyk7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUsO2dmFyc3Byw6VrJykpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnUsO2dmFyc3Byw6VrJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnaWQnLCAncm92YXJzcHJhaycpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRzZXR0aW5ncycpO1xuXG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHJvdmFyc3ByYWspO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgICAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXsgICAgICAgICAgICAgICAgICAgICAvL0NoZWNrcyBpZiBSw7Z2YXJzcHLDpWsgaXMgdHJ1ZSwgdGhlbiB0aGUgYm94IHNob3VsZCBiZSBjaGVja2VkXG4gICAgICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKHJvdmFyc3ByYWsuY2hlY2tlZCA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBwYXJlbnROb2RlLmNoaWxkTm9kZXM7XG5cbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGF0U2V0dGluZ3NEaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY291bnQgJSAyID09PSAwKXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWNyZXRMYW5nKHRleHQpIHsgICAgICAgICAgICAgICAgICAvL1RoZSBtZXNzYWdlIHR1cm5zIGludG8gYSAnc2VjcmV0JyBtZXNzYWdlXG5cbiAgICAgICAgbGV0IGtvbnNvbmFudGVyID0gWydCJywgJ2InLCAnQycsICdjJywgJ0QnLCAnZCcsICdGJywgJ2YnLCAnRycsICdnJywgJ0gnLCAnaCcsICdKJywgJ2onLCAnSycsICdrJywgJ0wnLCAnbCcsICdNJywgJ20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ04nLCAnbicsICdQJywgJ3AnLCAnUScsICdxJywgJ1InLCAncicsICdTJywgJ3MnLCAgJ1QnLCAndCcsICdWJywgJ3YnLCAnVycsICd3JywgJ1gnLCAneCcsICdaJywgJ3onXTtcblxuICAgICAgICBsZXQgbmV3U3RyaW5nID0gJyc7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpICsrKXtcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBrb25zb25hbnRlci5sZW5ndGg7IGogKyspe1xuICAgICAgICAgICAgICAgIGlmKHRleHRbaV0gPT09IGtvbnNvbmFudGVyW2pdKXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nICs9IHRleHRbaV0gKyAnbyc7ICAgICAgICAgICAgIC8vQWRkcyBhbiAnbycgdG8gYWxsIGNvbnNvbmFudHNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKGlucHV0KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TZW5kcyB0aGUgbWVzc2FnZSBhcyBKU09OIHZpYSB3ZWJzb2NrZXRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZSBldmVyeSB0aW1lIGEgbWVzc2FnZSBpcyBzZW50XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBKU09OLnBhcnNlKHRoaXMuY2xpZW50VXNlck5hbWUpO1xuICAgICAgICBpZiAodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5zZWNyZXRMYW5nKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIFwiZGF0YVwiIDogaW5wdXQsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgcmVjaWV2ZU1lc3NhZ2UoZSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1doZW4gbmV3IG1lc3NhZ2VzIGlzIHJlY2VpdmVkLCBkaXNwbGF5IGl0IGluIHRoZSBjaGF0IHdpbmRvd1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UudXNlcm5hbWUgKyAnOicpO1xuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBsZXQgdGV4dFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgdGV4dFAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZXNzYWdlY29udGVudCcpO1xuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdXNlcm5hbWUgaXMgZXF1YWwgdG8gdGhlIGNsaWVudCB1c2VyIG5hbWUsIGFkZCBjbGllbnQgY2xhc3NcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSAnVGhlIFNlcnZlcicpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHNlcnZlciBtZXNzYWdlcyBzbyB1c2VyIGNhbiB0ZWxsIGRpZmZlcmVuY2VcbiAgICAgICAgICAgICAgICBzZW5kZXJOYW1lLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXJ2ZXJtZXNzYWdlJyk7XG4gICAgICAgICAgICB9IGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBjbGFzcyB0byB0aGUgcmVwbGllcyB3aXRoIG5hbWVzIG5vdCBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHJlcGx5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRlck5hbWUuYXBwZW5kQ2hpbGQoc2VuZGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG5cbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgICAvL1Njcm9sbHMgYW5kIHNob3dzIHRoZSBsYXRlc3QgbWVzc2FnZSByZWNlaXZlZFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cbmNsYXNzIE5ld0Rlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2luZG93QXBwQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpO1xuICAgIH1cbiAgICBhcHBzKCl7XG4gICAgICAgIGxldCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKS5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcicpO1xuXG4gICAgICAgIGxldCBjaGF0ID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjQ2hhdCcpO1xuICAgICAgICBsZXQgZ2FtZSA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0dhbWUnKTtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjU2V0dGluZ3MnKTtcblxuXG4gICAgICAgIGNoYXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgbmV3IENoYXQoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG5cbiAgICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbmV3IEdhbWUoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBnYW1lIHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG5cbiAgICAgICAgc2V0dGluZ3MuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICBuZXcgU2V0dGluZ3MoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAvL0NyZWF0ZXMgYSBuZXcgY2hhdCB1cG9uIGEgY2xpY2ssIGNoYXQgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBjaGF0IHdpbmRvd1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXdEZXNrdG9wO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICovXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBTZXR0aW5ncyBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgTmV3RGVza3RvcCA9IHJlcXVpcmUoJy4vTmV3RGVza3RvcCcpO1xuXG5jb25zdCBEZXNrdG9wID0gbmV3IE5ld0Rlc2t0b3AoKTtcblxuRGVza3RvcC5hcHBzKCk7XG4iXX0=
