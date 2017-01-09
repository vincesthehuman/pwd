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
        appWindow.style.zIndex = this.counter;

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

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left, 10);
            let windowPosY = parseInt(selected.parentNode.style.top, 10);  //Sets the styling of the selected window

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
        this.topBar.querySelector('.appsettings').addEventListener('click', event =>{
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
        });                 //Creates a new chat upon a click, chat will inherit structure from Gui creating a new chat window

        game.addEventListener('click', event =>{
            new Game(event.target.parentNode.id, this.windowAppCounter.length);
        });                 //Creates a new game upon a click, chat will inherit structure from Gui creating a new chat window

        settings.addEventListener('click', event => {
            new Settings(event.target.parentNode.id, this.windowAppCounter.length);
        });            //Creates a new chat upon a click, chat will inherit structure from Gui creating a new chat window
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjcuXG4gKlxuICogKiBUb0RvIE1ha2UgYSBndWkgdGhhdCBhbGwgdGhlIGFwcHMgaW5oZXJpdHMuXG4gKi9cblxuXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIEdVSXtcbiAgICBjb25zdHJ1Y3Rvcih3aW5kb3dBcHAsIGNvdW50ZXIpIHtcbiAgICAgICAgdGhpcy53aW5kb3dBcHAgPSB3aW5kb3dBcHA7ICAgICAgICAgICAgIC8vV2hhdCB0eXBlIG9mIHdpbmRvdyBpcyBiZWluZyBjcmVhdGVkXG4gICAgICAgIHRoaXMuY291bnRlciA9IGNvdW50ZXI7ICAgICAgICAgICAgICAgICAvL0EgY291bnRlciBmb3IgaG93IG1hbnkgd2luZG93cyB0aGVyZSBhcmVcbiAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5ndWkoKTtcbiAgICB9XG5cbiAgICBndWkoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVswXTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7ICAgICAgLy9TZWxlY3RzIHRoZSBmaXJzdCB0ZW1wbGF0ZSBhbmQgaW1wb3J0cyBpdCBmcm9tIHRoZSBpbmRleC5odG1sXG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMud2luZG93QXBwKTsgICAgLy9UaGUgbmFtZSBvZiB0aGUgd2luZG93XG4gICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy53aW5kb3dBcHAgKyB0aGlzLmNvdW50ZXIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB3aW5kb3cgaXMgZ2l2ZW4gYW4gaWQsIHdpdGggdHlwZSBhbmQgYSBudW1iZXJcbiAgICAgICAgdGhpcy50b3BCYXIgPSBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyB0aGlzLndpbmRvd0FwcCk7ICAgIC8vVGhlIHdpbmRvd3MgdG9wYmFyIGdldHMgYSBzaW1pbGFyIGlkXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA0NSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEwNSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7ICAgIC8vQWRkcyBhIFwiYm91bmNlXCIgdG8gdGhlIHdpbmRvd3NcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnpJbmRleCA9IHRoaXMuY291bnRlcjtcblxuICAgICAgICBhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9waWNvbicpLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS8nICsgdGhpcy53aW5kb3dBcHAgKyAnLnBuZycpOyAgICAgICAvL1RoZSBpY29uIGNvcnJlc3BvbmRzIHRvIHRoZSB0eXBlIG9mIHdpbmRvdyB0aGF0IGlzIGNob29zZW5cblxuICAgICAgICBpZih0aGlzLndpbmRvd0FwcCA9PT0gJ0dhbWUnIHx8IHRoaXMud2luZG93QXBwID09PSAnQ2hhdCcpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBzZXR0aW5ncyBvcHRpb25cbiAgICAgICAgICAgIHRoaXMuYXBwU2V0dGluZ3MoYXBwV2luZG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcjY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgIC8vQWRkcyB0aGUgZnVuY3Rpb24gdG8gY2xvc2UgYSB3aW5kb3dcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyB0aGUgZnVuY3Rpb24gdG8gbW92ZSBhIHdpbmRvd1xuXG4gICAgICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuXG4gICAgfVxuXG4gICAgY2xvc2Uobm9kZSkgeyAgICAgICAvL1JlbW92ZXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYXJlbnQgbm9kZSAodGhlIFdpbmRvdyBzZWxlY3RlZClcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgfVxuXG4gICAgYXBwU2V0dGluZ3MocG9zaXRpb24pIHtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvU2V0dGluZ3MucG5nJyk7ICAgLy9BZGRzIHRoZSBzZXR0aW5ncyBpY29uXG4gICAgfVxuXG4gICAgbW92ZShzZWxlY3RlZCkgeyAgICAvL01ha2VzIGl0IHBvc3NpYmxlIGZvciB0aGUgdXNlciB0byBtb3ZlIHRoZSB3aW5kb3dcbiAgICAgICAgc2VsZWN0ZWQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT57XG5cbiAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnb25tb3VzZWRvd24nKTtcblxuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1ggPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NZID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AsIDEwKTsgIC8vU2V0cyB0aGUgc3R5bGluZyBvZiB0aGUgc2VsZWN0ZWQgd2luZG93XG5cbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZXZlbnQucGFnZVggLSB3aW5kb3dQb3NYO1xuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBldmVudC5wYWdlWSAtIHdpbmRvd1Bvc1k7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhlIG9mZnNldCBpcyBjYWxjdWxhdGVkIHNvIHRoYXQgdGhlIHdpbmRvd3MgdG9wIGxlZnQgY29ybmVyIGRvZXNuJ3QgXCJqdW1wXCIgdG8gcG9pbnRlclxuXG4gICAgICAgICAgICBsZXQgbW92ZVdpbmRvdyA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9YID0gZS5wYWdlWCAtIG9mZnNldFg7XG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1kgPSBlLnBhZ2VZIC0gb2Zmc2V0WTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCA9IG1vdmVUb1kgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCA9IG1vdmVUb1ggKyAncHgnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHJlbW92ZUV2ZW50ID0geCA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdvbm1vdXNlZG93bicpO1xuICAgICAgICAgICAgICAgIGxldCByZW1vdmVaaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3cnKTsgICAgICAgLy9Db3VudHMgYWxsIG9wZW4gd2luZG93cyBpbiB0aGUgd3JhcHBlclxuXG4gICAgICAgICAgICAgICAgbGV0IHpJbmRleENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcmVtb3ZlWmluZGV4Lmxlbmd0aDsgaSArKyl7ICAgICAgICAgICAgICAgICAgICAgIC8vR2l2ZXMgYSBuZXcgei1pbmRleFxuICAgICAgICAgICAgICAgICAgICBsZXQgZm9vID0gcmVtb3ZlWmluZGV4W2ldLnN0eWxlLnpJbmRleDtcblxuICAgICAgICAgICAgICAgICAgICBpZihwYXJzZUludChmb28pID4gekluZGV4Q291bnQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgemluZGV4IG9mIHRoZSBjbGlja2VkIHdpbmRvdyBpcyBoaWdoZXIgdGhhbiB0aGUgemluZGV4IGNvdW50ZXIsIHogaW5kZXggY291bnRlciBnZXRzIGEgbmV3IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXhDb3VudCA9IHBhcnNlSW50KGZvbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS56SW5kZXggPSB6SW5kZXhDb3VudCArIDE7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR1VJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIE1lbW9yeSBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAvL1RoZSBjb250ZW50IG9mIHRoZSB3aW5kb3cgY3JlYXRlZFxuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkOyAgICAgICAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgZ2FtZS1hcHBcbiAgICAgICAgdGhpcy5yb3dzID0gMDsgICAgICAvL0hvdyBtYW55IHJvd3Mgb2YgY2FyZHNcbiAgICAgICAgdGhpcy5jb2xzID0gMDsgICAgICAvL0hvdyBtYW55IGNvbHVtbnMgb2YgY2FyZHNcbiAgICAgICAgdGhpcy50dXJuMTsgICAgICAgICAvL0ZpcnN0IGZsaXBwZWQgY2FyZHNcbiAgICAgICAgdGhpcy50dXJuMjsgICAgICAgICAvL1NlY29uZCBmbGlwcGVkIGNhcmRcbiAgICAgICAgdGhpcy5sYXN0VGlsZTsgICAgICAvL1RoZSBsYXN0IHRpbGUgdGhhdCB3YXMgdHVybmVkXG4gICAgICAgIHRoaXMucGFpcnMgPSAwOyAgICAgLy9Db3VudGVyIGZvciBob3cgbWFueSBwYXJzIHRoZSB1c2VyIGhhc1xuICAgICAgICB0aGlzLnRyaWVzID0gMDsgICAgIC8vU291bnRlciBmb3IgaG93IG1hbnkgdHJpZXMgdGhlIHVzZXIgaGF2ZSBtYWRlXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZVNldHRpbmdzKCk7IC8vU3RhcnRzIG9mIGNhbGxpbmcgb24gdGhpcyBmdW5jdGlvblxuICAgIH1cblxuICAgIGdhbWVCb2FyZChjb2xzLCBjb250YWluZXIsIHRpbGVzKSB7XG4gICAgICAgIGNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnOyAgICAgLy9DbGVhcnMgdGhlIGRpdlxuXG4gICAgICAgIGxldCBhVGFnO1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzFdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIGxldCBzY29yZVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVs0XS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgZGl2U2NvcmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHNjb3JlVGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgICAgICAgICAgICAgIC8vSW1wb3J0IHRoZSB0ZW1wbGF0ZSBmb3IgdGhlIFwic2NvcmVib2FyZFwiXG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdlNjb3JlKTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgYVRhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgICAvL0NyZWF0ZXMgbmV3IHRpbGVzIGRlcGVuZGluZyBvbiBob3cgbWFueSB0aWxlcyB0aGUgY2xpZW50IHdhbnRzXG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZW1vcnlicmljaycpO1xuXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVzW2ldO1xuXG4gICAgICAgICAgICBhVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IGV2ZW50LnRhcmdldC5maXJzdENoaWxkLm5vZGVOYW1lID09PSAnSU1HJyA/IGV2ZW50IDogZXZlbnQuZmlyc3RDaGlsZDsgICAgLy9BZGRzIGFuIGV2ZW50bGlzdGVuZXIgdG8gZXZlcnkgZWxlbWVudFxuXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgZXZlbnQudGFyZ2V0LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKChpICsgMSkgJSBjb2xzID09PSAwKXtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7ICAgICAgICAvL0FkZHMgYSBCUiBzbyB0aGF0IHRoZSBjYXJkcyBhcmUgbmVhdGx5IG9yZ2FuaXNlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGljQXJyYXkocm93cywgY29scykge1xuICAgICAgICBsZXQgYXJyID0gW107XG5cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSAocm93cyAqIGNvbHMpIC8gMjsgaSsrKXsgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhbiBhcnJheSB3aXRoIHRoZSBhbW91bnQgb2YgY2FyZHMgdGhhdCB0aGUgY2xpZW50IGhhcyBjaG9zZW5cbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbiA9IGFyci5sZW5ndGg7XG4gICAgICAgIGxldCBzaHVmZmxlZEFyciA9IFtdO1xuXG4gICAgICAgIHdoaWxlIChuKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NodWZmbGVzIHRoZSBhcnJheVxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuLS0pO1xuICAgICAgICAgICAgc2h1ZmZsZWRBcnIucHVzaChhcnIuc3BsaWNlKGksIDEpWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaHVmZmxlZEFycjsgICAgIC8vUmV0dXJucyB0aGUgc2h1ZmZsZWQgYXJyYXlcbiAgICB9XG5cbiAgICB0dXJuQnJpY2sodGlsZSwgaW1nKSB7ICAgICAgICAgIC8vVGhlIGdhbWUgbG9naWNcbiAgICAgICAgaWYodGhpcy50dXJuMil7ICAgICAvL1ByZXZlbnRzIHNvIHRoYXQgdGhlIHVzZXIgY2FuIGNsaWNrIG9uIGEgM3JkIG9yIG1vcmUgY2FyZHNcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5zcmMgPSAnL2ltYWdlLycgKyB0aWxlICsgJy5wbmcnOyAgICAgICAgICAgICAgICAvL1NldHMgdGhlIHNvdXJjZSBvZiB0aGUgcGljXG4gICAgICAgIGxldCBtZXNzYWdlID0gdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgIGlmKCF0aGlzLnR1cm4xKXtcbiAgICAgICAgICAgIHRoaXMudHVybjEgPSBpbWc7XG4gICAgICAgICAgICB0aGlzLmxhc3RUaWxlID0gdGlsZTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGlmKGltZyA9PT0gdGhpcy50dXJuMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50cmllcyArPSAxO1xuICAgICAgICAgICAgdGhpcy50dXJuMiA9IGltZztcblxuICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnWW91IGhhdmUgbWFkZSAnICsgdGhpcy50cmllcyArICcgdHJpZXMgc28gZmFyIScpO1xuXG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICAgICAgICBpZih0aWxlID09PSB0aGlzLmxhc3RUaWxlKXtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaXJzICs9IDE7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnBhaXJzID09PSAodGhpcy5yb3dzICogdGhpcy5jb2xzKSAvIDIpe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1lvdSBvbmx5IG5lZWRlZCAnICsgdGhpcy50cmllcyArICcgdHJpZXMgdG8gd2luISBDbGljayBvbiB0aGUgc2V0dGluZ3MgYW5kIHN0YXJ0IGEgbmV3IGdhbWUhJyk7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZU91dCA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB9LDUwMCk7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoIGUgPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUdhbWVTZXR0aW5ncygpe1xuICAgICAgICBpZih0aGlzLnJvd3MgPT09IDApeyAgICAgICAgLy9JZiB0aGUgdXNlciBoYXNuJ3QgY2hvc2VuIGFueSBjYXJkIGZvciB0aGUgZ2FtZSwgYW4gaW5zdHJ1Y3Rpb24gb24gaG93IHRvIHN0YXJ0IHRoZSBnYW1lIGlzIHNob3duXG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgPT09IDEpeyAvL0NoZWNrcyBpZiB0aGUgdXNlciBoYXIgY2xpY2tlZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHRoZW4gaW1wb3J0IHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMl0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7ICAgICAgICAvL0lmIGFueSBvZiB0aGUgb3B0aW9ucyBpcyBjbGlja2VkLCByZXNldCBldmVyeXRoaW5nIGFuZCBzdGFydCBhIG5ldyBnYW1lXG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gdW5kZWZpbmVkKXsgICAgICAgLy9JZiB0aGUgdXNlciBhY2NpZGVudGFsbHkgY2xpY2tzIG91dHNpZGUsIGlnbm9yZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWlycyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd3MgPSBldmVudC50YXJnZXQudmFsdWVbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29scyA9IGV2ZW50LnRhcmdldC52YWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcyA9IHRoaXMucGljQXJyYXkodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZCh0aGlzLmNvbHMsIHRoaXMuY29udGVudCwgdGhpcy50aWxlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdiwgY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihjb3VudCAlIDIgPT09IDApeyAvL0lmIHRoaXMgaXMgdGhlIHNlY29uZCB0aW1lIChldmVuKSBjbGlja2VkLCBoaWRlIHRoZSBzZXR0aW5nc1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlOyAgLy9JZiB0aGlzIGlzIGEgdGhpcmQgdGltZSAodW5ldmVuKSBjbGlja2VkLCBkaXNwbGF5IHRoZSBzZXR0aW5ncyBhZ2FpblxuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZXNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzNdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7ICAvL0ltcG9ydHMgdGhlIGluc3RydWN0aW9ucyBvbiBob3cgdG8gc3RhcnQgdGhlIGdhbWVcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqXG4gKiBUb0RvIGNsb3NlIHNvY2tldCB3aGVuIHdpbmRvdyBpcyBjbG9zZWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBDaGF0IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkOyAgICAgIC8vTGV0cyB0aGUgYXBwIGtub3cgd2hpY2ggd2luZG93IGlzIHdoaWNoXG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgLy9UaGUgdG9wYmFyIG9mIHRoZSBjaGF0LWFwcFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXRTZXR0aW5ncygpOyAgICAgICAgICAvL1N0YXJ0cyB3aXRoIGNhbGxpbmcgb24gdGVoIHNldHRpbmdzIGZ1bmN0aW9uXG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJzsgICAgICAgICAgICAgICAgIC8vQ2hhdG5hbWUgaXMgc2V0IHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gJyc7ICAgICAgICAgICAvL1NlbmRlcnMgbmFtZSBpcyBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgIHRoaXMuZW50ZXJOYW1lKCk7ICAgICAgICAgICAgICAgICAgIC8vU3RhcnRzIHRoZSBlbnRlciBuYW1lXG4gICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlOyAgICAgIC8vT3B0aW9uIHRvIHVzZSB0aGUgXCJzZWNyZXQgbGFuZ1wiXG4gICAgfVxuICAgIGVudGVyTmFtZSgpIHtcbiAgICAgICAgbGV0IHVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7XG5cbiAgICAgICAgaWYodXNlck5hbWUgIT09IG51bGwpe1xuICAgICAgICAgICAgdXNlck5hbWUgPSBKU09OLnBhcnNlKHVzZXJOYW1lKTsgICAgICAgICAgICAvL0lmIHRoZSBuYW1lIGlzbnQgbnVsbCwgY2FsbHMgaW4gdGhlIGNoYXRBcHAgZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuY2hhdE5hbWUgPSB1c2VyTmFtZS51c2VybmFtZTtcbiAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpO1xuXG4gICAgICAgIH1lbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgbnVsbCwgY3JlYXRlIGEgb3B0aW9uIHRvIHBpY2sgYSBuYW1lXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlOyAgICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZSBmb3Igc29tZSBzdGFuZGFyZCBydWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOb3QgYSB2YWxpZCB1c2VybmFtZSEnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHApO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTsgICAgIC8vSWYgdGhlIHVzZXJuYW1lIGlzIHZhbGlkLCBhZGQgdGhlIGNob29zZW4gdXNlcm5hbWUgdG8gTFNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnOyAgICAgICAgICAgICAgICAgICAgLy9DbGVhciB0aGUgZGl2XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgY2hhdEFwcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhdEFwcCgpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvJyk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAgZXZlbnQgPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL09wZW5zIHVwIGEgbmV3IHNvY2tldCBhbmQgc3RhcnRzIHJlY2VpdmluZyB0aGUgbWVzc2FnZXNcbiAgICAgICAgICAgIHRoaXMucmVjaWV2ZU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZm9ybURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBlbGVtZW50cyBuZWNlc3NhcnkgZm9yIHRoZSBjaGF0LWFwcFxuICAgICAgICBsZXQgc2VuZEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBsZXQgc2VuZEFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHRoaXMudGV4dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGhpcy50ZXh0RmllbGQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0ZXh0ZmllbGQnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBzdHlsaW5nXG4gICAgICAgIGZvcm1EaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0U3R5bGVzJyk7XG4gICAgICAgIGZvcm1UYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdmb3Jtc3R5bGUnKTtcbiAgICAgICAgaW5wdXRUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0aW5wdXQnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kaWNvbicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGFrZXMgYSBpbWFnZSBhbmQgdXNlcyBpdCB0byBzZW5kIG1lc3NhZ2VzXG4gICAgICAgIHNlbmRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL3NlbmQucG5nJyk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMudGV4dEZpZWxkKTtcbiAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FwcGVuZHMgYWxsIHRoZSBuZXdseSBjcmVhdGVkIGVsZW1lbnRzXG4gICAgICAgIHNlbmRBVGFnLmFwcGVuZENoaWxkKHNlbmRJbWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKHNlbmRBVGFnKTtcbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGZvcm1EaXYpO1xuXG4gICAgICAgIGlucHV0VGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVudGVyLWtleSB3aGVuIHR5cGluZywgc2VuZCB0aGUgbWVzc2FnZSB3aGVuIHByZXNzZWRcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VuZEFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHNlbmQgaWNvbiB0byBzZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2hhdFNldHRpbmdzKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgPT09IDEpeyAvL0NoZWNrcyBpZiB0aGUgdXNlciBoYXIgY2xpY2tlZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHRoZW4gY3JlYXRlIHRoZSBuZWVkZWQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFNldHRpbmdzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbGV0IHJvdmFyc3ByYWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyhOb3QgdmVyeSBzZWNyZXQpJyk7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUsO2dmFyc3Byw6VrJykpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnUsO2dmFyc3Byw6VrJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnaWQnLCAncm92YXJzcHJhaycpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRzZXR0aW5ncycpO1xuXG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHJvdmFyc3ByYWspO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgICAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXsgICAgICAgICAgICAgICAgICAgICAvL0NoZWNrcyBpZiBSw7Z2YXJzcHLDpWsgaXMgdHJ1ZSwgdGhlbiB0aGUgYm94IHNob3VsZCBiZSBjaGVja2VkXG4gICAgICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgLy9FdmVudCBsaXN0ZW5lciBvbiB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmKHJvdmFyc3ByYWsuY2hlY2tlZCA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBwYXJlbnROb2RlLmNoaWxkTm9kZXM7XG5cbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGF0U2V0dGluZ3NEaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY291bnQgJSAyID09PSAwKXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTsgICAgLy9JZiB0aGlzIGlzIHRoZSBzZWNvbmQgdGltZSAoZXZlbikgY2xpY2tlZCwgaGlkZSB0aGUgc2V0dGluZ3NcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTsgICAgLy9JZiB0aGlzIGlzIGEgdGhpcmQgdGltZSAodW5ldmVuKSBjbGlja2VkLCBkaXNwbGF5IHRoZSBzZXR0aW5ncyBhZ2FpblxuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2hhdHNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlY3JldExhbmcodGV4dCkgeyAgICAgICAgICAgICAgICAgIC8vVGhlIG1lc3NhZ2UgdHVybnMgaW50byBhICdzZWNyZXQnIG1lc3NhZ2VcblxuICAgICAgICBsZXQga29uc29uYW50ZXIgPSBbJ0InLCAnYicsICdDJywgJ2MnLCAnRCcsICdkJywgJ0YnLCAnZicsICdHJywgJ2cnLCAnSCcsICdoJywgJ0onLCAnaicsICdLJywgJ2snLCAnTCcsICdsJywgJ00nLCAnbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnTicsICduJywgJ1AnLCAncCcsICdRJywgJ3EnLCAnUicsICdyJywgJ1MnLCAncycsICAnVCcsICd0JywgJ1YnLCAndicsICdXJywgJ3cnLCAnWCcsICd4JywgJ1onLCAneiddO1xuXG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSAnJztcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkgKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGtvbnNvbmFudGVyLmxlbmd0aDsgaiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGV4dFtpXSA9PT0ga29uc29uYW50ZXJbal0pe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXSArICdvJzsgICAgICAgICAgICAgLy9BZGRzIGFuICdvJyB0byBhbGwgY29uc29uYW50c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1N0cmluZyArPSB0ZXh0W2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgc2VuZE1lc3NhZ2UoaW5wdXQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NlbmRzIHRoZSBtZXNzYWdlIGFzIEpTT04gdmlhIHdlYnNvY2tldFxuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVja3MgdGhlIHVzZXJuYW1lIGV2ZXJ5IHRpbWUgYSBtZXNzYWdlIGlzIHNlbnRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IEpTT04ucGFyc2UodGhpcy5jbGllbnRVc2VyTmFtZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9PT0gdHJ1ZSl7ICAgICAgICAvL0lmIHRoZSBzZWNyZXQgbGFuZyBpcyBzZWxjdGVkLCBjb252ZXJ0IHRoZSBtZXNzYWdlc1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLnNlY3JldExhbmcoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBpbnB1dCxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy5jbGllbnRVc2VyTmFtZS51c2VybmFtZSxcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICByZWNpZXZlTWVzc2FnZShlKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2hlbiBuZXcgbWVzc2FnZXMgaXMgcmVjZWl2ZWQsIGRpc3BsYXkgaXQgaW4gdGhlIGNoYXQgd2luZG93XG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYWxsIG5lY2Vzc2FyeSBlbGVtZW50c1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS51c2VybmFtZSArICc6Jyk7XG4gICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIGxldCB0ZXh0UCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgICB0ZXh0UC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lc3NhZ2Vjb250ZW50Jyk7XG4gICAgICAgIHNlbmRlck5hbWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kZXJuYW1lJyk7XG5cbiAgICAgICAgaWYocmVzcG9uc2UudHlwZSAhPT0gJ2hlYXJ0YmVhdCcpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB1c2VybmFtZSBpcyBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXIgbmFtZSwgYWRkIGNsaWVudCBjbGFzc1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NsaWVudG1lc3NhZ2UnKVxuICAgICAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09ICdUaGUgU2VydmVyJyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgY2xhc3MgdG8gc2VydmVyIG1lc3NhZ2VzIHNvIHVzZXIgY2FuIHRlbGwgZGlmZmVyZW5jZVxuICAgICAgICAgICAgICAgIHNlbmRlck5hbWUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlcnZlcm1lc3NhZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHRoZSByZXBsaWVzIHdpdGggbmFtZXMgbm90IGVxdWFsIHRvIHRoZSBjbGllbnQgdXNlcm5hbWVcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0cmVwbHknKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZGVyTmFtZS5hcHBlbmRDaGlsZChzZW5kZXIpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChzZW5kZXJOYW1lKTtcblxuICAgICAgICAgICAgdGV4dFAuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHRleHRQKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChtZXNzYWdlKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLnNjcm9sbFRvcCA9IHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxIZWlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2Nyb2xscyBhbmQgc2hvd3MgdGhlIGxhdGVzdCBtZXNzYWdlIHJlY2VpdmVkXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjYuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoJy4vTmV3Q2hhdCcpO1xuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vTWVtb3J5Jyk7XG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vU2V0dGluZ3MnKTtcblxuY2xhc3MgTmV3RGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy53aW5kb3dBcHBDb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG4gICAgfVxuICAgIGFwcHMoKXtcbiAgICAgICAgbGV0IHNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpLnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyJyk7XG5cbiAgICAgICAgbGV0IGNoYXQgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNDaGF0Jyk7XG4gICAgICAgIGxldCBnYW1lID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjR2FtZScpO1xuICAgICAgICBsZXQgc2V0dGluZ3MgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNTZXR0aW5ncycpO1xuXG5cbiAgICAgICAgY2hhdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICBuZXcgQ2hhdChldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGNoYXQgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcblxuICAgICAgICBnYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBuZXcgR2FtZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGdhbWUgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcblxuICAgICAgICBzZXR0aW5ncy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIG5ldyBTZXR0aW5ncyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0Rlc2t0b3A7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKi9cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIFNldHRpbmdzIGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkOyAgICAgICAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgZ2FtZS1hcHBcbiAgICAgICAgdGhpcy5jcmVhdGVTZXR0aW5nc0NvbnRlbnQoKTsgICAgICAgICAgICAgICAgICAgLy9TdGFydGluZyBwb2ludCBvZiB0aGUgYXBwXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB9XG4gICAgY3JlYXRlU2V0dGluZ3NDb250ZW50KCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJzsgICAgICAvL0NsZWFycyB0aGUgZGl2XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNV0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDsgIC8vSW1wb3J0cyB0aGUgdGVtcGxhdGUgbmVlZGVkXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpO1xuICAgICAgICB0aGlzLmNoZWNrVXNlck5hbWUodXNlcm5hbWUpOyAgICAgICAvL0NoZWNrcyB0aGUgdXNlcm5hbWVcbiAgICB9XG4gICAgY2hlY2tVc2VyTmFtZSh1c2VybmFtZSkge1xuICAgICAgICBsZXQgY2xpZW50VXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTsgICAgICAvL0NoZWNrcyBsb2NhbCBzdG9yYWdlIGZvciBhIHVzZXJuYW1lXG5cbiAgICAgICAgbGV0IG5hbWUgPSBKU09OLnBhcnNlKGNsaWVudFVzZXJOYW1lKTtcblxuICAgICAgICBpZihuYW1lID09PSBudWxsKXsgICAgICAvL0lmIHVzZXJuYW1lIGlzIG5vdCBkZWZpbmVkLCBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICBuYW1lID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZS51c2VybmFtZSk7ICAgICAvL1RoZSB1c2VybmFtZSBpcyBwdXQgaW4gYSBwIGVsZW1lbnRcblxuICAgICAgICBpZihwVGV4dC50ZXh0Q29udGVudCA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgcFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3VzZXJuYW1lTm90U2V0Jyk7ICAgICAgIC8vSWYgdGhlIHVzZXJuYW1lIGlzIHVuZGVmaW5lZCwgYWRkIHRoZSBjbGFzcyB1c2VybmFtZSBub3Qgc2V0XG4gICAgICAgIH1cblxuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgdXNlcm5hbWUuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgbGV0IGJ1dHRvbiA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKVswXTsgIC8vQWRkcyBhbiBldmVudCB0byB0aGUgZmlyc3QgYnV0dG9uIGluIHRoZSB3aW5kb3dcblxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG5cbiAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoIDw9IDAgfHwgaW5wdXRWYWx1ZS5sZW5ndGggPj0gMjUgfHwgaW5wdXRWYWx1ZSA9PT0gJ1RoZSBTZXJ2ZXInKXsgLy9DaGVja3MgdGhlIGlucHV0IHZhbHVlIGlmIGl0IGlzIGEgcHJvcGVyIHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTm90IGEgdmFsaWQgdXNlcm5hbWUhJyk7XG4gICAgICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgICAgICBwLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFVzZXJuYW1lID0ge3VzZXJuYW1lOiB0aGlzLnVzZXJOYW1lfTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTsgICAgIC8vSWYgdGhlIHVzZXJuYW1lIHBhc3NlcyB0aGUgcnVsZXMsIExTIGlzIHNldCB0byB0aGUgbmV3IG5hbWVcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNldHRpbmdzQ29udGVudCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUnVucyB0aGUgZnVuY3Rpb24gYWdhaW4gdG8gZGlzcGxheSB0aGUgYWN0aXZlIHVzZXJuYW1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzO1xuIiwiLyoqXG4gKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IE5ld0Rlc2t0b3AgPSByZXF1aXJlKCcuL05ld0Rlc2t0b3AnKTtcblxuY29uc3QgRGVza3RvcCA9IG5ldyBOZXdEZXNrdG9wKCk7XG5cbkRlc2t0b3AuYXBwcygpO1xuIl19
