import * as Phaser from 'phaser'

export class Door extends Phaser.GameObjects.Sprite 
{
    private open_animation: string
    private open_key: string

    constructor(scene, x, y, texture, open_animation = "door", open_key = "key") 
    {
        super(scene, x, y, "door")
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.anims.play('door_close');
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true)
        this.open_animation = open_animation
        this.open_key = open_key
    }

    open_door(player)
    {
        if(player.key.includes(this.open_key))
        {
            this.scene.sound.play('snd_door');
            this.anims.play(this.open_animation, true);
            let particles = this.scene.add.particles(this.x, this.y, 'flares', {
                frame: 'yellow',
                blendMode: 'SCREEN',
                quantity: 10,
                gravityY: 10,
                lifespan: { min: 500, max: 2500 },
                frequency: -1,
                scale: { start: 0.1, end: 0 },
                speed: { min: 0, max: 2 },
                alpha: { start: 1, end: 0, ease: 'Quartic.easeOut' },
                angle: 90,
                emitZone: { source: new Phaser.Geom.Rectangle(-4, -16, 8, 32), type: 'edge', quantity: 10 }
            })
            particles.explode();
            this.scene.time.addEvent({ delay: 2500, callback: () => { particles.destroy() }});
            this.scene.physics.world.disable(this)
        }
    }
}