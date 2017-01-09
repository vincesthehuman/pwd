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

                label.appendChild(document.createTextNode('Rövarspråk'));
                rovarsprak.setAttribute('type', 'checkbox');
                rovarsprak.setAttribute('name', 'Rövarspråk');
                rovarsprak.setAttribute('value', 'true');
                rovarsprak.setAttribute('id', 'rovarsprak');
                chatSettingsDiv.setAttribute('class', 'chatsettings');

                chatSettingsDiv.appendChild(rovarsprak);
                chatSettingsDiv.appendChild(label);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI3LlxuICpcbiAqICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHVUl7XG4gICAgY29uc3RydWN0b3Iod2luZG93QXBwLCBjb3VudGVyKSB7XG4gICAgICAgIHRoaXMud2luZG93QXBwID0gd2luZG93QXBwO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSBjb3VudGVyO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuICAgIGd1aSgpe1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzBdO1xuICAgICAgICBsZXQgYXBwV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy53aW5kb3dBcHApO1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgdGhpcy50b3BCYXIgPSBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyB0aGlzLndpbmRvd0FwcCk7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA0NSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEwNSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS56SW5kZXggPSB0aGlzLmNvdW50ZXI7XG5cbiAgICAgICAgYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGljb24nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIHRoaXMud2luZG93QXBwICsgJy5wbmcnKTtcblxuICAgICAgICBpZih0aGlzLndpbmRvd0FwcCA9PT0gJ0dhbWUnIHx8IHRoaXMud2luZG93QXBwID09PSAnQ2hhdCcpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBzZXR0aW5ncyBvcHRpb25cbiAgICAgICAgICAgIHRoaXMuYXBwU2V0dGluZ3MoYXBwV2luZG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcjY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGZ1bmN0aW9uIHRvIGNsb3NlIHdpbmRvd1xuICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudC50YXJnZXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmUoYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoYXBwV2luZG93KTtcblxuICAgIH1cblxuICAgIGNsb3NlKG5vZGUpIHsgICAgICAgLy9SZW1vdmVzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFyZW50IG5vZGUgKHRoZSBXaW5kb3cgc2VsZWN0ZWQpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIH1cblxuICAgIGFwcFNldHRpbmdzKHBvc2l0aW9uKSB7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL1NldHRpbmdzLnBuZycpO1xuICAgIH1cblxuICAgIG1vdmUoc2VsZWN0ZWQpIHsgICAgLy9NYWtlcyBpdCBwb3NzaWJsZSBmb3IgdGhlIHVzZXIgdG8gbW92ZSB0aGUgd2luZG93XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuXG4gICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ29ubW91c2Vkb3duJyk7XG5cbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NYID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWSA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wLCAxMCk7XG5cbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZXZlbnQucGFnZVggLSB3aW5kb3dQb3NYO1xuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBldmVudC5wYWdlWSAtIHdpbmRvd1Bvc1k7XG5cbiAgICAgICAgICAgIGxldCBtb3ZlV2luZG93ID0gZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1ggPSBlLnBhZ2VYIC0gb2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWSA9IGUucGFnZVkgLSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wID0gbW92ZVRvWSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0ID0gbW92ZVRvWCArICdweCc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXZlbnQgPSB4ID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ29ubW91c2Vkb3duJyk7XG4gICAgICAgICAgICAgICAgbGV0IHJlbW92ZVppbmRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpOyAgICAgICAvL0NvdW50cyBhbGwgb3BlbiB3aW5kb3dzIGluIHRoZSB3cmFwcGVyXG5cbiAgICAgICAgICAgICAgICBsZXQgekluZGV4Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCByZW1vdmVaaW5kZXgubGVuZ3RoOyBpICsrKXsgICAgICAgICAgICAgICAgICAgICAgLy9HaXZlcyBhIG5ldyB6LWluZGV4XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb28gPSByZW1vdmVaaW5kZXhbaV0uc3R5bGUuekluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcnNlSW50KGZvbykgPiB6SW5kZXhDb3VudCl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXhDb3VudCA9IHBhcnNlSW50KGZvbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS56SW5kZXggPSB6SW5kZXhDb3VudCArIDE7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR1VJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIE1lbW9yeSBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGdhbWUtYXBwXG4gICAgICAgIHRoaXMucm93cyA9IDA7XG4gICAgICAgIHRoaXMuY29scyA9IDA7XG4gICAgICAgIHRoaXMudHVybjE7XG4gICAgICAgIHRoaXMudHVybjI7XG4gICAgICAgIHRoaXMubGFzdFRpbGU7XG4gICAgICAgIHRoaXMucGFpcnMgPSAwO1xuICAgICAgICB0aGlzLnRyaWVzID0gMDtcbiAgICAgICAgdGhpcy5jcmVhdGVHYW1lU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICBnYW1lQm9hcmQoY29scywgY29udGFpbmVyLCB0aWxlcykge1xuICAgICAgICBsZXQgYVRhZztcblxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzFdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGFUYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFUYWcpO1xuICAgICAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lbW9yeWJyaWNrJyk7XG5cbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZXNbaV07XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gZXZlbnQudGFyZ2V0LmZpcnN0Q2hpbGQubm9kZU5hbWUgPT09ICdJTUcnID8gZXZlbnQgOiBldmVudC5maXJzdENoaWxkO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgZXZlbnQudGFyZ2V0LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKChpICsgMSkgJSBjb2xzID09PSAwKXtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwaWNBcnJheShyb3dzLCBjb2xzKSB7XG4gICAgICAgIGxldCBhcnIgPSBbXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDw9IChyb3dzICogY29scykgLyAyOyBpKyspeyAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGFuIGFycmF5IHdpdGggdGhlIGFtb3VudCBvZiBjYXJkcyB0aGF0IHRoZSBjbGllbnQgaGFzIGNob3NlblxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuID0gYXJyLmxlbmd0aDtcbiAgICAgICAgbGV0IHNodWZmbGVkQXJyID0gW107XG5cbiAgICAgICAgd2hpbGUgKG4pIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2h1ZmZsZXMgdGhlIGFycmF5XG4gICAgICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4tLSk7XG4gICAgICAgICAgICBzaHVmZmxlZEFyci5wdXNoKGFyci5zcGxpY2UoaSwgMSlbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNodWZmbGVkQXJyO1xuICAgIH1cblxuICAgIHR1cm5Ccmljayh0aWxlLCBpbWcpIHtcbiAgICAgICAgaWYodGhpcy50dXJuMil7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbWcuc3JjID0gJy9pbWFnZS8nICsgdGlsZSArICcucG5nJztcblxuICAgICAgICBpZighdGhpcy50dXJuMSl7XG4gICAgICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZihpbWcgPT09IHRoaXMudHVybjEpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJpZXMgKz0gMTtcbiAgICAgICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgICAgIGlmKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpe1xuICAgICAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGFpcnMgPT09ICh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpIC8gMil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3Ugd29uIG9uICcgKyB0aGlzLnRyaWVzICsgJyB0cmllcyEhJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZU91dCA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB9LDUwMCk7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoIGUgPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUdhbWVTZXR0aW5ncygpe1xuICAgICAgICBpZih0aGlzLnJvd3MgPT09IDApe1xuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmKGNvdW50ID09PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzJdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihldmVudC50YXJnZXQudmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFpcnMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaWxlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzID0gZXZlbnQudGFyZ2V0LnZhbHVlWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbHMgPSBldmVudC50YXJnZXQudmFsdWVbMV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMgPSB0aGlzLnBpY0FycmF5KHRoaXMucm93cywgdGhpcy5jb2xzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lQm9hcmQodGhpcy5jb2xzLCB0aGlzLmNvbnRlbnQsIHRoaXMudGlsZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudE5vZGUgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShkaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY291bnQgJSAyID09PSAwKXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmdhbWVzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmdhbWVzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2hlbGxvIGZpcnN0IGdhbWUhJylcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKlxuICogVG9EbyBjbG9zZSBzb2NrZXQgd2hlbiB3aW5kb3cgaXMgY2xvc2VkXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgQ2hhdCBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGV0cyB0aGUgYXBwIGtub3cgd2hpY2ggd2luZG93IGlzIHdoaWNoXG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGNoYXQtYXBwXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhdFNldHRpbmdzKCk7XG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmVudGVyTmFtZSgpO1xuICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSBmYWxzZTtcbiAgICB9XG4gICAgZW50ZXJOYW1lKCkge1xuICAgICAgICBsZXQgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTtcblxuICAgICAgICBpZih1c2VyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB1c2VyTmFtZSA9IEpTT04ucGFyc2UodXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IHVzZXJOYW1lLnVzZXJuYW1lO1xuICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnTm90IGEgdmFsaWQgdXNlcm5hbWUgZHVkZSEnKVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYXRBcHAoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuICAgICAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgIGV2ZW50ID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9PcGVucyB1cCBhIG5ldyBzb2NrZXQgYW5kIHN0YXJ0cyByZWNlaXZpbmcgdGhlIG1lc3NhZ2VzXG4gICAgICAgICAgICB0aGlzLnJlY2lldmVNZXNzYWdlKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZvcm1EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgZWxlbWVudHMgbmVjZXNzYXJ5IGZvciB0aGUgY2hhdC1hcHBcbiAgICAgICAgbGV0IHNlbmRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgbGV0IHNlbmRBVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB0aGlzLnRleHRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRoaXMudGV4dEZpZWxkLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGV4dGZpZWxkJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgc3R5bGluZ1xuICAgICAgICBmb3JtRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdFN0eWxlcycpO1xuICAgICAgICBmb3JtVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZm9ybXN0eWxlJyk7XG4gICAgICAgIGlucHV0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdGlucHV0Jyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGljb24nKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Rha2VzIGEgaW1hZ2UgYW5kIHVzZXMgaXQgdG8gc2VuZCBtZXNzYWdlc1xuICAgICAgICBzZW5kSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9zZW5kLnBuZycpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BcHBlbmRzIGFsbCB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgICBzZW5kQVRhZy5hcHBlbmRDaGlsZChzZW5kSW1nKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChzZW5kQVRhZyk7XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcblxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBlbnRlci1rZXkgd2hlbiB0eXBpbmcsIHNlbmQgdGhlIG1lc3NhZ2Ugd2hlbiBwcmVzc2VkXG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKXtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbmRBVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBzZW5kIGljb24gdG8gc2VuZCBtZXNzYWdlXG4gICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGNyZWF0ZUNoYXRTZXR0aW5ncygpe1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmKGNvdW50ID09PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFNldHRpbmdzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbGV0IHJvdmFyc3ByYWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUsO2dmFyc3Byw6VrJykpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnUsO2dmFyc3Byw6VrJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnaWQnLCAncm92YXJzcHJhaycpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRzZXR0aW5ncycpO1xuXG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHJvdmFyc3ByYWspO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlY3JldExhbmdPcHRpb24gPT09IHRydWUpeyAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2tzIGlmIFLDtnZhcnNwcsOlayBpcyB0cnVlLCB0aGVuIHRoZSBib3ggc2hvdWxkIGJlIGNoZWNrZWRcbiAgICAgICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICAgICAgaWYocm92YXJzcHJhay5jaGVja2VkID09PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnROb2RlID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHBhcmVudE5vZGUuY2hpbGROb2RlcztcblxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNoYXRTZXR0aW5nc0RpdiwgY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihjb3VudCAlIDIgPT09IDApe1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2hhdHNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2hhdHNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlY3JldExhbmcodGV4dCkgeyAgICAgICAgICAgICAgICAgIC8vVGhlIG1lc3NhZ2UgdHVybnMgaW50byBhICdzZWNyZXQnIG1lc3NhZ2VcblxuICAgICAgICBsZXQga29uc29uYW50ZXIgPSBbJ0InLCAnYicsICdDJywgJ2MnLCAnRCcsICdkJywgJ0YnLCAnZicsICdHJywgJ2cnLCAnSCcsICdoJywgJ0onLCAnaicsICdLJywgJ2snLCAnTCcsICdsJywgJ00nLCAnbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnTicsICduJywgJ1AnLCAncCcsICdRJywgJ3EnLCAnUicsICdyJywgJ1MnLCAncycsICAnVCcsICd0JywgJ1YnLCAndicsICdXJywgJ3cnLCAnWCcsICd4JywgJ1onLCAneiddO1xuXG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSAnJztcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkgKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGtvbnNvbmFudGVyLmxlbmd0aDsgaiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGV4dFtpXSA9PT0ga29uc29uYW50ZXJbal0pe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXSArICdvJzsgICAgICAgICAgICAgLy9BZGRzIGFuICdvJyB0byBhbGwgY29uc29uYW50c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1N0cmluZyArPSB0ZXh0W2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgc2VuZE1lc3NhZ2UoaW5wdXQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NlbmRzIHRoZSBtZXNzYWdlIGFzIEpTT04gdmlhIHdlYnNvY2tldFxuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVja3MgdGhlIHVzZXJuYW1lIGV2ZXJ5IHRpbWUgYSBtZXNzYWdlIGlzIHNlbnRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IEpTT04ucGFyc2UodGhpcy5jbGllbnRVc2VyTmFtZSk7XG4gICAgICAgIGlmICh0aGlzLnNlY3JldExhbmdPcHRpb24gPT09IHRydWUpe1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLnNlY3JldExhbmcoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBpbnB1dCxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy5jbGllbnRVc2VyTmFtZS51c2VybmFtZSxcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICByZWNpZXZlTWVzc2FnZShlKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2hlbiBuZXcgbWVzc2FnZXMgaXMgcmVjZWl2ZWQsIGRpc3BsYXkgaXQgaW4gdGhlIGNoYXQgd2luZG93XG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS51c2VybmFtZSArICc6Jyk7XG4gICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIGxldCB0ZXh0UCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgICB0ZXh0UC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lc3NhZ2Vjb250ZW50Jyk7XG4gICAgICAgIHNlbmRlck5hbWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kZXJuYW1lJyk7XG5cbiAgICAgICAgaWYocmVzcG9uc2UudHlwZSAhPT0gJ2hlYXJ0YmVhdCcpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB1c2VybmFtZSBpcyBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXIgbmFtZSwgYWRkIGNsaWVudCBjbGFzc1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NsaWVudG1lc3NhZ2UnKVxuICAgICAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09ICdUaGUgU2VydmVyJyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgY2xhc3MgdG8gc2VydmVyIG1lc3NhZ2VzIHNvIHVzZXIgY2FuIHRlbGwgZGlmZmVyZW5jZVxuICAgICAgICAgICAgICAgIHNlbmRlck5hbWUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlcnZlcm1lc3NhZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHRoZSByZXBsaWVzIHdpdGggbmFtZXMgbm90IGVxdWFsIHRvIHRoZSBjbGllbnQgdXNlcm5hbWVcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0cmVwbHknKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZGVyTmFtZS5hcHBlbmRDaGlsZChzZW5kZXIpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChzZW5kZXJOYW1lKTtcblxuICAgICAgICAgICAgdGV4dFAuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHRleHRQKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChtZXNzYWdlKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLnNjcm9sbFRvcCA9IHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxIZWlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2Nyb2xscyBhbmQgc2hvd3MgdGhlIGxhdGVzdCBtZXNzYWdlIHJlY2VpdmVkXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjYuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoJy4vTmV3Q2hhdCcpO1xuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vTWVtb3J5Jyk7XG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vU2V0dGluZ3MnKTtcblxuY2xhc3MgTmV3RGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy53aW5kb3dBcHBDb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG4gICAgfVxuICAgIGFwcHMoKXtcbiAgICAgICAgbGV0IHNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpLnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyJyk7XG5cbiAgICAgICAgbGV0IGNoYXQgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNDaGF0Jyk7XG4gICAgICAgIGxldCBnYW1lID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjR2FtZScpO1xuICAgICAgICBsZXQgc2V0dGluZ3MgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNTZXR0aW5ncycpO1xuXG5cbiAgICAgICAgY2hhdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICBuZXcgQ2hhdChldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGNoYXQgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBBcHBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcblxuICAgICAgICBnYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBuZXcgR2FtZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGdhbWUgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBBcHBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcblxuICAgICAgICBzZXR0aW5ncy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIG5ldyBTZXR0aW5ncyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0Rlc2t0b3A7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKi9cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIFNldHRpbmdzIGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIi8qKlxuICpcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBOZXdEZXNrdG9wID0gcmVxdWlyZSgnLi9OZXdEZXNrdG9wJyk7XG5cbmNvbnN0IERlc2t0b3AgPSBuZXcgTmV3RGVza3RvcCgpO1xuXG5EZXNrdG9wLmFwcHMoKTtcbiJdfQ==
