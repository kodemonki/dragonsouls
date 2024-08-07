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
  endGame = false;

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
    this.player1.healthBar = this.makeBar(0, 0, 0x009933);
    this.setValue(this.player1.healthBar, 100);
    this.player1.powerBar = this.makeBar(0, 50, 0xff9900);
    this.setValue(this.player1.powerBar, 100);
  }
  onPlayerHitEnemy() {
    this.enemy1.onTakeHit(this.player1.punchPower);
    this.setValue(this.enemy1.healthBar, this.enemy1.health);
  }
  onPlayerPunch() {
    if (this.player1.power >= this.player1.punchPower) {
      let distance = Phaser.Math.Distance.Between(
        this.player1.sprite.x,
        this.player1.sprite.y,
        this.enemy1.sprite.x,
        this.enemy1.sprite.y
      );
      if (distance < 100) {
        if (
          this.player1.sprite.x < this.enemy1.sprite.x &&
          this.player1.sprite.flipX === false
        ) {
          this.onPlayerHitEnemy();
        } else if (
          this.player1.sprite.x > this.enemy1.sprite.x &&
          this.player1.sprite.flipX === true
        ) {
          this.onPlayerHitEnemy();
        } else {
          this.sound.play("punch-miss");
        }
      } else {
        this.sound.play("punch-miss");
      }
      this.player1.onPunch();
      this.player1.sprite.anims.play(constants.manpunchAnimation);

      this.setValue(this.player1.powerBar, this.player1.power);
    }
  }
  onPlayerBlock() {
    this.player1.onBlock();
    this.player1.sprite.anims.play(constants.manblockAnimation);
  }
  onPlayerUnblock() {
    this.player1.onUnblock();
    this.player1.sprite.anims.play(constants.manwalkAnimation);
    this.player1.sprite.anims.pause();
  }
  createInputs() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard?.createCursorKeys();
      this.input.keyboard.on("keydown", (event: { keyCode: number }) => {
        if (!this.endGame) {
          if (
            event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE &&
            this.player1.power > 0 &&
            !this.player1.isBlocking
          ) {
            this.onPlayerPunch();
          }
          if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.B) {
            this.onPlayerBlock();
          }
        }
      });
      this.input.keyboard.on("keyup", (event: { keyCode: number }) => {
        if (!this.endGame) {
          if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.B) {
            this.onPlayerUnblock();
          }
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
    if (!this.endGame) {
      if (this.player1.power < 100 && !this.player1.isBlocking) {
        this.player1.power += this.player1.regenPower;
        this.setValue(this.player1.powerBar, this.player1.power);
      }
      if (this.enemy1.power < 100 && !this.enemy1.isBlocking) {
        this.enemy1.power += this.enemy1.regenPower;
        this.setValue(this.enemy1.powerBar, this.enemy1.power);
      }
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
    this.enemy1.healthBar = this.makeBar(
      constants.screenWidth - constants.barWidth,
      0,
      0x009933
    );
    this.setValue(this.enemy1.healthBar, 100);
    this.enemy1.powerBar = this.makeBar(constants.screenWidth - constants.barWidth, 50, 0xff9900);
    this.setValue(this.enemy1.powerBar, 100);
  }
  create() {
    this.player1 = new Player(this);
    this.enemy1 = new Enemy(this, this.setValue);
    this.createWorld();
    this.createPlayerBars();
    this.createEnemyBars();
    this.createInputs();
    this.createTimer();
    //debug
    //this.sound.mute = true;
  }
  sortDepths() {
    if (this.player1.sprite.y < this.enemy1.sprite.y) {
      this.player1.sprite.setDepth(1);
      this.enemy1.sprite.setDepth(2);
    } else {
      this.player1.sprite.setDepth(2);
      this.enemy1.sprite.setDepth(1);
    }
  }
  calculateVelocities() {
    this.player1.sprite.setVelocity(0);
    if (!this.player1.isAttacking && !this.player1.isBlocking) {
      if (this.cursors.left.isDown) {
        this.player1.sprite.setVelocityX(-1 * constants.movemenVelocity);
        !this.player1.sprite.anims.isPlaying && !this.endGame &&
          this.player1.sprite.anims.play(constants.manwalkAnimation);
      } else if (this.cursors.right.isDown) {
        this.player1.sprite.setVelocityX(constants.movemenVelocity);
        !this.player1.sprite.anims.isPlaying && !this.endGame &&
          this.player1.sprite.anims.play(constants.manwalkAnimation);
      }
      if (this.cursors.up.isDown) {
        this.player1.sprite.setVelocityY(-1 * constants.movemenVelocity);
        !this.player1.sprite.anims.isPlaying && !this.endGame &&
          this.player1.sprite.anims.play(constants.manwalkAnimation);
      } else if (this.cursors.down.isDown) {
        this.player1.sprite.setVelocityY(constants.movemenVelocity);
        !this.player1.sprite.anims.isPlaying && !this.endGame &&
          this.player1.sprite.anims.play(constants.manwalkAnimation);
      }
      if (
        this.cursors.down.isUp &&
        this.cursors.up.isUp &&
        this.cursors.left.isUp &&
        this.cursors.right.isUp &&
        !this.player1.isAttacking
      )
        this.player1.sprite.anims.pause();
    }
  }
  gotoWinScene() {
    this.scene.remove();
    this.scene.start("GameOverWin");
  }
  gotoLoseScene() {
    this.scene.remove();
    this.scene.start("GameOverLose");
  }
  checkGameOver() {
    const dieTimer = 1000;
    if (this.enemy1.health === 0) {
      this.player1.sprite.setVelocity(0);
      this.enemy1.sprite.setVelocity(0);
      this.endGame = true;
      this.player1.endGame = true;
      this.enemy1.endGame = true;
      this.enemy1.sprite.anims.play(constants.mandieAnimation);
      this.player1.sprite.anims.play(constants.manwalkAnimation);
      this.player1.sprite.anims.pause();
      this.time.addEvent({
        delay: dieTimer,
        callback: this.gotoWinScene,
        callbackScope: this,
        loop: false,
      });
    } else if (this.player1.health === 0) {
      this.player1.sprite.setVelocity(0);
      this.enemy1.sprite.setVelocity(0);
      this.endGame = true;
      this.player1.endGame = true;
      this.enemy1.endGame = true;
      this.player1.sprite.anims.play(constants.mandieAnimation);
      this.enemy1.sprite.anims.play(constants.manwalkAnimation);
      this.enemy1.sprite.anims.pause();
      this.time.addEvent({
        delay: dieTimer,
        callback: this.gotoLoseScene,
        callbackScope: this,
        loop: false,
      });
    }
  }
  setDirection() {
    if (this.player1.sprite.x <= this.enemy1.sprite.x) {
      this.player1.sprite.flipX = false;
      this.enemy1.sprite.flipX = true;
    } else {
      this.player1.sprite.flipX = true;
      this.enemy1.sprite.flipX = false;
    }
  }
  update() {
    if (!this.endGame) {
      this.setDirection();
      this.sortDepths();
      this.calculateVelocities();
      this.enemy1.update(this.player1);
      this.checkGameOver();
    }
  }
}
