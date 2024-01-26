import * as Phaser from 'phaser'

export class Waypoint extends Phaser.GameObjects.Sprite
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

export class Checkpoint extends Phaser.GameObjects.Sprite
{
    private spark_emitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene, x: number, y: number) 
    {
        super(scene, x, y, "")
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.anims.play('firepit');
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        this.setDataEnabled()

        this.spark_emitter = this.scene.add.particles(this.x, this.y, 'flares', {
            frame: 'yellow',
            blendMode: 'ADD',
            emitting: false,
            lifespan: { min: 250, max: 1000 },
            scale: { start: 0.2, end: 0, random: true },
            speed: { min: 25, max: 100 },
            quantity: 5,
            angle: -90,
            alpha: { start: 0.5, end: 0, random: true },
            emitZone: { source: new Phaser.Geom.Rectangle(-8, 12, 16, 0) }
        })
    }

    public activate()
    {
        this.spark_emitter.x = this.x
        this.spark_emitter.y = this.y
        this.spark_emitter.start(0, 1000)
        this.scene.physics.world.disable(this)
    }
}