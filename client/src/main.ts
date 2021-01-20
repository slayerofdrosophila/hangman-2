import * as Phaser from "phaser";
import { MainScene } from "./scenes/mainScene";
import { playerJoinScene } from "./scenes/playerJoinScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [playerJoinScene, MainScene],
  backgroundColor: "#EEEEEE"
};

let game = new Phaser.Game(config);
