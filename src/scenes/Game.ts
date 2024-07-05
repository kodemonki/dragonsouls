import { Scene } from "phaser";
import constants from "../constants";
import { Player } from "../components/Player";
import { Enemy } from "../components/Enemy";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player1: Player;
  enemy1: Enemy;
  timer: number = 0;

  constructor() {
    super("Game");
  }
  makeBar(x: number, y: number, color: number) {
    let backgroundBar = this.add.graphics();
    backgroundBar.fillStyle(0xffffff, 1);
    backgroundBar.fillRect(0, 0, constants.barWidth, constants.barHeight);
    backgroundBar.x = x;
    backgroundBar.y = y;

    let bar = this.add.graphics();
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, constants.barWidth, constants.barHeight);
    bar.x = x;
    bar.y = y;
    return bar;
  }
  setValue(bar: Phaser.GameObjects.Graphics, percentage: number) {
    bar.scaleX = percentage / 100;
  }
  createPlayerBars() {
    this.player1.playerHealthBar = this.makeBar(0, 0, 0x009933);
    this.setValue(this.player1.playerHealthBar, 100);
    this.player1.playerPowerBar = this.makeBar(0, 50, 0xff9900);
    this.setValue(this.player1.playerPowerBar, 100);
  }
  onHit() {
    this.player1.onHit();
    this.enemy1.onTakeHit(this.player1.punchPower);
    this.setValue(this.enemy1.enemyHealthBar, this.enemy1.enemyHealth);
  }
  onPunch() {
    if (this.player1.playerPower >= this.player1.punchPower) {
      let distance = Phaser.Math.Distance.Between(
        this.player1.playerSprite.x,
        this.player1.playerSprite.y,
        this.enemy1.enemySprite.x,
        this.enemy1.enemySprite.y
      );
      if (distance < 100) {
        if (
          this.player1.playerSprite.x < this.enemy1.enemySprite.x &&
          this.player1.playerSprite.flipX === false
        ) {
          this.onHit();
        } else if (
          this.player1.playerSprite.x > this.enemy1.enemySprite.x &&
          this.player1.playerSprite.flipX === true
        ) {
          this.onHit();
        } else {
          this.sound.play("punch-miss");
        }
      } else {
        this.sound.play("punch-miss");
      }
      this.player1.onPunch();
      this.setValue(this.player1.playerPowerBar, this.player1.playerPower);
    }
  }
  onBlock() {
    this.player1.isBlocking = true;
    this.player1.playerSprite.anims.play(constants.manblockAnimation);
  }
  onUnblock() {
    this.player1.isBlocking = false;
    this.player1.playerSprite.anims.play(constants.manwalkAnimation);
    this.player1.playerSprite.anims.pause();
  }
  createInputs() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard?.createCursorKeys();
      this.input.keyboard.on("keydown", (event: { keyCode: number }) => {
        if (
          event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE &&
          this.player1.playerPower > 0 &&
          !this.player1.isBlocking
        ) {
          this.onPunch();
        }
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.B) {
          this.onBlock();
        }
      });
      this.input.keyboard.on("keyup", (event: { keyCode: number }) => {
        if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.B) {
          this.onUnblock();
        }
      });
    }
  }
  createWorld() {
    this.background = this.add.image(
      constants.screenWidth / 2,
      constants.screenHeight / 2,
      "gamebackground"
    );
    this.physics.world.setBounds(
      0,
      constants.screenHeight / 2,
      constants.screenWidth,
      constants.screenHeight / 2
    );
  }
  onTick() {
    if (this.player1.playerPower < 100 && !this.player1.isBlocking) {
      this.player1.playerPower += this.player1.regenPower;
      this.setValue(this.player1.playerPowerBar, this.player1.playerPower);
    }
  }
  createTimer() {
    this.time.addEvent({
      delay: 250,
      callback: this.onTick,
      callbackScope: this,
      loop: true,
    });
  }
  createEnemyBars() {
    this.enemy1.enemyHealthBar = this.makeBar(
      constants.screenWidth - constants.barWidth,
      0,
      0x009933
    );
    this.setValue(this.enemy1.enemyHealthBar, 100);
  }
  create() {
    this.player1 = new Player(this);
    this.enemy1 = new Enemy(this);
    this.createWorld();
    this.createPlayerBars();
    this.createEnemyBars();
    this.createInputs();
    this.createTimer();
  }
  sortDepths() {
    if (this.player1.playerSprite.y < this.enemy1.enemySprite.y) {
      this.player1.playerSprite.setDepth(1);
      this.enemy1.enemySprite.setDepth(2);
    } else {
      this.player1.playerSprite.setDepth(2);
      this.enemy1.enemySprite.setDepth(1);
    }
  }
  calculateVelocities() {
    this.player1.playerSprite.setVelocity(0);
    if (!this.player1.isAttacking && !this.player1.isBlocking) {
      if (this.cursors.left.isDown) {
        this.player1.playerSprite.setVelocityX(-300);
        !this.player1.playerSprite.anims.isPlaying &&
          this.player1.playerSprite.anims.play(constants.manwalkAnimation);
        this.player1.playerSprite.flipX = true;
      } else if (this.cursors.right.isDown) {
        this.player1.playerSprite.setVelocityX(300);
        !this.player1.playerSprite.anims.isPlaying &&
          this.player1.playerSprite.anims.play(constants.manwalkAnimation);
        this.player1.playerSprite.flipX = false;
      }
      if (this.cursors.up.isDown) {
        this.player1.playerSprite.setVelocityY(-300);
        !this.player1.playerSprite.anims.isPlaying &&
          this.player1.playerSprite.anims.play(constants.manwalkAnimation);
      } else if (this.cursors.down.isDown) {
        this.player1.playerSprite.setVelocityY(300);
        !this.player1.playerSprite.anims.isPlaying &&
          this.player1.playerSprite.anims.play(constants.manwalkAnimation);
      }
      if (
        this.cursors.down.isUp &&
        this.cursors.up.isUp &&
        this.cursors.left.isUp &&
        this.cursors.right.isUp &&
        !this.player1.isAttacking
      )
        this.player1.playerSprite.anims.pause();
    }
  }
  checkGameOver() {
    if (this.enemy1.enemyHealth === 0 || this.player1.playerHealth === 0) {
      this.scene.start("GameOver");
    }
  }
  update() {
    this.sortDepths();
    this.calculateVelocities();
    this.checkGameOver();
  }
}
