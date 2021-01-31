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

        this.load.image("bluestar", "assets/bluestar.png");
        this.load.image("goldstar", "assets/goldstar.png");
    }
    
    
    word: string[];
    socket: Socket;

    init(data) {
        this.word = data.word; // data.word is the word passed from scene.start in playerjoinscene
        console.log(data);
    }




    playersidsandplayersmap: Map<string, Player>;
    
    chosenplayer: string; // int of which player is being moused over


    create() { // this is called when the scene is to be displayed
        // creates the text objects on the scene
        var ypos = 150;

        
        // web magic
        let socket = io(window.location.host);

        let self = this;

        socket.on('connect', function () {
            console.log('Connected!');

            socket.on ("newplayerword",(word, newplayerid, playernumber) => {
                // console.log("newplayerword:"+newplayerid+word);
                if (newplayerid in self.playersidsandplayersmap) {
                    console.log("TRUE THO (it happened. turn off your computer and run)")
                    return;
                }

                let isme = false
                if (newplayerid === socket.id){
                    console.log("its a me")
                    isme = true;
                }
                console.log(isme)
                let player = new Player(self, 50, ypos, newplayerid, word, isme);    // this calls constructor() in Player class in player.ts
                self.playersidsandplayersmap[newplayerid] = player; // puts each sprite word into a map

                ypos += 100;
            });

            socket.on("wrong", function(sourceid: string, targetid:string, letter:string){
                self.playersidsandplayersmap[sourceid].takedamage();
                self.playersidsandplayersmap[targetid].wrongguess(letter); // the thingy refers to the Player sprite thingy
                self.turnend()
            })

            socket.on("right", function(sourceid: string, targetid:string, letter:string){
                self.playersidsandplayersmap[targetid].rightguess(letter)
                console.log("righte guess 2!!! " + sourceid, targetid, letter)
                self.turnend()
            })

            socket.on("myturn",function(){
                self.turnstart()
            })
    
            socket.emit("playerword", self.word);
            
        });

        // this checks what a person is hovering over and then checks the validity of their guess
        this.input.keyboard.on('keyup', keyevent => { 
            
            if (this.chosenplayer !== null) {          // chosenplayer is -1 unless hovering 
                socket.emit("guess", keyevent.key, this.chosenplayer);

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
    turnstart(){
        console.log("myturn!!!")
        this.cameras.main.setBackgroundColor('#fffdeb');
    }
    turnend(){
        this.cameras.main.setBackgroundColor('#eeeeee')
    }
}


