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
        this.topBar = appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);
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
        position.querySelector('.appsettings').setAttribute('id', this.windowApp + this.counter);
        position.querySelector('.appsettings').firstChild.setAttribute('src', '/image/Settings.png');
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
        sendATag.setAttribute('class', 'sendicon');                                                                     //Takes a image and uses it to send messages
        sendImg.setAttribute('src', '/image/send.png');

        this.content.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);                                                                                   //Appends all the newly created elements
        sendATag.appendChild(sendImg);
        formDiv.appendChild(sendATag);
        this.content.appendChild(formDiv);

        this.chatSettings();

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

    chatSettings(){
        let count = 1;
        this.topBar.querySelector('.appsettings').addEventListener('click', event =>{
            count += 1;
            if(count % 2 === 0){
                let chatSettingsDiv = document.createElement('div');
                let pTag = document.createElement('p');
                let text = document.createTextNode('text test');

                chatSettingsDiv.setAttribute('class', 'chatsettings');

                pTag.appendChild(text);
                chatSettingsDiv.appendChild(pTag);

                document.getElementById(this.topBar.parentNode.id).appendChild(chatSettingsDiv);
            }else{
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI3LlxuICpcbiAqICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHVUl7XG4gICAgY29uc3RydWN0b3Iod2luZG93QXBwLCBjb3VudGVyKSB7XG4gICAgICAgIHRoaXMud2luZG93QXBwID0gd2luZG93QXBwO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSBjb3VudGVyO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuICAgIGd1aSgpe1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlciB0ZW1wbGF0ZScpO1xuICAgICAgICBsZXQgYXBwV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy53aW5kb3dBcHApO1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgdGhpcy50b3BCYXIgPSBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyB0aGlzLndpbmRvd0FwcCk7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA0NSArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEwNSArICdweCc7XG5cbiAgICAgICAgYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGljb24nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIHRoaXMud2luZG93QXBwICsgJy5wbmcnKTtcblxuICAgICAgICBpZih0aGlzLndpbmRvd0FwcCA9PT0gJ0dhbWUnIHx8IHRoaXMud2luZG93QXBwID09PSAnQ2hhdCcpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBzZXR0aW5ncyBvcHRpb25cbiAgICAgICAgICAgIHRoaXMuYXBwU2V0dGluZ3MoYXBwV2luZG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcjY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+eyAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGZ1bmN0aW9uIHRvIGNsb3NlIHdpbmRvd1xuICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudC50YXJnZXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmUoYXBwV2luZG93LmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgICAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoYXBwV2luZG93KTtcblxuICAgIH1cblxuICAgIGNsb3NlKG5vZGUpIHsgICAgICAgLy9SZW1vdmVzIHRoZSBwYXJlbnQgbm9kZSBvZiB0aGUgcGFyZW50IG5vZGUgKHRoZSBXaW5kb3cgc2VsZWN0ZWQpXG4gICAgICAgIG5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgIH1cblxuICAgIGFwcFNldHRpbmdzKHBvc2l0aW9uKSB7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLndpbmRvd0FwcCArIHRoaXMuY291bnRlcik7XG4gICAgICAgIHBvc2l0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL1NldHRpbmdzLnBuZycpO1xuICAgIH1cblxuICAgIGdhbWVTZXR0aW5ncygpe1xuICAgICAgICBjb25zb2xlLmxvZygnSGVsbG9vb28gZ2FtZSBzZXR0aW5ncyEnKVxuICAgIH1cblxuICAgIG1vdmUoc2VsZWN0ZWQpIHsgICAgLy9NYWtlcyBpdCBwb3NzaWJsZSBmb3IgdGhlIHVzZXIgdG8gbW92ZSB0aGUgd2luZG93XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuXG4gICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ29ubW91c2Vkb3duJyk7XG5cbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NYID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWSA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wLCAxMCk7XG5cbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZXZlbnQucGFnZVggLSB3aW5kb3dQb3NYO1xuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBldmVudC5wYWdlWSAtIHdpbmRvd1Bvc1k7XG5cbiAgICAgICAgICAgIGxldCBtb3ZlV2luZG93ID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1ggPSBlLnBhZ2VYIC0gb2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWSA9IGUucGFnZVkgLSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wID0gbW92ZVRvWSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0ID0gbW92ZVRvWCArICdweCc7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ29ubW91c2Vkb3duJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR1VJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIE1lbW9yeSBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICpcbiAqIFRvRG8gY2xvc2Ugc29ja2V0IHdoZW4gd2luZG93IGlzIGNsb3NlZFxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIENoYXQgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0xldHMgdGhlIGFwcCBrbm93IHdoaWNoIHdpbmRvdyBpcyB3aGljaFxuICAgICAgICB0aGlzLnRvcEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmZpcnN0RWxlbWVudENoaWxkOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGUgdG9wYmFyIG9mIHRoZSBjaGF0LWFwcFxuICAgICAgICB0aGlzLmNoYXROYW1lID0gJyc7XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5lbnRlck5hbWUoKTtcbiAgICAgICAgdGhpcy5zZWNyZXRMYW5nT3B0aW9uID0gZmFsc2U7XG4gICAgfVxuICAgIGVudGVyTmFtZSgpIHtcbiAgICAgICAgbGV0IHVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7XG5cbiAgICAgICAgaWYodXNlck5hbWUgIT09IG51bGwpe1xuICAgICAgICAgICAgdXNlck5hbWUgPSBKU09OLnBhcnNlKHVzZXJOYW1lKTtcbiAgICAgICAgICAgIHRoaXMuY2hhdE5hbWUgPSB1c2VyTmFtZS51c2VybmFtZTtcbiAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpO1xuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jb250ZW50LmNsYXNzTmFtZSArPSAnIHVzZXJuYW1lJztcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxldCBkaXZJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxldCBhVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgbGV0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRW50ZXIgYSB1c2VybmFtZTonKTtcblxuICAgICAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXG4gICAgICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL2FjY2VwdC5wbmcnKTtcbiAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3VzZXJuYW1lZmllbGQnKTtcblxuICAgICAgICAgICAgYVRhZy5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICAgICAgZGl2SW1nLmFwcGVuZENoaWxkKGFUYWcpO1xuICAgICAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG4gICAgICAgICAgICBmb3JtVGFnLmFwcGVuZENoaWxkKGlucHV0VGFnKTtcblxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHBUYWcpO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRpdkltZyk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgICAgICAgICBhVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoIDw9IDAgfHwgaW5wdXRWYWx1ZS5sZW5ndGggPj0gMjUgfHwgaW5wdXRWYWx1ZSA9PT0gJ1RoZSBTZXJ2ZXInKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ05vdCBhIHZhbGlkIHVzZXJuYW1lIGR1ZGUhJylcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VyTmFtZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hhdFVzZXJuYW1lID0ge3VzZXJuYW1lOiB0aGlzLnVzZXJOYW1lfTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0NoYXRVc2VyJywgSlNPTi5zdHJpbmdpZnkoY2hhdFVzZXJuYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdE5hbWUgPSBpbnB1dFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZW50ZXJ1c2VybmFtZScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGF0QXBwKCl7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC8nKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICBldmVudCA9PiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vT3BlbnMgdXAgYSBuZXcgc29ja2V0IGFuZCBzdGFydHMgcmVjZWl2aW5nIHRoZSBtZXNzYWdlc1xuICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmb3JtRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGVzIGVsZW1lbnRzIG5lY2Vzc2FyeSBmb3IgdGhlIGNoYXQtYXBwXG4gICAgICAgIGxldCBzZW5kSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGxldCBzZW5kQVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgdGhpcy50ZXh0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICB0aGlzLnRleHRGaWVsZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RleHRmaWVsZCcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIHN0eWxpbmdcbiAgICAgICAgZm9ybURpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRTdHlsZXMnKTtcbiAgICAgICAgZm9ybVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Zvcm1zdHlsZScpO1xuICAgICAgICBpbnB1dFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRpbnB1dCcpO1xuICAgICAgICBzZW5kQVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICBzZW5kQVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbmRpY29uJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UYWtlcyBhIGltYWdlIGFuZCB1c2VzIGl0IHRvIHNlbmQgbWVzc2FnZXNcbiAgICAgICAgc2VuZEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2Uvc2VuZC5wbmcnKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy50ZXh0RmllbGQpO1xuICAgICAgICBmb3JtVGFnLmFwcGVuZENoaWxkKGlucHV0VGFnKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQXBwZW5kcyBhbGwgdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgICAgc2VuZEFUYWcuYXBwZW5kQ2hpbGQoc2VuZEltZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoc2VuZEFUYWcpO1xuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZm9ybURpdik7XG5cbiAgICAgICAgdGhpcy5jaGF0U2V0dGluZ3MoKTtcblxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBlbnRlci1rZXkgd2hlbiB0eXBpbmcsIHNlbmQgdGhlIG1lc3NhZ2Ugd2hlbiBwcmVzc2VkXG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKXtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbmRBVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBzZW5kIGljb24gdG8gc2VuZCBtZXNzYWdlXG4gICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGNoYXRTZXR0aW5ncygpe1xuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICB0aGlzLnRvcEJhci5xdWVyeVNlbGVjdG9yKCcuYXBwc2V0dGluZ3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmKGNvdW50ICUgMiA9PT0gMCl7XG4gICAgICAgICAgICAgICAgbGV0IGNoYXRTZXR0aW5nc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3RleHQgdGVzdCcpO1xuXG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHNldHRpbmdzJyk7XG5cbiAgICAgICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudG9wQmFyLnBhcmVudE5vZGUuaWQpLmFwcGVuZENoaWxkKGNoYXRTZXR0aW5nc0Rpdik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy50b3BCYXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNoYXRzZXR0aW5ncycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlY3JldExhbmcodGV4dCkgeyAgICAgICAgICAgICAgICAgIC8vVGhlIG1lc3NhZ2UgdHVybnMgaW50byBhICdzZWNyZXQnIG1lc3NhZ2VcblxuICAgICAgICBsZXQga29uc29uYW50ZXIgPSBbJ0InLCAnYicsICdDJywgJ2MnLCAnRCcsICdkJywgJ0YnLCAnZicsICdHJywgJ2cnLCAnSCcsICdoJywgJ0onLCAnaicsICdLJywgJ2snLCAnTCcsICdsJywgJ00nLCAnbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnTicsICduJywgJ1AnLCAncCcsICdRJywgJ3EnLCAnUicsICdyJywgJ1MnLCAncycsICAnVCcsICd0JywgJ1YnLCAndicsICdXJywgJ3cnLCAnWCcsICd4JywgJ1onLCAneiddO1xuXG4gICAgICAgIGxldCBuZXdTdHJpbmcgPSAnJztcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkgKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGtvbnNvbmFudGVyLmxlbmd0aDsgaiArKyl7XG4gICAgICAgICAgICAgICAgaWYodGV4dFtpXSA9PT0ga29uc29uYW50ZXJbal0pe1xuICAgICAgICAgICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXSArICdvJzsgICAgICAgICAgICAgLy9BZGRzIGFuICdvJyB0byBhbGwgY29uc29uYW50c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1N0cmluZyArPSB0ZXh0W2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHJpbmc7XG4gICAgfVxuXG4gICAgc2VuZE1lc3NhZ2UoaW5wdXQpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1NlbmRzIHRoZSBtZXNzYWdlIGFzIEpTT04gdmlhIHdlYnNvY2tldFxuICAgICAgICB0aGlzLmNsaWVudFVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0NoYXRVc2VyJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVja3MgdGhlIHVzZXJuYW1lIGV2ZXJ5IHRpbWUgYSBtZXNzYWdlIGlzIHNlbnRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IEpTT04ucGFyc2UodGhpcy5jbGllbnRVc2VyTmFtZSk7XG4gICAgICAgIGlmICh0aGlzLnNlY3JldExhbmdPcHRpb24gPT09IHRydWUpe1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLnNlY3JldExhbmcoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBpbnB1dCxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy5jbGllbnRVc2VyTmFtZS51c2VybmFtZSxcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICByZWNpZXZlTWVzc2FnZShlKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2hlbiBuZXcgbWVzc2FnZXMgaXMgcmVjZWl2ZWQsIGRpc3BsYXkgaXQgaW4gdGhlIGNoYXQgd2luZG93XG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS51c2VybmFtZSArICc6Jyk7XG4gICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIGxldCB0ZXh0UCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdXNlcm5hbWUgaXMgZXF1YWwgdG8gdGhlIGNsaWVudCB1c2VyIG5hbWUsIGFkZCBjbGllbnQgY2xhc3NcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSAnVGhlIFNlcnZlcicpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHNlcnZlciBtZXNzYWdlcyBzbyB1c2VyIGNhbiB0ZWxsIGRpZmZlcmVuY2VcbiAgICAgICAgICAgICAgICBzZW5kZXJOYW1lLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXJ2ZXJtZXNzYWdlJyk7XG4gICAgICAgICAgICB9IGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBjbGFzcyB0byB0aGUgcmVwbGllcyB3aXRoIG5hbWVzIG5vdCBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHJlcGx5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRlck5hbWUuYXBwZW5kQ2hpbGQoc2VuZGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG4gICAgICAgICAgICB0ZXh0UC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dFApO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsVG9wID0gdGhpcy5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLnNjcm9sbEhlaWdodDsgICAgICAgICAgICAgICAgICAgICAgICAgLy9TY3JvbGxzIGFuZCBzaG93cyB0aGUgbGF0ZXN0IG1lc3NhZ2UgcmVjZWl2ZWRcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yNi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBDaGF0ID0gcmVxdWlyZSgnLi9OZXdDaGF0Jyk7XG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9NZW1vcnknKTtcbmNvbnN0IFNldHRpbmdzID0gcmVxdWlyZSgnLi9TZXR0aW5ncycpO1xuXG5jbGFzcyBOZXdEZXNrdG9wIHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLndpbmRvd0FwcENvdW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3cnKTtcbiAgICB9XG4gICAgYXBwcygpe1xuICAgICAgICBsZXQgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJykucXVlcnlTZWxlY3RvcignI3NpZGViYXInKTtcblxuICAgICAgICBsZXQgY2hhdCA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0NoYXQnKTtcbiAgICAgICAgbGV0IGdhbWUgPSBzaWRlYmFyLnF1ZXJ5U2VsZWN0b3IoJyNHYW1lJyk7XG4gICAgICAgIGxldCBzZXR0aW5ncyA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI1NldHRpbmdzJyk7XG5cblxuICAgICAgICBjaGF0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgYSBuZXcgY2hhdCB1cG9uIGEgY2xpY2ssIGNoYXQgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBjaGF0IHdpbmRvd1xuICAgICAgICAgICAgbGV0IGNoYXQgPSBuZXcgQ2hhdChldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCwgdGhpcy53aW5kb3dBcHBDb3VudGVyLmxlbmd0aCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdhbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBnYW1lID0gbmV3IEdhbWUoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQpO1xuICAgICAgICAgICAgLy8gVG9ETyBDcmVhdGUgYSBuZXcgZ2FtZSB1cG9uIGEgY2xpY2ssIGdhbWUgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBnYW1lIHdpbmRvd1xuICAgICAgICB9KTtcblxuICAgICAgICBzZXR0aW5ncy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBzZXR0aW5ncyA9IG5ldyBTZXR0aW5ncyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCk7XG4gICAgICAgICAgICAvLyBUb0RPIENyZWF0ZSBhIG5ldyBTZXR0aW5ncyB1cG9uIGEgY2xpY2ssIHNldHRpbmdzIHdpbGwgaW5oZXJpdCBzdHJ1Y3R1cmUgZnJvbSBBcHBHdWkgY3JlYXRpbmcgYSBuZXcgc2V0dGluZ3Mgd2luZG93XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXdEZXNrdG9wO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICovXG5jb25zdCBHVUkgPSByZXF1aXJlKCcuL0dVSScpO1xuXG5jbGFzcyBTZXR0aW5ncyBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gY29uc3QgRGVza3RvcCA9IHJlcXVpcmUoJy4vRGVza3RvcCcpO1xuLy9cbi8vIGNvbnN0IGRlc2t0b3AgPSBuZXcgRGVza3RvcDtcbi8vXG4vLyBkZXNrdG9wLmNsaWNrKCk7XG5cbmNvbnN0IE5ld0Rlc2t0b3AgPSByZXF1aXJlKCcuL05ld0Rlc2t0b3AnKTtcblxuY29uc3QgRGVza3RvcCA9IG5ldyBOZXdEZXNrdG9wKCk7XG5cbkRlc2t0b3AuYXBwcygpO1xuIl19
