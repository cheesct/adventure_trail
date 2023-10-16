import * as Phaser from 'phaser'

export class JumpPad extends Phaser.GameObjects.Sprite 
{
    private animation: string
    constructor(scene, x, y) 
    {
        super(scene, x, y, "bounceshroom")
        scene.add.existing(this)
        scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true).setSize(40, 8)
        this.animation = "bounceshroom"
        this.play_animation()
    }

    play_animation()
    {
        this.anims.play(this.animation)
    }

    get_boost()
    {
        return this.data?.list?.Boost ?? 0
    }
}