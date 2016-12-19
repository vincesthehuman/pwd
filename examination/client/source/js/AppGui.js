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
