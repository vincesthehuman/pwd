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
        let appWindow = document.importNode(template.content.firstElementChild, true);

        appWindow.setAttribute('id', name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').setAttribute('id', 'window ' + name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').textContent =  name.id + ' ' + this.windows;

        appWindow.style.top =+ 80 * this.allW + 'px';
        appWindow.style.left =+ 120 * this.allW + 'px';

        let newpos = function () {
        };

        appWindow.addEventListener('mousedown', event =>{

            let moveWindow = function (e) {
                appWindow.style.top = e.clientY + 'px';
                appWindow.style.left = e.clientX + 'px';
            };

            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', x => {
                document.removeEventListener('mousemove', moveWindow);
            })
        }, true);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjcuMi4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQXBwR3VpLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9EZXNrdG9wLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB2aW5jZXMgb24gMjAxNi0xMi0xNS5cbiAqXG4gKiBUb0RvIE1ha2UgYSBndWkgdGhhdCBhbGwgdGhlIGFwcHMgaW5oZXJpdHMuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBBcHBHdWl7XG4gICAgY29uc3RydWN0b3Iod2luZG93Q291bnQsIGFsbFdpbmRvd3MpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJyk7XG4gICAgICAgIHRoaXMud2luZG93cyA9IHdpbmRvd0NvdW50O1xuICAgICAgICB0aGlzLmFsbFcgPSBhbGxXaW5kb3dzO1xuICAgIH1cbiAgICBndWkobmFtZSl7XG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyIHRlbXBsYXRlJyk7XG4gICAgICAgIGxldCBhcHBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuXG4gICAgICAgIGFwcFdpbmRvdy5zZXRBdHRyaWJ1dGUoJ2lkJywgbmFtZS5pZCArICcgJyArIHRoaXMud2luZG93cyk7XG4gICAgICAgIGFwcFdpbmRvdy5xdWVyeVNlbGVjdG9yKCcudG9wYmFyJykuc2V0QXR0cmlidXRlKCdpZCcsICd3aW5kb3cgJyArIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3MpO1xuICAgICAgICBhcHBXaW5kb3cucXVlcnlTZWxlY3RvcignLnRvcGJhcicpLnRleHRDb250ZW50ID0gIG5hbWUuaWQgKyAnICcgKyB0aGlzLndpbmRvd3M7XG5cbiAgICAgICAgYXBwV2luZG93LnN0eWxlLnRvcCA9KyA4MCAqIHRoaXMuYWxsVyArICdweCc7XG4gICAgICAgIGFwcFdpbmRvdy5zdHlsZS5sZWZ0ID0rIDEyMCAqIHRoaXMuYWxsVyArICdweCc7XG5cbiAgICAgICAgbGV0IG5ld3BvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfTtcblxuICAgICAgICBhcHBXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT57XG5cbiAgICAgICAgICAgIGxldCBtb3ZlV2luZG93ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBhcHBXaW5kb3cuc3R5bGUudG9wID0gZS5jbGllbnRZICsgJ3B4JztcbiAgICAgICAgICAgICAgICBhcHBXaW5kb3cuc3R5bGUubGVmdCA9IGUuY2xpZW50WCArICdweCc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB4ID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlV2luZG93KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHRoaXMuaWQuYXBwZW5kQ2hpbGQoYXBwV2luZG93KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwR3VpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE1LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IEFwcEd1aSA9IHJlcXVpcmUoJy4vQXBwR3VpJyk7XG5cbmNsYXNzIERlc2t0b3Age1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmdhbWVXaW5kb3dDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuY2hhdFdpbmRvd0NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5hbGxXaW5kb3dzID0gMDtcbiAgICB9XG4gICAgY2xpY2soKSB7XG4gICAgICAgIGxldCBjbGljayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cmFwcGVyJyk7XG4gICAgICAgIGNsaWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT57XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgaWYodGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaWQnKSl7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5pZCA9PT0gJ0dhbWUnKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lV2luZG93Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxXaW5kb3dzID0gdGhpcy5jaGF0V2luZG93Q291bnQgKyB0aGlzLmdhbWVXaW5kb3dDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXBwR3VpID0gbmV3IEFwcEd1aSh0aGlzLmdhbWVXaW5kb3dDb3VudCwgdGhpcy5hbGxXaW5kb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwR3VpLmd1aSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXQuaWQgPT09ICdDaGF0Jyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhdFdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsV2luZG93cyA9IHRoaXMuY2hhdFdpbmRvd0NvdW50ICsgdGhpcy5nYW1lV2luZG93Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcEd1aSA9IG5ldyBBcHBHdWkodGhpcy5jaGF0V2luZG93Q291bnQsIHRoaXMuYWxsV2luZG93cyk7XG4gICAgICAgICAgICAgICAgICAgIGFwcEd1aS5ndWkodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlc2t0b3A7XG4iLCIvKipcbiAqXG4gKiBDcmVhdGVkIGJ5IHZpbmNlcyBvbiAyMDE2LTEyLTE0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGVza3RvcCA9IHJlcXVpcmUoJy4vRGVza3RvcCcpO1xuXG5jb25zdCBkZXNrdG9wID0gbmV3IERlc2t0b3A7XG5cbmRlc2t0b3AuY2xpY2soKTtcbiJdfQ==
