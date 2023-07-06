import * as Phaser from 'phaser'
import Helper from './helper'

export class ParallaxStaticTileSprite extends Phaser.GameObjects.TileSprite 
{
    private rate: number

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, texture: string, rate: number)
    {
        super(scene, x, y, width, height, texture);
        scene.add.existing(this);
        this.rate = rate;
        this.setOrigin(0).setScrollFactor(0);
    }

    update(camX: number)
    {
        this.tilePositionX = camX * this.rate;
    }
}

export class ParallaxScrollingImage extends Phaser.GameObjects.Image 
{
    private speed: number
    private offset: number
    private limitLeft: number
    private limitRight: number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, speed: number, limit_left: number = 0, limit_right: number = 0)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.speed = speed;
        this.offset = x;
        this.limitLeft = limit_left;
        this.limitRight = limit_right;
    }

    update(camX: number, delta: number)
    {
        this.offset += this.speed * delta
        this.x = Helper.wrap(this.offset, camX - this.limitLeft, camX + this.limitRight)
    }
}