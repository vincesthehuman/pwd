/**
 * Created by vinces on 2016-12-15.
 *
 * ToDo Make a gui that all the apps inherits.
 */

'use strict';

class AppGui{
    constructor(windowCount) {
        this.id = document.querySelector('#wrapper');
        this.windows = windowCount;
    }
    gui(name){
        let template = document.querySelector('#wrapper template');
        let window = document.importNode(template.content.firstElementChild, true);

        window.addEventListener('mousedown' , event => {
            console.log('hejhej');
        });

        window.setAttribute('id', 'window' + this.windows);
        this.id.appendChild(window);
    }
}

module.exports = AppGui;
