/**
 * Created by vinces on 2016-12-28.
 */
const GUI = require('./GUI');

class Settings extends GUI{
    constructor(name, count){
        super(name, count);
        this.windowContent = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.createChatSettingsContent();                   //Starting point of the app
        this.changeTheme();
        this.message = document.createElement('p');
    }
    createChatSettingsContent() {
        // if(this.windowContent.querySelector('.settingsContent').firstElementChild !== null){
        //     this.windowContent.removeChild(this.windowContent.querySelector('.settingsContent'));     //Clears the div
        // }

        let template = document.querySelectorAll('template')[5].content;  //Imports the template needed
        let div = document.importNode(template, true);

        this.windowContent.appendChild(div);
        let username = this.windowContent.querySelector('#username');
        this.checkUserName(username);       //Checks the username
    }

    checkUserName(username) {
        let clientUserName = localStorage.getItem('ChatUser');      //Checks local storage for a username

        let name = JSON.parse(clientUserName);

        if(name === null){      //If username is not defined, set to an empty string
            name = '';
        }

        let pTag = document.createElement('p');
        let pText = document.createTextNode(name.username);     //The username is put in a p element

        if(pText.textContent === 'undefined'){
            pTag.setAttribute('class', 'usernameNotSet');       //If the username is undefined, add the class username not set
        }

        pTag.appendChild(pText);
        username.appendChild(pTag);

        let button = this.windowContent.querySelectorAll('button')[0];  //Adds an event to the first button in the window

        let input = this.windowContent.querySelector('input');

        input.addEventListener('keydown', event =>{                                                                  //Adds an event listener to the enter-key when typing, send the message when pressed
            if (event.which === 13){
                this.verifyUsername(input);
            }
        });

        button.addEventListener('click', event =>{
            this.verifyUsername(input);
        });
    }

    verifyUsername(input){
        if(input.value.length <= 0 || input.value.length >= 25 || input.value === 'The Server'){ //Checks the input value if it is a proper username
            let text = document.createTextNode('Not a valid username!');
            let p = document.createElement('p');

            p.appendChild(text);
            this.windowContent.appendChild(p);
        }else{
            this.userName = this.windowContent.querySelector('input').value;
            let chatUsername = {username: this.userName};
            localStorage.setItem('ChatUser', JSON.stringify(chatUsername));     //If the username passes the rules, LS is set to the new name
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
