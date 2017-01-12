(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-27.
 *
 * * ToDo Make a gui that all the apps inherits.
 */


'use strict';

class GUI{
    constructor(windowApp, counter) {
        this.windowApp = windowApp;             //What type of window is being created
        this.counter = counter;                 //A counter for how many windows there are
        this.wrapper = document.querySelector('#wrapper');
        this.gui();
    }


    gui(){
        let template = document.querySelectorAll('template')[0];
        let appWindow = document.importNode(template.content.firstElementChild, true);      //Selects the first template and imports it from the index.html

        let pTag = document.createElement('p');
        let pText = document.createTextNode(this.windowApp);    //The name of the window
        pTag.appendChild(pText);

        appWindow.setAttribute('id', this.windowApp + this.counter);                                        //The window is given an id, with type and a number
        this.topBar = appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);    //The windows topbar gets a similar id
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * (this.counter + 1) + 'px';
        appWindow.style.left =+ 105 * (this.counter + 1) + 'px';    //Adds a "bounce" to the windows

        let removeZindex = document.getElementsByClassName('window');       //Counts all open windows in the wrapper

        let zIndexCount = 0;
        for(let i = 0; i < removeZindex.length; i ++) {                      //Gives a new z-index
            let foo = removeZindex[i].style.zIndex;

            if (parseInt(foo) > zIndexCount) {                                //If the zindex of the clicked window is higher than the zindex counter, z index counter gets a new value
                zIndexCount = parseInt(foo);
            }
        }

        appWindow.style.zIndex = zIndexCount;

        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.windowApp + '.png');       //The icon corresponds to the type of window that is choosen

        if(this.windowApp === 'Game' || this.windowApp === 'Chat'){                            //Adds a settings option
            this.appSettings(appWindow);
        }

        appWindow.querySelector('#close').addEventListener('click', event =>{                  //Adds the function to close a window
            this.close(event.target);
        });

        this.move(appWindow.firstElementChild);                                                 //Adds the function to move a window

        this.wrapper.appendChild(appWindow);

    }

    close(node) {       //Removes the parent node of the parent node (the Window selected)
        node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
    }

    appSettings(position) {
        position.querySelector('.appsettings').setAttribute('id', this.windowApp + this.counter);
        position.querySelector('.appsettings').firstChild.setAttribute('src', '/image/Settings.png');   //Adds the settings icon
    }

    move(selected) {    //Makes it possible for the user to move the window
        selected.addEventListener('mousedown', event =>{
            event.preventDefault();

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left);
            let windowPosY = parseInt(selected.parentNode.style.top);  //Sets the styling of the selected window

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;                         //The offset is calculated so that the windows top left corner doesn't "jump" to pointer

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

                    if(parseInt(foo) > zIndexCount){                                //If the zindex of the clicked window is higher than the zindex counter, z index counter gets a new value
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
                    setTimeout(timeOut =>{
                        message.textContent = '';
                        let text = document.createTextNode('You only needed ' + this.tries + ' tries to win! Click on the settings and start a new game!');
                        message.appendChild(text);
                    }, 500)

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
        this.topBar.querySelector('.appsettings').addEventListener('mousedown', event =>{
            event.preventDefault();
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
        this.content = document.getElementById(name+count).lastElementChild;      //Lets the app know which window is which
        this.topBar = document.getElementById(name+count).firstElementChild;      //The topbar of the chat-app
        this.createChatSettings();          //Starts with calling on teh settings function
        this.chatName = '';                 //Chatname is set to an empty string
        this.clientUserName = '';           //Senders name is set to an empty string
        this.enterName();                   //Starts the enter name
        this.secretLangOption = false;      //Option to use the "secret lang"
    }
    enterName() {
        let userName = localStorage.getItem('ChatUser');

        if(userName !== null){
            userName = JSON.parse(userName);            //If the name isnt null, calls in the chatApp function
            this.chatName = userName.username;
            this.chatApp();

        }else{                                          //If null, create a option to pick a name
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
                let inputValue = this.content.querySelector('input').value;         //Checks the username for some standard rules

                if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){
                    let text = document.createTextNode('Not a valid username!');
                    let p = document.createElement('p');

                    p.appendChild(text);
                    this.content.appendChild(p);
                }else{
                    this.userName = this.content.querySelector('input').value;
                    let chatUsername = {username: this.userName};
                    localStorage.setItem('ChatUser', JSON.stringify(chatUsername));     //If the username is valid, add the choosen username to LS
                    this.chatName = inputValue;
                    this.content.classList.remove('enterusername');
                    this.content.textContent = '';                    //Clear the div
                    this.chatApp();                                   //Start the chatApp
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
        this.topBar.querySelector('.appsettings').addEventListener('mousedown', event =>{
            event.preventDefault();
            count += 1;
            if(count === 1){ //Checks if the user har clicked for the first time, then create the needed elements
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

                rovarsprak.addEventListener('click', event =>{      //Event listener on when the user clicks the option
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
                let parent = this.topBar.parentNode;    //If this is the second time (even) clicked, hide the settings
                parent.querySelector('.chatsettings').style.display = 'none';
            }else{
                let parent = this.topBar.parentNode;    //If this is a third time (uneven) clicked, display the settings again
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

        if (this.secretLangOption === true){        //If the secret lang is selcted, convert the messages
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
        let div = document.createElement('div');                //Creates all necessary elements
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
            }else if(response.type === 'notification'){                                                               //Adds a class to server messages so user can tell difference
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
            event.preventDefault();
            new Chat(event.target.parentNode.id, this.windowAppCounter.length);
        });                 //Creates a new chat upon a click, chat will inherit structure from Gui creating a new chat window

        game.addEventListener('click', event =>{
            event.preventDefault();
            new Game(event.target.parentNode.id, this.windowAppCounter.length);
        });                 //Creates a new game upon a click, chat will inherit structure from Gui creating a new chat window

        settings.addEventListener('click', event => {
            event.preventDefault();
            new Settings(event.target.parentNode.id, this.windowAppCounter.length);
        });                 //Creates a new chat upon a click, chat will inherit structure from Gui creating a new chat window
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
        this.content = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.createSettingsContent();                   //Starting point of the app
        this.message = document.createElement('p');
    }
    createSettingsContent() {
        this.content.textContent = '';      //Clears the div
        let template = document.querySelectorAll('template')[5].content.firstElementChild;  //Imports the template needed
        let div = document.importNode(template, true);

        this.content.appendChild(div);
        let username = this.content.querySelector('#username');
        this.checkUserName(username);       //Checks the username
    }
    checkUserName(username) {
        let clientUserName = localStorage.getItem('ChatUser');      //Checks local storage for a username

        let name = JSON.parse(clientUserName);

        if(name === null){      //If username is not defined, set to an empty string
            name = '';
        }

        let pTag = document.createElement('p');
        let pText = document.createTextNode(name.username);     //The username is put in a p element

        if(pText.textContent === 'undefined'){
            pTag.setAttribute('class', 'usernameNotSet');       //If the username is undefined, add the class username not set
        }

        pTag.appendChild(pText);
        username.appendChild(pTag);

        let button = this.content.querySelectorAll('button')[0];  //Adds an event to the first button in the window

        button.addEventListener('click', event =>{
            let inputValue = this.content.querySelector('input').value;

            if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){ //Checks the input value if it is a proper username
                let text = document.createTextNode('Not a valid username!');
                let p = document.createElement('p');

                p.appendChild(text);
                this.content.appendChild(p);
            }else{
                this.userName = this.content.querySelector('input').value;
                let chatUsername = {username: this.userName};
                localStorage.setItem('ChatUser', JSON.stringify(chatUsername));     //If the username passes the rules, LS is set to the new name
                this.createSettingsContent();                                       //Runs the function again to display the active username
            }
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yNy5cbiAqXG4gKiAqIFRvRG8gTWFrZSBhIGd1aSB0aGF0IGFsbCB0aGUgYXBwcyBpbmhlcml0cy5cbiAqL1xuXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgR1VJe1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvd0FwcCwgY291bnRlcikge1xuICAgICAgICB0aGlzLndpbmRvd0FwcCA9IHdpbmRvd0FwcDsgICAgICAgICAgICAgLy9XaGF0IHR5cGUgb2Ygd2luZG93IGlzIGJlaW5nIGNyZWF0ZWRcbiAgICAgICAgdGhpcy5jb3VudGVyID0gY291bnRlcjsgICAgICAgICAgICAgICAgIC8vQSBjb3VudGVyIGZvciBob3cgbWFueSB3aW5kb3dzIHRoZXJlIGFyZVxuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuXG4gICAgZ3VpKCl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMF07XG4gICAgICAgIGxldCBhcHBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgIC8vU2VsZWN0cyB0aGUgZmlyc3QgdGVtcGxhdGUgYW5kIGltcG9ydHMgaXQgZnJvbSB0aGUgaW5kZXguaHRtbFxuXG4gICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLndpbmRvd0FwcCk7ICAgIC8vVGhlIG5hbWUgb2YgdGhlIHdpbmRvd1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGUgd2luZG93IGlzIGdpdmVuIGFuIGlkLCB3aXRoIHR5cGUgYW5kIGEgbnVtYmVyXG4gICAgICAgIHRoaXMudG9wQmFyID0gYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbmRvdyAnICsgdGhpcy53aW5kb3dBcHApOyAgICAvL1RoZSB3aW5kb3dzIHRvcGJhciBnZXRzIGEgc2ltaWxhciBpZFxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS50b3AgPSsgNDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9KyAxMDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnOyAgICAvL0FkZHMgYSBcImJvdW5jZVwiIHRvIHRoZSB3aW5kb3dzXG5cbiAgICAgICAgbGV0IHJlbW92ZVppbmRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpOyAgICAgICAvL0NvdW50cyBhbGwgb3BlbiB3aW5kb3dzIGluIHRoZSB3cmFwcGVyXG5cbiAgICAgICAgbGV0IHpJbmRleENvdW50ID0gMDtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHJlbW92ZVppbmRleC5sZW5ndGg7IGkgKyspIHsgICAgICAgICAgICAgICAgICAgICAgLy9HaXZlcyBhIG5ldyB6LWluZGV4XG4gICAgICAgICAgICBsZXQgZm9vID0gcmVtb3ZlWmluZGV4W2ldLnN0eWxlLnpJbmRleDtcblxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KGZvbykgPiB6SW5kZXhDb3VudCkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgemluZGV4IG9mIHRoZSBjbGlja2VkIHdpbmRvdyBpcyBoaWdoZXIgdGhhbiB0aGUgemluZGV4IGNvdW50ZXIsIHogaW5kZXggY291bnRlciBnZXRzIGEgbmV3IHZhbHVlXG4gICAgICAgICAgICAgICAgekluZGV4Q291bnQgPSBwYXJzZUludChmb28pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnpJbmRleCA9IHpJbmRleENvdW50O1xuXG4gICAgICAgIGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BpY29uJykuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlLycgKyB0aGlzLndpbmRvd0FwcCArICcucG5nJyk7ICAgICAgIC8vVGhlIGljb24gY29ycmVzcG9uZHMgdG8gdGhlIHR5cGUgb2Ygd2luZG93IHRoYXQgaXMgY2hvb3NlblxuXG4gICAgICAgIGlmKHRoaXMud2luZG93QXBwID09PSAnR2FtZScgfHwgdGhpcy53aW5kb3dBcHAgPT09ICdDaGF0Jyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIHNldHRpbmdzIG9wdGlvblxuICAgICAgICAgICAgdGhpcy5hcHBTZXR0aW5ncyhhcHBXaW5kb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgLy9BZGRzIHRoZSBmdW5jdGlvbiB0byBjbG9zZSBhIHdpbmRvd1xuICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudC50YXJnZXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmUoYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIHRoZSBmdW5jdGlvbiB0byBtb3ZlIGEgd2luZG93XG5cbiAgICAgICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGFwcFdpbmRvdyk7XG5cbiAgICB9XG5cbiAgICBjbG9zZShub2RlKSB7ICAgICAgIC8vUmVtb3ZlcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhcmVudCBub2RlICh0aGUgV2luZG93IHNlbGVjdGVkKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICB9XG5cbiAgICBhcHBTZXR0aW5ncyhwb3NpdGlvbikge1xuICAgICAgICBwb3NpdGlvbi5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy53aW5kb3dBcHAgKyB0aGlzLmNvdW50ZXIpO1xuICAgICAgICBwb3NpdGlvbi5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9TZXR0aW5ncy5wbmcnKTsgICAvL0FkZHMgdGhlIHNldHRpbmdzIGljb25cbiAgICB9XG5cbiAgICBtb3ZlKHNlbGVjdGVkKSB7ICAgIC8vTWFrZXMgaXQgcG9zc2libGUgZm9yIHRoZSB1c2VyIHRvIG1vdmUgdGhlIHdpbmRvd1xuICAgICAgICBzZWxlY3RlZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnb25tb3VzZWRvd24nKTtcblxuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1ggPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1kgPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCk7ICAvL1NldHMgdGhlIHN0eWxpbmcgb2YgdGhlIHNlbGVjdGVkIHdpbmRvd1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IGV2ZW50LnBhZ2VYIC0gd2luZG93UG9zWDtcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gZXZlbnQucGFnZVkgLSB3aW5kb3dQb3NZOyAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSBvZmZzZXQgaXMgY2FsY3VsYXRlZCBzbyB0aGF0IHRoZSB3aW5kb3dzIHRvcCBsZWZ0IGNvcm5lciBkb2Vzbid0IFwianVtcFwiIHRvIHBvaW50ZXJcblxuICAgICAgICAgICAgbGV0IG1vdmVXaW5kb3cgPSBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWCA9IGUucGFnZVggLSBvZmZzZXRYO1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9ZID0gZS5wYWdlWSAtIG9mZnNldFk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AgPSBtb3ZlVG9ZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQgPSBtb3ZlVG9YICsgJ3B4JztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IHggPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnb25tb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlWmluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7ICAgICAgIC8vQ291bnRzIGFsbCBvcGVuIHdpbmRvd3MgaW4gdGhlIHdyYXBwZXJcblxuICAgICAgICAgICAgICAgIGxldCB6SW5kZXhDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHJlbW92ZVppbmRleC5sZW5ndGg7IGkgKyspeyAgICAgICAgICAgICAgICAgICAgICAvL0dpdmVzIGEgbmV3IHotaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvbyA9IHJlbW92ZVppbmRleFtpXS5zdHlsZS56SW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocGFyc2VJbnQoZm9vKSA+IHpJbmRleENvdW50KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIHppbmRleCBvZiB0aGUgY2xpY2tlZCB3aW5kb3cgaXMgaGlnaGVyIHRoYW4gdGhlIHppbmRleCBjb3VudGVyLCB6IGluZGV4IGNvdW50ZXIgZ2V0cyBhIG5ldyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4Q291bnQgPSBwYXJzZUludChmb28pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUuekluZGV4ID0gekluZGV4Q291bnQgKyAxO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdVSTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBNZW1vcnkgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgLy9UaGUgY29udGVudCBvZiB0aGUgd2luZG93IGNyZWF0ZWRcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGdhbWUtYXBwXG4gICAgICAgIHRoaXMucm93cyA9IDA7ICAgICAgLy9Ib3cgbWFueSByb3dzIG9mIGNhcmRzXG4gICAgICAgIHRoaXMuY29scyA9IDA7ICAgICAgLy9Ib3cgbWFueSBjb2x1bW5zIG9mIGNhcmRzXG4gICAgICAgIHRoaXMudHVybjE7ICAgICAgICAgLy9GaXJzdCBmbGlwcGVkIGNhcmRzXG4gICAgICAgIHRoaXMudHVybjI7ICAgICAgICAgLy9TZWNvbmQgZmxpcHBlZCBjYXJkXG4gICAgICAgIHRoaXMubGFzdFRpbGU7ICAgICAgLy9UaGUgbGFzdCB0aWxlIHRoYXQgd2FzIHR1cm5lZFxuICAgICAgICB0aGlzLnBhaXJzID0gMDsgICAgIC8vQ291bnRlciBmb3IgaG93IG1hbnkgcGFycyB0aGUgdXNlciBoYXNcbiAgICAgICAgdGhpcy50cmllcyA9IDA7ICAgICAvL1NvdW50ZXIgZm9yIGhvdyBtYW55IHRyaWVzIHRoZSB1c2VyIGhhdmUgbWFkZVxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVTZXR0aW5ncygpOyAvL1N0YXJ0cyBvZiBjYWxsaW5nIG9uIHRoaXMgZnVuY3Rpb25cbiAgICB9XG5cbiAgICBnYW1lQm9hcmQoY29scywgY29udGFpbmVyLCB0aWxlcykge1xuICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSAnJzsgICAgIC8vQ2xlYXJzIHRoZSBkaXZcblxuICAgICAgICBsZXQgYVRhZztcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVsxXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgc2NvcmVUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgbGV0IGRpdlNjb3JlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzY29yZVRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTsgICAgICAgICAgICAgICAgICAvL0ltcG9ydCB0aGUgdGVtcGxhdGUgZm9yIHRoZSBcInNjb3JlYm9hcmRcIlxuXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZTY29yZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGFUYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTsgICAgICAgLy9DcmVhdGVzIG5ldyB0aWxlcyBkZXBlbmRpbmcgb24gaG93IG1hbnkgdGlsZXMgdGhlIGNsaWVudCB3YW50c1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVtb3J5YnJpY2snKTtcblxuICAgICAgICAgICAgbGV0IHRpbGUgPSB0aWxlc1tpXTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBldmVudC50YXJnZXQuZmlyc3RDaGlsZC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudCA6IGV2ZW50LmZpcnN0Q2hpbGQ7ICAgIC8vQWRkcyBhbiBldmVudGxpc3RlbmVyIHRvIGV2ZXJ5IGVsZW1lbnRcblxuICAgICAgICAgICAgICAgIHRoaXMudHVybkJyaWNrKHRpbGUsIGV2ZW50LnRhcmdldC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZigoaSArIDEpICUgY29scyA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpOyAgICAgICAgLy9BZGRzIGEgQlIgc28gdGhhdCB0aGUgY2FyZHMgYXJlIG5lYXRseSBvcmdhbmlzZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBpY0FycmF5KHJvd3MsIGNvbHMpIHtcbiAgICAgICAgbGV0IGFyciA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKyl7ICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgYW1vdW50IG9mIGNhcmRzIHRoYXQgdGhlIGNsaWVudCBoYXMgY2hvc2VuXG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBsZXQgc2h1ZmZsZWRBcnIgPSBbXTtcblxuICAgICAgICB3aGlsZSAobikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TaHVmZmxlcyB0aGUgYXJyYXlcbiAgICAgICAgICAgIGxldCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbi0tKTtcbiAgICAgICAgICAgIHNodWZmbGVkQXJyLnB1c2goYXJyLnNwbGljZShpLCAxKVswXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2h1ZmZsZWRBcnI7ICAgICAvL1JldHVybnMgdGhlIHNodWZmbGVkIGFycmF5XG4gICAgfVxuXG4gICAgdHVybkJyaWNrKHRpbGUsIGltZykgeyAgICAgICAgICAvL1RoZSBnYW1lIGxvZ2ljXG4gICAgICAgIGlmKHRoaXMudHVybjIpeyAgICAgLy9QcmV2ZW50cyBzbyB0aGF0IHRoZSB1c2VyIGNhbiBjbGljayBvbiBhIDNyZCBvciBtb3JlIGNhcmRzXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbWcuc3JjID0gJy9pbWFnZS8nICsgdGlsZSArICcucG5nJzsgICAgICAgICAgICAgICAgLy9TZXRzIHRoZSBzb3VyY2Ugb2YgdGhlIHBpY1xuICAgICAgICBsZXQgbWVzc2FnZSA9IHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICBpZighdGhpcy50dXJuMSl7XG4gICAgICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZihpbWcgPT09IHRoaXMudHVybjEpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJpZXMgKz0gMTtcbiAgICAgICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1lvdSBoYXZlIG1hZGUgJyArIHRoaXMudHJpZXMgKyAnIHRyaWVzIHNvIGZhciEnKTtcblxuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0KTtcblxuICAgICAgICAgICAgaWYodGlsZSA9PT0gdGhpcy5sYXN0VGlsZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wYWlycyA9PT0gKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aW1lT3V0ID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnWW91IG9ubHkgbmVlZGVkICcgKyB0aGlzLnRyaWVzICsgJyB0cmllcyB0byB3aW4hIENsaWNrIG9uIHRoZSBzZXR0aW5ncyBhbmQgc3RhcnQgYSBuZXcgZ2FtZSEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRpbWVPdXQgPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdwYWlyJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdwYWlyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgfSw1MDApO1xuXG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBlID0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnNyYyA9ICcvaW1hZ2UvMC5wbmcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnNyYyA9ICcvaW1hZ2UvMC5wbmcnO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9LCA1MDApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVHYW1lU2V0dGluZ3MoKXtcbiAgICAgICAgaWYodGhpcy5yb3dzID09PSAwKXsgICAgICAgIC8vSWYgdGhlIHVzZXIgaGFzbid0IGNob3NlbiBhbnkgY2FyZCBmb3IgdGhlIGdhbWUsIGFuIGluc3RydWN0aW9uIG9uIGhvdyB0byBzdGFydCB0aGUgZ2FtZSBpcyBzaG93blxuICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgPT09IDEpeyAvL0NoZWNrcyBpZiB0aGUgdXNlciBoYXIgY2xpY2tlZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHRoZW4gaW1wb3J0IHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMl0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7ICAgICAgICAvL0lmIGFueSBvZiB0aGUgb3B0aW9ucyBpcyBjbGlja2VkLCByZXNldCBldmVyeXRoaW5nIGFuZCBzdGFydCBhIG5ldyBnYW1lXG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gdW5kZWZpbmVkKXsgICAgICAgLy9JZiB0aGUgdXNlciBhY2NpZGVudGFsbHkgY2xpY2tzIG91dHNpZGUsIGlnbm9yZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWlycyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd3MgPSBldmVudC50YXJnZXQudmFsdWVbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29scyA9IGV2ZW50LnRhcmdldC52YWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcyA9IHRoaXMucGljQXJyYXkodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZCh0aGlzLmNvbHMsIHRoaXMuY29udGVudCwgdGhpcy50aWxlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdiwgY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihjb3VudCAlIDIgPT09IDApeyAvL0lmIHRoaXMgaXMgdGhlIHNlY29uZCB0aW1lIChldmVuKSBjbGlja2VkLCBoaWRlIHRoZSBzZXR0aW5nc1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlOyAgLy9JZiB0aGlzIGlzIGEgdGhpcmQgdGltZSAodW5ldmVuKSBjbGlja2VkLCBkaXNwbGF5IHRoZSBzZXR0aW5ncyBhZ2FpblxuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzNdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7ICAvL0ltcG9ydHMgdGhlIGluc3RydWN0aW9ucyBvbiBob3cgdG8gc3RhcnQgdGhlIGdhbWVcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqXG4gKiBUb0RvIGNsb3NlIHNvY2tldCB3aGVuIHdpbmRvdyBpcyBjbG9zZWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBDaGF0IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkOyAgICAgIC8vTGV0cyB0aGUgYXBwIGtub3cgd2hpY2ggd2luZG93IGlzIHdoaWNoXG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgLy9UaGUgdG9wYmFyIG9mIHRoZSBjaGF0LWFwcFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXRTZXR0aW5ncygpOyAgICAgICAgICAvL1N0YXJ0cyB3aXRoIGNhbGxpbmcgb24gdGVoIHNldHRpbmdzIGZ1bmN0aW9uXG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJzsgICAgICAgICAgICAgICAgIC8vQ2hhdG5hbWUgaXMgc2V0IHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gJyc7ICAgICAgICAgICAvL1NlbmRlcnMgbmFtZSBpcyBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgIHRoaXMuZW50ZXJOYW1lKCk7ICAgICAgICAgICAgICAgICAgIC8vU3RhcnRzIHRoZSBlbnRlciBuYW1lXG4gICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlOyAgICAgIC8vT3B0aW9uIHRvIHVzZSB0aGUgXCJzZWNyZXQgbGFuZ1wiXG4gICAgfVxuICAgIGVudGVyTmFtZSgpIHtcbiAgICAgICAgbGV0IHVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7XG5cbiAgICAgICAgaWYodXNlck5hbWUgIT09IG51bGwpe1xuICAgICAgICAgICAgdXNlck5hbWUgPSBKU09OLnBhcnNlKHVzZXJOYW1lKTsgICAgICAgICAgICAvL0lmIHRoZSBuYW1lIGlzbnQgbnVsbCwgY2FsbHMgaW4gdGhlIGNoYXRBcHAgZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuY2hhdE5hbWUgPSB1c2VyTmFtZS51c2VybmFtZTtcbiAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpO1xuXG4gICAgICAgIH1lbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgbnVsbCwgY3JlYXRlIGEgb3B0aW9uIHRvIHBpY2sgYSBuYW1lXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlOyAgICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZSBmb3Igc29tZSBzdGFuZGFyZCBydWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOb3QgYSB2YWxpZCB1c2VybmFtZSEnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTsgICAgIC8vSWYgdGhlIHVzZXJuYW1lIGlzIHZhbGlkLCBhZGQgdGhlIGNob29zZW4gdXNlcm5hbWUgdG8gTFNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnOyAgICAgICAgICAgICAgICAgICAgLy9DbGVhciB0aGUgZGl2XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgY2hhdEFwcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhdEFwcCgpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvJyk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAgZXZlbnQgPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL09wZW5zIHVwIGEgbmV3IHNvY2tldCBhbmQgc3RhcnRzIHJlY2VpdmluZyB0aGUgbWVzc2FnZXNcbiAgICAgICAgICAgIHRoaXMucmVjaWV2ZU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZm9ybURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBlbGVtZW50cyBuZWNlc3NhcnkgZm9yIHRoZSBjaGF0LWFwcFxuICAgICAgICBsZXQgc2VuZEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBsZXQgc2VuZEFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHRoaXMudGV4dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGhpcy50ZXh0RmllbGQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0ZXh0ZmllbGQnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBzdHlsaW5nXG4gICAgICAgIGZvcm1EaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0U3R5bGVzJyk7XG4gICAgICAgIGZvcm1UYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdmb3Jtc3R5bGUnKTtcbiAgICAgICAgaW5wdXRUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0aW5wdXQnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kaWNvbicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGFrZXMgYSBpbWFnZSBhbmQgdXNlcyBpdCB0byBzZW5kIG1lc3NhZ2VzXG4gICAgICAgIHNlbmRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL3NlbmQucG5nJyk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcbiAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FwcGVuZHMgYWxsIHRoZSBuZXdseSBjcmVhdGVkIGVsZW1lbnRzXG4gICAgICAgIHNlbmRBVGFnLmFwcGVuZENoaWxkKHNlbmRJbWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKHNlbmRBVGFnKTtcbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGZvcm1EaXYpO1xuXG4gICAgICAgIGlucHV0VGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVudGVyLWtleSB3aGVuIHR5cGluZywgc2VuZCB0aGUgbWVzc2FnZSB3aGVuIHByZXNzZWRcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VuZEFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHNlbmQgaWNvbiB0byBzZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2hhdFNldHRpbmdzKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICBpZihjb3VudCA9PT0gMSl7IC8vQ2hlY2tzIGlmIHRoZSB1c2VyIGhhciBjbGlja2VkIGZvciB0aGUgZmlyc3QgdGltZSwgdGhlbiBjcmVhdGUgdGhlIG5lZWRlZCBlbGVtZW50c1xuICAgICAgICAgICAgICAgIGxldCBjaGF0U2V0dGluZ3NEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBsZXQgcm92YXJzcHJhayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnKE5vdCB2ZXJ5IHNlY3JldCknKTtcblxuICAgICAgICAgICAgICAgIGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdSw7Z2YXJzcHLDpWsnKSk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnbmFtZScsICdSw7Z2YXJzcHLDpWsnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCdpZCcsICdyb3ZhcnNwcmFrJyk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHNldHRpbmdzJyk7XG5cbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQocm92YXJzcHJhayk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNlY3JldExhbmdPcHRpb24gPT09IHRydWUpeyAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2tzIGlmIFLDtnZhcnNwcsOlayBpcyB0cnVlLCB0aGVuIHRoZSBib3ggc2hvdWxkIGJlIGNoZWNrZWRcbiAgICAgICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAvL0V2ZW50IGxpc3RlbmVyIG9uIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYocm92YXJzcHJhay5jaGVja2VkID09PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnROb2RlID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHBhcmVudE5vZGUuY2hpbGROb2RlcztcblxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNoYXRTZXR0aW5nc0RpdiwgY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihjb3VudCAlIDIgPT09IDApe1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlOyAgICAvL0lmIHRoaXMgaXMgdGhlIHNlY29uZCB0aW1lIChldmVuKSBjbGlja2VkLCBoaWRlIHRoZSBzZXR0aW5nc1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2hhdHNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlOyAgICAvL0lmIHRoaXMgaXMgYSB0aGlyZCB0aW1lICh1bmV2ZW4pIGNsaWNrZWQsIGRpc3BsYXkgdGhlIHNldHRpbmdzIGFnYWluXG4gICAgICAgICAgICAgICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGF0c2V0dGluZ3MnKS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VjcmV0TGFuZyh0ZXh0KSB7ICAgICAgICAgICAgICAgICAgLy9UaGUgbWVzc2FnZSB0dXJucyBpbnRvIGEgJ3NlY3JldCcgbWVzc2FnZVxuXG4gICAgICAgIGxldCBrb25zb25hbnRlciA9IFsnQicsICdiJywgJ0MnLCAnYycsICdEJywgJ2QnLCAnRicsICdmJywgJ0cnLCAnZycsICdIJywgJ2gnLCAnSicsICdqJywgJ0snLCAnaycsICdMJywgJ2wnLCAnTScsICdtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdOJywgJ24nLCAnUCcsICdwJywgJ1EnLCAncScsICdSJywgJ3InLCAnUycsICdzJywgICdUJywgJ3QnLCAnVicsICd2JywgJ1cnLCAndycsICdYJywgJ3gnLCAnWicsICd6J107XG5cbiAgICAgICAgbGV0IG5ld1N0cmluZyA9ICcnO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSArKyl7XG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwga29uc29uYW50ZXIubGVuZ3RoOyBqICsrKXtcbiAgICAgICAgICAgICAgICBpZih0ZXh0W2ldID09PSBrb25zb25hbnRlcltqXSl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyArPSB0ZXh0W2ldICsgJ28nOyAgICAgICAgICAgICAvL0FkZHMgYW4gJ28nIHRvIGFsbCBjb25zb25hbnRzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3U3RyaW5nICs9IHRleHRbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBzZW5kTWVzc2FnZShpbnB1dCl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2VuZHMgdGhlIG1lc3NhZ2UgYXMgSlNPTiB2aWEgd2Vic29ja2V0XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NoZWNrcyB0aGUgdXNlcm5hbWUgZXZlcnkgdGltZSBhIG1lc3NhZ2UgaXMgc2VudFxuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gSlNPTi5wYXJzZSh0aGlzLmNsaWVudFVzZXJOYW1lKTtcblxuICAgICAgICBpZiAodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXsgICAgICAgIC8vSWYgdGhlIHNlY3JldCBsYW5nIGlzIHNlbGN0ZWQsIGNvbnZlcnQgdGhlIG1lc3NhZ2VzXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuc2VjcmV0TGFuZyhpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcImRhdGFcIiA6IGlucHV0LFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lLFxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHJlY2lldmVNZXNzYWdlKGUpIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9XaGVuIG5ldyBtZXNzYWdlcyBpcyByZWNlaXZlZCwgZGlzcGxheSBpdCBpbiB0aGUgY2hhdCB3aW5kb3dcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7ICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhbGwgbmVjZXNzYXJ5IGVsZW1lbnRzXG4gICAgICAgIGxldCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLnVzZXJuYW1lICsgJzonKTtcbiAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgbGV0IHRleHRQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgIHRleHRQLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVzc2FnZWNvbnRlbnQnKTtcbiAgICAgICAgc2VuZGVyTmFtZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbmRlcm5hbWUnKTtcblxuICAgICAgICBpZihyZXNwb25zZS50eXBlICE9PSAnaGVhcnRiZWF0Jyl7XG4gICAgICAgICAgICBpZihyZXNwb25zZS51c2VybmFtZSA9PT0gdGhpcy5jbGllbnRVc2VyTmFtZS51c2VybmFtZSl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHVzZXJuYW1lIGlzIGVxdWFsIHRvIHRoZSBjbGllbnQgdXNlciBuYW1lLCBhZGQgY2xpZW50IGNsYXNzXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2xpZW50bWVzc2FnZScpXG4gICAgICAgICAgICB9ZWxzZSBpZihyZXNwb25zZS50eXBlID09PSAnbm90aWZpY2F0aW9uJyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgY2xhc3MgdG8gc2VydmVyIG1lc3NhZ2VzIHNvIHVzZXIgY2FuIHRlbGwgZGlmZmVyZW5jZVxuICAgICAgICAgICAgICAgIHNlbmRlck5hbWUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlcnZlcm1lc3NhZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHRoZSByZXBsaWVzIHdpdGggbmFtZXMgbm90IGVxdWFsIHRvIHRoZSBjbGllbnQgdXNlcm5hbWVcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0cmVwbHknKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZGVyTmFtZS5hcHBlbmRDaGlsZChzZW5kZXIpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChzZW5kZXJOYW1lKTtcblxuICAgICAgICAgICAgdGV4dFAuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHRleHRQKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChtZXNzYWdlKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLnNjcm9sbFRvcCA9IHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxIZWlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2Nyb2xscyBhbmQgc2hvd3MgdGhlIGxhdGVzdCBtZXNzYWdlIHJlY2VpdmVkXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjYuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoJy4vTmV3Q2hhdCcpO1xuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vTWVtb3J5Jyk7XG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vU2V0dGluZ3MnKTtcblxuY2xhc3MgTmV3RGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy53aW5kb3dBcHBDb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG4gICAgfVxuICAgIGFwcHMoKXtcbiAgICAgICAgbGV0IHNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpLnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyJyk7XG5cbiAgICAgICAgbGV0IGNoYXQgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNDaGF0Jyk7XG4gICAgICAgIGxldCBnYW1lID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjR2FtZScpO1xuICAgICAgICBsZXQgc2V0dGluZ3MgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNTZXR0aW5ncycpO1xuXG5cbiAgICAgICAgY2hhdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG5ldyBDaGF0KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7ICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYSBuZXcgY2hhdCB1cG9uIGEgY2xpY2ssIGNoYXQgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEd1aSBjcmVhdGluZyBhIG5ldyBjaGF0IHdpbmRvd1xuXG4gICAgICAgIGdhbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBuZXcgR2FtZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGdhbWUgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcblxuICAgICAgICBzZXR0aW5ncy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBuZXcgU2V0dGluZ3MoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0Rlc2t0b3A7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKi9cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIFNldHRpbmdzIGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkOyAgICAgICAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgZ2FtZS1hcHBcbiAgICAgICAgdGhpcy5jcmVhdGVTZXR0aW5nc0NvbnRlbnQoKTsgICAgICAgICAgICAgICAgICAgLy9TdGFydGluZyBwb2ludCBvZiB0aGUgYXBwXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB9XG4gICAgY3JlYXRlU2V0dGluZ3NDb250ZW50KCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJzsgICAgICAvL0NsZWFycyB0aGUgZGl2XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNV0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDsgIC8vSW1wb3J0cyB0aGUgdGVtcGxhdGUgbmVlZGVkXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpO1xuICAgICAgICB0aGlzLmNoZWNrVXNlck5hbWUodXNlcm5hbWUpOyAgICAgICAvL0NoZWNrcyB0aGUgdXNlcm5hbWVcbiAgICB9XG4gICAgY2hlY2tVc2VyTmFtZSh1c2VybmFtZSkge1xuICAgICAgICBsZXQgY2xpZW50VXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTsgICAgICAvL0NoZWNrcyBsb2NhbCBzdG9yYWdlIGZvciBhIHVzZXJuYW1lXG5cbiAgICAgICAgbGV0IG5hbWUgPSBKU09OLnBhcnNlKGNsaWVudFVzZXJOYW1lKTtcblxuICAgICAgICBpZihuYW1lID09PSBudWxsKXsgICAgICAvL0lmIHVzZXJuYW1lIGlzIG5vdCBkZWZpbmVkLCBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICBuYW1lID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZS51c2VybmFtZSk7ICAgICAvL1RoZSB1c2VybmFtZSBpcyBwdXQgaW4gYSBwIGVsZW1lbnRcblxuICAgICAgICBpZihwVGV4dC50ZXh0Q29udGVudCA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgcFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3VzZXJuYW1lTm90U2V0Jyk7ICAgICAgIC8vSWYgdGhlIHVzZXJuYW1lIGlzIHVuZGVmaW5lZCwgYWRkIHRoZSBjbGFzcyB1c2VybmFtZSBub3Qgc2V0XG4gICAgICAgIH1cblxuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgdXNlcm5hbWUuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKVswXTsgIC8vQWRkcyBhbiBldmVudCB0byB0aGUgZmlyc3QgYnV0dG9uIGluIHRoZSB3aW5kb3dcblxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG5cbiAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoIDw9IDAgfHwgaW5wdXRWYWx1ZS5sZW5ndGggPj0gMjUgfHwgaW5wdXRWYWx1ZSA9PT0gJ1RoZSBTZXJ2ZXInKXsgLy9DaGVja3MgdGhlIGlucHV0IHZhbHVlIGlmIGl0IGlzIGEgcHJvcGVyIHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTm90IGEgdmFsaWQgdXNlcm5hbWUhJyk7XG4gICAgICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgICAgICBwLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFVzZXJuYW1lID0ge3VzZXJuYW1lOiB0aGlzLnVzZXJOYW1lfTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTsgICAgIC8vSWYgdGhlIHVzZXJuYW1lIHBhc3NlcyB0aGUgcnVsZXMsIExTIGlzIHNldCB0byB0aGUgbmV3IG5hbWVcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNldHRpbmdzQ29udGVudCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUnVucyB0aGUgZnVuY3Rpb24gYWdhaW4gdG8gZGlzcGxheSB0aGUgYWN0aXZlIHVzZXJuYW1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzO1xuIiwiLyoqXG4gKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IE5ld0Rlc2t0b3AgPSByZXF1aXJlKCcuL05ld0Rlc2t0b3AnKTtcblxuY29uc3QgRGVza3RvcCA9IG5ldyBOZXdEZXNrdG9wKCk7XG5cbkRlc2t0b3AuYXBwcygpO1xuIl19
