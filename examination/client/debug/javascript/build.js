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
        appWindow.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.targetID + '.png');

        this.move(appWindow);

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
            let moveWindow = function (e) {
                selected.style.top = e.clientY + 'px';
                selected.style.left = e.clientX + 'px';
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
        this.content = content;
    }
    chatApp(){

        let place = document.getElementById(this.content).lastElementChild;
        let formTag = document.createElement('form');
        let inputTag = document.createElement('input');

        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');

        formTag.appendChild(inputTag);
        place.appendChild(formTag);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9DaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqXG4gKiBUb0RvIE1ha2UgYSBndWkgdGhhdCBhbGwgdGhlIGFwcHMgaW5oZXJpdHMuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBDaGF0ID0gcmVxdWlyZSgnLi9DaGF0Jyk7XG5cbmNsYXNzIEFwcEd1aXtcbiAgICBjb25zdHJ1Y3Rvcih3aW5kb3dDb3VudCwgYWxsV2luZG93cywgdGFyZ2V0SUQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJyk7XG4gICAgICAgIHRoaXMud2luZG93cyA9IHdpbmRvd0NvdW50O1xuICAgICAgICB0aGlzLmFsbFcgPSBhbGxXaW5kb3dzO1xuICAgICAgICB0aGlzLnRhcmdldElEID0gdGFyZ2V0SUQ7XG4gICAgICAgIHRoaXMud2luZG93Q291bnRlciA9IDA7XG4gICAgfVxuICAgIGd1aShuYW1lKXtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXIgdGVtcGxhdGUnKTtcbiAgICAgICAgbGV0IGFwcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgbGV0IHBUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGxldCBwVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICBwVGFnLmFwcGVuZENoaWxkKHBUZXh0KTtcblxuICAgICAgICBhcHBXaW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyBuYW1lLmlkICsgJyAnICsgdGhpcy53aW5kb3dzKTtcbiAgICAgICAgYXBwV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS5hcHBlbmRDaGlsZChwVGFnKTtcblxuICAgICAgICBhcHBXaW5kb3cuc3R5bGUudG9wID0rIDQ1ICogdGhpcy5hbGxXICsgJ3B4JztcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLmxlZnQgPSsgMTA1ICogdGhpcy5hbGxXICsgJ3B4JztcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnpJbmRleCA9ICcxJztcbiAgICAgICAgYXBwV2luZG93LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcblxuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGljb24nKS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1hZ2UvJyArIHRoaXMudGFyZ2V0SUQgKyAnLnBuZycpO1xuXG4gICAgICAgIHRoaXMubW92ZShhcHBXaW5kb3cpO1xuXG4gICAgICAgIHRoaXMuaWQuYXBwZW5kQ2hpbGQoYXBwV2luZG93KTtcblxuICAgICAgICBpZih0aGlzLnRhcmdldElEID09PSAnR2FtZScpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hlbGxvIEdhbWVyJylcbiAgICAgICAgfWVsc2UgaWYodGhpcy50YXJnZXRJRCA9PT0gJ0NoYXQnKXtcbiAgICAgICAgICAgIGNvbnN0IGNoYXRXaW5kb3cgPSBuZXcgQ2hhdChhcHBXaW5kb3cuaWQpO1xuICAgICAgICAgICAgY2hhdFdpbmRvdy5jaGF0QXBwKCk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBtb3ZlKHNlbGVjdGVkKSB7XG4gICAgICAgIHNlbGVjdGVkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IG1vdmVXaW5kb3cgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLnN0eWxlLnRvcCA9IGUuY2xpZW50WSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuc3R5bGUubGVmdCA9IGUuY2xpZW50WCArICdweCc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEd1aTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIENoYXQge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRlbnQpe1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgIH1cbiAgICBjaGF0QXBwKCl7XG5cbiAgICAgICAgbGV0IHBsYWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250ZW50KS5sYXN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgZm9ybVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgICAgICBmb3JtVGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZm9ybXN0eWxlJyk7XG4gICAgICAgIGlucHV0VGFnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2hhdGlucHV0Jyk7XG5cbiAgICAgICAgZm9ybVRhZy5hcHBlbmRDaGlsZChpbnB1dFRhZyk7XG4gICAgICAgIHBsYWNlLmFwcGVuZENoaWxkKGZvcm1UYWcpO1xuICAgIH1cbiAgICBnZXRNZXNzYWdlKCl7XG5cbiAgICB9XG4gICAgc2VuZE1lc3NhZ2UoKXtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICBcImRhdGFcIiA6IFwiVGhlIG1lc3NhZ2UgdGV4dCBpcyBzZW50IHVzaW5nIHRoZSBkYXRhIHByb3BlcnR5XCIsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IFwiTXlGYW5jeVVzZXJuYW1lXCIsXG4gICAgICAgICAgICBcImNoYW5uZWxcIjogXCJteSwgbm90IHNvIHNlY3JldCwgY2hhbm5lbFwiLFxuICAgICAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBBcHBHdWkgPSByZXF1aXJlKCcuL0FwcEd1aScpO1xuXG5jbGFzcyBEZXNrdG9wIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nYW1lV2luZG93Q291bnQgPSAwO1xuICAgICAgICB0aGlzLmNoYXRXaW5kb3dDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYWxsV2luZG93cyA9IDA7XG4gICAgfVxuICAgIGNsaWNrKCkge1xuICAgICAgICBsZXQgY2xpY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICBjbGljay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGlmKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2lkJykpe1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuaWQgPT09ICdHYW1lJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5nYW1lV2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cywgdGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXQuaWQgPT09ICdDaGF0Jyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdFdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5jaGF0V2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cywgdGFyZ2V0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXQuaWQgPT09ICdjbG9zZScpe1xuICAgICAgICAgICAgICAgICAgICBjbGljay5yZW1vdmVDaGlsZCh0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlc2t0b3A7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGVza3RvcCA9IHJlcXVpcmUoJy4vRGVza3RvcCcpO1xuXG5jb25zdCBkZXNrdG9wID0gbmV3IERlc2t0b3A7XG5cbmRlc2t0b3AuY2xpY2soKTtcbiJdfQ==
