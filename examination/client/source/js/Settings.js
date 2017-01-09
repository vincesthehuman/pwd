/**
 * Created by vinces on 2016-12-28.
 */
const GUI = require('./GUI');

class Settings extends GUI{
    constructor(name, count){
        super(name, count);
        this.content = document.getElementById(name+count).lastElementChild;
        this.topBar = document.getElementById(name+count).firstElementChild;            //The topbar of the game-app
        this.createSettingsContent();                   //Starting point of the app
        this.message = document.createElement('p');
    }
    createSettingsContent() {
        this.content.textContent = '';      //Clears the div
        let template = document.querySelectorAll('template')[5].content.firstElementChild;  //Imports the template needed
        let div = document.importNode(template, true);

        this.content.appendChild(div);
        let username = this.content.querySelector('#username');
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

        let button = this.content.querySelectorAll('button')[0];  //Adds an event to the first button in the window

        button.addEventListener('click', event =>{
            let inputValue = this.content.querySelector('input').value;

            if(inputValue.length <= 0 || inputValue.length >= 25 || inputValue === 'The Server'){ //Checks the input value if it is a proper username
                let text = document.createTextNode('Not a valid username!');
                let p = document.createElement('p');

                p.appendChild(text);
                this.content.appendChild(p);
            }else{
                this.userName = this.content.querySelector('input').value;
                let chatUsername = {username: this.userName};
                localStorage.setItem('ChatUser', JSON.stringify(chatUsername));     //If the username passes the rules, LS is set to the new name
                this.createSettingsContent();                                       //Runs the function again to display the active username
            }
        });
    }

}

module.exports = Settings;
