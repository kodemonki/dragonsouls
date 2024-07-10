import { Scene } from "phaser";
import constants from "../constants";
import { Player } from "./Player";

export class Enemy {
  health: number = 100;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  healthBar: Phaser.GameObjects.Graphics;
  power: number = 100;
  punchPower: number = 30;
  regenPower: number = 7.5;
  powerBar: Phaser.GameObjects.Graphics;
  isAttacking: boolean = false;
  isBlocking: boolean = false;
  isStunned: boolean = false;
  endGame = false;
  scene: Scene;
  setValue: (bar: Phaser.GameObjects.Graphics, percentage: number) => void;

  constructor(
    scene: Scene,
    setValue: (bar: Phaser.GameObjects.Graphics, percentage: number) => void
  ) {
    this.scene = scene;
    this.setValue = setValue;
    this.createSprite();
  }
  createSprite() {
    this.sprite = this.scene.physics.add.sprite(850, 550, "manwalk", 0);
    this.sprite.scale = 2.5;

    this.sprite.on("animationcomplete", () => {
      this.isAttacking = false;
      if (!this.endGame) {
        this.sprite.anims.play(constants.manwalkAnimation);
        this.sprite.setFrame(0);
        this.sprite.anims.pause();
      }
    });
  }
  onTakeHit(power: number) {
    if (!this.endGame) {
      this.sprite.anims.play(constants.manhitAnimation);
      this.scene.sound.play("punch");
      if (this.health <= power) {
        this.health = 0;
      } else {
        this.health -= power;
      }
    }
  }
  onPunch(target: Player) {
    if (!this.endGame && this.power >= this.punchPower) {
      this.isAttacking = true;
      this.power -= this.punchPower;
      if (this.power < 0) {
        this.power = 0;
      }
      if (target.isBlocking) {
        this.scene.sound.play("punch-miss");
      } else {
        this.onHit(target);
      }
      this.sprite.anims.play(constants.manpunchAnimation);
    }
  }
  onHit(target: Player) {
    if (!this.endGame) {
      this.scene.sound.play("punch");
      target.sprite.anims.play(constants.manhitAnimation);
      if (target.health <= this.punchPower) {
        target.health = 0;
      } else {
        target.health -= this.punchPower;
      }
      this.setValue(target.healthBar, target.health);
    }
  }
  update(target: Player) {
    this.sprite.setVelocity(0);
    if (!this.isAttacking && !this.isBlocking && !this.endGame) {
      const tolleranceX = 100;
      const tolleranceY = 10;

      if (target.sprite.x < this.sprite.x - tolleranceX) {
        //move left
        this.sprite.setVelocityX(-0.5 * constants.movemenVelocity);
        !this.sprite.anims.isPlaying &&
          !this.endGame &&
          this.sprite.anims.play(constants.manwalkAnimation);
      } else if (target.sprite.x > this.sprite.x + tolleranceX) {
        //move right
        this.sprite.setVelocityX(0.5 * constants.movemenVelocity);
        !this.sprite.anims.isPlaying &&
          !this.endGame &&
          this.sprite.anims.play(constants.manwalkAnimation);
      } else {
        this.sprite.anims.pause();
      }

      if (target.sprite.y < this.sprite.y - tolleranceY) {
        //move up
        this.sprite.setVelocityY(-0.5 * constants.movemenVelocity);
        !this.sprite.anims.isPlaying &&
          !this.endGame &&
          this.sprite.anims.play(constants.manwalkAnimation);
      } else if (target.sprite.y > this.sprite.y + tolleranceY) {
        //move down
        this.sprite.setVelocityY(0.5 * constants.movemenVelocity);
        !this.sprite.anims.isPlaying &&
          !this.endGame &&
          this.sprite.anims.play(constants.manwalkAnimation);
      }

      let distance = Phaser.Math.Distance.Between(
        target.sprite.x,
        target.sprite.y,
        this.sprite.x,
        this.sprite.y
      );
      if (distance <= 100) {
        this.onPunch(target);
      }
    }
  }
}
