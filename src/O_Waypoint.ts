import * as Phaser from 'phaser'

export default class Waypoint extends Phaser.GameObjects.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number) 
    {
        super(scene, x, y, "")
        scene.add.existing(this)
        scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        this.setDataEnabled()
    }
}