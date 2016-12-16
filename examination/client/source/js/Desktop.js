/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const AppGui = require('./AppGui');

class Desktop {
    constructor() {
        this.windowCount = 0;
    }
    click() {
        let click = document.querySelector('#wrapper');
        click.addEventListener('click', event =>{
            let target = event.target;
            if(target.hasAttribute('id')){
                if (target.id === 'game' || target.id === 'chat') {
                    this.windowCount += 1;
                    const appGui = new AppGui(this.windowCount);
                    appGui.gui(target);
                }
            }
        })
    }
}

module.exports = Desktop;
