import { Scene } from "phaser";
import constants from "../constants";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerHealth: number = 100;
  playerHealthBar: Phaser.GameObjects.Graphics;
  playerPower: number = 100;
  punchPower: number = 30;
  regenPower: number = 10;
  playerPowerBar: Phaser.GameObjects.Graphics;
  enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemyHealth: number = 100;
  enemyHealthBar: Phaser.GameObjects.Graphics;
  isAttacking: boolean = false;
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
    this.playerHealthBar = this.makeBar(0, 0, 0x009933);
    this.setValue(this.playerHealthBar, 100);
    this.playerPowerBar = this.makeBar(0, 50, 0xff9900);
    this.setValue(this.playerPowerBar, 100);
  }
  createPlayer() {
    this.player = this.physics.add.sprite(50, 550, "manwalk", 0);
    this.player.scale = 2.5;
    this.player.setCollideWorldBounds(true);
    const config1 = {
      key: "manwalkAnimation",
      frames: "manwalk",
      frameRate: 10,
      repeat: -1,
    };
    this.anims.create(config1);
    const config2 = {
      key: "manpunchAnimation",
      frames: "manpunch",
      frameRate: 20,
      repeat: 0,
    };
    this.anims.create(config2);
    const config3 = {
      key: "manhitAnimation",
      frames: "manhit",
      frameRate: 1,
      repeat: 0,
    };
    this.anims.create(config3);
    this.player.on("animationcomplete", () => {
      this.isAttacking = false;
      this.player.setFrame(0);
    });
  }
  onHit(){
    this.sound.play("punch");
    this.enemy.anims.play("manhitAnimation");
  }
  onPunch() {
    if (this.playerPower >= this.punchPower) {
      let distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.enemy.x,
        this.enemy.y
      );

      if (distance < 100) {
        if (this.player.x < this.enemy.x && this.player.flipX === false) {
          this.onHit();
        }else  if (this.player.x > this.enemy.x && this.player.flipX === true) {
          this.onHit();
        }else{
          this.sound.play("punch-miss");
        }
      }else{
        this.sound.play("punch-miss");
      }
     
      this.isAttacking = true;
      this.player.anims.play("manpunchAnimation");
      this.playerPower -= this.punchPower;
      this.setValue(this.playerPowerBar, this.playerPower);
    }
  }
  createInputs() {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard?.createCursorKeys();
      this.input.keyboard.on("keydown", (event: { keyCode: number }) => {
        if (
          event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE &&
          this.playerPower > 0
        ) {
          this.onPunch();
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
  onSecond() {
    if (this.playerPower < 100) {
      this.playerPower += this.regenPower;
      this.setValue(this.playerPowerBar, this.playerPower);
    }
  }
  createTimer() {
    this.time.addEvent({
      delay: 500,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }
  createEnemy() {
    this.enemy = this.physics.add.sprite(850, 550, "manwalk", 0);
    this.enemy.scale = 2.5;
    this.enemy.flipX = true;

    this.enemy.on("animationcomplete", () => {
      this.enemy.anims.play("manwalkAnimation");
      this.enemy.setFrame(0);
      this.enemy.anims.pause();
    });
  }
  createEnemyBars() {
    this.enemyHealthBar = this.makeBar(
      constants.screenWidth - constants.barWidth,
      0,
      0x009933
    );
    this.setValue(this.enemyHealthBar, 100);
  }
  create() {
    this.createWorld();
    this.createPlayer();
    this.createPlayerBars();

    this.createEnemy();
    this.createEnemyBars();

    this.createInputs();
    this.createTimer();
  }
  sortDepths() {
    if (this.player.y < this.enemy.y) {
      this.player.setDepth(1);
      this.enemy.setDepth(2);
    } else {
      this.player.setDepth(2);
      this.enemy.setDepth(1);
    }
  }
  update() {
    this.sortDepths();
    this.player.setVelocity(0);
    if (!this.isAttacking) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-300);
        !this.player.anims.isPlaying &&
          this.player.anims.play("manwalkAnimation");
        this.player.flipX = true;
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(300);
        !this.player.anims.isPlaying &&
          this.player.anims.play("manwalkAnimation");
        this.player.flipX = false;
      }
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-300);
        !this.player.anims.isPlaying &&
          this.player.anims.play("manwalkAnimation");
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(300);
        !this.player.anims.isPlaying &&
          this.player.anims.play("manwalkAnimation");
      }
      if (
        this.cursors.down.isUp &&
        this.cursors.up.isUp &&
        this.cursors.left.isUp &&
        this.cursors.right.isUp &&
        !this.isAttacking
      )
        this.player.anims.pause();
    }
  }
}
