import { Boot } from "./scenes/Boot";
import { GameOverWin } from "./scenes/GameOverWin";
import { GameOverLose } from "./scenes/GameOverLose";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";
import constants from "./constants";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: constants.screenWidth,
  height: constants.screenHeight,
  parent: "game-container",
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Boot, Preloader, MainMenu, GameOverWin, GameOverLose],
};

export default new Game(config);
