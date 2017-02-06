/**
 * Created by vinces on 2016-12-27.
 *
 * * ToDo Make a gui that all the apps inherits.
 */

/**
 * Todo place the settings- and close icon so that the div does not gets a transparency
 */

'use strict';

class GUI{
    constructor(windowApp, counter) {
        this.windowApp = windowApp;
        this.counter = counter;
        this.wrapper = document.querySelector('#wrapper');
        this.gui();
    }

    /**
     * Creates the basic GUI layout
     */
    gui(){
        let template = document.querySelectorAll('template')[0];
        let appWindow = document.importNode(template.content.firstElementChild, true);

        let pTag = document.createElement('p');
        pTag.setAttribute('class', this.windowApp + 'title');
        let pText = document.createTextNode(this.windowApp);
        pTag.appendChild(pText);

        appWindow.setAttribute('id', this.windowApp + this.counter);
        this.topBar = appWindow.querySelector('.topbar').setAttribute('id', 'window ' + this.windowApp);
        appWindow.querySelector('.topbar').appendChild(pTag);

        appWindow.style.top =+ 45 * (this.counter + 1) + 'px';
        appWindow.style.left =+ 105 * (this.counter + 1) + 'px';

        let removeZindex = document.getElementsByClassName('window');

        let zIndexCount = 0;
        for(let i = 0; i < removeZindex.length; i ++) {
            let foo = removeZindex[i].style.zIndex;

            if (parseInt(foo) > zIndexCount) {
                zIndexCount = parseInt(foo);
            }
        }

        appWindow.style.zIndex = zIndexCount;

        appWindow.firstElementChild.style.cursor = 'move';

        appWindow.querySelector('.topicon').setAttribute('src', '/image/' + this.windowApp + '.png');

        if(this.windowApp === 'Game' || this.windowApp === 'Chat'){
            this.appSettings(appWindow);
        }

        appWindow.querySelector('#close').addEventListener('click', event =>{
            this.close(event.target);
        });

        this.move(appWindow.firstElementChild);

        this.wrapper.appendChild(appWindow);

    }

    /**
     * Makes a close button
     * @param node
     */
    close(node) {
        node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
    }

    /**
     * Adds settings icon
     * @param position
     */
    appSettings(position) {
        position.querySelector('.appsettings').setAttribute('id', this.windowApp + this.counter);
        position.querySelector('.appsettings').firstChild.setAttribute('src', '/image/Settings.png');
    }

    /**
     * Enables the window to move
     * @param selected
     */
    move(selected) {
        selected.addEventListener('mousedown', event =>{
            event.preventDefault();

            selected.parentNode.classList.add('onmousedown');

            let windowPosX = parseInt(selected.parentNode.style.left);
            let windowPosY = parseInt(selected.parentNode.style.top);

            let offsetX = event.pageX - windowPosX;
            let offsetY = event.pageY - windowPosY;

            let moveWindow = e => {
                let moveToX = e.pageX - offsetX;
                let moveToY = e.pageY - offsetY;
                selected.parentNode.style.top = moveToY + 'px';
                selected.parentNode.style.left = moveToX + 'px';
            };

            let removeEvent = x => {
                selected.parentNode.classList.remove('onmousedown');
                let removeZindex = document.getElementsByClassName('window');

                let zIndexCount = 0;
                for(let i = 0; i < removeZindex.length; i ++){
                    let foo = removeZindex[i].style.zIndex;

                    if(parseInt(foo) > zIndexCount){
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
