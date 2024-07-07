import { Scene } from "phaser";
import constants from "../constants";
import { Player } from "./Player";

export class Enemy {
  health: number = 100;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  healthBar: Phaser.GameObjects.Graphics;
  punchPower: number = 30;
  isAttacking: boolean = false;
  isBlocking: boolean = false;
  scene: Scene;
  setValue: (bar: Phaser.GameObjects.Graphics, percentage: number) => void;

  constructor(scene: Scene, setValue: (bar: Phaser.GameObjects.Graphics, percentage: number) => void) {
    this.scene = scene;
    this.setValue = setValue;
    this.createEnemy();
  }
  createEnemy() {
    this.sprite = this.scene.physics.add.sprite(850, 550, "manwalk", 0);
    this.sprite.scale = 2.5;

    this.sprite.on("animationcomplete", () => {
      this.sprite.anims.play(constants.manwalkAnimation);
      this.sprite.setFrame(0);
      this.sprite.anims.pause();
      this.isAttacking = false;
    });
  }
  onTakeHit(power: number) {
    this.sprite.anims.play(constants.manhitAnimation);
    if (this.health <= power) {
      this.health = 0;
    } else {
      this.health -= power;
    }
  }
  onPunch(target: Player) {
    this.isAttacking = true;
    if (target.isBlocking) {
      this.scene.sound.play("punch-miss");
    } else {
      this.onHit(target);
    }
    this.sprite.anims.play(constants.manpunchAnimation);
  }
  onHit(target: Player) {
    this.scene.sound.play("punch");
    target.sprite.anims.play(constants.manhitAnimation);
    if (target.health <= this.punchPower) {
      target.health = 0;
    } else {
      target.health -= this.punchPower;
    }
    this.setValue(target.healthBar, target.health);
  }
  update(target: Player) {
    this.sprite.setVelocity(0);
    if (!this.isAttacking && !this.isBlocking) {
      const tolleranceX = 100;
      const tolleranceY = 10;

      if (target.sprite.x < this.sprite.x - tolleranceX) {
        //move left
        this.sprite.setVelocityX(-0.5 * constants.movemenVelocity);
        this.sprite.flipX = true;
        !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
      } else if (target.sprite.x > this.sprite.x + tolleranceX) {
        //move right
        this.sprite.setVelocityX(0.5 * constants.movemenVelocity);
        this.sprite.flipX = false;
        !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
      } else {
        this.sprite.anims.pause();
      }

      if (target.sprite.y < this.sprite.y - tolleranceY) {
        //move up
        this.sprite.setVelocityY(-0.5 * constants.movemenVelocity);
        !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
      } else if (target.sprite.y > this.sprite.y + tolleranceY) {
        //move down
        this.sprite.setVelocityY(0.5 * constants.movemenVelocity);
        !this.sprite.anims.isPlaying &&
          this.sprite.anims.play(constants.manwalkAnimation);
      }

      //if close punch

      let distance = Phaser.Math.Distance.Between(
        target.sprite.x,
        target.sprite.y,
        this.sprite.x,
        this.sprite.y
      );
      if (distance < 100) {
        this.onPunch(target);
      }
    }
  }
}
