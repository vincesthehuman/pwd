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
