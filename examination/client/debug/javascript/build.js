(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-15.
 *
 * ToDo Make a gui that all the apps inherits.
 */

'use strict';

const Chat = require('./Chat');

class AppGui{
    constructor(windowCount, allWindows, targetID) {
        this.id = document.querySelector('#wrapper');
        this.windows = windowCount;
        this.allW = allWindows;
        this.targetID = targetID;
        this.windowCounter = 0;
    }

    gui(name){
        let template = document.querySelector('#wrapper template');
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let pTag = document.createElement('p');
        let pText = document.createTextNode(name.id + ' ' + this.windows);
        pTag.appendChild(pText);

        appWindow.setAttribute('id', name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').setAttribute('id', 'window ' + name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * this.allW + 'px';
        appWindow.style.left =+ 105 * this.allW + 'px';

        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.targetID + '.png');

        this.move(appWindow.firstElementChild);

        this.id.appendChild(appWindow);

        if(this.targetID === 'Game'){
            console.log('hello Gamer')
        }else if(this.targetID === 'Chat'){
            const chatWindow = new Chat(appWindow.id);
            chatWindow.enterName();
        }

    }
    move(selected) {
        selected.addEventListener('mousedown', event =>{
            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left, 10);
            let windowPosY = parseInt(selected.parentNode.style.top, 10);

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;

            let moveWindow = function (e) {

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

module.exports = AppGui;

},{"./Chat":2}],2:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-15.
 *
 * ToDo close socket when window is closed
 */

'use strict';

class Chat {
    constructor(content){
        this.content = document.getElementById(content).lastElementChild;
        this.chatName = '';
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
            senderName.appendChild(sender);                     //ToDo save messages as an object, and save to localstorage
            message.appendChild(senderName);
            textP.appendChild(text);
            message.appendChild(textP);
            div.appendChild(message);

            this.content.firstElementChild.appendChild(div);
        }
    }

}

module.exports = Chat;

},{}],3:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const AppGui = require('./AppGui');

class Desktop {
    constructor() {
        this.gameWindowCount = 0;
        this.chatWindowCount = 0;
        this.allWindows = 0;
    }

    click() {
        let click = document.querySelector('#wrapper');
        click.addEventListener('click', event =>{
            let target = event.target;
            if(target.hasAttribute('id')){
                if (target.id === 'Game'){
                    this.gameWindowCount += 1;
                    this.allWindows = this.chatWindowCount + this.gameWindowCount;
                    const appGui = new AppGui(this.gameWindowCount, this.allWindows, target.id);
                    appGui.gui(target);
                }else if (target.id === 'Chat'){
                    this.chatWindowCount += 1;
                    this.allWindows = this.chatWindowCount + this.gameWindowCount;
                    const appGui = new AppGui(this.chatWindowCount, this.allWindows, target.id);
                    appGui.gui(target);
                }else if(target.id === 'Settings'){
                    this.chatWindowCount += 1;
                    this.allWindows = this.chatWindowCount + this.gameWindowCount;
                    const appGui = new AppGui(this.chatWindowCount, this.allWindows, target.id);
                    appGui.gui(target);
                }else if (target.id === 'close'){
                    if(target.parentNode.parentNode.id === 'Chat'){
                        console.log('wat');
                    }
                    click.removeChild(target.parentNode.parentNode);
                }
            }
        })
    }

}

