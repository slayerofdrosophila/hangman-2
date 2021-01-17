import { Scene } from "phaser";

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    preload() {
        this.load.image('hangman0', './assets/a0.png');
        this.load.image('hangman1', './assets/a1.png');
    }

    create() { // this is called when the scene is to be displayed
        this.add.sprite(50, 50, "hangman0");
        this.add.sprite(150, 50, "hangman1");
    }
}

