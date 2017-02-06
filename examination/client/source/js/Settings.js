/**
 * Created by vinces on 2016-12-28.
 */
const GUI = require('./GUI');

class Settings extends GUI{
    constructor(name, count){
        super(name, count);
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;
        this.createChatSettingsContent();
        this.changeTheme();
        this.message = document.createElement('p');
    }

    createChatSettingsContent() {
        let template = document.querySelectorAll('template')[5].content;
        let div = document.importNode(template, true);

        this.windowContent.appendChild(div);
        let username = this.windowContent.querySelector('#username');
        this.checkUserName(username);
    }

    /**
     *
     * @param username
     */
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

        let button = this.windowContent.querySelectorAll('button')[0];

        let input = this.windowContent.querySelector('input');

        input.addEventListener('keydown', event =>{
            if (event.which === 13){
                this.verifyUsername(input);
            }
        });

        button.addEventListener('click', event =>{
            this.verifyUsername(input);
        });
    }

    /**
     *
     * @param input
     */
    verifyUsername(input){
        if(input.value.length <= 0 || input.value.length >= 25 || input.value === 'The Server'){
            let text = document.createTextNode('Not a valid username!');
            let p = document.createElement('p');

            p.appendChild(text);
            this.windowContent.appendChild(p);

            /**
             * ToDo remove the p-tag so that they don't stack
             */
        }else{
            this.userName = this.windowContent.querySelector('input').value;
            let chatUsername = {username: this.userName};
            localStorage.setItem('ChatUser', JSON.stringify(chatUsername));
            let newName = this.windowContent.querySelector('#username');
            newName.textContent = this.userName;
            this.windowContent.querySelector('.settingsContent').querySelector('input').value = '';
        }
    }

    changeTheme(){

        if(this.windowContent.querySelector('.changeTheme') !== null){
            this.windowContent.removeChild(this.windowContent.querySelector('.changeTheme'));     //Clears the div
        }
        let template = document.querySelectorAll('template')[6].content;

        let themeOptions = document.importNode(template, true);

        this.windowContent.appendChild(themeOptions);

        let themeDiv = this.windowContent.querySelector('.changeTheme');

        themeDiv.addEventListener('click', event =>{
            event.preventDefault();
            let clicked = event.target.classList[0];

            if(event.target.nodeName !== 'A'){
                return;
            }

            console.log(event.target);

            let option1 = 'aliceblue';
            let option2 = '#F8BF28';
            let option3 = '#00aeff';

            let wrapper = document.querySelector('#wrapper');

            /**
             * ToDo set new background in LS, read from that, all the time in desktop
             *
             * todo give a border to the active pic in use right now
             *
             *
             * todo clean up the code, remove massive if-statement
             */

            if(clicked === 'option1'){
                wrapper.style.background = 0;
                wrapper.style.backgroundColor = option1;
            }else if(clicked === 'option2'){
                wrapper.style.background = 0;
                wrapper.style.backgroundColor = option2;
            }else if(clicked === 'option3'){
                wrapper.style.background = 0;
                wrapper.style.backgroundColor = option3;
            }else if(clicked === 'option4'){
                wrapper.style.background = 'url("/image/jakethedog.png") center';
            }
        })
    }

}

module.exports = Settings;
