import { Scenes } from "phaser";
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

    constructor(scene: MainScene, xpos: integer, ypos: integer, playerindex: string, playerletters: string[]) { // when is this called?

        let underscorelist = [];
        for (let c in playerletters) {
            underscorelist.push("-");     // this doesnt have anything to do with the drawing, it puts the right amount of dashes into the list
        }

        this.underscorelist = underscorelist;
        this.playerletters = playerletters;
        this.createPlayerSprite(scene, xpos, ypos, underscorelist, playerindex);

        this.wrongguesses = new Set();
        this.wronganswerlistsprite = scene.add.text(xpos + 80, ypos + 40, "" , { fontSize: "24px", color: "orange" });

        this.damage = 0;
        this.hangmanpicture = scene.add.image(xpos, ypos, "0").setScale(.2, .2); 


    }

    private createPlayerSprite(scene: MainScene, xpos: number, ypos: number, underscorelist: string[], playerindex: string) {
        this.wordsprite = scene.add.text(xpos + 80, ypos, underscorelist.join(" "), { fontSize: "48px", color: "red" }); // wordsprite is defined as that text
        this.wordsprite.setInteractive();


        this.wordsprite.on('pointerdown', () => {
            scene.newselectedplayer(playerindex);
        });

        // welcome to the object treasure hunt
        // i wrote this bc this involved passing things between classes a lot and i wanted to remember this
        // 
        // when a player sprite is clicked by a human, it runs newselectedplayer()
        //
        // in mainscene.ts,
        // the function newselectedplayer is run with the number ID of the sending word sprite (player) as the parameter
        // if the chosenplayer veriable is -1 (the default), it means that this is the first click of the session and that there was no previously clicked player
        // it then sets the chosenplayer variable to the number ID sent to it
        // then runs changeselectstate(ID)
        //
        // back in player.ts,
        // changeselectstate() changes the "select state" variable in its own sprite to the value given to it (in this case, true)
        // changeselectstate() checks if the sprite it's in is selected by the human (true = human clicked on it)
        // if it is true
        // it then goes into the list of player sprites, goes to the given number ID, and changes its color value to blue

        // result: when a human clicks on a word, it gets its color changed, select state variable changed, and the scene has its current player selected variable changed.

        // if the player clicks a different sprite one afterward, this pathway does 2 more things:
        // newselectedplayer() will remember the previous selected player when it is called, 
        // so it will change the select state of the old one to false before its memory is overwritten
        // then changeselectstate(), called by newselectedplayer(), will change the sprite's color
        // finally, the scene will change which player it remembers as the current chosen one by the human. so a seamless transition. probably.


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

    guessletter(letter: string){

        letter = letter.toUpperCase();

        if (! isLetter(letter)){ // ! means not
            return true; // rejects all non-letter guesses
        }

        let hitcounter = 0;
        for (let position in this.underscorelist) {
            if (letter == this.playerletters[position]){ // if correct
                this.underscorelist[position] = letter;
                hitcounter += 1;
                // dont return here!!!
            }
        }

        if (hitcounter == 0) { // no matching letters
            this.wrongguesses.add(letter);
            this.wronganswerlistsprite.setText(Array.from(this.wrongguesses).join('')); // join for sets to display

            // this.hangmanpicture.setTexture("" + this.wrongguesses.size); // wrong and old
            return false;
        }

        this.wordsprite.setText(this.underscorelist.join(" ")); // updates the wordsprite (the dashes)

        return true;
    
    }
    // when guessletter returns false
    takedamage(){
        this.damage += 1
        this.hangmanpicture.setTexture("" + this.damage); // SOMEHOW only adds to player 0??
    }

    
}