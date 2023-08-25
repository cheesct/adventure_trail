import * as Phaser from 'phaser'
import Helper from './helper'

export class HP extends Phaser.GameObjects.Image
{
    private max: number
    private current: number

    constructor(scene, x, y) 
    {
        super(scene, x, y, 'hp_bar')
        scene.add.existing(this)
        this.max = 5
        this.current = 5
        this.depth = 2
        this.setFrame(this.current).setOrigin(0, 0).setScrollFactor(0).setDepth(2)
    }

    add(value)
    {
        this.current = Helper.clamp(this.current + value, 0, this.max)
        this.setFrame(this.current)
        if(this.current == 0)
            return true
        else
            return false
    }

    set(value)
    {
        this.current = Helper.clamp(value, 0, this.max)
        this.setFrame(this.current)
    }
}