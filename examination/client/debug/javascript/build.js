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
        pTag.setAttribute('class', this.windowApp + 'title');
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
        this.windowContent = document.getElementById(name+count).lastElementChild;            //The content of the window created
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
        this.windowContent = document.getElementById(name+count).lastElementChild;      //Lets the app know which window is which
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
            img.setAttribute('src', '/image/accept.png');
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
                let inputValue = this.windowContent.querySelector('input').value;         //Checks the username for some standard rules

                if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){
                    let text = document.createTextNode('Not a valid username!');
                    let p = document.createElement('p');

                    p.appendChild(text);
                    this.windowContent.appendChild(p);
                }else{
                    this.userName = this.windowContent.querySelector('input').value;
                    let chatUsername = {username: this.userName};
                    localStorage.setItem('ChatUser', JSON.stringify(chatUsername));     //If the username is valid, add the choosen username to LS
                    this.chatName = inputValue;
                    this.windowContent.classList.remove('enterusername');
                    this.windowContent.textContent = '';                    //Clear the div
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

        this.windowContent.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);                                                                                   //Appends all the newly created elements
        sendATag.appendChild(sendImg);
        formDiv.appendChild(sendATag);
        this.windowContent.appendChild(formDiv);

        inputTag.addEventListener('keydown', event =>{                                                                  //Adds an event listener to the enter-key when typing, send the message when pressed
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

        sendATag.addEventListener('click', event =>{                                                                        //Adds an event listener to the send icon to send message
            let clearInput = this.windowContent.querySelector('textarea');
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

            this.windowContent.firstElementChild.appendChild(div);
        }
        this.windowContent.firstElementChild.scrollTop = this.windowContent.firstElementChild.scrollHeight;                         //Scrolls and shows the latest message received
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
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.createChatSettingsContent();                   //Starting point of the app
        this.changeTheme();
        this.message = document.createElement('p');
    }
    createChatSettingsContent() {
        // if(this.windowContent.querySelector('.settingsContent').firstElementChild !== null){
        //     this.windowContent.removeChild(this.windowContent.querySelector('.settingsContent'));     //Clears the div
        // }

        let template = document.querySelectorAll('template')[5].content;  //Imports the template needed
        let div = document.importNode(template, true);

        this.windowContent.appendChild(div);
        let username = this.windowContent.querySelector('#username');
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

        let button = this.windowContent.querySelectorAll('button')[0];  //Adds an event to the first button in the window

        let input = this.windowContent.querySelector('input');

        input.addEventListener('keydown', event =>{                                                                  //Adds an event listener to the enter-key when typing, send the message when pressed
            if (event.which === 13){
                this.verifyUsername(input);
            }
        });

        button.addEventListener('click', event =>{
            this.verifyUsername(input);
        });
    }

    verifyUsername(input){
        if(input.value.length <= 0 || input.value.length >= 25 || input.value === 'The Server'){ //Checks the input value if it is a proper username
            let text = document.createTextNode('Not a valid username!');
            let p = document.createElement('p');

            p.appendChild(text);
            this.windowContent.appendChild(p);
        }else{
            this.userName = this.windowContent.querySelector('input').value;
            let chatUsername = {username: this.userName};
            localStorage.setItem('ChatUser', JSON.stringify(chatUsername));     //If the username passes the rules, LS is set to the new name
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
                wrapper.style.background = 'url("/image/jakethedog.png") center';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yNy5cbiAqXG4gKiAqIFRvRG8gTWFrZSBhIGd1aSB0aGF0IGFsbCB0aGUgYXBwcyBpbmhlcml0cy5cbiAqL1xuXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgR1VJe1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvd0FwcCwgY291bnRlcikge1xuICAgICAgICB0aGlzLndpbmRvd0FwcCA9IHdpbmRvd0FwcDsgICAgICAgICAgICAgLy9XaGF0IHR5cGUgb2Ygd2luZG93IGlzIGJlaW5nIGNyZWF0ZWRcbiAgICAgICAgdGhpcy5jb3VudGVyID0gY291bnRlcjsgICAgICAgICAgICAgICAgIC8vQSBjb3VudGVyIGZvciBob3cgbWFueSB3aW5kb3dzIHRoZXJlIGFyZVxuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuXG4gICAgZ3VpKCl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbMF07XG4gICAgICAgIGxldCBhcHBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgIC8vU2VsZWN0cyB0aGUgZmlyc3QgdGVtcGxhdGUgYW5kIGltcG9ydHMgaXQgZnJvbSB0aGUgaW5kZXguaHRtbFxuXG4gICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBwVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aGlzLndpbmRvd0FwcCArICd0aXRsZScpO1xuICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLndpbmRvd0FwcCk7ICAgIC8vVGhlIG5hbWUgb2YgdGhlIHdpbmRvd1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGUgd2luZG93IGlzIGdpdmVuIGFuIGlkLCB3aXRoIHR5cGUgYW5kIGEgbnVtYmVyXG4gICAgICAgIHRoaXMudG9wQmFyID0gYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbmRvdyAnICsgdGhpcy53aW5kb3dBcHApOyAgICAvL1RoZSB3aW5kb3dzIHRvcGJhciBnZXRzIGEgc2ltaWxhciBpZFxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS50b3AgPSsgNDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9KyAxMDUgKiAodGhpcy5jb3VudGVyICsgMSkgKyAncHgnOyAgICAvL0FkZHMgYSBcImJvdW5jZVwiIHRvIHRoZSB3aW5kb3dzXG5cbiAgICAgICAgbGV0IHJlbW92ZVppbmRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpOyAgICAgICAvL0NvdW50cyBhbGwgb3BlbiB3aW5kb3dzIGluIHRoZSB3cmFwcGVyXG5cbiAgICAgICAgbGV0IHpJbmRleENvdW50ID0gMDtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHJlbW92ZVppbmRleC5sZW5ndGg7IGkgKyspIHsgICAgICAgICAgICAgICAgICAgICAgLy9HaXZlcyBhIG5ldyB6LWluZGV4XG4gICAgICAgICAgICBsZXQgZm9vID0gcmVtb3ZlWmluZGV4W2ldLnN0eWxlLnpJbmRleDtcblxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KGZvbykgPiB6SW5kZXhDb3VudCkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgemluZGV4IG9mIHRoZSBjbGlja2VkIHdpbmRvdyBpcyBoaWdoZXIgdGhhbiB0aGUgemluZGV4IGNvdW50ZXIsIHogaW5kZXggY291bnRlciBnZXRzIGEgbmV3IHZhbHVlXG4gICAgICAgICAgICAgICAgekluZGV4Q291bnQgPSBwYXJzZUludChmb28pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnpJbmRleCA9IHpJbmRleENvdW50O1xuXG4gICAgICAgIGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BpY29uJykuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlLycgKyB0aGlzLndpbmRvd0FwcCArICcucG5nJyk7ICAgICAgIC8vVGhlIGljb24gY29ycmVzcG9uZHMgdG8gdGhlIHR5cGUgb2Ygd2luZG93IHRoYXQgaXMgY2hvb3NlblxuXG4gICAgICAgIGlmKHRoaXMud2luZG93QXBwID09PSAnR2FtZScgfHwgdGhpcy53aW5kb3dBcHAgPT09ICdDaGF0Jyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIHNldHRpbmdzIG9wdGlvblxuICAgICAgICAgICAgdGhpcy5hcHBTZXR0aW5ncyhhcHBXaW5kb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgLy9BZGRzIHRoZSBmdW5jdGlvbiB0byBjbG9zZSBhIHdpbmRvd1xuICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudC50YXJnZXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmUoYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIHRoZSBmdW5jdGlvbiB0byBtb3ZlIGEgd2luZG93XG5cbiAgICAgICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGFwcFdpbmRvdyk7XG5cbiAgICB9XG5cbiAgICBjbG9zZShub2RlKSB7ICAgICAgIC8vUmVtb3ZlcyB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIHBhcmVudCBub2RlICh0aGUgV2luZG93IHNlbGVjdGVkKVxuICAgICAgICBub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICB9XG5cbiAgICBhcHBTZXR0aW5ncyhwb3NpdGlvbikge1xuICAgICAgICBwb3NpdGlvbi5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy53aW5kb3dBcHAgKyB0aGlzLmNvdW50ZXIpO1xuICAgICAgICBwb3NpdGlvbi5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9TZXR0aW5ncy5wbmcnKTsgICAvL0FkZHMgdGhlIHNldHRpbmdzIGljb25cbiAgICB9XG5cbiAgICBtb3ZlKHNlbGVjdGVkKSB7ICAgIC8vTWFrZXMgaXQgcG9zc2libGUgZm9yIHRoZSB1c2VyIHRvIG1vdmUgdGhlIHdpbmRvd1xuICAgICAgICBzZWxlY3RlZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnb25tb3VzZWRvd24nKTtcblxuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1ggPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQpO1xuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1kgPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCk7ICAvL1NldHMgdGhlIHN0eWxpbmcgb2YgdGhlIHNlbGVjdGVkIHdpbmRvd1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IGV2ZW50LnBhZ2VYIC0gd2luZG93UG9zWDtcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gZXZlbnQucGFnZVkgLSB3aW5kb3dQb3NZOyAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSBvZmZzZXQgaXMgY2FsY3VsYXRlZCBzbyB0aGF0IHRoZSB3aW5kb3dzIHRvcCBsZWZ0IGNvcm5lciBkb2Vzbid0IFwianVtcFwiIHRvIHBvaW50ZXJcblxuICAgICAgICAgICAgbGV0IG1vdmVXaW5kb3cgPSBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWCA9IGUucGFnZVggLSBvZmZzZXRYO1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9ZID0gZS5wYWdlWSAtIG9mZnNldFk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AgPSBtb3ZlVG9ZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQgPSBtb3ZlVG9YICsgJ3B4JztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IHggPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnb25tb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlWmluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7ICAgICAgIC8vQ291bnRzIGFsbCBvcGVuIHdpbmRvd3MgaW4gdGhlIHdyYXBwZXJcblxuICAgICAgICAgICAgICAgIGxldCB6SW5kZXhDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHJlbW92ZVppbmRleC5sZW5ndGg7IGkgKyspeyAgICAgICAgICAgICAgICAgICAgICAvL0dpdmVzIGEgbmV3IHotaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvbyA9IHJlbW92ZVppbmRleFtpXS5zdHlsZS56SW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYocGFyc2VJbnQoZm9vKSA+IHpJbmRleENvdW50KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIHppbmRleCBvZiB0aGUgY2xpY2tlZCB3aW5kb3cgaXMgaGlnaGVyIHRoYW4gdGhlIHppbmRleCBjb3VudGVyLCB6IGluZGV4IGNvdW50ZXIgZ2V0cyBhIG5ldyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4Q291bnQgPSBwYXJzZUludChmb28pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUuekluZGV4ID0gekluZGV4Q291bnQgKyAxO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdVSTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBNZW1vcnkgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMud2luZG93Q29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgLy9UaGUgY29udGVudCBvZiB0aGUgd2luZG93IGNyZWF0ZWRcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGdhbWUtYXBwXG4gICAgICAgIHRoaXMucm93cyA9IDA7ICAgICAgLy9Ib3cgbWFueSByb3dzIG9mIGNhcmRzXG4gICAgICAgIHRoaXMuY29scyA9IDA7ICAgICAgLy9Ib3cgbWFueSBjb2x1bW5zIG9mIGNhcmRzXG4gICAgICAgIHRoaXMudHVybjE7ICAgICAgICAgLy9GaXJzdCBmbGlwcGVkIGNhcmRzXG4gICAgICAgIHRoaXMudHVybjI7ICAgICAgICAgLy9TZWNvbmQgZmxpcHBlZCBjYXJkXG4gICAgICAgIHRoaXMubGFzdFRpbGU7ICAgICAgLy9UaGUgbGFzdCB0aWxlIHRoYXQgd2FzIHR1cm5lZFxuICAgICAgICB0aGlzLnBhaXJzID0gMDsgICAgIC8vQ291bnRlciBmb3IgaG93IG1hbnkgcGFycyB0aGUgdXNlciBoYXNcbiAgICAgICAgdGhpcy50cmllcyA9IDA7ICAgICAvL1NvdW50ZXIgZm9yIGhvdyBtYW55IHRyaWVzIHRoZSB1c2VyIGhhdmUgbWFkZVxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVTZXR0aW5ncygpOyAvL1N0YXJ0cyBvZiBjYWxsaW5nIG9uIHRoaXMgZnVuY3Rpb25cbiAgICB9XG5cbiAgICBnYW1lQm9hcmQoY29scywgY29udGFpbmVyLCB0aWxlcykge1xuICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSAnJzsgICAgIC8vQ2xlYXJzIHRoZSBkaXZcblxuICAgICAgICBsZXQgYVRhZztcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVsxXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgc2NvcmVUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgbGV0IGRpdlNjb3JlID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShzY29yZVRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTsgICAgICAgICAgICAgICAgICAvL0ltcG9ydCB0aGUgdGVtcGxhdGUgZm9yIHRoZSBcInNjb3JlYm9hcmRcIlxuXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZTY29yZSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRpbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGFUYWcgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTsgICAgICAgLy9DcmVhdGVzIG5ldyB0aWxlcyBkZXBlbmRpbmcgb24gaG93IG1hbnkgdGlsZXMgdGhlIGNsaWVudCB3YW50c1xuXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWVtb3J5YnJpY2snKTtcblxuICAgICAgICAgICAgbGV0IHRpbGUgPSB0aWxlc1tpXTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBldmVudC50YXJnZXQuZmlyc3RDaGlsZC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudCA6IGV2ZW50LmZpcnN0Q2hpbGQ7ICAgIC8vQWRkcyBhbiBldmVudGxpc3RlbmVyIHRvIGV2ZXJ5IGVsZW1lbnRcblxuICAgICAgICAgICAgICAgIHRoaXMudHVybkJyaWNrKHRpbGUsIGV2ZW50LnRhcmdldC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZigoaSArIDEpICUgY29scyA9PT0gMCl7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpOyAgICAgICAgLy9BZGRzIGEgQlIgc28gdGhhdCB0aGUgY2FyZHMgYXJlIG5lYXRseSBvcmdhbmlzZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBpY0FycmF5KHJvd3MsIGNvbHMpIHtcbiAgICAgICAgbGV0IGFyciA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKyl7ICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYW4gYXJyYXkgd2l0aCB0aGUgYW1vdW50IG9mIGNhcmRzIHRoYXQgdGhlIGNsaWVudCBoYXMgY2hvc2VuXG4gICAgICAgICAgICBhcnIucHVzaChpKTtcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG4gPSBhcnIubGVuZ3RoO1xuICAgICAgICBsZXQgc2h1ZmZsZWRBcnIgPSBbXTtcblxuICAgICAgICB3aGlsZSAobikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TaHVmZmxlcyB0aGUgYXJyYXlcbiAgICAgICAgICAgIGxldCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbi0tKTtcbiAgICAgICAgICAgIHNodWZmbGVkQXJyLnB1c2goYXJyLnNwbGljZShpLCAxKVswXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2h1ZmZsZWRBcnI7ICAgICAvL1JldHVybnMgdGhlIHNodWZmbGVkIGFycmF5XG4gICAgfVxuXG4gICAgdHVybkJyaWNrKHRpbGUsIGltZykgeyAgICAgICAgICAvL1RoZSBnYW1lIGxvZ2ljXG4gICAgICAgIGlmKHRoaXMudHVybjIpeyAgICAgLy9QcmV2ZW50cyBzbyB0aGF0IHRoZSB1c2VyIGNhbiBjbGljayBvbiBhIDNyZCBvciBtb3JlIGNhcmRzXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbWcuc3JjID0gJy9pbWFnZS8nICsgdGlsZSArICcucG5nJzsgICAgICAgICAgICAgICAgLy9TZXRzIHRoZSBzb3VyY2Ugb2YgdGhlIHBpY1xuICAgICAgICBsZXQgbWVzc2FnZSA9IHRoaXMud2luZG93Q29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICBpZighdGhpcy50dXJuMSl7XG4gICAgICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZihpbWcgPT09IHRoaXMudHVybjEpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJpZXMgKz0gMTtcbiAgICAgICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1lvdSBoYXZlIG1hZGUgJyArIHRoaXMudHJpZXMgKyAnIHRyaWVzIHNvIGZhciEnKTtcblxuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0KTtcblxuICAgICAgICAgICAgaWYodGlsZSA9PT0gdGhpcy5sYXN0VGlsZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wYWlycyA9PT0gKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aW1lT3V0ID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnWW91IG9ubHkgbmVlZGVkICcgKyB0aGlzLnRyaWVzICsgJyB0cmllcyB0byB3aW4hJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnaWQnLCAncmVzZXRCdXR0b24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9ICdQbGF5IGFnYWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNldEdhbWUgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3Jlc2V0QnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNldEdhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRHYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWlycyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmllcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlcyA9IHRoaXMucGljQXJyYXkodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUJvYXJkKHRoaXMuY29scywgdGhpcy53aW5kb3dDb250ZW50LCB0aGlzLnRpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh0aW1lT3V0ID0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncGFpcicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncGFpcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIH0sNTAwKTtcblxuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCggZSA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5zcmMgPSAnL2ltYWdlLzAucG5nJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5zcmMgPSAnL2ltYWdlLzAucG5nJztcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlR2FtZVNldHRpbmdzKCl7XG4gICAgICAgIGlmKHRoaXMucm93cyA9PT0gMCl7ICAgICAgICAvL0lmIHRoZSB1c2VyIGhhc24ndCBjaG9zZW4gYW55IGNhcmQgZm9yIHRoZSBnYW1lLCBhbiBpbnN0cnVjdGlvbiBvbiBob3cgdG8gc3RhcnQgdGhlIGdhbWUgaXMgc2hvd25cbiAgICAgICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgdGhpcy50b3BCYXIucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT57XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmKGNvdW50ID09PSAxKXsgLy9DaGVja3MgaWYgdGhlIHVzZXIgaGFyIGNsaWNrZWQgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aGVuIGltcG9ydCB0aGUgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzJdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4geyAgICAgICAgLy9JZiBhbnkgb2YgdGhlIG9wdGlvbnMgaXMgY2xpY2tlZCwgcmVzZXQgZXZlcnl0aGluZyBhbmQgc3RhcnQgYSBuZXcgZ2FtZVxuICAgICAgICAgICAgICAgICAgICBpZihldmVudC50YXJnZXQudmFsdWUgPT09IHVuZGVmaW5lZCl7ICAgICAgIC8vSWYgdGhlIHVzZXIgYWNjaWRlbnRhbGx5IGNsaWNrcyBvdXRzaWRlLCBpZ25vcmUgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFpcnMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUaWxlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzID0gZXZlbnQudGFyZ2V0LnZhbHVlWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbHMgPSBldmVudC50YXJnZXQudmFsdWVbMV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMgPSB0aGlzLnBpY0FycmF5KHRoaXMucm93cywgdGhpcy5jb2xzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lQm9hcmQodGhpcy5jb2xzLCB0aGlzLndpbmRvd0NvbnRlbnQsIHRoaXMudGlsZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudE5vZGUgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShkaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY291bnQgJSAyID09PSAwKXsgLy9JZiB0aGlzIGlzIHRoZSBzZWNvbmQgdGltZSAoZXZlbikgY2xpY2tlZCwgaGlkZSB0aGUgc2V0dGluZ3NcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmdhbWVzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTsgIC8vSWYgdGhpcyBpcyBhIHRoaXJkIHRpbWUgKHVuZXZlbikgY2xpY2tlZCwgZGlzcGxheSB0aGUgc2V0dGluZ3MgYWdhaW5cbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmdhbWVzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVszXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkOyAgLy9JbXBvcnRzIHRoZSBpbnN0cnVjdGlvbnMgb24gaG93IHRvIHN0YXJ0IHRoZSBnYW1lXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKlxuICogVG9EbyBjbG9zZSBzb2NrZXQgd2hlbiB3aW5kb3cgaXMgY2xvc2VkXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgQ2hhdCBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDsgICAgICAvL0xldHMgdGhlIGFwcCBrbm93IHdoaWNoIHdpbmRvdyBpcyB3aGljaFxuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkOyAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgY2hhdC1hcHBcbiAgICAgICAgdGhpcy5jcmVhdGVDaGF0U2V0dGluZ3MoKTsgICAgICAgICAgLy9TdGFydHMgd2l0aCBjYWxsaW5nIG9uIHRlaCBzZXR0aW5ncyBmdW5jdGlvblxuICAgICAgICB0aGlzLmNoYXROYW1lID0gJyc7ICAgICAgICAgICAgICAgICAvL0NoYXRuYW1lIGlzIHNldCB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9ICcnOyAgICAgICAgICAgLy9TZW5kZXJzIG5hbWUgaXMgc2V0IHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICB0aGlzLmVudGVyTmFtZSgpOyAgICAgICAgICAgICAgICAgICAvL1N0YXJ0cyB0aGUgZW50ZXIgbmFtZVxuICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSBmYWxzZTsgICAgICAvL09wdGlvbiB0byB1c2UgdGhlIFwic2VjcmV0IGxhbmdcIlxuICAgIH1cbiAgICBlbnRlck5hbWUoKSB7XG4gICAgICAgIGxldCB1c2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpO1xuXG4gICAgICAgIGlmKHVzZXJOYW1lICE9PSBudWxsKXtcbiAgICAgICAgICAgIHVzZXJOYW1lID0gSlNPTi5wYXJzZSh1c2VyTmFtZSk7ICAgICAgICAgICAgLy9JZiB0aGUgbmFtZSBpc250IG51bGwsIGNhbGxzIGluIHRoZSBjaGF0QXBwIGZ1bmN0aW9uXG4gICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gdXNlck5hbWUudXNlcm5hbWU7XG4gICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcblxuICAgICAgICB9ZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIG51bGwsIGNyZWF0ZSBhIG9wdGlvbiB0byBwaWNrIGEgbmFtZVxuICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmNsYXNzTmFtZSArPSAnIHVzZXJuYW1lJztcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxldCBkaXZJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxldCBhVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgbGV0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRW50ZXIgYSB1c2VybmFtZTonKTtcblxuICAgICAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXG4gICAgICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL2FjY2VwdC5wbmcnKTtcbiAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3VzZXJuYW1lZmllbGQnKTtcblxuICAgICAgICAgICAgYVRhZy5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICAgICAgZGl2SW1nLmFwcGVuZENoaWxkKGFUYWcpO1xuICAgICAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG4gICAgICAgICAgICBmb3JtVGFnLmFwcGVuZENoaWxkKGlucHV0VGFnKTtcblxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHBUYWcpO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRpdkltZyk7XG5cbiAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgICAgICAgICBhVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTsgICAgICAgICAvL0NoZWNrcyB0aGUgdXNlcm5hbWUgZm9yIHNvbWUgc3RhbmRhcmQgcnVsZXNcblxuICAgICAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoIDw9IDAgfHwgaW5wdXRWYWx1ZS5sZW5ndGggPj0gMjUgfHwgaW5wdXRWYWx1ZSA9PT0gJ1RoZSBTZXJ2ZXInKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTm90IGEgdmFsaWQgdXNlcm5hbWUhJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VyTmFtZSA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhdFVzZXJuYW1lID0ge3VzZXJuYW1lOiB0aGlzLnVzZXJOYW1lfTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0NoYXRVc2VyJywgSlNPTi5zdHJpbmdpZnkoY2hhdFVzZXJuYW1lKSk7ICAgICAvL0lmIHRoZSB1c2VybmFtZSBpcyB2YWxpZCwgYWRkIHRoZSBjaG9vc2VuIHVzZXJuYW1lIHRvIExTXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdE5hbWUgPSBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZW50ZXJ1c2VybmFtZScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQudGV4dENvbnRlbnQgPSAnJzsgICAgICAgICAgICAgICAgICAgIC8vQ2xlYXIgdGhlIGRpdlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU3RhcnQgdGhlIGNoYXRBcHBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYXRBcHAoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuICAgICAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgIGV2ZW50ID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9PcGVucyB1cCBhIG5ldyBzb2NrZXQgYW5kIHN0YXJ0cyByZWNlaXZpbmcgdGhlIG1lc3NhZ2VzXG4gICAgICAgICAgICB0aGlzLnJlY2lldmVNZXNzYWdlKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZvcm1EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgZWxlbWVudHMgbmVjZXNzYXJ5IGZvciB0aGUgY2hhdC1hcHBcbiAgICAgICAgbGV0IHNlbmRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgbGV0IHNlbmRBVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB0aGlzLnRleHRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRoaXMudGV4dEZpZWxkLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGV4dGZpZWxkJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgc3R5bGluZ1xuICAgICAgICBmb3JtRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdFN0eWxlcycpO1xuICAgICAgICBmb3JtVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZm9ybXN0eWxlJyk7XG4gICAgICAgIGlucHV0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdGlucHV0Jyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGljb24nKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Rha2VzIGEgaW1hZ2UgYW5kIHVzZXMgaXQgdG8gc2VuZCBtZXNzYWdlc1xuICAgICAgICBzZW5kSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9zZW5kLnBuZycpO1xuXG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BcHBlbmRzIGFsbCB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgICBzZW5kQVRhZy5hcHBlbmRDaGlsZChzZW5kSW1nKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChzZW5kQVRhZyk7XG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcblxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBlbnRlci1rZXkgd2hlbiB0eXBpbmcsIHNlbmQgdGhlIG1lc3NhZ2Ugd2hlbiBwcmVzc2VkXG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKXtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbmRBVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBzZW5kIGljb24gdG8gc2VuZCBtZXNzYWdlXG4gICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGNyZWF0ZUNoYXRTZXR0aW5ncygpe1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgPT09IDEpeyAvL0NoZWNrcyBpZiB0aGUgdXNlciBoYXIgY2xpY2tlZCBmb3IgdGhlIGZpcnN0IHRpbWUsIHRoZW4gY3JlYXRlIHRoZSBuZWVkZWQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFNldHRpbmdzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbGV0IHJvdmFyc3ByYWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyhOb3QgdmVyeSBzZWNyZXQpJyk7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUsO2dmFyc3Byw6VrJykpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnUsO2dmFyc3Byw6VrJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnaWQnLCAncm92YXJzcHJhaycpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRzZXR0aW5ncycpO1xuXG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHJvdmFyc3ByYWspO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgICAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXsgICAgICAgICAgICAgICAgICAgICAvL0NoZWNrcyBpZiBSw7Z2YXJzcHLDpWsgaXMgdHJ1ZSwgdGhlbiB0aGUgYm94IHNob3VsZCBiZSBjaGVja2VkXG4gICAgICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgLy9FdmVudCBsaXN0ZW5lciBvbiB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmKHJvdmFyc3ByYWsuY2hlY2tlZCA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBwYXJlbnROb2RlLmNoaWxkTm9kZXM7XG5cbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGF0U2V0dGluZ3NEaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY291bnQgJSAyID09PSAwKXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTsgICAgLy9JZiB0aGlzIGlzIHRoZSBzZWNvbmQgdGltZSAoZXZlbikgY2xpY2tlZCwgaGlkZSB0aGUgc2V0dGluZ3NcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTsgICAgLy9JZiB0aGlzIGlzIGEgdGhpcmQgdGltZSAodW5ldmVuKSBjbGlja2VkLCBkaXNwbGF5IHRoZSBzZXR0aW5ncyBhZ2FpblxuICAgICAgICAgICAgICAgIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2hhdHNldHRpbmdzJykuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlY3JldExhbmcodGV4dCkgeyAgICAgICAgICAgICAgICAgIC8vVGhlIG1lc3NhZ2UgdHVybnMgaW50byBhICdzZWNyZXQnIG1lc3NhZ2VcblxuICAgICAgICBsZXQga29uc29uYW50ZXIgPSBbJ0InLCAnYicsICdDJywgJ2MnLCAnRCcsICdkJywgJ0YnLCAnZicsICdHJywgJ2cnLCAnSCcsICdoJywgJ0onLCAnaicsICdLJywgJ2snLCAnTCcsICdsJywgJ00nLCAnbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnTicsICduJywgJ1AnLCAncCcsICdRJywgJ3EnLCAnUicsICdyJywgJ1MnLCAncycsICAnVCcsICd0JywgJ1YnLCAndicsICdXJywgJ3cnLCAnWCcsICd4JywgJ1onLCAneiddO1xuXG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSAnJztcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkgKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGtvbnNvbmFudGVyLmxlbmd0aDsgaiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGV4dFtpXSA9PT0ga29uc29uYW50ZXJbal0pe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXSArICdvJzsgICAgICAgICAgICAgLy9BZGRzIGFuICdvJyB0byBhbGwgY29uc29uYW50c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1N0cmluZyArPSB0ZXh0W2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgc2VuZE1lc3NhZ2UoaW5wdXQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NlbmRzIHRoZSBtZXNzYWdlIGFzIEpTT04gdmlhIHdlYnNvY2tldFxuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVja3MgdGhlIHVzZXJuYW1lIGV2ZXJ5IHRpbWUgYSBtZXNzYWdlIGlzIHNlbnRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IEpTT04ucGFyc2UodGhpcy5jbGllbnRVc2VyTmFtZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9PT0gdHJ1ZSl7ICAgICAgICAvL0lmIHRoZSBzZWNyZXQgbGFuZyBpcyBzZWxjdGVkLCBjb252ZXJ0IHRoZSBtZXNzYWdlc1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLnNlY3JldExhbmcoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBpbnB1dCxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy5jbGllbnRVc2VyTmFtZS51c2VybmFtZSxcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICByZWNpZXZlTWVzc2FnZShlKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2hlbiBuZXcgbWVzc2FnZXMgaXMgcmVjZWl2ZWQsIGRpc3BsYXkgaXQgaW4gdGhlIGNoYXQgd2luZG93XG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOyAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYWxsIG5lY2Vzc2FyeSBlbGVtZW50c1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS51c2VybmFtZSArICc6Jyk7XG4gICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIGxldCB0ZXh0UCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgICB0ZXh0UC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21lc3NhZ2Vjb250ZW50Jyk7XG4gICAgICAgIHNlbmRlck5hbWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kZXJuYW1lJyk7XG5cbiAgICAgICAgaWYocmVzcG9uc2UudHlwZSAhPT0gJ2hlYXJ0YmVhdCcpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB1c2VybmFtZSBpcyBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXIgbmFtZSwgYWRkIGNsaWVudCBjbGFzc1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NsaWVudG1lc3NhZ2UnKVxuICAgICAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UudHlwZSA9PT0gJ25vdGlmaWNhdGlvbicpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHNlcnZlciBtZXNzYWdlcyBzbyB1c2VyIGNhbiB0ZWxsIGRpZmZlcmVuY2VcbiAgICAgICAgICAgICAgICBzZW5kZXJOYW1lLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXJ2ZXJtZXNzYWdlJyk7XG4gICAgICAgICAgICB9IGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBjbGFzcyB0byB0aGUgcmVwbGllcyB3aXRoIG5hbWVzIG5vdCBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHJlcGx5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRlck5hbWUuYXBwZW5kQ2hpbGQoc2VuZGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG5cbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLndpbmRvd0NvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgICAvL1Njcm9sbHMgYW5kIHNob3dzIHRoZSBsYXRlc3QgbWVzc2FnZSByZWNlaXZlZFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cbmNsYXNzIE5ld0Rlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2luZG93QXBwQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpO1xuICAgIH1cbiAgICBhcHBzKCl7XG4gICAgICAgIGxldCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKS5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcicpO1xuXG4gICAgICAgIGxldCBjaGF0ID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjQ2hhdCcpO1xuICAgICAgICBsZXQgZ2FtZSA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0dhbWUnKTtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjU2V0dGluZ3MnKTtcblxuXG4gICAgICAgIGNoYXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBuZXcgQ2hhdChldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGNoYXQgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcblxuICAgICAgICBnYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbmV3IEdhbWUoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBnYW1lIHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG5cbiAgICAgICAgc2V0dGluZ3MuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbmV3IFNldHRpbmdzKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7ICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYSBuZXcgY2hhdCB1cG9uIGEgY2xpY2ssIGNoYXQgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEd1aSBjcmVhdGluZyBhIG5ldyBjaGF0IHdpbmRvd1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXdEZXNrdG9wO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICovXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBTZXR0aW5ncyBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGdhbWUtYXBwXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhdFNldHRpbmdzQ29udGVudCgpOyAgICAgICAgICAgICAgICAgICAvL1N0YXJ0aW5nIHBvaW50IG9mIHRoZSBhcHBcbiAgICAgICAgdGhpcy5jaGFuZ2VUaGVtZSgpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgfVxuICAgIGNyZWF0ZUNoYXRTZXR0aW5nc0NvbnRlbnQoKSB7XG4gICAgICAgIC8vIGlmKHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZ3NDb250ZW50JykuZmlyc3RFbGVtZW50Q2hpbGQgIT09IG51bGwpe1xuICAgICAgICAvLyAgICAgdGhpcy53aW5kb3dDb250ZW50LnJlbW92ZUNoaWxkKHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZ3NDb250ZW50JykpOyAgICAgLy9DbGVhcnMgdGhlIGRpdlxuICAgICAgICAvLyB9XG5cbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVs1XS5jb250ZW50OyAgLy9JbXBvcnRzIHRoZSB0ZW1wbGF0ZSBuZWVkZWRcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICBsZXQgdXNlcm5hbWUgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignI3VzZXJuYW1lJyk7XG4gICAgICAgIHRoaXMuY2hlY2tVc2VyTmFtZSh1c2VybmFtZSk7ICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZVxuICAgIH1cblxuICAgIGNoZWNrVXNlck5hbWUodXNlcm5hbWUpIHtcbiAgICAgICAgbGV0IGNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7ICAgICAgLy9DaGVja3MgbG9jYWwgc3RvcmFnZSBmb3IgYSB1c2VybmFtZVxuXG4gICAgICAgIGxldCBuYW1lID0gSlNPTi5wYXJzZShjbGllbnRVc2VyTmFtZSk7XG5cbiAgICAgICAgaWYobmFtZSA9PT0gbnVsbCl7ICAgICAgLy9JZiB1c2VybmFtZSBpcyBub3QgZGVmaW5lZCwgc2V0IHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICAgICAgbmFtZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUudXNlcm5hbWUpOyAgICAgLy9UaGUgdXNlcm5hbWUgaXMgcHV0IGluIGEgcCBlbGVtZW50XG5cbiAgICAgICAgaWYocFRleHQudGV4dENvbnRlbnQgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHBUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICd1c2VybmFtZU5vdFNldCcpOyAgICAgICAvL0lmIHRoZSB1c2VybmFtZSBpcyB1bmRlZmluZWQsIGFkZCB0aGUgY2xhc3MgdXNlcm5hbWUgbm90IHNldFxuICAgICAgICB9XG5cbiAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG4gICAgICAgIHVzZXJuYW1lLmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgIGxldCBidXR0b24gPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJylbMF07ICAvL0FkZHMgYW4gZXZlbnQgdG8gdGhlIGZpcnN0IGJ1dHRvbiBpbiB0aGUgd2luZG93XG5cbiAgICAgICAgbGV0IGlucHV0ID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG5cbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZW50ZXIta2V5IHdoZW4gdHlwaW5nLCBzZW5kIHRoZSBtZXNzYWdlIHdoZW4gcHJlc3NlZFxuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxMyl7XG4gICAgICAgICAgICAgICAgdGhpcy52ZXJpZnlVc2VybmFtZShpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgdGhpcy52ZXJpZnlVc2VybmFtZShpbnB1dCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZlcmlmeVVzZXJuYW1lKGlucHV0KXtcbiAgICAgICAgaWYoaW5wdXQudmFsdWUubGVuZ3RoIDw9IDAgfHwgaW5wdXQudmFsdWUubGVuZ3RoID49IDI1IHx8IGlucHV0LnZhbHVlID09PSAnVGhlIFNlcnZlcicpeyAvL0NoZWNrcyB0aGUgaW5wdXQgdmFsdWUgaWYgaXQgaXMgYSBwcm9wZXIgdXNlcm5hbWVcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ05vdCBhIHZhbGlkIHVzZXJuYW1lIScpO1xuICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy51c2VyTmFtZSA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuICAgICAgICAgICAgbGV0IGNoYXRVc2VybmFtZSA9IHt1c2VybmFtZTogdGhpcy51c2VyTmFtZX07XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTsgICAgIC8vSWYgdGhlIHVzZXJuYW1lIHBhc3NlcyB0aGUgcnVsZXMsIExTIGlzIHNldCB0byB0aGUgbmV3IG5hbWVcbiAgICAgICAgICAgIGxldCBuZXdOYW1lID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpO1xuICAgICAgICAgICAgbmV3TmFtZS50ZXh0Q29udGVudCA9IHRoaXMudXNlck5hbWU7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmdzQ29udGVudCcpLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZVRoZW1lKCl7XG5cbiAgICAgICAgaWYodGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFuZ2VUaGVtZScpICE9PSBudWxsKXtcbiAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignLmNoYW5nZVRoZW1lJykpOyAgICAgLy9DbGVhcnMgdGhlIGRpdlxuICAgICAgICB9XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNl0uY29udGVudDtcblxuICAgICAgICBsZXQgdGhlbWVPcHRpb25zID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKHRoZW1lT3B0aW9ucyk7XG5cbiAgICAgICAgbGV0IHRoZW1lRGl2ID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFuZ2VUaGVtZScpO1xuXG4gICAgICAgIHRoZW1lRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGNsaWNrZWQgPSBldmVudC50YXJnZXQuY2xhc3NMaXN0WzBdO1xuXG4gICAgICAgICAgICBpZihldmVudC50YXJnZXQubm9kZU5hbWUgIT09ICdBJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICBsZXQgb3B0aW9uMSA9ICdhbGljZWJsdWUnO1xuICAgICAgICAgICAgbGV0IG9wdGlvbjIgPSAnI0Y4QkYyOCc7XG4gICAgICAgICAgICBsZXQgb3B0aW9uMyA9ICcjMDBhZWZmJztcblxuICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuXG4gICAgICAgICAgICBpZihjbGlja2VkID09PSAnb3B0aW9uMScpe1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb24xO1xuICAgICAgICAgICAgfWVsc2UgaWYoY2xpY2tlZCA9PT0gJ29wdGlvbjInKXtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmQgPSAwO1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9uMjtcbiAgICAgICAgICAgIH1lbHNlIGlmKGNsaWNrZWQgPT09ICdvcHRpb24zJyl7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wdGlvbjM7XG4gICAgICAgICAgICB9ZWxzZSBpZihjbGlja2VkID09PSAnb3B0aW9uNCcpe1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZCA9ICd1cmwoXCIvaW1hZ2UvamFrZXRoZWRvZy5wbmdcIikgY2VudGVyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIi8qKlxuICpcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBOZXdEZXNrdG9wID0gcmVxdWlyZSgnLi9OZXdEZXNrdG9wJyk7XG5cbmNvbnN0IERlc2t0b3AgPSBuZXcgTmV3RGVza3RvcCgpO1xuXG5EZXNrdG9wLmFwcHMoKTtcbiJdfQ==
