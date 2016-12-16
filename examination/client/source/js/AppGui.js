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
