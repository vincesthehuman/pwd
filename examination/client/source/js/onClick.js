/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

class onClick{
    constructor () {
        this.click;
    }
    click() {
        const icon = document.getElementsByClassName('.icon');
        icon.addEventListener('click', event =>{
            console.log('hello world!');
        })
    }
}

module.exports = onClick;
