import { Socket } from "socket.io-client";
import {isLetter} from "../player";

export class playerJoinScene extends Phaser.Scene {
    socket: Socket;
    constructor() {
        super({ key: "playerJoinScene" });
    }
    create() { // this is called when the scene is to be displayed

        
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const input = this.add.text(screenCenterX, screenCenterY, "Type your word (don't need to click me) (then hit enter): ", {color: "black"}).setOrigin(0.5);

        let word: string[] = [];

        // this is for word input
        this.input.keyboard.on('keyup', keyevent => {

            let letter = keyevent.key
            letter = letter.toUpperCase();

            if (keyevent.key === "Enter"){ // when person preessen rester

                this.scene.start("MainScene", { 
                    "word": word,
                });
                return
            }
            if (! isLetter(letter)){ // ! means not
                if (letter !== " "){
                    return true; // rejects all non-letters
              }
            }
    
            word.push(keyevent.key);
            input.setText("Type your word: " + word.join(""))
            
        })
    }
}