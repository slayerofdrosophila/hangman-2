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
            this.playerslist.push(player);
            ypos += 100;
            
        } 

        // this checks what a person is hovering over and then checks the validity of their guess
        this.input.keyboard.on('keyup', keyevent => { 
            console.log(this.chosenplayer);
            if (this.chosenplayer >= 0) {          // chosenplayer is -1 unless hovering 
                
                let player = this.playerslist[this.chosenplayer];
                player.guessletter(keyevent.key);
            }
        });
    }
}



// 
export class Player {

    playerletters: string[]; // list of characters of a word
    underscorelist: string[]; // list of underscores as they are being guessed
    wordsprite: Phaser.GameObjects.Text; // one player's word sprite
    wrongguesses: Set<string>; // SET of wrong guesses
    hangmanpicture: Phaser.GameObjects.Image; // hangman picture, 1-6.png


    wronganswerlistsprite: Phaser.GameObjects.Text; // wrong answer list sprite

    constructor(scene: MainScene, xpos: integer, ypos: integer, playerindex: integer, playerletters: string[]) {

        let underscorelist = [];
        for (let c in playerletters) {
            underscorelist.push("-");     // this doesnt have anything to do with the drawing
        }

        this.underscorelist = underscorelist;
        this.playerletters = playerletters;

        this.wordsprite = scene.add.text(xpos + 80, ypos, underscorelist.join(" "), { fontSize: "48px", color: "red" }); // wordsprite is created 
        this.wordsprite.setInteractive();

        this.wordsprite.on('pointerover', () => { 
            this.wordsprite.setColor('pink');
            scene.chosenplayer = playerindex; })
        this.wordsprite.on('pointerout', () => { 
            this.wordsprite.setColor('red'); 
            scene.chosenplayer = -1;});



        this.wrongguesses = new Set();
        this.wronganswerlistsprite = scene.add.text(xpos + 80, ypos + 40, "" , { fontSize: "24px", color: "orange" });

        this.hangmanpicture = scene.add.image(xpos, ypos, "0").setScale(.2, .2);
       
    }

    guessletter(letter: string){

        letter = letter.toUpperCase();

        if ( ! isLetter(letter)){ // ! means not
            return
        }

        let hitcounter = 0;
        for (let position in this.underscorelist) {
            if (letter == this.playerletters[position]){
                this.underscorelist[position] = letter;
                hitcounter += 1;
                return true;
            }
        }
        if (hitcounter == 0) {
            this.wrongguesses.add(letter);
            this.wronganswerlistsprite.setText(Array.from(this.wrongguesses).join('')); // join for sets to display

            return false;

        
            
        
        
            this.hangmanpicture.setTexture("" + this.wrongguesses.size); 
        }


        console.log(this.wrongguesses);

        this.wordsprite.setText(this.underscorelist.join(" "));
    

    }
}
