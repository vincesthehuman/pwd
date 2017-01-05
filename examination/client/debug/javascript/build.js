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

                let parentNode = this.topBar.parentNode;

                let children = parentNode.childNodes;

                parentNode.insertBefore(chatSettingsDiv, children[0]);

            }else{
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').remove();
            }
        })
    }

    chatSettings() {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjcuXG4gKlxuICogKiBUb0RvIE1ha2UgYSBndWkgdGhhdCBhbGwgdGhlIGFwcHMgaW5oZXJpdHMuXG4gKi9cblxuXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIEdVSXtcbiAgICBjb25zdHJ1Y3Rvcih3aW5kb3dBcHAsIGNvdW50ZXIpIHtcbiAgICAgICAgdGhpcy53aW5kb3dBcHAgPSB3aW5kb3dBcHA7XG4gICAgICAgIHRoaXMuY291bnRlciA9IGNvdW50ZXI7XG4gICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJyk7XG4gICAgICAgIHRoaXMuZ3VpKCk7XG4gICAgfVxuXG4gICAgZ3VpKCl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyIHRlbXBsYXRlJyk7XG4gICAgICAgIGxldCBhcHBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuXG4gICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLndpbmRvd0FwcCk7XG4gICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy53aW5kb3dBcHAgKyB0aGlzLmNvdW50ZXIpO1xuICAgICAgICB0aGlzLnRvcEJhciA9IGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuc2V0QXR0cmlidXRlKCdpZCcsICd3aW5kb3cgJyArIHRoaXMud2luZG93QXBwKTtcbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUudG9wID0rIDQ1ICsgJ3B4JztcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLmxlZnQgPSsgMTA1ICsgJ3B4JztcblxuICAgICAgICBhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9waWNvbicpLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS8nICsgdGhpcy53aW5kb3dBcHAgKyAnLnBuZycpO1xuXG4gICAgICAgIGlmKHRoaXMud2luZG93QXBwID09PSAnR2FtZScgfHwgdGhpcy53aW5kb3dBcHAgPT09ICdDaGF0Jyl7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIHNldHRpbmdzIG9wdGlvblxuICAgICAgICAgICAgdGhpcy5hcHBTZXR0aW5ncyhhcHBXaW5kb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57ICAgICAgICAgICAgICAgICAgLy9BZGRzIGEgZnVuY3Rpb24gdG8gY2xvc2Ugd2luZG93XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubW92ZShhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuXG4gICAgfVxuXG4gICAgY2xvc2Uobm9kZSkgeyAgICAgICAvL1JlbW92ZXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYXJlbnQgbm9kZSAodGhlIFdpbmRvdyBzZWxlY3RlZClcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgfVxuXG4gICAgYXBwU2V0dGluZ3MocG9zaXRpb24pIHtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgcG9zaXRpb24ucXVlcnlTZWxlY3RvcignLmFwcHNldHRpbmdzJykuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvU2V0dGluZ3MucG5nJyk7XG4gICAgfVxuXG4gICAgZ2FtZVNldHRpbmdzKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdIZWxsb29vbyBnYW1lIHNldHRpbmdzIScpXG4gICAgfVxuXG4gICAgbW92ZShzZWxlY3RlZCkgeyAgICAvL01ha2VzIGl0IHBvc3NpYmxlIGZvciB0aGUgdXNlciB0byBtb3ZlIHRoZSB3aW5kb3dcbiAgICAgICAgc2VsZWN0ZWQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT57XG5cbiAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnb25tb3VzZWRvd24nKTtcblxuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1ggPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NZID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AsIDEwKTtcblxuICAgICAgICAgICAgbGV0IG9mZnNldFggPSBldmVudC5wYWdlWCAtIHdpbmRvd1Bvc1g7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IGV2ZW50LnBhZ2VZIC0gd2luZG93UG9zWTtcblxuICAgICAgICAgICAgbGV0IG1vdmVXaW5kb3cgPSBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWCA9IGUucGFnZVggLSBvZmZzZXRYO1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9ZID0gZS5wYWdlWSAtIG9mZnNldFk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AgPSBtb3ZlVG9ZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQgPSBtb3ZlVG9YICsgJ3B4JztcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHJlbW92ZUV2ZW50ID0gZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnb25tb3VzZWRvd24nKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVtb3ZlRXZlbnQpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVtb3ZlRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHVUk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgTWVtb3J5IGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKlxuICogVG9EbyBjbG9zZSBzb2NrZXQgd2hlbiB3aW5kb3cgaXMgY2xvc2VkXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgQ2hhdCBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkubGFzdEVsZW1lbnRDaGlsZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGV0cyB0aGUgYXBwIGtub3cgd2hpY2ggd2luZG93IGlzIHdoaWNoXG4gICAgICAgIHRoaXMudG9wQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZStjb3VudCkuZmlyc3RFbGVtZW50Q2hpbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoZSB0b3BiYXIgb2YgdGhlIGNoYXQtYXBwXG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9ICcnO1xuICAgICAgICB0aGlzLmVudGVyTmFtZSgpO1xuICAgICAgICB0aGlzLnNlY3JldExhbmdPcHRpb24gPSBmYWxzZTtcbiAgICB9XG4gICAgZW50ZXJOYW1lKCkge1xuICAgICAgICBsZXQgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTtcblxuICAgICAgICBpZih1c2VyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB1c2VyTmFtZSA9IEpTT04ucGFyc2UodXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IHVzZXJOYW1lLnVzZXJuYW1lO1xuICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnTm90IGEgdmFsaWQgdXNlcm5hbWUgZHVkZSEnKVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYXRBcHAoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuICAgICAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgIGV2ZW50ID0+IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9PcGVucyB1cCBhIG5ldyBzb2NrZXQgYW5kIHN0YXJ0cyByZWNlaXZpbmcgdGhlIG1lc3NhZ2VzXG4gICAgICAgICAgICB0aGlzLnJlY2lldmVNZXNzYWdlKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZvcm1EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZXMgZWxlbWVudHMgbmVjZXNzYXJ5IGZvciB0aGUgY2hhdC1hcHBcbiAgICAgICAgbGV0IHNlbmRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgbGV0IHNlbmRBVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB0aGlzLnRleHRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRoaXMudGV4dEZpZWxkLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGV4dGZpZWxkJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgc3R5bGluZ1xuICAgICAgICBmb3JtRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdFN0eWxlcycpO1xuICAgICAgICBmb3JtVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZm9ybXN0eWxlJyk7XG4gICAgICAgIGlucHV0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdGlucHV0Jyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgIHNlbmRBVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGljb24nKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Rha2VzIGEgaW1hZ2UgYW5kIHVzZXMgaXQgdG8gc2VuZCBtZXNzYWdlc1xuICAgICAgICBzZW5kSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9zZW5kLnBuZycpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9BcHBlbmRzIGFsbCB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgICBzZW5kQVRhZy5hcHBlbmRDaGlsZChzZW5kSW1nKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChzZW5kQVRhZyk7XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZUNoYXRTZXR0aW5ncygpO1xuXG4gICAgICAgIGlucHV0VGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVudGVyLWtleSB3aGVuIHR5cGluZywgc2VuZCB0aGUgbWVzc2FnZSB3aGVuIHByZXNzZWRcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VuZEFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHNlbmQgaWNvbiB0byBzZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgIGxldCBjbGVhcklucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGNsZWFySW5wdXQudmFsdWU7XG4gICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2hhdFNldHRpbmdzKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDE7XG4gICAgICAgIHRoaXMudG9wQmFyLnF1ZXJ5U2VsZWN0b3IoJy5hcHBzZXR0aW5ncycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgaWYoY291bnQgJSAyID09PSAwKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hhdFNldHRpbmdzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbGV0IHJvdmFyc3ByYWsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG5cbiAgICAgICAgICAgICAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUsO2dmFyc3Byw6VrJykpO1xuICAgICAgICAgICAgICAgIHJvdmFyc3ByYWsuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnUsO2dmFyc3Byw6VrJyk7XG4gICAgICAgICAgICAgICAgcm92YXJzcHJhay5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICByb3ZhcnNwcmFrLnNldEF0dHJpYnV0ZSgnaWQnLCAncm92YXJzcHJhaycpO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRzZXR0aW5ncycpO1xuXG4gICAgICAgICAgICAgICAgY2hhdFNldHRpbmdzRGl2LmFwcGVuZENoaWxkKHJvdmFyc3ByYWspO1xuICAgICAgICAgICAgICAgIGNoYXRTZXR0aW5nc0Rpdi5hcHBlbmRDaGlsZChsYWJlbCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50Tm9kZSA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBwYXJlbnROb2RlLmNoaWxkTm9kZXM7XG5cbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGF0U2V0dGluZ3NEaXYsIGNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMudG9wQmFyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGF0c2V0dGluZ3MnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjaGF0U2V0dGluZ3MoKSB7XG5cbiAgICB9XG5cbiAgICBzZWNyZXRMYW5nKHRleHQpIHsgICAgICAgICAgICAgICAgICAvL1RoZSBtZXNzYWdlIHR1cm5zIGludG8gYSAnc2VjcmV0JyBtZXNzYWdlXG5cbiAgICAgICAgbGV0IGtvbnNvbmFudGVyID0gWydCJywgJ2InLCAnQycsICdjJywgJ0QnLCAnZCcsICdGJywgJ2YnLCAnRycsICdnJywgJ0gnLCAnaCcsICdKJywgJ2onLCAnSycsICdrJywgJ0wnLCAnbCcsICdNJywgJ20nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ04nLCAnbicsICdQJywgJ3AnLCAnUScsICdxJywgJ1InLCAncicsICdTJywgJ3MnLCAgJ1QnLCAndCcsICdWJywgJ3YnLCAnVycsICd3JywgJ1gnLCAneCcsICdaJywgJ3onXTtcblxuICAgICAgICBsZXQgbmV3U3RyaW5nID0gJyc7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpICsrKXtcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBrb25zb25hbnRlci5sZW5ndGg7IGogKyspe1xuICAgICAgICAgICAgICAgIGlmKHRleHRbaV0gPT09IGtvbnNvbmFudGVyW2pdKXtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RyaW5nICs9IHRleHRbaV0gKyAnbyc7ICAgICAgICAgICAgIC8vQWRkcyBhbiAnbycgdG8gYWxsIGNvbnNvbmFudHNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTdHJpbmcgKz0gdGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyaW5nO1xuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKGlucHV0KXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TZW5kcyB0aGUgbWVzc2FnZSBhcyBKU09OIHZpYSB3ZWJzb2NrZXRcbiAgICAgICAgdGhpcy5jbGllbnRVc2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2tzIHRoZSB1c2VybmFtZSBldmVyeSB0aW1lIGEgbWVzc2FnZSBpcyBzZW50XG4gICAgICAgIHRoaXMuY2xpZW50VXNlck5hbWUgPSBKU09OLnBhcnNlKHRoaXMuY2xpZW50VXNlck5hbWUpO1xuICAgICAgICBpZiAodGhpcy5zZWNyZXRMYW5nT3B0aW9uID09PSB0cnVlKXtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5zZWNyZXRMYW5nKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgICAgIFwiZGF0YVwiIDogaW5wdXQsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHRoaXMuY2xpZW50VXNlck5hbWUudXNlcm5hbWUsXG4gICAgICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgcmVjaWV2ZU1lc3NhZ2UoZSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1doZW4gbmV3IG1lc3NhZ2VzIGlzIHJlY2VpdmVkLCBkaXNwbGF5IGl0IGluIHRoZSBjaGF0IHdpbmRvd1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGUuZGF0YSk7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXJOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UudXNlcm5hbWUgKyAnOicpO1xuICAgICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICBsZXQgdGV4dFAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICAgICAgdGV4dFAuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtZXNzYWdlY29udGVudCcpO1xuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNsaWVudFVzZXJOYW1lLnVzZXJuYW1lKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdXNlcm5hbWUgaXMgZXF1YWwgdG8gdGhlIGNsaWVudCB1c2VyIG5hbWUsIGFkZCBjbGllbnQgY2xhc3NcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSAnVGhlIFNlcnZlcicpeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQWRkcyBhIGNsYXNzIHRvIHNlcnZlciBtZXNzYWdlcyBzbyB1c2VyIGNhbiB0ZWxsIGRpZmZlcmVuY2VcbiAgICAgICAgICAgICAgICBzZW5kZXJOYW1lLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXJ2ZXJtZXNzYWdlJyk7XG4gICAgICAgICAgICB9IGVsc2V7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FkZHMgYSBjbGFzcyB0byB0aGUgcmVwbGllcyB3aXRoIG5hbWVzIG5vdCBlcXVhbCB0byB0aGUgY2xpZW50IHVzZXJuYW1lXG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdHJlcGx5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbmRlck5hbWUuYXBwZW5kQ2hpbGQoc2VuZGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG5cbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgICAvL1Njcm9sbHMgYW5kIHNob3dzIHRoZSBsYXRlc3QgbWVzc2FnZSByZWNlaXZlZFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cbmNsYXNzIE5ld0Rlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2luZG93QXBwQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpO1xuICAgIH1cbiAgICBhcHBzKCl7XG4gICAgICAgIGxldCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKS5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcicpO1xuXG4gICAgICAgIGxldCBjaGF0ID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjQ2hhdCcpO1xuICAgICAgICBsZXQgZ2FtZSA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0dhbWUnKTtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjU2V0dGluZ3MnKTtcblxuXG4gICAgICAgIGNoYXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PnsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlcyBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG4gICAgICAgICAgICBsZXQgY2hhdCA9IG5ldyBDaGF0KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkLCB0aGlzLndpbmRvd0FwcENvdW50ZXIubGVuZ3RoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IGdhbWUgPSBuZXcgR2FtZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCk7XG4gICAgICAgICAgICAvLyBUb0RPIENyZWF0ZSBhIG5ldyBnYW1lIHVwb24gYSBjbGljaywgZ2FtZSB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGdhbWUgd2luZG93XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldHRpbmdzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHNldHRpbmdzID0gbmV3IFNldHRpbmdzKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkKTtcbiAgICAgICAgICAgIC8vIFRvRE8gQ3JlYXRlIGEgbmV3IFNldHRpbmdzIHVwb24gYSBjbGljaywgc2V0dGluZ3Mgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBzZXR0aW5ncyB3aW5kb3dcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0Rlc2t0b3A7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMjguXG4gKi9cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIFNldHRpbmdzIGV4dGVuZHMgR1VJe1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvdW50KXtcbiAgICAgICAgc3VwZXIobmFtZSwgY291bnQpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIi8qKlxuICpcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb25zdCBEZXNrdG9wID0gcmVxdWlyZSgnLi9EZXNrdG9wJyk7XG4vL1xuLy8gY29uc3QgZGVza3RvcCA9IG5ldyBEZXNrdG9wO1xuLy9cbi8vIGRlc2t0b3AuY2xpY2soKTtcblxuY29uc3QgTmV3RGVza3RvcCA9IHJlcXVpcmUoJy4vTmV3RGVza3RvcCcpO1xuXG5jb25zdCBEZXNrdG9wID0gbmV3IE5ld0Rlc2t0b3AoKTtcblxuRGVza3RvcC5hcHBzKCk7XG4iXX0=
