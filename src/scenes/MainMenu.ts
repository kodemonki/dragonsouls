import { Scene, GameObjects } from "phaser";
import { Game } from "./Game";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  title: GameObjects.Text;
  description: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.title = this.add
      .text(512, 234, "Dragon Souls", {
        fontFamily: "Arial Black",
        fontSize: 44,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.title = this.add
      .text(512, 384, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.description = this.add
      .text(512, 484, "Arrow keys to move - space to punch B Block", {
        fontFamily: "Arial Black",
        fontSize: 18,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown', ()=>{
        this.scene.add("Game", Game, true);
      })     
    }
  }
}
