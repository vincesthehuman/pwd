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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI3LlxuICpcbiAqICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHVUl7XG4gICAgY29uc3RydWN0b3Iod2luZG93QXBwLCBjb3VudGVyKSB7XG4gICAgICAgIHRoaXMud2luZG93QXBwID0gd2luZG93QXBwOyAgICAgICAgICAgICAvL1doYXQgdHlwZSBvZiB3aW5kb3cgaXMgYmVpbmcgY3JlYXRlZFxuICAgICAgICB0aGlzLmNvdW50ZXIgPSBjb3VudGVyOyAgICAgICAgICAgICAgICAgLy9BIGNvdW50ZXIgZm9yIGhvdyBtYW55IHdpbmRvd3MgdGhlcmUgYXJlXG4gICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZ3VpKCk7XG4gICAgfVxuXG5cbiAgICBndWkoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVswXTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7ICAgICAgLy9TZWxlY3RzIHRoZSBmaXJzdCB0ZW1wbGF0ZSBhbmQgaW1wb3J0cyBpdCBmcm9tIHRoZSBpbmRleC5odG1sXG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMud2luZG93QXBwKTsgICAgLy9UaGUgbmFtZSBvZiB0aGUgd2luZG93XG4gICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy53aW5kb3dBcHAgKyB0aGlzLmNvdW50ZXIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB3aW5kb3cgaXMgZ2l2ZW4gYW4gaWQsIHdpdGggdHlwZSBhbmQgYSBudW1iZXJcbiAgICAgICAgdGhpcy50b3BCYXIgPSBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyB0aGlzLndpbmRvd0FwcCk7ICAgIC8vVGhlIHdpbmRvd3MgdG9wYmFyIGdldHMgYSBzaW1pbGFyIGlkXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA0NSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEwNSAqICh0aGlzLmNvdW50ZXIgKyAxKSArICdweCc7ICAgIC8vQWRkcyBhIFwiYm91bmNlXCIgdG8gdGhlIHdpbmRvd3NcblxuICAgICAgICBsZXQgcmVtb3ZlWmluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7ICAgICAgIC8vQ291bnRzIGFsbCBvcGVuIHdpbmRvd3MgaW4gdGhlIHdyYXBwZXJcblxuICAgICAgICBsZXQgekluZGV4Q291bnQgPSAwO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcmVtb3ZlWmluZGV4Lmxlbmd0aDsgaSArKykgeyAgICAgICAgICAgICAgICAgICAgICAvL0dpdmVzIGEgbmV3IHotaW5kZXhcbiAgICAgICAgICAgIGxldCBmb28gPSByZW1vdmVaaW5kZXhbaV0uc3R5bGUuekluZGV4O1xuXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoZm9vKSA+IHpJbmRleENvdW50KSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSB6aW5kZXggb2YgdGhlIGNsaWNrZWQgd2luZG93IGlzIGhpZ2hlciB0aGFuIHRoZSB6aW5kZXggY291bnRlciwgeiBpbmRleCBjb3VudGVyIGdldHMgYSBuZXcgdmFsdWVcbiAgICAgICAgICAgICAgICB6SW5kZXhDb3VudCA9IHBhcnNlSW50KGZvbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUuekluZGV4ID0gekluZGV4Q291bnQ7XG5cbiAgICAgICAgYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGljb24nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIHRoaXMud2luZG93QXBwICsgJy5wbmcnKTsgICAgICAgLy9UaGUgaWNvbiBjb3JyZXNwb25kcyB0byB0aGUgdHlwZSBvZiB3aW5kb3cgdGhhdCBpcyBjaG9vc2VuXG5cbiAgICAgICAgaWYodGhpcy53aW5kb3dBcHAgPT09ICdHYW1lJyB8fCB0aGlzLndpbmRvd0FwcCA9PT0gJ0NoYXQnKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgc2V0dGluZ3Mgb3B0aW9uXG4gICAgICAgICAgICB0aGlzLmFwcFNldHRpbmdzKGFwcFdpbmRvdyk7XG4gICAgICAgIH1cblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignI2Nsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAvL0FkZHMgdGhlIGZ1bmN0aW9uIHRvIGNsb3NlIGEgd2luZG93XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW92ZShhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgdGhlIGZ1bmN0aW9uIHRvIG1vdmUgYSB3aW5kb3dcblxuICAgICAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoYXBwV2luZG93KTtcblxuICAgIH1cblxuICAgIGNsb3NlKG5vZGUpIHsgICAgICAgLy9SZW1vdmVzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFyZW50IG5vZGUgKHRoZSBXaW5kb3cgc2VsZWN0ZWQpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIH1cblxuICAgIGFwcFNldHRpbmdzKHBvc2l0aW9uKSB7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL1NldHRpbmdzLnBuZycpOyAgIC8vQWRkcyB0aGUgc2V0dGluZ3MgaWNvblxuICAgIH1cblxuICAgIG1vdmUoc2VsZWN0ZWQpIHsgICAgLy9NYWtlcyBpdCBwb3NzaWJsZSBmb3IgdGhlIHVzZXIgdG8gbW92ZSB0aGUgd2luZG93XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdvbm1vdXNlZG93bicpO1xuXG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWCA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCk7XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWSA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wKTsgIC8vU2V0cyB0aGUgc3R5bGluZyBvZiB0aGUgc2VsZWN0ZWQgd2luZG93XG5cbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZXZlbnQucGFnZVggLSB3aW5kb3dQb3NYO1xuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBldmVudC5wYWdlWSAtIHdpbmRvd1Bvc1k7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhlIG9mZnNldCBpcyBjYWxjdWxhdGVkIHNvIHRoYXQgdGhlIHdpbmRvd3MgdG9wIGxlZnQgY29ybmVyIGRvZXNuJ3QgXCJqdW1wXCIgdG8gcG9pbnRlclxuXG4gICAgICAgICAgICBsZXQgbW92ZVdpbmRvdyA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9YID0gZS5wYWdlWCAtIG9mZnNldFg7XG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1kgPSBlLnBhZ2VZIC0gb2Zmc2V0WTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCA9IG1vdmVUb1kgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCA9IG1vdmVUb1ggKyAncHgnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHJlbW92ZUV2ZW50ID0geCA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdvbm1vdXNlZG93bicpO1xuICAgICAgICAgICAgICAgIGxldCByZW1vdmVaaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3cnKTsgICAgICAgLy9Db3VudHMgYWxsIG9wZW4gd2luZG93cyBpbiB0aGUgd3JhcHBlclxuXG4gICAgICAgICAgICAgICAgbGV0IHpJbmRleENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcmVtb3ZlWmluZGV4Lmxlbmd0aDsgaSArKyl7ICAgICAgICAgICAgICAgICAgICAgIC8vR2l2ZXMgYSBuZXcgei1pbmRleFxuICAgICAgICAgICAgICAgICAgICBsZXQgZm9vID0gcmVtb3ZlWmluZGV4W2ldLnN0eWxlLnpJbmRleDtcblxuICAgICAgICAgICAgICAgICAgICBpZihwYXJzZUludChmb28pID4gekluZGV4Q291bnQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgemluZGV4IG9mIHRoZSBjbGlja2VkIHdpbmRvdyBpcyBoaWdoZXIgdGhhbiB0aGUgemluZGV4IGNvdW50ZXIsIHogaW5kZXggY291bnRlciBnZXRzIGEgbmV3IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXhDb3VudCA9IHBhcnNlSW50KGZvbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS56SW5kZXggPSB6SW5kZXhDb3VudCArIDE7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR1VJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIE1lbW9yeSBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAvL1RoZSBjb250ZW50IG9mIHRoZSB3aW5kb3cgY3JlYXRlZFxuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkOyAgICAgICAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgZ2FtZS1hcHBcbiAgICAgICAgdGhpcy5yb3dzID0gMDsgICAgICAvL0hvdyBtYW55IHJvd3Mgb2YgY2FyZHNcbiAgICAgICAgdGhpcy5jb2xzID0gMDsgICAgICAvL0hvdyBtYW55IGNvbHVtbnMgb2YgY2FyZHNcbiAgICAgICAgdGhpcy50dXJuMTsgICAgICAgICAvL0ZpcnN0IGZsaXBwZWQgY2FyZHNcbiAgICAgICAgdGhpcy50dXJuMjsgICAgICAgICAvL1NlY29uZCBmbGlwcGVkIGNhcmRcbiAgICAgICAgdGhpcy5sYXN0VGlsZTsgICAgICAvL1RoZSBsYXN0IHRpbGUgdGhhdCB3YXMgdHVybmVkXG4gICAgICAgIHRoaXMucGFpcnMgPSAwOyAgICAgLy9Db3VudGVyIGZvciBob3cgbWFueSBwYXJzIHRoZSB1c2VyIGhhc1xuICAgICAgICB0aGlzLnRyaWVzID0gMDsgICAgIC8vU291bnRlciBmb3IgaG93IG1hbnkgdHJpZXMgdGhlIHVzZXIgaGF2ZSBtYWRlXG4gICAgICAgIHRoaXMuY3JlYXRlR2FtZVNldHRpbmdzKCk7IC8vU3RhcnRzIG9mIGNhbGxpbmcgb24gdGhpcyBmdW5jdGlvblxuICAgIH1cblxuICAgIGdhbWVCb2FyZChjb2xzLCBjb250YWluZXIsIHRpbGVzKSB7XG4gICAgICAgIGNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnOyAgICAgLy9DbGVhcnMgdGhlIGRpdlxuXG4gICAgICAgIGxldCBhVGFnO1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzFdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIGxldCBzY29yZVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVs0XS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgZGl2U2NvcmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHNjb3JlVGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgICAgICAgICAgICAgIC8vSW1wb3J0IHRoZSB0ZW1wbGF0ZSBmb3IgdGhlIFwic2NvcmVib2FyZFwiXG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdlNjb3JlKTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgYVRhZyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpOyAgICAgICAvL0NyZWF0ZXMgbmV3IHRpbGVzIGRlcGVuZGluZyBvbiBob3cgbWFueSB0aWxlcyB0aGUgY2xpZW50IHdhbnRzXG5cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZW1vcnlicmljaycpO1xuXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVzW2ldO1xuXG4gICAgICAgICAgICBhVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgbGV0IGltZyA9IGV2ZW50LnRhcmdldC5maXJzdENoaWxkLm5vZGVOYW1lID09PSAnSU1HJyA/IGV2ZW50IDogZXZlbnQuZmlyc3RDaGlsZDsgICAgLy9BZGRzIGFuIGV2ZW50bGlzdGVuZXIgdG8gZXZlcnkgZWxlbWVudFxuXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgZXZlbnQudGFyZ2V0LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKChpICsgMSkgJSBjb2xzID09PSAwKXtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7ICAgICAgICAvL0FkZHMgYSBCUiBzbyB0aGF0IHRoZSBjYXJkcyBhcmUgbmVhdGx5IG9yZ2FuaXNlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGljQXJyYXkocm93cywgY29scykge1xuICAgICAgICBsZXQgYXJyID0gW107XG5cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSAocm93cyAqIGNvbHMpIC8gMjsgaSsrKXsgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhbiBhcnJheSB3aXRoIHRoZSBhbW91bnQgb2YgY2FyZHMgdGhhdCB0aGUgY2xpZW50IGhhcyBjaG9zZW5cbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbiA9IGFyci5sZW5ndGg7XG4gICAgICAgIGxldCBzaHVmZmxlZEFyciA9IFtdO1xuXG4gICAgICAgIHdoaWxlIChuKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NodWZmbGVzIHRoZSBhcnJheVxuICAgICAgICAgICAgbGV0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuLS0pO1xuICAgICAgICAgICAgc2h1ZmZsZWRBcnIucHVzaChhcnIuc3BsaWNlKGksIDEpWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaHVmZmxlZEFycjsgICAgIC8vUmV0dXJucyB0aGUgc2h1ZmZsZWQgYXJyYXlcbiAgICB9XG5cbiAgICB0dXJuQnJpY2sodGlsZSwgaW1nKSB7ICAgICAgICAgIC8vVGhlIGdhbWUgbG9naWNcbiAgICAgICAgaWYodGhpcy50dXJuMil7ICAgICAvL1ByZXZlbnRzIHNvIHRoYXQgdGhlIHVzZXIgY2FuIGNsaWNrIG9uIGEgM3JkIG9yIG1vcmUgY2FyZHNcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5zcmMgPSAnL2ltYWdlLycgKyB0aWxlICsgJy5wbmcnOyAgICAgICAgICAgICAgICAvL1NldHMgdGhlIHNvdXJjZSBvZiB0aGUgcGljXG4gICAgICAgIGxldCBtZXNzYWdlID0gdGhpcy53aW5kb3dDb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgIGlmKCF0aGlzLnR1cm4xKXtcbiAgICAgICAgICAgIHRoaXMudHVybjEgPSBpbWc7XG4gICAgICAgICAgICB0aGlzLmxhc3RUaWxlID0gdGlsZTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGlmKGltZyA9PT0gdGhpcy50dXJuMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50cmllcyArPSAxO1xuICAgICAgICAgICAgdGhpcy50dXJuMiA9IGltZztcblxuICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnWW91IGhhdmUgbWFkZSAnICsgdGhpcy50cmllcyArICcgdHJpZXMgc28gZmFyIScpO1xuXG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICAgICAgICBpZih0aWxlID09PSB0aGlzLmxhc3RUaWxlKXtcbiAgICAgICAgICAgICAgICB0aGlzLnBhaXJzICs9IDE7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnBhaXJzID09PSAodGhpcy5yb3dzICogdGhpcy5jb2xzKSAvIDIpe1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRpbWVPdXQgPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdZb3Ugb25seSBuZWVkZWQgJyArIHRoaXMudHJpZXMgKyAnIHRyaWVzIHRvIHdpbiEgQ2xpY2sgb24gdGhlIHNldHRpbmdzIGFuZCBzdGFydCBhIG5ldyBnYW1lIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodGltZU91dCA9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3BhaXInKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB9LDUwMCk7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoIGUgPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gJy9pbWFnZS8wLnBuZyc7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUdhbWVTZXR0aW5ncygpe1xuICAgICAgICBpZih0aGlzLnJvd3MgPT09IDApeyAgICAgICAgLy9JZiB0aGUgdXNlciBoYXNuJ3QgY2hvc2VuIGFueSBjYXJkIGZvciB0aGUgZ2FtZSwgYW4gaW5zdHJ1Y3Rpb24gb24gaG93IHRvIHN0YXJ0IHRoZSBnYW1lIGlzIHNob3duXG4gICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICBpZihjb3VudCA9PT0gMSl7IC8vQ2hlY2tzIGlmIHRoZSB1c2VyIGhhciBjbGlja2VkIGZvciB0aGUgZmlyc3QgdGltZSwgdGhlbiBpbXBvcnQgdGhlIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVsyXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHsgICAgICAgIC8vSWYgYW55IG9mIHRoZSBvcHRpb25zIGlzIGNsaWNrZWQsIHJlc2V0IGV2ZXJ5dGhpbmcgYW5kIHN0YXJ0IGEgbmV3IGdhbWVcbiAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQudGFyZ2V0LnZhbHVlID09PSB1bmRlZmluZWQpeyAgICAgICAvL0lmIHRoZSB1c2VyIGFjY2lkZW50YWxseSBjbGlja3Mgb3V0c2lkZSwgaWdub3JlIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhaXJzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmllcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0VGlsZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93cyA9IGV2ZW50LnRhcmdldC52YWx1ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xzID0gZXZlbnQudGFyZ2V0LnZhbHVlWzFdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVzID0gdGhpcy5waWNBcnJheSh0aGlzLnJvd3MsIHRoaXMuY29scyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUJvYXJkKHRoaXMuY29scywgdGhpcy53aW5kb3dDb250ZW50LCB0aGlzLnRpbGVzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnROb2RlID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBwYXJlbnROb2RlLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGl2LCBjaGlsZHJlblswXSk7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGNvdW50ICUgMiA9PT0gMCl7IC8vSWYgdGhpcyBpcyB0aGUgc2Vjb25kIHRpbWUgKGV2ZW4pIGNsaWNrZWQsIGhpZGUgdGhlIHNldHRpbmdzXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lc2V0dGluZ3MnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7ICAvL0lmIHRoaXMgaXMgYSB0aGlyZCB0aW1lICh1bmV2ZW4pIGNsaWNrZWQsIGRpc3BsYXkgdGhlIHNldHRpbmdzIGFnYWluXG4gICAgICAgICAgICAgICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lc2V0dGluZ3MnKS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbM10uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDsgIC8vSW1wb3J0cyB0aGUgaW5zdHJ1Y3Rpb25zIG9uIGhvdyB0byBzdGFydCB0aGUgZ2FtZVxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICpcbiAqIFRvRG8gY2xvc2Ugc29ja2V0IHdoZW4gd2luZG93IGlzIGNsb3NlZFxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIENoYXQgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMud2luZG93Q29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7ICAgICAgLy9MZXRzIHRoZSBhcHAga25vdyB3aGljaCB3aW5kb3cgaXMgd2hpY2hcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGNoYXQtYXBwXG4gICAgICAgIHRoaXMuY3JlYXRlQ2hhdFNldHRpbmdzKCk7ICAgICAgICAgIC8vU3RhcnRzIHdpdGggY2FsbGluZyBvbiB0ZWggc2V0dGluZ3MgZnVuY3Rpb25cbiAgICAgICAgdGhpcy5jaGF0TmFtZSA9ICcnOyAgICAgICAgICAgICAgICAgLy9DaGF0bmFtZSBpcyBzZXQgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSAnJzsgICAgICAgICAgIC8vU2VuZGVycyBuYW1lIGlzIHNldCB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgdGhpcy5lbnRlck5hbWUoKTsgICAgICAgICAgICAgICAgICAgLy9TdGFydHMgdGhlIGVudGVyIG5hbWVcbiAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gZmFsc2U7ICAgICAgLy9PcHRpb24gdG8gdXNlIHRoZSBcInNlY3JldCBsYW5nXCJcbiAgICB9XG4gICAgZW50ZXJOYW1lKCkge1xuICAgICAgICBsZXQgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTtcblxuICAgICAgICBpZih1c2VyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB1c2VyTmFtZSA9IEpTT04ucGFyc2UodXNlck5hbWUpOyAgICAgICAgICAgIC8vSWYgdGhlIG5hbWUgaXNudCBudWxsLCBjYWxscyBpbiB0aGUgY2hhdEFwcCBmdW5jdGlvblxuICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IHVzZXJOYW1lLnVzZXJuYW1lO1xuICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG5cbiAgICAgICAgfWVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiBudWxsLCBjcmVhdGUgYSBvcHRpb24gdG8gcGljayBhIG5hbWVcbiAgICAgICAgICAgIHRoaXMud2luZG93Q29udGVudC5jbGFzc05hbWUgKz0gJyB1c2VybmFtZSc7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgZGl2SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgYVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0VudGVyIGEgdXNlcm5hbWU6Jyk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgICAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9hY2NlcHQucG5nJyk7XG4gICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICd1c2VybmFtZWZpZWxkJyk7XG5cbiAgICAgICAgICAgIGFUYWcuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIGRpdkltZy5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG5cbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChwVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChkaXZJbWcpO1xuXG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7ICAgICAgICAgLy9DaGVja3MgdGhlIHVzZXJuYW1lIGZvciBzb21lIHN0YW5kYXJkIHJ1bGVzXG5cbiAgICAgICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA8PSAwIHx8IGlucHV0VmFsdWUubGVuZ3RoID49IDI1IHx8IGlucHV0VmFsdWUgPT09ICdUaGUgU2VydmVyJyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ05vdCBhIHZhbGlkIHVzZXJuYW1lIScpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgICAgICAgICAgICAgICBwLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXRVc2VybmFtZSA9IHt1c2VybmFtZTogdGhpcy51c2VyTmFtZX07XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdDaGF0VXNlcicsIEpTT04uc3RyaW5naWZ5KGNoYXRVc2VybmFtZSkpOyAgICAgLy9JZiB0aGUgdXNlcm5hbWUgaXMgdmFsaWQsIGFkZCB0aGUgY2hvb3NlbiB1c2VybmFtZSB0byBMU1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VudGVydXNlcm5hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LnRleHRDb250ZW50ID0gJyc7ICAgICAgICAgICAgICAgICAgICAvL0NsZWFyIHRoZSBkaXZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1N0YXJ0IHRoZSBjaGF0QXBwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGF0QXBwKCl7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC8nKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICBldmVudCA9PiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vT3BlbnMgdXAgYSBuZXcgc29ja2V0IGFuZCBzdGFydHMgcmVjZWl2aW5nIHRoZSBtZXNzYWdlc1xuICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmb3JtRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGVsZW1lbnRzIG5lY2Vzc2FyeSBmb3IgdGhlIGNoYXQtYXBwXG4gICAgICAgIGxldCBzZW5kSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGxldCBzZW5kQVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgdGhpcy50ZXh0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICB0aGlzLnRleHRGaWVsZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RleHRmaWVsZCcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIHN0eWxpbmdcbiAgICAgICAgZm9ybURpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRTdHlsZXMnKTtcbiAgICAgICAgZm9ybVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Zvcm1zdHlsZScpO1xuICAgICAgICBpbnB1dFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRpbnB1dCcpO1xuICAgICAgICBzZW5kQVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICBzZW5kQVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbmRpY29uJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UYWtlcyBhIGltYWdlIGFuZCB1c2VzIGl0IHRvIHNlbmQgbWVzc2FnZXNcbiAgICAgICAgc2VuZEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2Uvc2VuZC5wbmcnKTtcblxuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy50ZXh0RmllbGQpO1xuICAgICAgICBmb3JtVGFnLmFwcGVuZENoaWxkKGlucHV0VGFnKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQXBwZW5kcyBhbGwgdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgICAgc2VuZEFUYWcuYXBwZW5kQ2hpbGQoc2VuZEltZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoc2VuZEFUYWcpO1xuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQoZm9ybURpdik7XG5cbiAgICAgICAgaW5wdXRUYWcuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgZW50ZXIta2V5IHdoZW4gdHlwaW5nLCBzZW5kIHRoZSBtZXNzYWdlIHdoZW4gcHJlc3NlZFxuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxMyl7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gY2xlYXJJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhcklucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzZW5kQVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgc2VuZCBpY29uIHRvIHNlbmQgbWVzc2FnZVxuICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gY2xlYXJJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICBjbGVhcklucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBjcmVhdGVDaGF0U2V0dGluZ3MoKXtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgdGhpcy50b3BCYXIucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT57XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmKGNvdW50ID09PSAxKXsgLy9DaGVja3MgaWYgdGhlIHVzZXIgaGFyIGNsaWNrZWQgZm9yIHRoZSBmaXJzdCB0aW1lLCB0aGVuIGNyZWF0ZSB0aGUgbmVlZGVkIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgbGV0IGNoYXRTZXR0aW5nc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGxldCByb3ZhcnNwcmFrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcoTm90IHZlcnkgc2VjcmV0KScpO1xuXG4gICAgICAgICAgICAgICAgbGFiZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1LDtnZhcnNwcsOlaycpKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCduYW1lJywgJ1LDtnZhcnNwcsOlaycpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd2YWx1ZScsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3JvdmFyc3ByYWsnKTtcbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0c2V0dGluZ3MnKTtcblxuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChyb3ZhcnNwcmFrKTtcbiAgICAgICAgICAgICAgICBjaGF0U2V0dGluZ3NEaXYuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICAgICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9PT0gdHJ1ZSl7ICAgICAgICAgICAgICAgICAgICAgLy9DaGVja3MgaWYgUsO2dmFyc3Byw6VrIGlzIHRydWUsIHRoZW4gdGhlIGJveCBzaG91bGQgYmUgY2hlY2tlZFxuICAgICAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgIC8vRXZlbnQgbGlzdGVuZXIgb24gd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIG9wdGlvblxuICAgICAgICAgICAgICAgICAgICBpZihyb3ZhcnNwcmFrLmNoZWNrZWQgPT09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudE5vZGUgPSB0aGlzLnRvcEJhci5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gcGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hhdFNldHRpbmdzRGl2LCBjaGlsZHJlblswXSk7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGNvdW50ICUgMiA9PT0gMCl7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7ICAgIC8vSWYgdGhpcyBpcyB0aGUgc2Vjb25kIHRpbWUgKGV2ZW4pIGNsaWNrZWQsIGhpZGUgdGhlIHNldHRpbmdzXG4gICAgICAgICAgICAgICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGF0c2V0dGluZ3MnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7ICAgIC8vSWYgdGhpcyBpcyBhIHRoaXJkIHRpbWUgKHVuZXZlbikgY2xpY2tlZCwgZGlzcGxheSB0aGUgc2V0dGluZ3MgYWdhaW5cbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWNyZXRMYW5nKHRleHQpIHsgICAgICAgICAgICAgICAgICAvL1RoZSBtZXNzYWdlIHR1cm5zIGludG8gYSAnc2VjcmV0JyBtZXNzYWdlXG5cbiAgICAgICAgbGV0IGtvbnNvbmFudGVyID0gWydCJywgJ2InLCAnQycsICdjJywgJ0QnLCAnZCcsICdGJywgJ2YnLCAnRycsICdnJywgJ0gnLCAnaCcsICdKJywgJ2onLCAnSycsICdrJywgJ0wnLCAnbCcsICdNJywgJ20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ04nLCAnbicsICdQJywgJ3AnLCAnUScsICdxJywgJ1InLCAncicsICdTJywgJ3MnLCAgJ1QnLCAndCcsICdWJywgJ3YnLCAnVycsICd3JywgJ1gnLCAneCcsICdaJywgJ3onXTtcblxuICAgICAgICBsZXQgbmV3U3RyaW5nID0gJyc7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpICsrKXtcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBrb25zb25hbnRlci5sZW5ndGg7IGogKyspe1xuICAgICAgICAgICAgICAgIGlmKHRleHRbaV0gPT09IGtvbnNvbmFudGVyW2pdKXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nICs9IHRleHRbaV0gKyAnbyc7ICAgICAgICAgICAgIC8vQWRkcyBhbiAnbycgdG8gYWxsIGNvbnNvbmFudHNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKGlucHV0KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TZW5kcyB0aGUgbWVzc2FnZSBhcyBKU09OIHZpYSB3ZWJzb2NrZXRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZSBldmVyeSB0aW1lIGEgbWVzc2FnZSBpcyBzZW50XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBKU09OLnBhcnNlKHRoaXMuY2xpZW50VXNlck5hbWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnNlY3JldExhbmdPcHRpb24gPT09IHRydWUpeyAgICAgICAgLy9JZiB0aGUgc2VjcmV0IGxhbmcgaXMgc2VsY3RlZCwgY29udmVydCB0aGUgbWVzc2FnZXNcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5zZWNyZXRMYW5nKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIFwiZGF0YVwiIDogaW5wdXQsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgcmVjaWV2ZU1lc3NhZ2UoZSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1doZW4gbmV3IG1lc3NhZ2VzIGlzIHJlY2VpdmVkLCBkaXNwbGF5IGl0IGluIHRoZSBjaGF0IHdpbmRvd1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGFsbCBuZWNlc3NhcnkgZWxlbWVudHNcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UudXNlcm5hbWUgKyAnOicpO1xuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBsZXQgdGV4dFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgdGV4dFAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZXNzYWdlY29udGVudCcpO1xuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdXNlcm5hbWUgaXMgZXF1YWwgdG8gdGhlIGNsaWVudCB1c2VyIG5hbWUsIGFkZCBjbGllbnQgY2xhc3NcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnR5cGUgPT09ICdub3RpZmljYXRpb24nKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBjbGFzcyB0byBzZXJ2ZXIgbWVzc2FnZXMgc28gdXNlciBjYW4gdGVsbCBkaWZmZXJlbmNlXG4gICAgICAgICAgICAgICAgc2VuZGVyTmFtZS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VydmVybWVzc2FnZScpO1xuICAgICAgICAgICAgfSBlbHNleyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgY2xhc3MgdG8gdGhlIHJlcGxpZXMgd2l0aCBuYW1lcyBub3QgZXF1YWwgdG8gdGhlIGNsaWVudCB1c2VybmFtZVxuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRyZXBseScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW5kZXJOYW1lLmFwcGVuZENoaWxkKHNlbmRlcik7XG4gICAgICAgICAgICBtZXNzYWdlLmFwcGVuZENoaWxkKHNlbmRlck5hbWUpO1xuXG4gICAgICAgICAgICB0ZXh0UC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dFApO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsVG9wID0gdGhpcy53aW5kb3dDb250ZW50LmZpcnN0RWxlbWVudENoaWxkLnNjcm9sbEhlaWdodDsgICAgICAgICAgICAgICAgICAgICAgICAgLy9TY3JvbGxzIGFuZCBzaG93cyB0aGUgbGF0ZXN0IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yNi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBDaGF0ID0gcmVxdWlyZSgnLi9OZXdDaGF0Jyk7XG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9NZW1vcnknKTtcbmNvbnN0IFNldHRpbmdzID0gcmVxdWlyZSgnLi9TZXR0aW5ncycpO1xuXG5jbGFzcyBOZXdEZXNrdG9wIHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLndpbmRvd0FwcENvdW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3cnKTtcbiAgICB9XG4gICAgYXBwcygpe1xuICAgICAgICBsZXQgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJykucXVlcnlTZWxlY3RvcignI3NpZGViYXInKTtcblxuICAgICAgICBsZXQgY2hhdCA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0NoYXQnKTtcbiAgICAgICAgbGV0IGdhbWUgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNHYW1lJyk7XG4gICAgICAgIGxldCBzZXR0aW5ncyA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI1NldHRpbmdzJyk7XG5cblxuICAgICAgICBjaGF0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbmV3IENoYXQoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuICAgICAgICB9KTsgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG5cbiAgICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG5ldyBHYW1lKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7ICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYSBuZXcgZ2FtZSB1cG9uIGEgY2xpY2ssIGNoYXQgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEd1aSBjcmVhdGluZyBhIG5ldyBjaGF0IHdpbmRvd1xuXG4gICAgICAgIHNldHRpbmdzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG5ldyBTZXR0aW5ncyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pOyAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGEgbmV3IGNoYXQgdXBvbiBhIGNsaWNrLCBjaGF0IHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBHdWkgY3JlYXRpbmcgYSBuZXcgY2hhdCB3aW5kb3dcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3RGVza3RvcDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqL1xuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgU2V0dGluZ3MgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMud2luZG93Q29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgLy9UaGUgdG9wYmFyIG9mIHRoZSBnYW1lLWFwcFxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXRTZXR0aW5nc0NvbnRlbnQoKTsgICAgICAgICAgICAgICAgICAgLy9TdGFydGluZyBwb2ludCBvZiB0aGUgYXBwXG4gICAgICAgIHRoaXMuY2hhbmdlVGhlbWUoKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIH1cbiAgICBjcmVhdGVDaGF0U2V0dGluZ3NDb250ZW50KCkge1xuICAgICAgICAvLyBpZih0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmdzQ29udGVudCcpLmZpcnN0RWxlbWVudENoaWxkICE9PSBudWxsKXtcbiAgICAgICAgLy8gICAgIHRoaXMud2luZG93Q29udGVudC5yZW1vdmVDaGlsZCh0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmdzQ29udGVudCcpKTsgICAgIC8vQ2xlYXJzIHRoZSBkaXZcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylbNV0uY29udGVudDsgIC8vSW1wb3J0cyB0aGUgdGVtcGxhdGUgbmVlZGVkXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcblxuICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyN1c2VybmFtZScpO1xuICAgICAgICB0aGlzLmNoZWNrVXNlck5hbWUodXNlcm5hbWUpOyAgICAgICAvL0NoZWNrcyB0aGUgdXNlcm5hbWVcbiAgICB9XG5cbiAgICBjaGVja1VzZXJOYW1lKHVzZXJuYW1lKSB7XG4gICAgICAgIGxldCBjbGllbnRVc2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpOyAgICAgIC8vQ2hlY2tzIGxvY2FsIHN0b3JhZ2UgZm9yIGEgdXNlcm5hbWVcblxuICAgICAgICBsZXQgbmFtZSA9IEpTT04ucGFyc2UoY2xpZW50VXNlck5hbWUpO1xuXG4gICAgICAgIGlmKG5hbWUgPT09IG51bGwpeyAgICAgIC8vSWYgdXNlcm5hbWUgaXMgbm90IGRlZmluZWQsIHNldCB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgICAgIG5hbWUgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYW1lLnVzZXJuYW1lKTsgICAgIC8vVGhlIHVzZXJuYW1lIGlzIHB1dCBpbiBhIHAgZWxlbWVudFxuXG4gICAgICAgIGlmKHBUZXh0LnRleHRDb250ZW50ID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICBwVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVOb3RTZXQnKTsgICAgICAgLy9JZiB0aGUgdXNlcm5hbWUgaXMgdW5kZWZpbmVkLCBhZGQgdGhlIGNsYXNzIHVzZXJuYW1lIG5vdCBzZXRcbiAgICAgICAgfVxuXG4gICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICB1c2VybmFtZS5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpWzBdOyAgLy9BZGRzIGFuIGV2ZW50IHRvIHRoZSBmaXJzdCBidXR0b24gaW4gdGhlIHdpbmRvd1xuXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVudGVyLWtleSB3aGVuIHR5cGluZywgc2VuZCB0aGUgbWVzc2FnZSB3aGVuIHByZXNzZWRcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpe1xuICAgICAgICAgICAgICAgIHRoaXMudmVyaWZ5VXNlcm5hbWUoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIHRoaXMudmVyaWZ5VXNlcm5hbWUoaW5wdXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2ZXJpZnlVc2VybmFtZShpbnB1dCl7XG4gICAgICAgIGlmKGlucHV0LnZhbHVlLmxlbmd0aCA8PSAwIHx8IGlucHV0LnZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dC52YWx1ZSA9PT0gJ1RoZSBTZXJ2ZXInKXsgLy9DaGVja3MgdGhlIGlucHV0IHZhbHVlIGlmIGl0IGlzIGEgcHJvcGVyIHVzZXJuYW1lXG4gICAgICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOb3QgYSB2YWxpZCB1c2VybmFtZSEnKTtcbiAgICAgICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgICAgICBwLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LmFwcGVuZENoaWxkKHApO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLndpbmRvd0NvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0NoYXRVc2VyJywgSlNPTi5zdHJpbmdpZnkoY2hhdFVzZXJuYW1lKSk7ICAgICAvL0lmIHRoZSB1c2VybmFtZSBwYXNzZXMgdGhlIHJ1bGVzLCBMUyBpcyBzZXQgdG8gdGhlIG5ldyBuYW1lXG4gICAgICAgICAgICBsZXQgbmV3TmFtZSA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCcjdXNlcm5hbWUnKTtcbiAgICAgICAgICAgIG5ld05hbWUudGV4dENvbnRlbnQgPSB0aGlzLnVzZXJOYW1lO1xuICAgICAgICAgICAgdGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZXR0aW5nc0NvbnRlbnQnKS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VUaGVtZSgpe1xuXG4gICAgICAgIGlmKHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCcuY2hhbmdlVGhlbWUnKSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0NvbnRlbnQucmVtb3ZlQ2hpbGQodGhpcy53aW5kb3dDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFuZ2VUaGVtZScpKTsgICAgIC8vQ2xlYXJzIHRoZSBkaXZcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpWzZdLmNvbnRlbnQ7XG5cbiAgICAgICAgbGV0IHRoZW1lT3B0aW9ucyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuXG4gICAgICAgIHRoaXMud2luZG93Q29udGVudC5hcHBlbmRDaGlsZCh0aGVtZU9wdGlvbnMpO1xuXG4gICAgICAgIGxldCB0aGVtZURpdiA9IHRoaXMud2luZG93Q29udGVudC5xdWVyeVNlbGVjdG9yKCcuY2hhbmdlVGhlbWUnKTtcblxuICAgICAgICB0aGVtZURpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBjbGlja2VkID0gZXZlbnQudGFyZ2V0LmNsYXNzTGlzdFswXTtcblxuICAgICAgICAgICAgaWYoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnQScpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgbGV0IG9wdGlvbjEgPSAnYWxpY2VibHVlJztcbiAgICAgICAgICAgIGxldCBvcHRpb24yID0gJyNGOEJGMjgnO1xuICAgICAgICAgICAgbGV0IG9wdGlvbjMgPSAnIzAwYWVmZic7XG5cbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcblxuICAgICAgICAgICAgaWYoY2xpY2tlZCA9PT0gJ29wdGlvbjEnKXtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmQgPSAwO1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9uMTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGNsaWNrZWQgPT09ICdvcHRpb24yJyl7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wdGlvbjI7XG4gICAgICAgICAgICB9ZWxzZSBpZihjbGlja2VkID09PSAnb3B0aW9uMycpe1xuICAgICAgICAgICAgICAgIHdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb24zO1xuICAgICAgICAgICAgfWVsc2UgaWYoY2xpY2tlZCA9PT0gJ29wdGlvbjQnKXtcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmJhY2tncm91bmQgPSAndXJsKFwiL2ltYWdlL2pha2V0aGVkb2cucG5nXCIpIGNlbnRlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgTmV3RGVza3RvcCA9IHJlcXVpcmUoJy4vTmV3RGVza3RvcCcpO1xuXG5jb25zdCBEZXNrdG9wID0gbmV3IE5ld0Rlc2t0b3AoKTtcblxuRGVza3RvcC5hcHBzKCk7XG4iXX0=
