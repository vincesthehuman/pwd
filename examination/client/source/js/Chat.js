/**
 * Created by vinces on 2016-12-15.
 */

'use strict';

class Chat {
    constructor(content){
        this.content = document.getElementById(content).lastElementChild;
    }
    initiate(){
        this.content.className += ' username';
        let div = document.createElement('div');
        let pTag = document.createElement('p');
        let pText = document.createTextNode('Please enter a username:');

        let formTag = document.createElement('form');
        let inputTag = document.createElement('input');

        div.setAttribute('class', 'usernamefield');

        pTag.appendChild(pText);
        formTag.appendChild(inputTag);

        div.appendChild(pTag);
        div.appendChild(formTag);

        this.content.appendChild(div)
    }

    chatApp(){
        let formDiv = document.createElement('div');
        let formTag = document.createElement('form');
        let inputTag = document.createElement('input');
        let img = document.createElement('img');
        let aTag = document.createElement('a');
        let textField = document.createElement('div');

        textField.setAttribute('class', 'textfield');
        formDiv.setAttribute('class', 'chatStyles');
        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');
        aTag.setAttribute('href', '#');
        aTag.setAttribute('class', 'sendicon');
        img.setAttribute('src', '/image/send.png');

        this.content.appendChild(textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);
        aTag.appendChild(img);
        formDiv.appendChild(aTag);
        this.content.appendChild(formDiv);
    }

    messages(input){
        let socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');

        let data = input;



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