module.exports = Desktop;

},{"./AppGui":1}],4:[function(require,module,exports){
/**
 *
 * Created by vinces on 2016-12-14.
 */

'use strict';

const Desktop = require('./Desktop');

const desktop = new Desktop;

desktop.click();

},{"./Desktop":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKlxuICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoJy4vQ2hhdCcpO1xuXG5jbGFzcyBBcHBHdWl7XG4gICAgY29uc3RydWN0b3Iod2luZG93Q291bnQsIGFsbFdpbmRvd3MsIHRhcmdldElEKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB3aW5kb3dDb3VudDtcbiAgICAgICAgdGhpcy5hbGxXID0gYWxsV2luZG93cztcbiAgICAgICAgdGhpcy50YXJnZXRJRCA9IHRhcmdldElEO1xuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIgPSAwO1xuICAgIH1cblxuICAgIGd1aShuYW1lKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXIgdGVtcGxhdGUnKTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyBuYW1lLmlkICsgJyAnICsgdGhpcy53aW5kb3dzKTtcbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUudG9wID0rIDQ1ICogdGhpcy5hbGxXICsgJ3B4JztcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLmxlZnQgPSsgMTA1ICogdGhpcy5hbGxXICsgJ3B4JztcblxuICAgICAgICBhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9waWNvbicpLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS8nICsgdGhpcy50YXJnZXRJRCArICcucG5nJyk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgICAgdGhpcy5pZC5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuXG4gICAgICAgIGlmKHRoaXMudGFyZ2V0SUQgPT09ICdHYW1lJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGVsbG8gR2FtZXInKVxuICAgICAgICB9ZWxzZSBpZih0aGlzLnRhcmdldElEID09PSAnQ2hhdCcpe1xuICAgICAgICAgICAgY29uc3QgY2hhdFdpbmRvdyA9IG5ldyBDaGF0KGFwcFdpbmRvdy5pZCk7XG4gICAgICAgICAgICBjaGF0V2luZG93LmVudGVyTmFtZSgpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgbW92ZShzZWxlY3RlZCkge1xuICAgICAgICBzZWxlY3RlZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnb25tb3VzZWRvd24nKTtcblxuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1ggPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQsIDEwKTtcbiAgICAgICAgICAgIGxldCB3aW5kb3dQb3NZID0gcGFyc2VJbnQoc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AsIDEwKTtcblxuICAgICAgICAgICAgbGV0IG9mZnNldFggPSBldmVudC5wYWdlWCAtIHdpbmRvd1Bvc1g7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IGV2ZW50LnBhZ2VZIC0gd2luZG93UG9zWTtcblxuICAgICAgICAgICAgbGV0IG1vdmVXaW5kb3cgPSBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IG1vdmVUb1ggPSBlLnBhZ2VYIC0gb2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWSA9IGUucGFnZVkgLSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUudG9wID0gbW92ZVRvWSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS5sZWZ0ID0gbW92ZVRvWCArICdweCc7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ29ubW91c2Vkb3duJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwR3VpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICpcbiAqIFRvRG8gY2xvc2Ugc29ja2V0IHdoZW4gd2luZG93IGlzIGNsb3NlZFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQ2hhdCB7XG4gICAgY29uc3RydWN0b3IoY29udGVudCl7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRlbnQpLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgIHRoaXMuY2hhdE5hbWUgPSAnJztcbiAgICB9XG5cbiAgICBlbnRlck5hbWUoKSB7XG4gICAgICAgIGxldCB1c2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdDaGF0VXNlcicpO1xuXG4gICAgICAgIGlmKHVzZXJOYW1lICE9PSBudWxsKXtcbiAgICAgICAgICAgIHVzZXJOYW1lID0gSlNPTi5wYXJzZSh1c2VyTmFtZSk7XG4gICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gdXNlck5hbWUudXNlcm5hbWU7XG4gICAgICAgICAgICB0aGlzLmNoYXRBcHAoKTtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5jbGFzc05hbWUgKz0gJyB1c2VybmFtZSc7XG4gICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgZGl2SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZXQgYVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgbGV0IHBUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0VudGVyIGEgdXNlcm5hbWU6Jyk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgICAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9hY2NlcHQucG5nJyk7XG4gICAgICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICd1c2VybmFtZWZpZWxkJyk7XG5cbiAgICAgICAgICAgIGFUYWcuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgICAgIGRpdkltZy5hcHBlbmRDaGlsZChhVGFnKTtcbiAgICAgICAgICAgIHBUYWcuYXBwZW5kQ2hpbGQocFRleHQpO1xuICAgICAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG5cbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChwVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChmb3JtVGFnKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChkaXZJbWcpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgICAgICAgYVRhZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykudmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZihpbnB1dFZhbHVlLmxlbmd0aCA8PSAwIHx8IGlucHV0VmFsdWUubGVuZ3RoID49IDI1IHx8IGlucHV0VmFsdWUgPT09ICdUaGUgU2VydmVyJyl7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdOb3QgYSB2YWxpZCB1c2VybmFtZSBkdWRlIScpXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlck5hbWUgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYXRVc2VybmFtZSA9IHt1c2VybmFtZTogdGhpcy51c2VyTmFtZX07XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdDaGF0VXNlcicsIEpTT04uc3RyaW5naWZ5KGNoYXRVc2VybmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXROYW1lID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2VudGVydXNlcm5hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdEFwcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhdEFwcCgpe1xuICAgICAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvJyk7XG4gICAgICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAgZXZlbnQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmb3JtRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxldCBmb3JtVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGxldCBhVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB0aGlzLnRleHRGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIHRoaXMudGV4dEZpZWxkLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGV4dGZpZWxkJyk7XG4gICAgICAgIGZvcm1EaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0U3R5bGVzJyk7XG4gICAgICAgIGZvcm1UYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdmb3Jtc3R5bGUnKTtcbiAgICAgICAgaW5wdXRUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdjaGF0aW5wdXQnKTtcbiAgICAgICAgYVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VuZGljb24nKTtcbiAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS9zZW5kLnBuZycpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpO1xuICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcblxuICAgICAgICBhVGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBsZXQgY2xlYXJJbnB1dCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBjbGVhcklucHV0LnZhbHVlO1xuICAgICAgICAgICAgaWYoaW5wdXRWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGNsZWFySW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIHNlbmRNZXNzYWdlKGlucHV0KXtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcImRhdGFcIiA6IGlucHV0LFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLmNoYXROYW1lLFxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHJlY2lldmVNZXNzYWdlKGUpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxldCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgc2VuZGVyTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHNlbmRlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3BvbnNlLnVzZXJuYW1lKTtcbiAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgbGV0IHRleHRQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgICAgIHNlbmRlck5hbWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kZXJuYW1lJyk7XG5cbiAgICAgICAgaWYocmVzcG9uc2UudHlwZSAhPT0gJ2hlYXJ0YmVhdCcpe1xuICAgICAgICAgICAgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09IHRoaXMuY2hhdE5hbWUpe1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NsaWVudG1lc3NhZ2UnKVxuICAgICAgICAgICAgfWVsc2UgaWYocmVzcG9uc2UudXNlcm5hbWUgPT09ICdUaGUgU2VydmVyJyl7XG4gICAgICAgICAgICAgICAgc2VuZGVyTmFtZS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICAgICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VydmVybWVzc2FnZScpO1xuICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRyZXBseScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZW5kZXJOYW1lLmFwcGVuZENoaWxkKHNlbmRlcik7ICAgICAgICAgICAgICAgICAgICAgLy9Ub0RvIHNhdmUgbWVzc2FnZXMgYXMgYW4gb2JqZWN0LCBhbmQgc2F2ZSB0byBsb2NhbHN0b3JhZ2VcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQoc2VuZGVyTmFtZSk7XG4gICAgICAgICAgICB0ZXh0UC5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICAgICAgICAgIG1lc3NhZ2UuYXBwZW5kQ2hpbGQodGV4dFApO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQXBwR3VpID0gcmVxdWlyZSgnLi9BcHBHdWknKTtcblxuY2xhc3MgRGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5jaGF0V2luZG93Q291bnQgPSAwO1xuICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSAwO1xuICAgIH1cblxuICAgIGNsaWNrKCkge1xuICAgICAgICBsZXQgY2xpY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICBjbGljay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGlmKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2lkJykpe1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuaWQgPT09ICdHYW1lJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5nYW1lV2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cywgdGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXQuaWQgPT09ICdDaGF0Jyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdFdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5jaGF0V2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cywgdGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldC5pZCA9PT0gJ1NldHRpbmdzJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdFdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5jaGF0V2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cywgdGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXQuaWQgPT09ICdjbG9zZScpe1xuICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmlkID09PSAnQ2hhdCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dhdCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrLnJlbW92ZUNoaWxkKHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wO1xuIiwiLyoqXG4gKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IERlc2t0b3AgPSByZXF1aXJlKCcuL0Rlc2t0b3AnKTtcblxuY29uc3QgZGVza3RvcCA9IG5ldyBEZXNrdG9wO1xuXG5kZXNrdG9wLmNsaWNrKCk7XG4iXX0=
