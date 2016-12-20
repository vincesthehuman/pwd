/**
 * Created by vinces on 2016-12-15.
 */

'use strict';

class Chat {
    constructor(content){
        this.content = content;
    }
    chatApp(){

        let place = document.getElementById(this.content).lastElementChild;
        let formTag = document.createElement('form');
        let inputTag = document.createElement('input');

        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');

        formTag.appendChild(inputTag);
        place.appendChild(formTag);
    }
    getMessage(){

    }
    sendMessage(){
        let message = {
            "type": "message",
            "data" : "The message text is sent using the data property",
            "username": "MyFancyUsername",
            "channel": "my, not so secret, channel",
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }
    }
}

module.exports = Chat;
