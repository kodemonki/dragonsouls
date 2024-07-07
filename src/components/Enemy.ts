import { Scene } from "phaser";
import constants from "../constants";
import { Player } from "./Player";

export class Enemy {
  health: number = 100;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  healthBar: Phaser.GameObjects.Graphics;

  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createEnemy();
  }

  createEnemy() {
    this.sprite = this.scene.physics.add.sprite(850, 550, "manwalk", 0);
    this.sprite.scale = 2.5;

    this.sprite.on("animationcomplete", () => {
      this.sprite.anims.play(constants.manwalkAnimation);
      this.sprite.setFrame(0);
      this.sprite.anims.pause();
    });
  }

  onTakeHit(power: number) {
    this.sprite.anims.play(constants.manhitAnimation);
    if ((this, this.health <= power)) {
      this.health = 0;
    } else {
      this.health -= power;
    }
  }

  update(target: Player) {
    this.sprite.setVelocity(0);
    const tolleranceX = 100;
    const tolleranceY = 10;

    if (target.sprite.x < (this.sprite.x - tolleranceX)) {
      //move left
      this.sprite.setVelocityX(-0.5*constants.movemenVelocity);
      this.sprite.flipX = true;
      !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
    } else if (target.sprite.x > (this.sprite.x + tolleranceX)) {
      //move right
      this.sprite.setVelocityX(0.5*constants.movemenVelocity);
      this.sprite.flipX = false;
      !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
    }else{
      this.sprite.anims.pause();
    }

    if (target.sprite.y < (this.sprite.y - tolleranceY)) {
      //move up
      this.sprite.setVelocityY(-0.5*constants.movemenVelocity);
      !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
    } else if (target.sprite.y > (this.sprite.y + tolleranceY)) {
      //move down
      this.sprite.setVelocityY(0.5*constants.movemenVelocity);
      !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
    }

    //if close punch



  }
}
