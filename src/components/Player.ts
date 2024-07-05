import { Scene } from "phaser";
import constants from "../constants";

export class Player {
  playerSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerHealth: number = 100;
  playerHealthBar: Phaser.GameObjects.Graphics;
  playerPower: number = 100;
  punchPower: number = 30;
  regenPower: number = 7.5;
  playerPowerBar: Phaser.GameObjects.Graphics;
  isAttacking: boolean = false;
  isBlocking: boolean = false;
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createPlayer();
  }

  createPlayer() {
    this.playerSprite = this.scene.physics.add.sprite(50, 550, "manwalk", 0);
    this.playerSprite.scale = 2.5;
    this.playerSprite.setCollideWorldBounds(true);
    const config1 = {
      key: constants.manwalkAnimation,
      frames: "manwalk",
      frameRate: 10,
      repeat: -1,
    };
    this.scene.anims.create(config1);
    const config2 = {
      key: constants.manpunchAnimation,
      frames: "manpunch",
      frameRate: 20,
      repeat: 0,
    };
    this.scene.anims.create(config2);
    const config3 = {
      key: constants.manhitAnimation,
      frames: "manhit",
      frameRate: 1,
      repeat: 0,
    };
    this.scene.anims.create(config3);
    const config4 = {
      key: constants.manblockAnimation,
      frames: "manblock",
      frameRate: 1,
      repeat: 0,
    };
    this.scene.anims.create(config4);
    this.playerSprite.on("animationcomplete", () => {
      this.isAttacking = false;
      this.playerSprite.setFrame(0);
    });
  }
  onHit() {
    this.scene.sound.play("punch");
  }
  onPunch() {
    this.isAttacking = true;
    this.playerSprite.anims.play(constants.manpunchAnimation);
    this.playerPower -= this.punchPower;
  }
}
