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

        window.style.top =+ 120 * this.allW + 'px';
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
                    console.log('poop1')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKlxuICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQXBwR3Vpe1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvd0NvdW50LCBhbGxXaW5kb3dzKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB3aW5kb3dDb3VudDtcbiAgICAgICAgdGhpcy5hbGxXID0gYWxsV2luZG93cztcbiAgICB9XG4gICAgZ3VpKG5hbWUpe1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlciB0ZW1wbGF0ZScpO1xuICAgICAgICBsZXQgd2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICB3aW5kb3cuc2V0QXR0cmlidXRlKCdpZCcsIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICB3aW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnNldEF0dHJpYnV0ZSgnaWQnLCAnd2luZG93ICcgKyBuYW1lLmlkICsgJyAnICsgdGhpcy53aW5kb3dzKTtcbiAgICAgICAgd2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50b3BiYXInKS50ZXh0Q29udGVudCA9ICBuYW1lLmlkICsgJyAnICsgdGhpcy53aW5kb3dzO1xuXG4gICAgICAgIHdpbmRvdy5zdHlsZS50b3AgPSsgMTIwICogdGhpcy5hbGxXICsgJ3B4JztcbiAgICAgICAgd2luZG93LnN0eWxlLmxlZnQgPSsgMTIwICogdGhpcy5hbGxXICsgJ3B4JztcblxuICAgICAgICB0aGlzLmlkLmFwcGVuZENoaWxkKHdpbmRvdyk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyAsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlkKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEd1aTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBBcHBHdWkgPSByZXF1aXJlKCcuL0FwcEd1aScpO1xuXG5jbGFzcyBEZXNrdG9wIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nYW1lV2luZG93Q291bnQgPSAwO1xuICAgICAgICB0aGlzLmNoYXRXaW5kb3dDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuYWxsV2luZG93cyA9IDA7XG4gICAgfVxuICAgIGNsaWNrKCkge1xuICAgICAgICBsZXQgY2xpY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICBjbGljay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+e1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIGlmKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2lkJykpe1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuaWQgPT09ICdHYW1lJyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5nYW1lV2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cyk7XG4gICAgICAgICAgICAgICAgICAgIGFwcEd1aS5ndWkodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Bvb3AxJylcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAodGFyZ2V0LmlkID09PSAnQ2hhdCcpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXRXaW5kb3dDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSB0aGlzLmNoYXRXaW5kb3dDb3VudCArIHRoaXMuZ2FtZVdpbmRvd0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBHdWkgPSBuZXcgQXBwR3VpKHRoaXMuY2hhdFdpbmRvd0NvdW50LCB0aGlzLmFsbFdpbmRvd3MpO1xuICAgICAgICAgICAgICAgICAgICBhcHBHdWkuZ3VpKHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlc2t0b3A7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGVza3RvcCA9IHJlcXVpcmUoJy4vRGVza3RvcCcpO1xuXG5jb25zdCBkZXNrdG9wID0gbmV3IERlc2t0b3A7XG5cbmRlc2t0b3AuY2xpY2soKTtcbiJdfQ==
