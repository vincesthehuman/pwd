/**
 * Created by vinces on 2016-12-15.
 *
 * ToDo Make a gui that all the apps inherits.
 */

'use strict';

const Chat = require('./Chat');

class AppGui{
    constructor(windowCount, allWindows, targetID) {
        this.id = document.querySelector('#wrapper');
        this.windows = windowCount;
        this.allW = allWindows;
        this.targetID = targetID;
        this.windowCounter = 0;
    }
    gui(name){
        let template = document.querySelector('#wrapper template');
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let pTag = document.createElement('p');
        let pText = document.createTextNode(name.id + ' ' + this.windows);
        pTag.appendChild(pText);

        appWindow.setAttribute('id', name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').setAttribute('id', 'window ' + name.id + ' ' + this.windows);
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * this.allW + 'px';
        appWindow.style.left =+ 105 * this.allW + 'px';


        appWindow.style.zIndex = '1';
        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.targetID + '.png');
        console.log(appWindow.firstElementChild.id);

        this.move(appWindow.firstElementChild);

        this.id.appendChild(appWindow);

        if(this.targetID === 'Game'){
            console.log('hello Gamer')
        }else if(this.targetID === 'Chat'){
            const chatWindow = new Chat(appWindow.id);
            chatWindow.chatApp();
        }

    }
    move(selected) {
        selected.addEventListener('mousedown', event =>{
            let windowPosX = parseInt(selected.parentNode.style.left, 10);
            let windowPosY = parseInt(selected.parentNode.style.top, 10);

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;

            let moveWindow = function (e) {

                let moveToX = e.pageX - offsetX;
                let moveToY = e.pageY - offsetY;
                selected.parentNode.style.top = moveToY + 'px';
                selected.parentNode.style.left = moveToX + 'px';
            };

            let removeEvent = function(x) {
                document.removeEventListener('mouseup', removeEvent);
                document.removeEventListener('mousemove', moveWindow);
            };

            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', removeEvent);
        });
    }
}

module.exports = AppGui;
