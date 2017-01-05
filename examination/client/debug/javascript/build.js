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
        let template = document.querySelector('#wrapper template');
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let pTag = document.createElement('p');
        let pText = document.createTextNode(this.windowApp);
        pTag.appendChild(pText);

        appWindow.setAttribute('id', this.windowApp + this.counter);
        appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 + 'px';
        appWindow.style.left =+ 105 + 'px';

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
        position.querySelector('#' + this.windowApp + 'Settings').setAttribute('src', '/image/Settings.png');

        let onClick = position.querySelector('#' + this.windowApp + 'Settings').parentNode;

        onClick.addEventListener('click', event => {
            if(this.windowApp === 'Chat'){
                this.chatSettings();
            }else{
                this.gameSettings();
            }

        });                          //Creates settings depending on which window that is being created
    }

    chatSettings(){
        console.log('Hello chatsettings')
    }

    gameSettings(){
        console.log('Helloooo game settings!')
    }

    move(selected) {    //Makes it possible for the user to move the window
        selected.addEventListener('mousedown', event =>{

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left, 10);
            let windowPosY = parseInt(selected.parentNode.style.top, 10);

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;

            let moveWindow = function(e) {

                let moveToX = e.pageX - offsetX;
                let moveToY = e.pageY - offsetY;
                selected.parentNode.style.top = moveToY + 'px';
                selected.parentNode.style.left = moveToX + 'px';

            };

            let removeEvent = function(x) {
                selected.parentNode.classList.remove('onmousedown');
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
        sendATag.setAttribute('class', 'sendicon');                                                                         //Takes a image and uses it to send messages
        sendImg.setAttribute('src', '/image/send.png');

        this.content.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);                                                                                   //Appends all the newly created elements
        sendATag.appendChild(sendImg);
        formDiv.appendChild(sendATag);
        this.content.appendChild(formDiv);

        inputTag.addEventListener('keydown', event =>{                                                                    //Adds an event listener to the enter-key when typing, send the message when pressed
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


        chat.addEventListener('click', event =>{                                //Creates a new chat upon a click, chat will inherit structure from AppGui creating a new chat window
            let chat = new Chat(event.target.parentNode.id, this.windowAppCounter.length);
        });

        game.addEventListener('click', event =>{
            let game = new Game(event.target.parentNode.id);
            // ToDO Create a new game upon a click, game will inherit structure from AppGui creating a new game window
        });

        settings.addEventListener('click', event => {
            let settings = new Settings(event.target.parentNode.id);
            // ToDO Create a new Settings upon a click, settings will inherit structure from AppGui creating a new settings window
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
    }
}

module.exports = Settings;

},{"./GUI":1}],6:[function(require,module,exports){
/**
 *
 * Created by vinces on 2016-12-14.
 */

'use strict';

// const Desktop = require('./Desktop');
//
// const desktop = new Desktop;
//
// desktop.click();

const NewDesktop = require('./NewDesktop');

const Desktop = new NewDesktop();

Desktop.apps();

},{"./NewDesktop":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yNy5cbiAqXG4gKiAqIFRvRG8gTWFrZSBhIGd1aSB0aGF0IGFsbCB0aGUgYXBwcyBpbmhlcml0cy5cbiAqL1xuXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgR1VJe1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvd0FwcCwgY291bnRlcikge1xuICAgICAgICB0aGlzLndpbmRvd0FwcCA9IHdpbmRvd0FwcDtcbiAgICAgICAgdGhpcy5jb3VudGVyID0gY291bnRlcjtcbiAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcbiAgICAgICAgdGhpcy5ndWkoKTtcbiAgICB9XG5cbiAgICBndWkoKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXIgdGVtcGxhdGUnKTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMud2luZG93QXBwKTtcbiAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG5cbiAgICAgICAgYXBwV2luZG93LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuc2V0QXR0cmlidXRlKCdpZCcsICd3aW5kb3cgJyArIHRoaXMud2luZG93QXBwKTtcbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUudG9wID0rIDQ1ICsgJ3B4JztcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLmxlZnQgPSsgMTA1ICsgJ3B4JztcblxuICAgICAgICBhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9waWNvbicpLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS8nICsgdGhpcy53aW5kb3dBcHAgKyAnLnBuZycpO1xuXG4gICAgICAgIGlmKHRoaXMud2luZG93QXBwID09PSAnR2FtZScgfHwgdGhpcy53aW5kb3dBcHAgPT09ICdDaGF0Jyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIHNldHRpbmdzIG9wdGlvblxuICAgICAgICAgICAgdGhpcy5hcHBTZXR0aW5ncyhhcHBXaW5kb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgZnVuY3Rpb24gdG8gY2xvc2Ugd2luZG93XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW92ZShhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuXG4gICAgfVxuXG4gICAgY2xvc2Uobm9kZSkgeyAgICAgICAvL1JlbW92ZXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYXJlbnQgbm9kZSAodGhlIFdpbmRvdyBzZWxlY3RlZClcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgfVxuXG4gICAgYXBwU2V0dGluZ3MocG9zaXRpb24pIHtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLndpbmRvd0FwcCArICdTZXR0aW5ncycpLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9TZXR0aW5ncy5wbmcnKTtcblxuICAgICAgICBsZXQgb25DbGljayA9IHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGhpcy53aW5kb3dBcHAgKyAnU2V0dGluZ3MnKS5wYXJlbnROb2RlO1xuXG4gICAgICAgIG9uQ2xpY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgICBpZih0aGlzLndpbmRvd0FwcCA9PT0gJ0NoYXQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXRTZXR0aW5ncygpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBzZXR0aW5ncyBkZXBlbmRpbmcgb24gd2hpY2ggd2luZG93IHRoYXQgaXMgYmVpbmcgY3JlYXRlZFxuICAgIH1cblxuICAgIGNoYXRTZXR0aW5ncygpe1xuICAgICAgICBjb25zb2xlLmxvZygnSGVsbG8gY2hhdHNldHRpbmdzJylcbiAgICB9XG5cbiAgICBnYW1lU2V0dGluZ3MoKXtcbiAgICAgICAgY29uc29sZS5sb2coJ0hlbGxvb29vIGdhbWUgc2V0dGluZ3MhJylcbiAgICB9XG5cbiAgICBtb3ZlKHNlbGVjdGVkKSB7ICAgIC8vTWFrZXMgaXQgcG9zc2libGUgZm9yIHRoZSB1c2VyIHRvIG1vdmUgdGhlIHdpbmRvd1xuICAgICAgICBzZWxlY3RlZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcblxuICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdvbm1vdXNlZG93bicpO1xuXG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWCA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1kgPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCwgMTApO1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IGV2ZW50LnBhZ2VYIC0gd2luZG93UG9zWDtcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gZXZlbnQucGFnZVkgLSB3aW5kb3dQb3NZO1xuXG4gICAgICAgICAgICBsZXQgbW92ZVdpbmRvdyA9IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9YID0gZS5wYWdlWCAtIG9mZnNldFg7XG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1kgPSBlLnBhZ2VZIC0gb2Zmc2V0WTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCA9IG1vdmVUb1kgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCA9IG1vdmVUb1ggKyAncHgnO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdvbm1vdXNlZG93bicpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCByZW1vdmVFdmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdVSTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBNZW1vcnkgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqXG4gKiBUb0RvIGNsb3NlIHNvY2tldCB3aGVuIHdpbmRvdyBpcyBjbG9zZWRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBDaGF0IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5sYXN0RWxlbWVudENoaWxkOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9MZXRzIHRoZSBhcHAga25vdyB3aGljaCB3aW5kb3cgaXMgd2hpY2hcbiAgICAgICAgdGhpcy50b3BCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lK2NvdW50KS5maXJzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhlIHRvcGJhciBvZiB0aGUgY2hhdC1hcHBcbiAgICAgICAgdGhpcy5jaGF0TmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gJyc7XG4gICAgICAgIHRoaXMuZW50ZXJOYW1lKCk7XG4gICAgICAgIHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9IGZhbHNlO1xuICAgIH1cbiAgICBlbnRlck5hbWUoKSB7XG4gICAgICAgIGxldCB1c2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpO1xuXG4gICAgICAgIGlmKHVzZXJOYW1lICE9PSBudWxsKXtcbiAgICAgICAgICAgIHVzZXJOYW1lID0gSlNPTi5wYXJzZSh1c2VyTmFtZSk7XG4gICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gdXNlck5hbWUudXNlcm5hbWU7XG4gICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc05hbWUgKz0gJyB1c2VybmFtZSc7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgZGl2SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgYVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0VudGVyIGEgdXNlcm5hbWU6Jyk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgICAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9hY2NlcHQucG5nJyk7XG4gICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICd1c2VybmFtZWZpZWxkJyk7XG5cbiAgICAgICAgICAgIGFUYWcuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIGRpdkltZy5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG5cbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChwVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChkaXZJbWcpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA8PSAwIHx8IGlucHV0VmFsdWUubGVuZ3RoID49IDI1IHx8IGlucHV0VmFsdWUgPT09ICdUaGUgU2VydmVyJyl7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdOb3QgYSB2YWxpZCB1c2VybmFtZSBkdWRlIScpXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXRVc2VybmFtZSA9IHt1c2VybmFtZTogdGhpcy51c2VyTmFtZX07XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdDaGF0VXNlcicsIEpTT04uc3RyaW5naWZ5KGNoYXRVc2VybmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VudGVydXNlcm5hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhdEFwcCgpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvJyk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAgZXZlbnQgPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL09wZW5zIHVwIGEgbmV3IHNvY2tldCBhbmQgc3RhcnRzIHJlY2VpdmluZyB0aGUgbWVzc2FnZXNcbiAgICAgICAgICAgIHRoaXMucmVjaWV2ZU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZm9ybURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBlbGVtZW50cyBuZWNlc3NhcnkgZm9yIHRoZSBjaGF0LWFwcFxuICAgICAgICBsZXQgc2VuZEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBsZXQgc2VuZEFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHRoaXMudGV4dEZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgdGhpcy50ZXh0RmllbGQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0ZXh0ZmllbGQnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBzdHlsaW5nXG4gICAgICAgIGZvcm1EaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0U3R5bGVzJyk7XG4gICAgICAgIGZvcm1UYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdmb3Jtc3R5bGUnKTtcbiAgICAgICAgaW5wdXRUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0aW5wdXQnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgc2VuZEFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kaWNvbicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Rha2VzIGEgaW1hZ2UgYW5kIHVzZXMgaXQgdG8gc2VuZCBtZXNzYWdlc1xuICAgICAgICBzZW5kSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9zZW5kLnBuZycpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BcHBlbmRzIGFsbCB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgICBzZW5kQVRhZy5hcHBlbmRDaGlsZChzZW5kSW1nKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChzZW5kQVRhZyk7XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcblxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVudGVyLWtleSB3aGVuIHR5cGluZywgc2VuZCB0aGUgbWVzc2FnZSB3aGVuIHByZXNzZWRcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VuZEFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHNlbmQgaWNvbiB0byBzZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgc2VjcmV0TGFuZyh0ZXh0KSB7ICAgICAgICAgICAgICAgICAgLy9UaGUgbWVzc2FnZSB0dXJucyBpbnRvIGEgJ3NlY3JldCcgbWVzc2FnZVxuXG4gICAgICAgIGxldCBrb25zb25hbnRlciA9IFsnQicsICdiJywgJ0MnLCAnYycsICdEJywgJ2QnLCAnRicsICdmJywgJ0cnLCAnZycsICdIJywgJ2gnLCAnSicsICdqJywgJ0snLCAnaycsICdMJywgJ2wnLCAnTScsICdtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdOJywgJ24nLCAnUCcsICdwJywgJ1EnLCAncScsICdSJywgJ3InLCAnUycsICdzJywgICdUJywgJ3QnLCAnVicsICd2JywgJ1cnLCAndycsICdYJywgJ3gnLCAnWicsICd6J107XG5cbiAgICAgICAgbGV0IG5ld1N0cmluZyA9ICcnO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSArKyl7XG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwga29uc29uYW50ZXIubGVuZ3RoOyBqICsrKXtcbiAgICAgICAgICAgICAgICBpZih0ZXh0W2ldID09PSBrb25zb25hbnRlcltqXSl7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0cmluZyArPSB0ZXh0W2ldICsgJ28nOyAgICAgICAgICAgICAvL0FkZHMgYW4gJ28nIHRvIGFsbCBjb25zb25hbnRzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3U3RyaW5nICs9IHRleHRbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cmluZztcbiAgICB9XG5cbiAgICBzZW5kTWVzc2FnZShpbnB1dCl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2VuZHMgdGhlIG1lc3NhZ2UgYXMgSlNPTiB2aWEgd2Vic29ja2V0XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NoZWNrcyB0aGUgdXNlcm5hbWUgZXZlcnkgdGltZSBhIG1lc3NhZ2UgaXMgc2VudFxuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gSlNPTi5wYXJzZSh0aGlzLmNsaWVudFVzZXJOYW1lKTtcbiAgICAgICAgaWYgKHRoaXMuc2VjcmV0TGFuZ09wdGlvbiA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuc2VjcmV0TGFuZyhpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcImRhdGFcIiA6IGlucHV0LFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lLFxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHJlY2lldmVNZXNzYWdlKGUpIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9XaGVuIG5ldyBtZXNzYWdlcyBpcyByZWNlaXZlZCwgZGlzcGxheSBpdCBpbiB0aGUgY2hhdCB3aW5kb3dcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLnVzZXJuYW1lICsgJzonKTtcbiAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgbGV0IHRleHRQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgIHNlbmRlck5hbWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kZXJuYW1lJyk7XG5cbiAgICAgICAgaWYocmVzcG9uc2UudHlwZSAhPT0gJ2hlYXJ0YmVhdCcpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB1c2VybmFtZSBpcyBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXIgbmFtZSwgYWRkIGNsaWVudCBjbGFzc1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NsaWVudG1lc3NhZ2UnKVxuICAgICAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09ICdUaGUgU2VydmVyJyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgY2xhc3MgdG8gc2VydmVyIG1lc3NhZ2VzIHNvIHVzZXIgY2FuIHRlbGwgZGlmZmVyZW5jZVxuICAgICAgICAgICAgICAgIHNlbmRlck5hbWUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlcnZlcm1lc3NhZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHRoZSByZXBsaWVzIHdpdGggbmFtZXMgbm90IGVxdWFsIHRvIHRoZSBjbGllbnQgdXNlcm5hbWVcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0cmVwbHknKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZGVyTmFtZS5hcHBlbmRDaGlsZChzZW5kZXIpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChzZW5kZXJOYW1lKTtcbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgICAvL1Njcm9sbHMgYW5kIHNob3dzIHRoZSBsYXRlc3QgbWVzc2FnZSByZWNlaXZlZFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cbmNsYXNzIE5ld0Rlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2luZG93QXBwQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpO1xuICAgIH1cbiAgICBhcHBzKCl7XG4gICAgICAgIGxldCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKS5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcicpO1xuXG4gICAgICAgIGxldCBjaGF0ID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjQ2hhdCcpO1xuICAgICAgICBsZXQgZ2FtZSA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0dhbWUnKTtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjU2V0dGluZ3MnKTtcblxuXG4gICAgICAgIGNoYXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG4gICAgICAgICAgICBsZXQgY2hhdCA9IG5ldyBDaGF0KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IGdhbWUgPSBuZXcgR2FtZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCk7XG4gICAgICAgICAgICAvLyBUb0RPIENyZWF0ZSBhIG5ldyBnYW1lIHVwb24gYSBjbGljaywgZ2FtZSB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGdhbWUgd2luZG93XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldHRpbmdzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHNldHRpbmdzID0gbmV3IFNldHRpbmdzKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkKTtcbiAgICAgICAgICAgIC8vIFRvRE8gQ3JlYXRlIGEgbmV3IFNldHRpbmdzIHVwb24gYSBjbGljaywgc2V0dGluZ3Mgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBzZXR0aW5ncyB3aW5kb3dcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0Rlc2t0b3A7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKi9cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIFNldHRpbmdzIGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIi8qKlxuICpcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb25zdCBEZXNrdG9wID0gcmVxdWlyZSgnLi9EZXNrdG9wJyk7XG4vL1xuLy8gY29uc3QgZGVza3RvcCA9IG5ldyBEZXNrdG9wO1xuLy9cbi8vIGRlc2t0b3AuY2xpY2soKTtcblxuY29uc3QgTmV3RGVza3RvcCA9IHJlcXVpcmUoJy4vTmV3RGVza3RvcCcpO1xuXG5jb25zdCBEZXNrdG9wID0gbmV3IE5ld0Rlc2t0b3AoKTtcblxuRGVza3RvcC5hcHBzKCk7XG4iXX0=
