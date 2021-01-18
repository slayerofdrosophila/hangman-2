import * as Phaser from "phaser";
import { MainScene } from "./scenes/mainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: MainScene,
  backgroundColor: "#EEEEEE"
};

let game = new Phaser.Game(config);
