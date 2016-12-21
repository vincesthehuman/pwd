/**
 * Created by vinces on 2016-12-15.
 *
 * ToDo close socket when wondow is closed
 */

'use strict';

class Chat {
    constructor(content){
        this.content = document.getElementById(content).lastElementChild;
        this.userName = '';
    }
    initiate(){
        this.enterName();
    }
    enterName() {
        let userName = localStorage.getItem('ChatUser');

        if(userName !== null){
            userName = JSON.parse(userName);
            this.chatApp();
        }else{
            this.content.className += ' username';
            let div = document.createElement('div');
            let divImg = document.createElement('div');
            let aTag = document.createElement('a');
            let img = document.createElement('img');
            let pTag = document.createElement('p');
            let pText = document.createTextNode('Please enter a username:');

            let formTag = document.createElement('form');
            let inputTag = document.createElement('input');

            aTag.setAttribute('href', '#');
            img.setAttribute('src', '/image/accept.png');
            div.setAttribute('class', 'usernamefield');

            aTag.appendChild(img);
            divImg.appendChild(aTag);
            pTag.appendChild(pText);
            formTag.appendChild(inputTag);

            div.appendChild(pTag);
            div.appendChild(formTag);
            div.appendChild(divImg);


            this.content.appendChild(div);

            aTag.addEventListener('click', event =>{
                let inputValue = this.content.querySelector('input').value;

                if(inputValue.length <= 0 || inputValue.length >= 25){
                    console.log('the name is either too short or too long dude!')
                }else{
                    this.userName = this.content.querySelector('input').value;
                    let chatUsername = {username: this.userName};
                    localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
                    //clear the div
                    this.chatApp();
                }
            });
        }


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
