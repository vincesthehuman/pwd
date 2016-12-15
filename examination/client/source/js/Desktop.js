/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const AppGui = require('./AppGui');

class Desktop {
    constructor() {
        this.target;
    }
    click() {
        let icon = document.querySelector('#sidebar');
        icon.addEventListener('click', event =>{
            this.target = event.target.id;
            const appGui = new AppGui();
            appGui.gui(this.target);
        })
    }
}

module.exports = Desktop;
