import { Scene } from "phaser";
import constants from "../constants";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");
    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    const frameHeight:number= 103;
    const frameWidth:number= 80;
    
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
    this.load.image("gamebackground", "gamebg.png");
    this.load.audio("punch", ["audio/punch.mp3"]);
    this.load.audio("punch-miss", ["audio/punch-miss.mp3"]);
    this.load.spritesheet({
      key: "manwalk",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: frameWidth,
        frameHeight: frameHeight,
        startFrame: 0,
        endFrame: 5,
      },
    });
    this.load.spritesheet({
      key: "manpunch",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: frameWidth,
        frameHeight: frameHeight,
        startFrame: 5,
        endFrame: 9,
      },
    });
    this.load.spritesheet({
      key: "manhit",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: frameWidth,
        frameHeight: frameHeight,
        startFrame: 9,
        endFrame: 9,
      },
    });
    this.load.spritesheet({
      key: "manblock",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: frameWidth,
        frameHeight: frameHeight,
        startFrame: 6,
        endFrame: 6,
      },
    });
    this.load.spritesheet({
      key: "mandie",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: frameWidth,
        frameHeight: frameHeight,
        startFrame: 10,
        endFrame: 11,
      },
    });    
  }

  create() {
    const manwalkAnimation = {
      key: constants.manwalkAnimation,
      frames: "manwalk",
      frameRate: 10,
      repeat: -1,
    };
    this.anims.create(manwalkAnimation);
    const manpunchAnimation = {
      key: constants.manpunchAnimation,
      frames: "manpunch",
      frameRate: 20,
      repeat: 0,
    };
    this.anims.create(manpunchAnimation);
    const manhitAnimation = {
      key: constants.manhitAnimation,
      frames: "manhit",
      frameRate: 1,
      repeat: 0,
    };
    this.anims.create(manhitAnimation);
    const manblockAnimation = {
      key: constants.manblockAnimation,
      frames: "manblock",
      frameRate: 1,
      repeat: 0,
    };
    this.anims.create(manblockAnimation);
    const mandieAnimation = {
      key: constants.mandieAnimation,
      frames: "mandie",
      frameRate: 10,
      repeat: 0,
    };
    this.anims.create(mandieAnimation);

    this.scene.start("MainMenu");
  }
}
