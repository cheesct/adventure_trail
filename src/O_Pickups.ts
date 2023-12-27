import * as Phaser from 'phaser'

class O_PickupBase extends Phaser.GameObjects.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) 
    {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.world.enable(this);
        this.anims.play(texture);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
    }

    pickup(player)
    {
        var dying = this.scene.add.sprite(this.x, this.y, 'fx_item').on('animationcomplete', () => { dying.destroy() }).anims.play('fx_item')
        this.scene.sound.play('snd_pickup')
        this.destroy()
    }
}

export class Cherry extends O_PickupBase
{
    constructor(scene, x, y) 
    {
        super(scene, x, y, 'cherry')
    }

    pickup(player)
    {
        player.HP.add(1)
        this.scene.sound.play('snd_food')
        super.pickup(player)
    }
}

export class Key extends O_PickupBase
{
    private particles: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene, x, y)
    {
        super(scene, x, y, 'key')
        this.y -= 4
        scene.tweens.add({ targets: this, y: '+=4', ease: 'Sine.easeInOut', duration: 1000, yoyo: true, repeat: -1 })
        this.scale = 0.5
        this.particles = this.scene.add.particles(this.x, this.y, 'flares', {
            frame: 'white',
            blendMode: 'SCREEN',
            quantity: 4,
            lifespan: { min: 500, max: 2000 } ,
            frequency: 250,
            scale: { start: 0.05, end: 0 },
            speed: { min: 2, max: 10 },
            alpha: { start: 1, end: 0, ease: 'Quartic.easeOut' },
            angle: -90,
            follow: this,
            emitZone: { source: new Phaser.Geom.Rectangle(-10, -5, 20, 20), type: 'random', quantity: 0.2 }
        })
    }

    pickup(player)
    {
        player.key.push("key")
        this.particles.destroy()
        this.scene.sound.play('snd_key')
        super.pickup(player)
    }
}