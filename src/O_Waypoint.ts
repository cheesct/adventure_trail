import * as Phaser from 'phaser'
import Singleton from './singleton'

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

    change_scene()
    {
        const destination = this.data.list.To
        if (destination)
        {
			Singleton.sceneTransOut(this.scene, 0, destination)
            if (this.data.list.ArriveX && this.data.list.ArriveY)
            {
                Singleton.is_waypoint_travel = true
                Singleton.waypoint_landing_x = this.data.list.ArriveX
                Singleton.waypoint_landing_y = this.data.list.ArriveY
            }
            else
            {
                Singleton.is_waypoint_travel = false
            }
            this.destroy()
        }
    }
}