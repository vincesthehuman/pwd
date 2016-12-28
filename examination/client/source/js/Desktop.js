/**
 * Created by vinces on 2016-12-15.
 */
'use strict';

const AppGui = require('./AppGui');
const Chat = require('./Chat');



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
                    const appGui = new AppGui(this.gameWindowCount, this.allWindows, target.id);
                    appGui.gui(target);
                }else if (target.id === 'Chat'){
                    this.chatWindowCount += 1;
                    this.allWindows = this.chatWindowCount + this.gameWindowCount;
                    const appGui = new AppGui(this.chatWindowCount, this.allWindows, target.id);
                    appGui.gui(target);
                }else if(target.id === 'Settings'){
                    this.chatWindowCount += 1;
                    this.allWindows = this.chatWindowCount + this.gameWindowCount;
                    const appGui = new AppGui(this.chatWindowCount, this.allWindows, target.id);
                    appGui.gui(target);
                }else if (target.id === 'close'){
                    if(target.parentNode.parentNode.id === 'Chat'){
                        console.log('wat');
                    }
                    click.removeChild(target.parentNode.parentNode);
                }
            }
        })
    }

}

module.exports = Desktop;
