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
        this.windowCounter = 0;
    }
    gui(name){
        let template = document.querySelector('#wrapper template');
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let ptag = document.createElement('p');
        let ptext = document.createTextNode(name.id + ' ' + this.windows);
        ptag.appendChild(ptext);

        appWindow.setAttribute('id', name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').setAttribute('id', 'window ' + name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').appendChild(ptag);

        appWindow.style.top =+ 80 * this.allW + 'px';
        appWindow.style.left =+ 120 * this.allW + 'px';
        appWindow.style.zIndex = '1';
        appWindow.style.cursor = 'move';

        appWindow.addEventListener('mousedown', event =>{
            let moveWindow = function (e) {
                appWindow.style.top = e.clientY + 'px';
                appWindow.style.left = e.clientX + 'px';
            };

            let removeEvent = function(x) {
                document.removeEventListener('mouseup', removeEvent);
                document.removeEventListener('mousemove', moveWindow);
            };

            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', removeEvent);
        });

        this.id.appendChild(appWindow);
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
                }else if (target.id === 'close'){
                    click.removeChild(target.parentNode.parentNode);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKlxuICogVG9EbyBNYWtlIGEgZ3VpIHRoYXQgYWxsIHRoZSBhcHBzIGluaGVyaXRzLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQXBwR3Vpe1xuICAgIGNvbnN0cnVjdG9yKHdpbmRvd0NvdW50LCBhbGxXaW5kb3dzKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlcicpO1xuICAgICAgICB0aGlzLndpbmRvd3MgPSB3aW5kb3dDb3VudDtcbiAgICAgICAgdGhpcy5hbGxXID0gYWxsV2luZG93cztcbiAgICAgICAgdGhpcy53aW5kb3dDb3VudGVyID0gMDtcbiAgICB9XG4gICAgZ3VpKG5hbWUpe1xuICAgICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd3JhcHBlciB0ZW1wbGF0ZScpO1xuICAgICAgICBsZXQgYXBwV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcblxuICAgICAgICBsZXQgcHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbGV0IHB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmFtZS5pZCArICcgJyArIHRoaXMud2luZG93cyk7XG4gICAgICAgIHB0YWcuYXBwZW5kQ2hpbGQocHRleHQpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zZXRBdHRyaWJ1dGUoJ2lkJywgbmFtZS5pZCArICcgJyArIHRoaXMud2luZG93cyk7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuc2V0QXR0cmlidXRlKCdpZCcsICd3aW5kb3cgJyArIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLmFwcGVuZENoaWxkKHB0YWcpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS50b3AgPSsgODAgKiB0aGlzLmFsbFcgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9KyAxMjAgKiB0aGlzLmFsbFcgKyAncHgnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUuekluZGV4ID0gJzEnO1xuICAgICAgICBhcHBXaW5kb3cuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuXG4gICAgICAgIGFwcFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCBtb3ZlV2luZG93ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBhcHBXaW5kb3cuc3R5bGUudG9wID0gZS5jbGllbnRZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9IGUuY2xpZW50WCArICdweCc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVXaW5kb3cpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJlbW92ZUV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pZC5hcHBlbmRDaGlsZChhcHBXaW5kb3cpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcHBHdWk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdmluY2VzIG9uIDIwMTYtMTItMTUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgQXBwR3VpID0gcmVxdWlyZSgnLi9BcHBHdWknKTtcblxuY2xhc3MgRGVza3RvcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZ2FtZVdpbmRvd0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5jaGF0V2luZG93Q291bnQgPSAwO1xuICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSAwO1xuICAgIH1cbiAgICBjbGljaygpIHtcbiAgICAgICAgbGV0IGNsaWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dyYXBwZXInKTtcbiAgICAgICAgY2xpY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PntcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICBpZih0YXJnZXQuaGFzQXR0cmlidXRlKCdpZCcpKXtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlkID09PSAnR2FtZScpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVXaW5kb3dDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbFdpbmRvd3MgPSB0aGlzLmNoYXRXaW5kb3dDb3VudCArIHRoaXMuZ2FtZVdpbmRvd0NvdW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBHdWkgPSBuZXcgQXBwR3VpKHRoaXMuZ2FtZVdpbmRvd0NvdW50LCB0aGlzLmFsbFdpbmRvd3MpO1xuICAgICAgICAgICAgICAgICAgICBhcHBHdWkuZ3VpKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHRhcmdldC5pZCA9PT0gJ0NoYXQnKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGF0V2luZG93Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxXaW5kb3dzID0gdGhpcy5jaGF0V2luZG93Q291bnQgKyB0aGlzLmdhbWVXaW5kb3dDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXBwR3VpID0gbmV3IEFwcEd1aSh0aGlzLmNoYXRXaW5kb3dDb3VudCwgdGhpcy5hbGxXaW5kb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXQuaWQgPT09ICdjbG9zZScpe1xuICAgICAgICAgICAgICAgICAgICBjbGljay5yZW1vdmVDaGlsZCh0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlc2t0b3A7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGVza3RvcCA9IHJlcXVpcmUoJy4vRGVza3RvcCcpO1xuXG5jb25zdCBkZXNrdG9wID0gbmV3IERlc2t0b3A7XG5cbmRlc2t0b3AuY2xpY2soKTtcbiJdfQ==
