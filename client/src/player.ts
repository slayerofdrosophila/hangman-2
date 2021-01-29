import { Scene, Scenes } from "phaser";
import {MainScene} from "./scenes/mainScene";

export function isLetter(c: string){
    return c.length === 1 && c.match(/[a-z]/i)
}

export class Player {

    // this class is a "list" with these elements, functions will take the "this" parameter which is all this stuff

    playerletters: string[]; // list of characters of a word
    underscorelist: string[]; // list of underscores as they are being guessed
    wrongguesses: Set<string>; // SET of wrong guesses
    damage: integer; // 0 = best, 6 = daed, and each has a corresponding picture names 0-6.png

    wordsprite: Phaser.GameObjects.Text; // one player's word sprite
    wronganswerlistsprite: Phaser.GameObjects.Text; // wrong answer list sprite
    hangmanpicture: Phaser.GameObjects.Image; // hangman picture, 0-5.png

    selectedstate: boolean = false; // if a sprite is selected

    constructor(scene: MainScene, xpos: integer, ypos: integer, playerindex: string, playerletters: string[], isme:boolean) { // when is this called?

        let underscorelist = [];
        for (let c in playerletters) {
            underscorelist.push("-");     // this doesnt have anything to do with the drawing, it puts the right amount of dashes into the list
        }
        
        this.underscorelist = underscorelist;
        this.playerletters = playerletters;
        this.createPlayerSprite(scene, xpos, ypos, underscorelist, playerindex, isme);

        this.wrongguesses = new Set();
        this.wronganswerlistsprite = scene.add.text(xpos + 80, ypos + 40, "" , { fontSize: "24px", color: "orange" });

        this.damage = 0;
        this.hangmanpicture = scene.add.image(xpos, ypos, "0").setScale(.2, .2); 

    }

    private createPlayerSprite(scene: MainScene, xpos: number, ypos: number, underscorelist: string[], playerindex: string, isme:boolean) {
        this.wordsprite = scene.add.text(xpos + 80, ypos, underscorelist.join(" "), { fontSize: "48px", color: "red" }); // wordsprite is defined as that text
        this.wordsprite.setInteractive();


        this.wordsprite.on('pointerdown', () => {
            scene.newselectedplayer(playerindex);
        });

        this.wordsprite.on('pointerover', () => { // these things here are just to make the color pink when you hover over it
            this.wordsprite.setColor('pink');
        });

        this.wordsprite.on('pointerout', () => { // this leaves it as it was before when you stop hovering
            if (this.selectedstate === false){
                this.wordsprite.setColor('red');
            }
            else{
                this.wordsprite.setColor('blue');
            }
            
        });
        if (isme){
        scene.add.image(xpos + this.wordsprite.width + 200, ypos, "goldstar").setScale(.70, .70); 
        }
    }

  
    changeselectstate(state: boolean){
        this.selectedstate = state

        if (this.selectedstate === true){
            this.wordsprite.setColor('blue');
        }
        else{
            this.wordsprite.setColor('red');
        }
    }

    rightguess(letter: string){
        for (let position in this.underscorelist) {
            if (letter == this.playerletters[position]){ // if correct
                this.underscorelist[position] = letter;
            }
        }
        this.wordsprite.setText(this.underscorelist.join(" ")); // updates the wordsprite (the dashes)
    }
    
    wrongguess(letter: string){
        this.wrongguesses.add(letter);
        this.wronganswerlistsprite.setText(Array.from(this.wrongguesses).join('')); // join for sets to display
    }


    takedamage(){
        this.damage += 1
        this.hangmanpicture.setTexture("" + this.damage); // SOMEHOW only adds to player 0??
    }

    
}