import { Scene } from "phaser";

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
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
    this.load.image("logo", "logo.png");
    this.load.image("gamebackground", "gamebg.png");
    this.load.audio("punch", ["audio/punch.mp3"]);
    this.load.audio("punch-miss", ["audio/punch-miss.mp3"]);
    this.load.spritesheet({
      key: "manwalk",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: 80,
        frameHeight: 93,
        startFrame: 0,
        endFrame: 5,
      },
    });
    this.load.spritesheet({
      key: "manpunch",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: 80,
        frameHeight: 93,
        startFrame: 5,
        endFrame: 9,
      },
    });
    this.load.spritesheet({
      key: "manhit",
      url: "sprites/mansheet.png",
      frameConfig: {
        frameWidth: 80,
        frameHeight: 93,
        startFrame: 9,
        endFrame: 9,
      },
    });
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
