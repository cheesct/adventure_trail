import * as Phaser from 'phaser'

export class Slope extends Phaser.GameObjects.Rectangle
{
	public triangle: Phaser.Geom.Triangle

    constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number)
    {
        // super(scene, x, y, w, h, 0xff0000, 0.5)
        super(scene, x, y, w, h)
        this.triangle = new Phaser.Geom.Triangle(x, y + h, x + w, y, x + w, y + h);
        scene.add.existing(this)
    }

    render(graphics)
    {
        graphics.strokeTriangleShape(this.triangle);
    }
}