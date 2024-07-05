import { Scene } from "phaser";
import constants from "../constants";

export class Enemy {
  enemyHealth: number = 100;
  enemySprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemyHealthBar: Phaser.GameObjects.Graphics;

  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createEnemy();
  }

  createEnemy() {
    this.enemySprite = this.scene.physics.add.sprite(850, 550, "manwalk", 0);
    this.enemySprite.scale = 2.5;
    this.enemySprite.flipX = true;

    this.enemySprite.on("animationcomplete", () => {
      this.enemySprite.anims.play(constants.manwalkAnimation);
      this.enemySprite.setFrame(0);
      this.enemySprite.anims.pause();
    });
  }

  onTakeHit(power: number) {
    this.enemySprite.anims.play(constants.manhitAnimation);
    if ((this, this.enemyHealth <= power)) {
      this.enemyHealth = 0;
    } else {
      this.enemyHealth -= power;
    }
  }
}
