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


        appWindow.style.zIndex = '1';
        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.targetID + '.png');
        console.log(appWindow.firstElementChild.id);

        this.move(appWindow.firstElementChild);

        this.id.appendChild(appWindow);

        if(this.targetID === 'Game'){
            console.log('hello Gamer')
        }else if(this.targetID === 'Chat'){
            const chatWindow = new Chat(appWindow.id);
            chatWindow.chatApp();
        }

    }
    move(selected) {
        selected.addEventListener('mousedown', event =>{
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
 */

'use strict';

class Chat {
    constructor(content){
        this.content = document.getElementById(content).lastElementChild;
    }
    chatApp(){
        let formDiv = document.createElement('div');
        let formTag = document.createElement('form');
        let inputTag = document.createElement('input');
        let img = document.createElement('img');
        let aTag = document.createElement('a');
        let textField = document.createElement('div');

        textField.setAttribute('class', 'textfield');
        formDiv.setAttribute('class', 'chatStyles');
        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');
        aTag.setAttribute('href', '#');
        aTag.setAttribute('class', 'sendicon');
        img.setAttribute('src', '/image/send.png');

        this.content.appendChild(textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);
        aTag.appendChild(img);
        formDiv.appendChild(aTag);
        this.content.appendChild(formDiv);
    }
    getMessage(){

    }
    sendMessage(){
        let message = {
            "type": "message",
            "data" : "The message text is sent using the data property",
            "username": "MyFancyUsername",
            "channel": "my, not so secret, channel",
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
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
                }else if (target.id === 'close'){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKlxuICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQ2hhdCA9IHJlcXVpcmUoJy4vQ2hhdCcpO1xuXG5jbGFzcyBBcHBHdWl7XG4gICAgY29uc3RydWN0b3Iod2luZG93Q291bnQsIGFsbFdpbmRvd3MsIHRhcmdldElEKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB3aW5kb3dDb3VudDtcbiAgICAgICAgdGhpcy5hbGxXID0gYWxsV2luZG93cztcbiAgICAgICAgdGhpcy50YXJnZXRJRCA9IHRhcmdldElEO1xuICAgICAgICB0aGlzLndpbmRvd0NvdW50ZXIgPSAwO1xuICAgIH1cbiAgICBndWkobmFtZSl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyIHRlbXBsYXRlJyk7XG4gICAgICAgIGxldCBhcHBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuXG4gICAgICAgIGxldCBwVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBsZXQgcFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYW1lLmlkICsgJyAnICsgdGhpcy53aW5kb3dzKTtcbiAgICAgICAgcFRhZy5hcHBlbmRDaGlsZChwVGV4dCk7XG5cbiAgICAgICAgYXBwV2luZG93LnNldEF0dHJpYnV0ZSgnaWQnLCBuYW1lLmlkICsgJyAnICsgdGhpcy53aW5kb3dzKTtcbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbmRvdyAnICsgbmFtZS5pZCArICcgJyArIHRoaXMud2luZG93cyk7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuYXBwZW5kQ2hpbGQocFRhZyk7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA0NSAqIHRoaXMuYWxsVyArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEwNSAqIHRoaXMuYWxsVyArICdweCc7XG5cblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUuekluZGV4ID0gJzEnO1xuICAgICAgICBhcHBXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9waWNvbicpLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWFnZS8nICsgdGhpcy50YXJnZXRJRCArICcucG5nJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5pZCk7XG5cbiAgICAgICAgdGhpcy5tb3ZlKGFwcFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICAgICAgdGhpcy5pZC5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuXG4gICAgICAgIGlmKHRoaXMudGFyZ2V0SUQgPT09ICdHYW1lJyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGVsbG8gR2FtZXInKVxuICAgICAgICB9ZWxzZSBpZih0aGlzLnRhcmdldElEID09PSAnQ2hhdCcpe1xuICAgICAgICAgICAgY29uc3QgY2hhdFdpbmRvdyA9IG5ldyBDaGF0KGFwcFdpbmRvdy5pZCk7XG4gICAgICAgICAgICBjaGF0V2luZG93LmNoYXRBcHAoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIG1vdmUoc2VsZWN0ZWQpIHtcbiAgICAgICAgc2VsZWN0ZWQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT57XG4gICAgICAgICAgICBsZXQgd2luZG93UG9zWCA9IHBhcnNlSW50KHNlbGVjdGVkLnBhcmVudE5vZGUuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICAgICAgbGV0IHdpbmRvd1Bvc1kgPSBwYXJzZUludChzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLnRvcCwgMTApO1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IGV2ZW50LnBhZ2VYIC0gd2luZG93UG9zWDtcbiAgICAgICAgICAgIGxldCBvZmZzZXRZID0gZXZlbnQucGFnZVkgLSB3aW5kb3dQb3NZO1xuXG4gICAgICAgICAgICBsZXQgbW92ZVdpbmRvdyA9IGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgbW92ZVRvWCA9IGUucGFnZVggLSBvZmZzZXRYO1xuICAgICAgICAgICAgICAgIGxldCBtb3ZlVG9ZID0gZS5wYWdlWSAtIG9mZnNldFk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQucGFyZW50Tm9kZS5zdHlsZS50b3AgPSBtb3ZlVG9ZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5wYXJlbnROb2RlLnN0eWxlLmxlZnQgPSBtb3ZlVG9YICsgJ3B4JztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCByZW1vdmVFdmVudCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVtb3ZlRXZlbnQpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVdpbmRvdyk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmVtb3ZlRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwR3VpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQ2hhdCB7XG4gICAgY29uc3RydWN0b3IoY29udGVudCl7XG4gICAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRlbnQpLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuICAgIGNoYXRBcHAoKXtcbiAgICAgICAgbGV0IGZvcm1EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGV0IGZvcm1UYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIGxldCBpbnB1dFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgbGV0IGFUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxldCB0ZXh0RmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICB0ZXh0RmllbGQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0ZXh0ZmllbGQnKTtcbiAgICAgICAgZm9ybURpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRTdHlsZXMnKTtcbiAgICAgICAgZm9ybVRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2Zvcm1zdHlsZScpO1xuICAgICAgICBpbnB1dFRhZy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2NoYXRpbnB1dCcpO1xuICAgICAgICBhVGFnLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgICAgIGFUYWcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZW5kaWNvbicpO1xuICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltYWdlL3NlbmQucG5nJyk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRleHRGaWVsZCk7XG4gICAgICAgIGZvcm1UYWcuYXBwZW5kQ2hpbGQoaW5wdXRUYWcpO1xuICAgICAgICBmb3JtRGl2LmFwcGVuZENoaWxkKGZvcm1UYWcpO1xuICAgICAgICBhVGFnLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIGZvcm1EaXYuYXBwZW5kQ2hpbGQoYVRhZyk7XG4gICAgICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChmb3JtRGl2KTtcbiAgICB9XG4gICAgZ2V0TWVzc2FnZSgpe1xuXG4gICAgfVxuICAgIHNlbmRNZXNzYWdlKCl7XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCIgOiBcIlRoZSBtZXNzYWdlIHRleHQgaXMgc2VudCB1c2luZyB0aGUgZGF0YSBwcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiBcIk15RmFuY3lVc2VybmFtZVwiLFxuICAgICAgICAgICAgXCJjaGFubmVsXCI6IFwibXksIG5vdCBzbyBzZWNyZXQsIGNoYW5uZWxcIixcbiAgICAgICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQXBwR3VpID0gcmVxdWlyZSgnLi9BcHBHdWknKTtcblxuY2xhc3MgRGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5jaGF0V2luZG93Q291bnQgPSAwO1xuICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSAwO1xuICAgIH1cbiAgICBjbGljaygpIHtcbiAgICAgICAgbGV0IGNsaWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcbiAgICAgICAgY2xpY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBpZih0YXJnZXQuaGFzQXR0cmlidXRlKCdpZCcpKXtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlkID09PSAnR2FtZScpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVXaW5kb3dDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSB0aGlzLmNoYXRXaW5kb3dDb3VudCArIHRoaXMuZ2FtZVdpbmRvd0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBHdWkgPSBuZXcgQXBwR3VpKHRoaXMuZ2FtZVdpbmRvd0NvdW50LCB0aGlzLmFsbFdpbmRvd3MsIHRhcmdldC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcEd1aS5ndWkodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAodGFyZ2V0LmlkID09PSAnQ2hhdCcpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRXaW5kb3dDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSB0aGlzLmNoYXRXaW5kb3dDb3VudCArIHRoaXMuZ2FtZVdpbmRvd0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBHdWkgPSBuZXcgQXBwR3VpKHRoaXMuY2hhdFdpbmRvd0NvdW50LCB0aGlzLmFsbFdpbmRvd3MsIHRhcmdldC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcEd1aS5ndWkodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAodGFyZ2V0LmlkID09PSAnY2xvc2UnKXtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2sucmVtb3ZlQ2hpbGQodGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wO1xuIiwiLyoqXG4gKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNC5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IERlc2t0b3AgPSByZXF1aXJlKCcuL0Rlc2t0b3AnKTtcblxuY29uc3QgZGVza3RvcCA9IG5ldyBEZXNrdG9wO1xuXG5kZXNrdG9wLmNsaWNrKCk7XG4iXX0=
