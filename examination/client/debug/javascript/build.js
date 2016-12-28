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


        appWindow.querySelector('#close').addEventListener('click', event =>{
            this.close(event.target);
        });

        this.move(appWindow.firstElementChild);

        this.wrapper.appendChild(appWindow);

    }
    close(node) {       //Removes the parent node of the parent node (the Window selected)
        node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
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
        this.content = document.getElementById(name+count).lastElementChild;
        this.chatName = '';
        this.enterName();
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
        this.socket.addEventListener('message',  event => {
            this.recieveMessage(event);
        });

        let formDiv = document.createElement('div');
        let formTag = document.createElement('form');
        let inputTag = document.createElement('textarea');
        let img = document.createElement('img');
        let aTag = document.createElement('a');
        this.textField = document.createElement('div');

        this.textField.setAttribute('class', 'textfield');
        formDiv.setAttribute('class', 'chatStyles');
        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');
        aTag.setAttribute('href', '#');
        aTag.setAttribute('class', 'sendicon');
        img.setAttribute('src', '/image/send.png');

        this.content.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);
        aTag.appendChild(img);
        formDiv.appendChild(aTag);
        this.content.appendChild(formDiv);

        aTag.addEventListener('click', event =>{
            let clearInput = this.content.querySelector('textarea');
            let inputValue = clearInput.value;
            if(inputValue.length > 0){
                this.sendMessage(inputValue);
                clearInput.value = '';
            }
        })

    }

    sendMessage(input){
        let message = {
            "type": "message",
            "data" : input,
            "username": this.chatName,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        };
        this.socket.send(JSON.stringify(message));
    }

    recieveMessage(e) {
        let response = JSON.parse(e.data);
        let div = document.createElement('div');
        let message = document.createElement('p');
        let senderName = document.createElement('p');
        let sender = document.createTextNode(response.username);
        let text = document.createTextNode(response.data);
        let textP = document.createElement('p');

        senderName.setAttribute('class', 'sendername');

        if(response.type !== 'heartbeat'){
            if(response.username === this.chatName){
                div.setAttribute('class', 'clientmessage')
            }else if(response.username === 'The Server'){
                senderName.removeAttribute('class');
                div.setAttribute('class', 'servermessage');
            } else{
                div.setAttribute('class', 'chatreply')
            }
            senderName.appendChild(sender);                     //ToDo save messages as an object, and save to localstorage, add grey styling so one can tell that they are old
            message.appendChild(senderName);
            textP.appendChild(text);
            message.appendChild(textP);
            div.appendChild(message);

            this.content.firstElementChild.appendChild(div);
        }
        this.content.firstElementChild.scrollTop = this.content.firstElementChild.scrollHeight;
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
            let chat = new Chat(event.target.parentNode.id, this.windowAppCounter.length);

            // ToDO Create a new chat upon a click, chat will inherit structure from AppGui creating a new chat window
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvR1VJLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9NZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0NoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL05ld0Rlc2t0b3AuanMiLCJjbGllbnQvc291cmNlL2pzL1NldHRpbmdzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI3LlxuICpcbiAqICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBHVUl7XG4gICAgY29uc3RydWN0b3Iod2luZG93QXBwLCBjb3VudGVyKSB7XG4gICAgICAgIHRoaXMud2luZG93QXBwID0gd2luZG93QXBwO1xuICAgICAgICB0aGlzLmNvdW50ZXIgPSBjb3VudGVyO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmd1aSgpO1xuICAgIH1cblxuICAgIGd1aSgpe1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlciB0ZW1wbGF0ZScpO1xuICAgICAgICBsZXQgYXBwV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy53aW5kb3dBcHApO1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMud2luZG93QXBwICsgdGhpcy5jb3VudGVyKTtcbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbmRvdyAnICsgdGhpcy53aW5kb3dBcHApO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLmFwcGVuZENoaWxkKHBUYWcpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS50b3AgPSsgNDUgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9KyAxMDUgKyAncHgnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG5cbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BpY29uJykuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlLycgKyB0aGlzLndpbmRvd0FwcCArICcucG5nJyk7XG5cblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignI2Nsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGFwcFdpbmRvdyk7XG5cbiAgICB9XG4gICAgY2xvc2Uobm9kZSkgeyAgICAgICAvL1JlbW92ZXMgdGhlIHBhcmVudCBub2RlIG9mIHRoZSBwYXJlbnQgbm9kZSAodGhlIFdpbmRvdyBzZWxlY3RlZClcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgfVxuICAgIG1vdmUoc2VsZWN0ZWQpIHsgICAgLy9NYWtlcyBpdCBwb3NzaWJsZSBmb3IgdGhlIHVzZXIgdG8gbW92ZSB0aGUgd2luZG93XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuXG4gICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ29ubW91c2Vkb3duJyk7XG5cbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NYID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0LCAxMCk7XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWSA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wLCAxMCk7XG5cbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gZXZlbnQucGFnZVggLSB3aW5kb3dQb3NYO1xuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSBldmVudC5wYWdlWSAtIHdpbmRvd1Bvc1k7XG5cbiAgICAgICAgICAgIGxldCBtb3ZlV2luZG93ID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1ggPSBlLnBhZ2VYIC0gb2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWSA9IGUucGFnZVkgLSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wID0gbW92ZVRvWSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0ID0gbW92ZVRvWCArICdweCc7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ29ubW91c2Vkb3duJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR1VJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIE1lbW9yeSBleHRlbmRzIEdVSXtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb3VudCl7XG4gICAgICAgIHN1cGVyKG5hbWUsIGNvdW50KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI4LlxuICpcbiAqIFRvRG8gY2xvc2Ugc29ja2V0IHdoZW4gd2luZG93IGlzIGNsb3NlZFxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEdVSSA9IHJlcXVpcmUoJy4vR1VJJyk7XG5cbmNsYXNzIENoYXQgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUrY291bnQpLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5lbnRlck5hbWUoKTtcbiAgICB9XG4gICAgZW50ZXJOYW1lKCkge1xuICAgICAgICBsZXQgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQ2hhdFVzZXInKTtcblxuICAgICAgICBpZih1c2VyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgICAgICB1c2VyTmFtZSA9IEpTT04ucGFyc2UodXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IHVzZXJOYW1lLnVzZXJuYW1lO1xuICAgICAgICAgICAgdGhpcy5jaGF0QXBwKCk7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xhc3NOYW1lICs9ICcgdXNlcm5hbWUnO1xuICAgICAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGRpdkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBsZXQgcFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdFbnRlciBhIHVzZXJuYW1lOicpO1xuXG4gICAgICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvYWNjZXB0LnBuZycpO1xuICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndXNlcm5hbWVmaWVsZCcpO1xuXG4gICAgICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICBkaXZJbWcuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcbiAgICAgICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuXG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocFRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybVRhZyk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGl2SW1nKTtcblxuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgICAgIGFUYWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPD0gMCB8fCBpbnB1dFZhbHVlLmxlbmd0aCA+PSAyNSB8fCBpbnB1dFZhbHVlID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnTm90IGEgdmFsaWQgdXNlcm5hbWUgZHVkZSEnKVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGF0VXNlcm5hbWUgPSB7dXNlcm5hbWU6IHRoaXMudXNlck5hbWV9O1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQ2hhdFVzZXInLCBKU09OLnN0cmluZ2lmeShjaGF0VXNlcm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0TmFtZSA9IGlucHV0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdlbnRlcnVzZXJuYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYXRBcHAoKXtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuICAgICAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVjaWV2ZU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgZm9ybURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgbGV0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBsZXQgYVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgdGhpcy50ZXh0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICB0aGlzLnRleHRGaWVsZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RleHRmaWVsZCcpO1xuICAgICAgICBmb3JtRGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdFN0eWxlcycpO1xuICAgICAgICBmb3JtVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZm9ybXN0eWxlJyk7XG4gICAgICAgIGlucHV0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdGlucHV0Jyk7XG4gICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbmRpY29uJyk7XG4gICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2Uvc2VuZC5wbmcnKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy50ZXh0RmllbGQpO1xuICAgICAgICBmb3JtVGFnLmFwcGVuZENoaWxkKGlucHV0VGFnKTtcbiAgICAgICAgZm9ybURpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTtcbiAgICAgICAgYVRhZy5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGFUYWcpO1xuICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZm9ybURpdik7XG5cbiAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IGNsZWFySW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gY2xlYXJJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGlmKGlucHV0VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kTWVzc2FnZShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgICBjbGVhcklucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBzZW5kTWVzc2FnZShpbnB1dCl7XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBpbnB1dCxcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogdGhpcy5jaGF0TmFtZSxcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICByZWNpZXZlTWVzc2FnZShlKSB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlck5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBzZW5kZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS51c2VybmFtZSk7XG4gICAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIGxldCB0ZXh0UCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgICAgICBzZW5kZXJOYW1lLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGVybmFtZScpO1xuXG4gICAgICAgIGlmKHJlc3BvbnNlLnR5cGUgIT09ICdoZWFydGJlYXQnKXtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSB0aGlzLmNoYXROYW1lKXtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjbGllbnRtZXNzYWdlJylcbiAgICAgICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlLnVzZXJuYW1lID09PSAnVGhlIFNlcnZlcicpe1xuICAgICAgICAgICAgICAgIHNlbmRlck5hbWUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlcnZlcm1lc3NhZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0cmVwbHknKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VuZGVyTmFtZS5hcHBlbmRDaGlsZChzZW5kZXIpOyAgICAgICAgICAgICAgICAgICAgIC8vVG9EbyBzYXZlIG1lc3NhZ2VzIGFzIGFuIG9iamVjdCwgYW5kIHNhdmUgdG8gbG9jYWxzdG9yYWdlLCBhZGQgZ3JleSBzdHlsaW5nIHNvIG9uZSBjYW4gdGVsbCB0aGF0IHRoZXkgYXJlIG9sZFxuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZChzZW5kZXJOYW1lKTtcbiAgICAgICAgICAgIHRleHRQLmFwcGVuZENoaWxkKHRleHQpO1xuICAgICAgICAgICAgbWVzc2FnZS5hcHBlbmRDaGlsZCh0ZXh0UCk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5zY3JvbGxUb3AgPSB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTI2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IENoYXQgPSByZXF1aXJlKCcuL05ld0NoYXQnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL01lbW9yeScpO1xuY29uc3QgU2V0dGluZ3MgPSByZXF1aXJlKCcuL1NldHRpbmdzJyk7XG5cbmNsYXNzIE5ld0Rlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2luZG93QXBwQ291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvdycpO1xuICAgIH1cbiAgICBhcHBzKCl7XG4gICAgICAgIGxldCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKS5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhcicpO1xuXG4gICAgICAgIGxldCBjaGF0ID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjQ2hhdCcpO1xuICAgICAgICBsZXQgZ2FtZSA9IHNpZGViYXIucXVlcnlTZWxlY3RvcignI0dhbWUnKTtcbiAgICAgICAgbGV0IHNldHRpbmdzID0gc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcjU2V0dGluZ3MnKTtcblxuXG4gICAgICAgIGNoYXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBjaGF0ID0gbmV3IENoYXQoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQsIHRoaXMud2luZG93QXBwQ291bnRlci5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBUb0RPIENyZWF0ZSBhIG5ldyBjaGF0IHVwb24gYSBjbGljaywgY2hhdCB3aWxsIGluaGVyaXQgc3RydWN0dXJlIGZyb20gQXBwR3VpIGNyZWF0aW5nIGEgbmV3IGNoYXQgd2luZG93XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdhbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBnYW1lID0gbmV3IEdhbWUoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQpO1xuICAgICAgICAgICAgLy8gVG9ETyBDcmVhdGUgYSBuZXcgZ2FtZSB1cG9uIGEgY2xpY2ssIGdhbWUgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBnYW1lIHdpbmRvd1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldHRpbmdzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IHNldHRpbmdzID0gbmV3IFNldHRpbmdzKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkKTtcbiAgICAgICAgICAgIC8vIFRvRE8gQ3JlYXRlIGEgbmV3IFNldHRpbmdzIHVwb24gYSBjbGljaywgc2V0dGluZ3Mgd2lsbCBpbmhlcml0IHN0cnVjdHVyZSBmcm9tIEFwcEd1aSBjcmVhdGluZyBhIG5ldyBzZXR0aW5ncyB3aW5kb3dcblxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3RGVza3RvcDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0yOC5cbiAqL1xuY29uc3QgR1VJID0gcmVxdWlyZSgnLi9HVUknKTtcblxuY2xhc3MgU2V0dGluZ3MgZXh0ZW5kcyBHVUl7XG4gICAgY29uc3RydWN0b3IobmFtZSwgY291bnQpe1xuICAgICAgICBzdXBlcihuYW1lLCBjb3VudCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzO1xuIiwiLyoqXG4gKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIGNvbnN0IERlc2t0b3AgPSByZXF1aXJlKCcuL0Rlc2t0b3AnKTtcbi8vXG4vLyBjb25zdCBkZXNrdG9wID0gbmV3IERlc2t0b3A7XG4vL1xuLy8gZGVza3RvcC5jbGljaygpO1xuXG5jb25zdCBOZXdEZXNrdG9wID0gcmVxdWlyZSgnLi9OZXdEZXNrdG9wJyk7XG5cbmNvbnN0IERlc2t0b3AgPSBuZXcgTmV3RGVza3RvcCgpO1xuXG5EZXNrdG9wLmFwcHMoKTtcbiJdfQ==
