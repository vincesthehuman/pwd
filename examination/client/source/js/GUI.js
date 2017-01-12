/**
 * Created by vinces on 2016-12-27.
 *
 * * ToDo Make a gui that all the apps inherits.
 */


'use strict';

class GUI{
    constructor(windowApp, counter) {
        this.windowApp = windowApp;             //What type of window is being created
        this.counter = counter;                 //A counter for how many windows there are
        this.wrapper = document.querySelector('#wrapper');
        this.gui();
    }


    gui(){
        let template = document.querySelectorAll('template')[0];
        let appWindow = document.importNode(template.content.firstElementChild, true);      //Selects the first template and imports it from the index.html

        let pTag = document.createElement('p');
        let pText = document.createTextNode(this.windowApp);    //The name of the window
        pTag.appendChild(pText);

        appWindow.setAttribute('id', this.windowApp + this.counter);                                        //The window is given an id, with type and a number
        this.topBar = appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);    //The windows topbar gets a similar id
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * (this.counter + 1) + 'px';
        appWindow.style.left =+ 105 * (this.counter + 1) + 'px';    //Adds a "bounce" to the windows

        let removeZindex = document.getElementsByClassName('window');       //Counts all open windows in the wrapper

        let zIndexCount = 0;
        for(let i = 0; i < removeZindex.length; i ++) {                      //Gives a new z-index
            let foo = removeZindex[i].style.zIndex;

            if (parseInt(foo) > zIndexCount) {                                //If the zindex of the clicked window is higher than the zindex counter, z index counter gets a new value
                zIndexCount = parseInt(foo);
            }
        }

        appWindow.style.zIndex = zIndexCount;

        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.windowApp + '.png');       //The icon corresponds to the type of window that is choosen

        if(this.windowApp === 'Game' || this.windowApp === 'Chat'){                            //Adds a settings option
            this.appSettings(appWindow);
        }

        appWindow.querySelector('#close').addEventListener('click', event =>{                  //Adds the function to close a window
            this.close(event.target);
        });

        this.move(appWindow.firstElementChild);                                                 //Adds the function to move a window

        this.wrapper.appendChild(appWindow);

    }

    close(node) {       //Removes the parent node of the parent node (the Window selected)
        node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
    }

    appSettings(position) {
        position.querySelector('.appsettings').setAttribute('id', this.windowApp + this.counter);
        position.querySelector('.appsettings').firstChild.setAttribute('src', '/image/Settings.png');   //Adds the settings icon
    }

    move(selected) {    //Makes it possible for the user to move the window
        selected.addEventListener('mousedown', event =>{
            event.preventDefault();

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left);
            let windowPosY = parseInt(selected.parentNode.style.top);  //Sets the styling of the selected window

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;                         //The offset is calculated so that the windows top left corner doesn't "jump" to pointer

            let moveWindow = e => {
                let moveToX = e.pageX - offsetX;
                let moveToY = e.pageY - offsetY;
                selected.parentNode.style.top = moveToY + 'px';
                selected.parentNode.style.left = moveToX + 'px';
            };

            let removeEvent = x => {
                selected.parentNode.classList.remove('onmousedown');
                let removeZindex = document.getElementsByClassName('window');       //Counts all open windows in the wrapper

                let zIndexCount = 0;
                for(let i = 0; i < removeZindex.length; i ++){                      //Gives a new z-index
                    let foo = removeZindex[i].style.zIndex;

                    if(parseInt(foo) > zIndexCount){                                //If the zindex of the clicked window is higher than the zindex counter, z index counter gets a new value
                        zIndexCount = parseInt(foo);
                    }
                }
                selected.parentNode.style.zIndex = zIndexCount + 1;
                document.removeEventListener('mouseup', removeEvent);
                document.removeEventListener('mousemove', moveWindow);
            };

            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', removeEvent);
        });
    }

}

module.exports = GUI;
