import * as Phaser from 'phaser'

export class JumpPad extends Phaser.GameObjects.Sprite 
{
    private animation: string
    private boost: number

    constructor(scene, x, y, data) 
    {
        super(scene, x, y, "bounceshroom")
        scene.add.existing(this)
        scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true).setSize(40, 8)
        this.animation = "bounceshroom"
        this.y -= 16
        this.boost = data.Boost
    }

    jump_pad_boost()
    {
        this.anims.play(this.animation)
    }
}