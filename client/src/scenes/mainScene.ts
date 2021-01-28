import { Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import {isLetter, Player} from "../player";

export class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: "MainScene" });
        this.chosenplayer = null;
        this.playersidsandplayersmap = new Map();
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
    
    
    word: string[];
    socket: Socket;

    init(data) {
        this.word = data.word; // data.word is the word passed from scene.start in playerjoinscene
        console.log(data);
    }




    playersidsandplayersmap: Map<string, Player>;
    
    chosenplayer: string; // int of which player is being moused over
    myplayer: Player = null;

    create() { // this is called when the scene is to be displayed
        // creates the text objects on the scene
        var ypos = 150;

        
        // web magic
         let socket = io(window.location.host);

        let self = this;

        socket.on('connect', function () {
            console.log('Connected!');

            socket.on ("newplayerword",(word, newplayerid) => {
                console.log("newplayerword:"+newplayerid+word);
                if (newplayerid in self.playersidsandplayersmap) {
                    return;
                }
                let player = new Player(self, 50, ypos, newplayerid, word);    // this calls constructor() in Player class in player.ts
                self.playersidsandplayersmap[newplayerid] = player; // puts each sprite word into a list
                if (self.myplayer === null) {
                    self.myplayer = player;
                }
                ypos += 100;
            });
    
            socket.emit("playerword", self.word);
            
        });

        // this checks what a person is hovering over and then checks the validity of their guess
        this.input.keyboard.on('keyup', keyevent => { 
            if (this.chosenplayer !== null) {          // chosenplayer is -1 unless hovering 
                
                let player = this.playersidsandplayersmap[this.chosenplayer];
                if (! player.guessletter(keyevent.key)){
                    this.myplayer.takedamage(); // takedamage() somehow knows its player 0 and does the right thing, somehow
                }

            }
        });
    }
    newselectedplayer(index: string){
        console.log(this.chosenplayer);
        if (this.chosenplayer !== null){
        this.playersidsandplayersmap[this.chosenplayer].changeselectstate(false)
        }
        this.chosenplayer = index; 
        this.playersidsandplayersmap[this.chosenplayer].changeselectstate(true)


    }
}

