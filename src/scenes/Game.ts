import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super("Game");
  }

  create() {

    if (this.input.keyboard)
      this.cursors = this.input.keyboard?.createCursorKeys();

    this.background = this.add.image(512, 384, "gamebackground");

    this.player = this.physics.add.sprite(50, 550, "manwalk", 0);
    this.player.scale = 2.5;

    this.player.setCollideWorldBounds(true);

    const config = {
      key: "manwalkAnimation",
      frames: "manwalk",
      frameRate: 10,
      repeat: -1,
    };
    this.anims.create(config);
  }
  update() {
    this.player.setVelocity(0);

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
      this.cursors.right.isUp
    )
      this.player.anims.pause();
  }
}
