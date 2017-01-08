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
        this.rows =4;
        this.cols = 4;
        this.tiles = this.picArray(this.rows, this.cols);
        this.gameBoard(4, this.content, this.tiles);
        this.turn1;
        this.turn2;
        this.lastTile;
        this.pairs = 0;
        this.tries = 0;
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

        this.createChatSettings();

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
        let count = 1;
        this.topBar.querySelector('.appsettings').addEventListener('click', event =>{
            count += 1;
            if(count % 2 === 0){
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

            }else{
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').style.display = 'none';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI3LlxuICpcbiAqICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHVUl7XG4gICAgY29uc3RydWN0b3Iod2luZG93QXBwLCBjb3VudGVyKSB7XG4gICAgICAgIHRoaXMud2luZG93QXBwID0gd2luZG93QXBwO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSBjb3VudGVyO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuICAgIGd1aSgpe1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzBdO1xuICAgICAgICBsZXQgYXBwV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy53aW5kb3dBcHApO1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgdGhpcy50b3BCYXIgPSBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyB0aGlzLndpbmRvd0FwcCk7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA0NSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEwNSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS56SW5kZXggPSB0aGlzLmNvdW50ZXI7XG5cbiAgICAgICAgYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGljb24nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIHRoaXMud2luZG93QXBwICsgJy5wbmcnKTtcblxuICAgICAgICBpZih0aGlzLndpbmRvd0FwcCA9PT0gJ0dhbWUnIHx8IHRoaXMud2luZG93QXBwID09PSAnQ2hhdCcpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBzZXR0aW5ncyBvcHRpb25cbiAgICAgICAgICAgIHRoaXMuYXBwU2V0dGluZ3MoYXBwV2luZG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcjY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGZ1bmN0aW9uIHRvIGNsb3NlIHdpbmRvd1xuICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudC50YXJnZXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmUoYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoYXBwV2luZG93KTtcblxuICAgIH1cblxuICAgIGNsb3NlKG5vZGUpIHsgICAgICAgLy9SZW1vdmVzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFyZW50IG5vZGUgKHRoZSBXaW5kb3cgc2VsZWN0ZWQpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIH1cblxuICAgIGFwcFNldHRpbmdzKHBvc2l0aW9uKSB7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL1NldHRpbmdzLnBuZycpO1xuICAgIH1cblxuICAgIG1vdmUoc2VsZWN0ZWQpIHsgICAgLy9NYWtlcyBpdCBwb3NzaWJsZSBmb3IgdGhlIHVzZXIgdG8gbW92ZSB0aGUgd2luZG93XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuXG4gICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ29ubW91c2Vkb3duJyk7XG5cbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NYID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWSA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wLCAxMCk7XG5cbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZXZlbnQucGFnZVggLSB3aW5kb3dQb3NYO1xuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBldmVudC5wYWdlWSAtIHdpbmRvd1Bvc1k7XG5cbiAgICAgICAgICAgIGxldCBtb3ZlV2luZG93ID0gZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1ggPSBlLnBhZ2VYIC0gb2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWSA9IGUucGFnZVkgLSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wID0gbW92ZVRvWSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0ID0gbW92ZVRvWCArICdweCc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXZlbnQgPSB4ID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ29ubW91c2Vkb3duJyk7XG4gICAgICAgICAgICAgICAgbGV0IHJlbW92ZVppbmRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpOyAgICAgICAvL0NvdW50cyBhbGwgb3BlbiB3aW5kb3dzIGluIHRoZSB3cmFwcGVyXG5cbiAgICAgICAgICAgICAgICBsZXQgekluZGV4Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCByZW1vdmVaaW5kZXgubGVuZ3RoOyBpICsrKXsgICAgICAgICAgICAgICAgICAgICAgLy9HaXZlcyBhIG5ldyB6LWluZGV4XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb28gPSByZW1vdmVaaW5kZXhbaV0uc3R5bGUuekluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcnNlSW50KGZvbykgPiB6SW5kZXhDb3VudCl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXhDb3VudCA9IHBhcnNlSW50KGZvbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS56SW5kZXggPSB6SW5kZXhDb3VudCArIDE7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR1VJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIE1lbW9yeSBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgdGhpcy5yb3dzID00O1xuICAgICAgICB0aGlzLmNvbHMgPSA0O1xuICAgICAgICB0aGlzLnRpbGVzID0gdGhpcy5waWNBcnJheSh0aGlzLnJvd3MsIHRoaXMuY29scyk7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkKDQsIHRoaXMuY29udGVudCwgdGhpcy50aWxlcyk7XG4gICAgICAgIHRoaXMudHVybjE7XG4gICAgICAgIHRoaXMudHVybjI7XG4gICAgICAgIHRoaXMubGFzdFRpbGU7XG4gICAgICAgIHRoaXMucGFpcnMgPSAwO1xuICAgICAgICB0aGlzLnRyaWVzID0gMDtcbiAgICB9XG5cbiAgICBnYW1lQm9hcmQoY29scywgY29udGFpbmVyLCB0aWxlcykge1xuICAgICAgICBsZXQgYVRhZztcblxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzFdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGFUYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFUYWcpO1xuICAgICAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lbW9yeWJyaWNrJyk7XG5cbiAgICAgICAgICAgIGxldCB0aWxlID0gdGlsZXNbaV07XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gZXZlbnQudGFyZ2V0LmZpcnN0Q2hpbGQubm9kZU5hbWUgPT09ICdJTUcnID8gZXZlbnQgOiBldmVudC5maXJzdENoaWxkO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgZXZlbnQudGFyZ2V0LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKChpICsgMSkgJSBjb2xzID09PSAwKXtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwaWNBcnJheShyb3dzLCBjb2xzKSB7XG4gICAgICAgIGxldCBhcnIgPSBbXTtcblxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDw9IChyb3dzICogY29scykgLyAyOyBpKyspeyAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGFuIGFycmF5IHdpdGggdGhlIGFtb3VudCBvZiBjYXJkcyB0aGF0IHRoZSBjbGllbnQgaGFzIGNob3NlblxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuID0gYXJyLmxlbmd0aDtcbiAgICAgICAgbGV0IHNodWZmbGVkQXJyID0gW107XG5cbiAgICAgICAgd2hpbGUgKG4pIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2h1ZmZsZXMgdGhlIGFycmF5XG4gICAgICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4tLSk7XG4gICAgICAgICAgICBzaHVmZmxlZEFyci5wdXNoKGFyci5zcGxpY2UoaSwgMSlbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNodWZmbGVkQXJyO1xuICAgIH1cblxuICAgIHR1cm5Ccmljayh0aWxlLCBpbWcpIHtcbiAgICAgICAgaWYodGhpcy50dXJuMil7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbWcuc3JjID0gJy9pbWFnZS8nICsgdGlsZSArICcucG5nJztcblxuICAgICAgICBpZighdGhpcy50dXJuMSl7XG4gICAgICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZihpbWcgPT09IHRoaXMudHVybjEpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJpZXMgKz0gMTtcbiAgICAgICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgICAgIGlmKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpe1xuICAgICAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGFpcnMgPT09ICh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpIC8gMil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3Ugd29uIG9uICcgKyB0aGlzLnRyaWVzICsgJyB0cmllcyEhJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZU91dCA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB9LDUwMCk7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoIGUgPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqXG4gKiBUb0RvIGNsb3NlIHNvY2tldCB3aGVuIHdpbmRvdyBpcyBjbG9zZWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBDaGF0IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9MZXRzIHRoZSBhcHAga25vdyB3aGljaCB3aW5kb3cgaXMgd2hpY2hcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgY2hhdC1hcHBcbiAgICAgICAgdGhpcy5jaGF0TmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gJyc7XG4gICAgICAgIHRoaXMuZW50ZXJOYW1lKCk7XG4gICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlO1xuICAgIH1cbiAgICBlbnRlck5hbWUoKSB7XG4gICAgICAgIGxldCB1c2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpO1xuXG4gICAgICAgIGlmKHVzZXJOYW1lICE9PSBudWxsKXtcbiAgICAgICAgICAgIHVzZXJOYW1lID0gSlNPTi5wYXJzZSh1c2VyTmFtZSk7XG4gICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gdXNlck5hbWUudXNlcm5hbWU7XG4gICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc05hbWUgKz0gJyB1c2VybmFtZSc7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgZGl2SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgYVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0VudGVyIGEgdXNlcm5hbWU6Jyk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgICAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9hY2NlcHQucG5nJyk7XG4gICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICd1c2VybmFtZWZpZWxkJyk7XG5cbiAgICAgICAgICAgIGFUYWcuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIGRpdkltZy5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG5cbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChwVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChkaXZJbWcpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA8PSAwIHx8IGlucHV0VmFsdWUubGVuZ3RoID49IDI1IHx8IGlucHV0VmFsdWUgPT09ICdUaGUgU2VydmVyJyl7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdOb3QgYSB2YWxpZCB1c2VybmFtZSBkdWRlIScpXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXRVc2VybmFtZSA9IHt1c2VybmFtZTogdGhpcy51c2VyTmFtZX07XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdDaGF0VXNlcicsIEpTT04uc3RyaW5naWZ5KGNoYXRVc2VybmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VudGVydXNlcm5hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhdEFwcCgpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvJyk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAgZXZlbnQgPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL09wZW5zIHVwIGEgbmV3IHNvY2tldCBhbmQgc3RhcnRzIHJlY2VpdmluZyB0aGUgbWVzc2FnZXNcbiAgICAgICAgICAgIHRoaXMucmVjaWV2ZU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZm9ybURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBlbGVtZW50cyBuZWNlc3NhcnkgZm9yIHRoZSBjaGF0LWFwcFxuICAgICAgICBsZXQgc2VuZEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBsZXQgc2VuZEFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHRoaXMudGV4dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGhpcy50ZXh0RmllbGQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0ZXh0ZmllbGQnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBzdHlsaW5nXG4gICAgICAgIGZvcm1EaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0U3R5bGVzJyk7XG4gICAgICAgIGZvcm1UYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdmb3Jtc3R5bGUnKTtcbiAgICAgICAgaW5wdXRUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0aW5wdXQnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kaWNvbicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGFrZXMgYSBpbWFnZSBhbmQgdXNlcyBpdCB0byBzZW5kIG1lc3NhZ2VzXG4gICAgICAgIHNlbmRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL3NlbmQucG5nJyk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcbiAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FwcGVuZHMgYWxsIHRoZSBuZXdseSBjcmVhdGVkIGVsZW1lbnRzXG4gICAgICAgIHNlbmRBVGFnLmFwcGVuZENoaWxkKHNlbmRJbWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKHNlbmRBVGFnKTtcbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGZvcm1EaXYpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhdFNldHRpbmdzKCk7XG5cbiAgICAgICAgaW5wdXRUYWcuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZW50ZXIta2V5IHdoZW4gdHlwaW5nLCBzZW5kIHRoZSBtZXNzYWdlIHdoZW4gcHJlc3NlZFxuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxMyl7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gY2xlYXJJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhcklucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzZW5kQVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgc2VuZCBpY29uIHRvIHNlbmQgbWVzc2FnZVxuICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gY2xlYXJJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICBjbGVhcklucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBjcmVhdGVDaGF0U2V0dGluZ3MoKXtcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgdGhpcy50b3BCYXIucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICBpZihjb3VudCAlIDIgPT09IDApe1xuICAgICAgICAgICAgICAgIGxldCBjaGF0U2V0dGluZ3NEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBsZXQgcm92YXJzcHJhayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcblxuICAgICAgICAgICAgICAgIGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdSw7Z2YXJzcHLDpWsnKSk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnbmFtZScsICdSw7Z2YXJzcHLDpWsnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCdpZCcsICdyb3ZhcnNwcmFrJyk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHNldHRpbmdzJyk7XG5cbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQocm92YXJzcHJhayk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9PT0gdHJ1ZSl7ICAgICAgICAgICAgICAgICAgICAgLy9DaGVja3MgaWYgUsO2dmFyc3Byw6VrIGlzIHRydWUsIHRoZW4gdGhlIGJveCBzaG91bGQgYmUgY2hlY2tlZFxuICAgICAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgICAgICBpZihyb3ZhcnNwcmFrLmNoZWNrZWQgPT09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudE5vZGUgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hhdFNldHRpbmdzRGl2LCBjaGlsZHJlblswXSk7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2hhdHNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWNyZXRMYW5nKHRleHQpIHsgICAgICAgICAgICAgICAgICAvL1RoZSBtZXNzYWdlIHR1cm5zIGludG8gYSAnc2VjcmV0JyBtZXNzYWdlXG5cbiAgICAgICAgbGV0IGtvbnNvbmFudGVyID0gWydCJywgJ2InLCAnQycsICdjJywgJ0QnLCAnZCcsICdGJywgJ2YnLCAnRycsICdnJywgJ0gnLCAnaCcsICdKJywgJ2onLCAnSycsICdrJywgJ0wnLCAnbCcsICdNJywgJ20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ04nLCAnbicsICdQJywgJ3AnLCAnUScsICdxJywgJ1InLCAncicsICdTJywgJ3MnLCAgJ1QnLCAndCcsICdWJywgJ3YnLCAnVycsICd3JywgJ1gnLCAneCcsICdaJywgJ3onXTtcblxuICAgICAgICBsZXQgbmV3U3RyaW5nID0gJyc7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpICsrKXtcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBrb25zb25hbnRlci5sZW5ndGg7IGogKyspe1xuICAgICAgICAgICAgICAgIGlmKHRleHRbaV0gPT09IGtvbnNvbmFudGVyW2pdKXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nICs9IHRleHRbaV0gKyAnbyc7ICAgICAgICAgICAgIC8vQWRkcyBhbiAnbycgdG8gYWxsIGNvbnNvbmFudHNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKGlucHV0KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TZW5kcyB0aGUgbWVzc2FnZSBhcyBKU09OIHZpYSB3ZWJzb2NrZXRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZSBldmVyeSB0aW1lIGEgbWVzc2FnZSBpcyBzZW50XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBKU09OLnBhcnNlKHRoaXMuY2xpZW50VXNlck5hbWUpO1xuICAgICAgICBpZiAodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5zZWNyZXRMYW5nKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIFwiZGF0YVwiIDogaW5wdXQsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgcmVjaWV2ZU1lc3NhZ2UoZSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1doZW4gbmV3IG1lc3NhZ2VzIGlzIHJlY2VpdmVkLCBkaXNwbGF5IGl0IGluIHRoZSBjaGF0IHdpbmRvd1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UudXNlcm5hbWUgKyAnOicpO1xuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBsZXQgdGV4dFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgdGV4dFAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZXNzYWdlY29udGVudCcpO1xuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdXNlcm5hbWUgaXMgZXF1YWwgdG8gdGhlIGNsaWVudCB1c2VyIG5hbWUsIGFkZCBjbGllbnQgY2xhc3NcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSAnVGhlIFNlcnZlcicpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHNlcnZlciBtZXNzYWdlcyBzbyB1c2VyIGNhbiB0ZWxsIGRpZmZlcmVuY2VcbiAgICAgICAgICAgICAgICBzZW5kZXJOYW1lLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXJ2ZXJtZXNzYWdlJyk7XG4gICAgICAgICAgICB9IGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBjbGFzcyB0byB0aGUgcmVwbGllcyB3aXRoIG5hbWVzIG5vdCBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHJlcGx5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRlck5hbWUuYXBwZW5kQ2hpbGQoc2VuZGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG5cbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgICAvL1Njcm9sbHMgYW5kIHNob3dzIHRoZSBsYXRlc3QgbWVzc2FnZSByZWNlaXZlZFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cbmNsYXNzIE5ld0Rlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2luZG93QXBwQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpO1xuICAgIH1cbiAgICBhcHBzKCl7XG4gICAgICAgIGxldCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKS5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcicpO1xuXG4gICAgICAgIGxldCBjaGF0ID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjQ2hhdCcpO1xuICAgICAgICBsZXQgZ2FtZSA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0dhbWUnKTtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjU2V0dGluZ3MnKTtcblxuXG4gICAgICAgIGNoYXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgbmV3IENoYXQoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG5cbiAgICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbmV3IEdhbWUoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBnYW1lIHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG5cbiAgICAgICAgc2V0dGluZ3MuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICBuZXcgU2V0dGluZ3MoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAvL0NyZWF0ZXMgYSBuZXcgY2hhdCB1cG9uIGEgY2xpY2ssIGNoYXQgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBjaGF0IHdpbmRvd1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXdEZXNrdG9wO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICovXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBTZXR0aW5ncyBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgTmV3RGVza3RvcCA9IHJlcXVpcmUoJy4vTmV3RGVza3RvcCcpO1xuXG5jb25zdCBEZXNrdG9wID0gbmV3IE5ld0Rlc2t0b3AoKTtcblxuRGVza3RvcC5hcHBzKCk7XG4iXX0=
