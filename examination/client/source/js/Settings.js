/**
 * Created by vinces on 2016-12-28.
 */
const GUI = require('./GUI');

class Settings extends GUI{
    constructor(name, count){
        super(name, count);
        this.content = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.createSettingsContent();
        this.message = document.createElement('p');
    }
    createSettingsContent() {
        this.content.textContent = '';
        let template = document.querySelectorAll('template')[5].content.firstElementChild;
        let div = document.importNode(template, true);

        this.content.appendChild(div);
        let username = this.content.querySelector('#username');
        this.checkUserName(username);
    }
    checkUserName(username) {
        let clientUserName = localStorage.getItem('ChatUser');

        let name = JSON.parse(clientUserName);

        if(name === null){
            name = '';
        }

        let pTag = document.createElement('p');
        let pText = document.createTextNode(name.username);

        if(pText.textContent === 'undefined'){
            pTag.setAttribute('class', 'usernameNotSet');
        }

        pTag.appendChild(pText);
        username.appendChild(pTag);

        let button = this.content.querySelectorAll('button')[0];

        button.addEventListener('click', event =>{
            let inputValue = this.content.querySelector('input').value;

            if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){
                let text = document.createTextNode('Not a valid username!');
                let p = document.createElement('p');

                p.appendChild(text);
                this.content.appendChild(p);
            }else{
                this.userName = this.content.querySelector('input').value;
                let chatUsername = {username: this.userName};
                localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
                this.createSettingsContent();
            }
        });
    }

}

module.exports = Settings;
