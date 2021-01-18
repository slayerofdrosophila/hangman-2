import { Scene } from "phaser";

function isLetter(c: string){
    return c.length === 1 && c.match(/[a-z]/i)
}

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
        this.chosenplayer = -1;
        this.playerslist = []; 
    }

    preload() {
        this.load.image('0', 'assets/0.png');
        this.load.image('1', 'assets/1.png');
        this.load.image('2', 'assets/2.png');
        this.load.image('3', 'assets/3.png');
        this.load.image('4', 'assets/4.png');
        this.load.image('5', 'assets/5.png');
        this.load.image('6', 'assets/6.png');
    }

    playerslist: Player[]; // list of the sprite words (as sprites)
    chosenplayer: integer; // int of which player is being moused over

    create() { // this is called when the scene is to be displayed
        // creates the text objects on the scene
        var ypos = 150;
        let playerwords = [Array.from('HANGMAN'),Array.from('TUXEDO'), Array.from("PILLOW")];

        for (let playerindex=0; playerindex < playerwords.length; playerindex += 1) { // playerindex = 0, while condition, increment by 1 at end of loop
            let player = new Player(this, 50, ypos, playerindex, playerwords[playerindex]);    
            this.playerslist.push(player); // puts each sprite word into a list
            ypos += 100;

            
        } 

        // this checks what a person is hovering over and then checks the validity of their guess
        this.input.keyboard.on('keyup', keyevent => { 
            if (this.chosenplayer >= 0) {          // chosenplayer is -1 unless hovering 
                
                let player = this.playerslist[this.chosenplayer];
                if (! player.guessletter(keyevent.key)){
                    this.playerslist[0].takedamage(); // takedamage() somehow knows its player 0 and does the right thing, somehow
                }

            }
        });
    }
}



// this class handles all the guessing and checking stuff
export class Player {

    // this class is a "list" with these elements, functions will take the "this" parameter which is all this stuff

    playerletters: string[]; // list of characters of a word
    underscorelist: string[]; // list of underscores as they are being guessed
    wrongguesses: Set<string>; // SET of wrong guesses
    damage: integer; // 0 = best, 6 = daed

    wordsprite: Phaser.GameObjects.Text; // one player's word sprite
    wronganswerlistsprite: Phaser.GameObjects.Text; // wrong answer list sprite
    hangmanpicture: Phaser.GameObjects.Image; // hangman picture, 0-5.png

    constructor(scene: MainScene, xpos: integer, ypos: integer, playerindex: integer, playerletters: string[]) { // when is this called?

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
        this.hangmanpicture = scene.add.image(xpos, ypos, "0").setScale(.2, .2); // hangman picture is created... but can we do better? dun dund


    }

    private createPlayerSprite(scene: MainScene, xpos: number, ypos: number, underscorelist: any[], playerindex: number) {
        this.wordsprite = scene.add.text(xpos + 80, ypos, underscorelist.join(" "), { fontSize: "48px", color: "red" }); // wordsprite is defined as that text
        this.wordsprite.setInteractive();

        this.wordsprite.on('pointerover', () => { // colo0r on mouseover and mouseunover
            this.wordsprite.setColor('pink');
            scene.chosenplayer = playerindex; // tracks what one is being moused over
        });
        this.wordsprite.on('pointerout', () => {
            this.wordsprite.setColor('red');
            scene.chosenplayer = -1;
        });
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
        this.hangmanpicture.setTexture("" + this.damage);
    }
}
