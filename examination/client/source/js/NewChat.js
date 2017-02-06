/**
 * Created by vinces on 2016-12-28.
 *
 * ToDo close socket when window is closed
 */
'use strict';

const GUI = require('./GUI');

class Chat extends GUI{
    constructor(name, count){
        super(name, count);
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;
        this.createChatSettings();
        this.chatName = '';
        this.clientUserName = '';
        this.enterName();
        this.secretLangOption = false;
    }

    /**
     * Creates a GUI for the user to enter a chat name which will be saved in local storage
     */
    enterName() {
        let userName = localStorage.getItem('ChatUser');

        if(userName !== null){
            userName = JSON.parse(userName);
            this.chatName = userName.username;
            this.chatApp();

        }else{
            this.windowContent.className += ' username';
            let div = document.createElement('div');
            let divImg = document.createElement('div');
            let aTag = document.createElement('a');
            let img = document.createElement('img');
            let pTag = document.createElement('p');
            let pText = document.createTextNode('Enter a username:');

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

            this.windowContent.appendChild(div);

            aTag.addEventListener('click', event =>{
                let inputValue = this.windowContent.querySelector('input').value;

                if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){
                    let text = document.createTextNode('Not a valid username!');
                    let p = document.createElement('p');

                    p.appendChild(text);
                    this.windowContent.appendChild(p);
                }else{
                    this.userName = this.windowContent.querySelector('input').value;
                    let chatUsername = {username: this.userName};
                    localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
                    this.chatName = inputValue;
                    this.windowContent.classList.remove('enterusername');
                    this.windowContent.textContent = '';
                    this.chatApp();
                }
            });
        }
    }

    /**
     * Creates the GUI for the chat app
     */
    chatApp(){
        this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
        this.socket.addEventListener('message',  event => {
            this.receiveMessage(event);
        });

        let formDiv = document.createElement('div');
        let formTag = document.createElement('form');
        let inputTag = document.createElement('textarea');
        let sendImg = document.createElement('img');
        let sendATag = document.createElement('a');
        this.textField = document.createElement('div');

        this.textField.setAttribute('class', 'textfield');
        formDiv.setAttribute('class', 'chatStyles');
        formTag.setAttribute('class', 'formstyle');
        inputTag.setAttribute('class', 'chatinput');
        sendATag.setAttribute('href', '#');
        sendATag.setAttribute('class', 'sendicon');
        sendImg.setAttribute('src', '/image/send.png');

        this.windowContent.appendChild(this.textField);
        formTag.appendChild(inputTag);
        formDiv.appendChild(formTag);
        sendATag.appendChild(sendImg);
        formDiv.appendChild(sendATag);
        this.windowContent.appendChild(formDiv);

        inputTag.addEventListener('keydown', event =>{
            if (event.which === 13){
                event.preventDefault();
                let clearInput = this.windowContent.querySelector('textarea');
                let inputValue = clearInput.value;
                if(inputValue.length > 0){
                    this.sendMessage(inputValue);
                    clearInput.value = '';
                }
            }
        });

        sendATag.addEventListener('click', event =>{
            let clearInput = this.windowContent.querySelector('textarea');
            let inputValue = clearInput.value;
            if(inputValue.length > 0){
                this.sendMessage(inputValue);
                clearInput.value = '';
            }
        })

    }

    /**
     * Creates chat settings
     */
    createChatSettings(){
        let count = 0;
        this.topBar.querySelector('.appsettings').addEventListener('mousedown', event =>{
            event.preventDefault();
            count += 1;
            if(count === 1){
                let chatSettingsDiv = document.createElement('div');
                let rovarsprak = document.createElement('input');
                let label = document.createElement('label');
                let pTag = document.createElement('p');
                let pText = document.createTextNode('(Not very secret)');

                label.appendChild(document.createTextNode('Rövarspråk'));
                rovarsprak.setAttribute('type', 'checkbox');
                rovarsprak.setAttribute('name', 'Rövarspråk');
                rovarsprak.setAttribute('value', 'true');
                rovarsprak.setAttribute('id', 'rovarsprak');
                chatSettingsDiv.setAttribute('class', 'chatsettings');

                chatSettingsDiv.appendChild(rovarsprak);
                chatSettingsDiv.appendChild(label);
                pTag.appendChild(pText);
                chatSettingsDiv.appendChild(pTag);

                if(this.secretLangOption === true){
                    rovarsprak.setAttribute('checked', 'true');
                }

                rovarsprak.addEventListener('click', event =>{
                    if(rovarsprak.checked === true){
                        this.secretLangOption = true;
                    }else{
                        this.secretLangOption = false;
                    }
                });

                let parentNode = this.topBar.parentNode;

                let children = parentNode.childNodes;

                parentNode.insertBefore(chatSettingsDiv, children[0]);

            }else if(count % 2 === 0){
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').style.display = 'none';
            }else{
                let parent = this.topBar.parentNode;
                parent.querySelector('.chatsettings').style.display = 'inline-block';
            }
        })
    }

    /**
     *
     * @param text
     * @returns {string}
     */
    secretLang(text) {

        let konsonanter = ['B', 'b', 'C', 'c', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm',
                           'N', 'n', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's',  'T', 't', 'V', 'v', 'W', 'w', 'X', 'x', 'Z', 'z'];

        let newString = '';

        for(let i = 0; i < text.length; i ++){
            for(let j = 0; j < konsonanter.length; j ++){
                if(text[i] === konsonanter[j]){
                    newString += text[i] + 'o';
                }
            }
            newString += text[i];
        }
        return newString;
    }

    /**
     *
     * @param input
     */
    sendMessage(input){
        this.clientUserName = localStorage.getItem('ChatUser');
        this.clientUserName = JSON.parse(this.clientUserName);

        if (this.secretLangOption === true){
            input = this.secretLang(input);
        }
        let message = {
            "type": "message",
            "data" : input,
            "username": this.clientUserName.username,
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        };
        this.socket.send(JSON.stringify(message));
    }

    /**
     *
     * @param receivedMessage
     */
    receiveMessage(receivedMessage) {
        let response = JSON.parse(receivedMessage.data);
        let div = document.createElement('div');
        let message = document.createElement('p');
        let senderName = document.createElement('p');
        let sender = document.createTextNode(response.username + ':');
        let text = document.createTextNode(response.data);
        let textP = document.createElement('p');

        textP.setAttribute('class', 'messagecontent');
        senderName.setAttribute('class', 'sendername');

        if(response.type !== 'heartbeat'){
            if(response.username === this.clientUserName.username){
                div.setAttribute('class', 'clientmessage')
            }else if(response.type === 'notification'){
                senderName.removeAttribute('class');
                div.setAttribute('class', 'servermessage');
            } else{
                div.setAttribute('class', 'chatreply')
            }
            senderName.appendChild(sender);
            message.appendChild(senderName);

            textP.appendChild(text);
            message.appendChild(textP);
            div.appendChild(message);

            this.windowContent.firstElementChild.appendChild(div);
        }
        this.windowContent.firstElementChild.scrollTop = this.windowContent.firstElementChild.scrollHeight;
    }
}

module.exports = Chat;
