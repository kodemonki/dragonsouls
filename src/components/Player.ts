import { Scene } from "phaser";

export class Player {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  health: number = 100;
  healthBar: Phaser.GameObjects.Graphics;
  power: number = 100;
  punchPower: number = 30;
  regenPower: number = 7.5;
  powerBar: Phaser.GameObjects.Graphics;
  isAttacking: boolean = false;
  isBlocking: boolean = false;
  isStunned: boolean = false;
  endGame: boolean = false;
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createPlayer();
  }

  createPlayer() {
    this.sprite = this.scene.physics.add.sprite(50, 550, "manwalk", 0);
    this.sprite.scale = 2.5;
    this.sprite.setCollideWorldBounds(true);

    this.sprite.on("animationcomplete", () => {
      this.isAttacking = false;
      if (this.endGame === false) {
        this.sprite.setFrame(0);
      }
    });
  }

  onPunch() {
    this.isAttacking = true;
    this.power -= this.punchPower;
  }

  onBlock() {
    this.isBlocking = true;
  }

  onUnblock() {
    this.isBlocking = false;
  }
}
