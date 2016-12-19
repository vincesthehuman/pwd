(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by vinces on 2016-12-15.
 *
 * ToDo Make a gui that all the apps inherits.
 */

'use strict';

class AppGui{
    constructor(windowCount, allWindows) {
        this.id = document.querySelector('#wrapper');
        this.windows = windowCount;
        this.allW = allWindows;
    }
    gui(name){
        let template = document.querySelector('#wrapper template');
        let window = document.importNode(template.content.firstElementChild, true);

        window.setAttribute('id', name.id + ' ' + this.windows);
        window.querySelector('.topbar').setAttribute('id', 'window ' + name.id + ' ' + this.windows);
        window.querySelector('.topbar').textContent =  name.id + ' ' + this.windows;

        window.style.top =+ 80 * this.allW + 'px';
        window.style.left =+ 120 * this.allW + 'px';

        this.id.appendChild(window);

        window.addEventListener('click' , event => {
            console.log(event.target.parentNode.id);
        });
    }
}

module.exports = AppGui;

},{}],2:[function(require,module,exports){
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
                    const appGui = new AppGui(this.gameWindowCount, this.allWindows);
                    appGui.gui(target);
                }else if (target.id === 'Chat'){
                    this.chatWindowCount += 1;
                    this.allWindows = this.chatWindowCount + this.gameWindowCount;
                    const appGui = new AppGui(this.chatWindowCount, this.allWindows);
                    appGui.gui(target);
                }
            }
        })
    }
}

module.exports = Desktop;

},{"./AppGui":1}],3:[function(require,module,exports){
/**
 *
 * Created by vinces on 2016-12-14.
 */

'use strict';

const Desktop = require('./Desktop');

const desktop = new Desktop;

desktop.click();

},{"./Desktop":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqXG4gKiBUb0RvIE1ha2UgYSBndWkgdGhhdCBhbGwgdGhlIGFwcHMgaW5oZXJpdHMuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBBcHBHdWl7XG4gICAgY29uc3RydWN0b3Iod2luZG93Q291bnQsIGFsbFdpbmRvd3MpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJyk7XG4gICAgICAgIHRoaXMud2luZG93cyA9IHdpbmRvd0NvdW50O1xuICAgICAgICB0aGlzLmFsbFcgPSBhbGxXaW5kb3dzO1xuICAgIH1cbiAgICBndWkobmFtZSl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyIHRlbXBsYXRlJyk7XG4gICAgICAgIGxldCB3aW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuXG4gICAgICAgIHdpbmRvdy5zZXRBdHRyaWJ1dGUoJ2lkJywgbmFtZS5pZCArICcgJyArIHRoaXMud2luZG93cyk7XG4gICAgICAgIHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuc2V0QXR0cmlidXRlKCdpZCcsICd3aW5kb3cgJyArIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICB3aW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnRleHRDb250ZW50ID0gIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3M7XG5cbiAgICAgICAgd2luZG93LnN0eWxlLnRvcCA9KyA4MCAqIHRoaXMuYWxsVyArICdweCc7XG4gICAgICAgIHdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEyMCAqIHRoaXMuYWxsVyArICdweCc7XG5cbiAgICAgICAgdGhpcy5pZC5hcHBlbmRDaGlsZCh3aW5kb3cpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycgLCBldmVudCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBHdWk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQXBwR3VpID0gcmVxdWlyZSgnLi9BcHBHdWknKTtcblxuY2xhc3MgRGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5jaGF0V2luZG93Q291bnQgPSAwO1xuICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSAwO1xuICAgIH1cbiAgICBjbGljaygpIHtcbiAgICAgICAgbGV0IGNsaWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcbiAgICAgICAgY2xpY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBpZih0YXJnZXQuaGFzQXR0cmlidXRlKCdpZCcpKXtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlkID09PSAnR2FtZScpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVXaW5kb3dDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSB0aGlzLmNoYXRXaW5kb3dDb3VudCArIHRoaXMuZ2FtZVdpbmRvd0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBHdWkgPSBuZXcgQXBwR3VpKHRoaXMuZ2FtZVdpbmRvd0NvdW50LCB0aGlzLmFsbFdpbmRvd3MpO1xuICAgICAgICAgICAgICAgICAgICBhcHBHdWkuZ3VpKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHRhcmdldC5pZCA9PT0gJ0NoYXQnKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0V2luZG93Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxXaW5kb3dzID0gdGhpcy5jaGF0V2luZG93Q291bnQgKyB0aGlzLmdhbWVXaW5kb3dDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXBwR3VpID0gbmV3IEFwcEd1aSh0aGlzLmNoYXRXaW5kb3dDb3VudCwgdGhpcy5hbGxXaW5kb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVza3RvcDtcbiIsIi8qKlxuICpcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBEZXNrdG9wID0gcmVxdWlyZSgnLi9EZXNrdG9wJyk7XG5cbmNvbnN0IGRlc2t0b3AgPSBuZXcgRGVza3RvcDtcblxuZGVza3RvcC5jbGljaygpO1xuIl19
