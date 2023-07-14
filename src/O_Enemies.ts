import * as Phaser from 'phaser'

class O_EnemyBase extends Phaser.Physics.Arcade.Sprite
{
    protected HP: number
    protected flag: number
    protected speed: number
    protected selected_movement: Phaser.Math.Vector2
    protected knocked_y: number
    protected forced_movement_resist: number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.setCollideWorldBounds(true)
        this.flag = 0
        this.forced_movement_resist = 0
        this.knocked_y = 0
        this.selected_movement = Phaser.Math.Vector2.ZERO
    }

    change_state(state)
    {
        if (this.state != state)
        {
            this.state = state
            this.flag = 0
        }
    }

    update(): void 
    {
    }

    death(): void 
    {
        this.destroy()
    }

    hurt(): void 
    {
        if (--this.HP < 1)
        {
            this.death()
        }
        else
        {
            this.change_state("Hurt")
        }
    }

    apply_force(force: Phaser.Math.Vector2): void 
    {
        if (force != null && this.forced_movement_resist < 1)
        {
            var affected_force = force.lerp(Phaser.Math.Vector2.ZERO, this.forced_movement_resist)
            this.knocked_y += affected_force.y
        }
    }
}

export class Slime extends O_EnemyBase
{
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'slime')
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.HP = 3
        this.state = ""
        this.flipX = Phaser.Math.Between(0, 1) == 0
        this.speed = 15
        this.body.setSize(16, 10)
        this.body.offset.y = 10
        this.setCollideWorldBounds(true)
    }

    update()
    {
        if (this.knocked_y != 0)
        {
            this.body.velocity.y = this.knocked_y
            this.knocked_y = 0
        }
        switch(this.state)
        {
            case "Hurt":
                this.setVelocityX(0)
                if(this.flag == 0)
                {
                    this.scene.sound.play('snd_slime_splat', { rate: 0.8 })
                    this.anims.play('slime_hurt')
                    this.flag = 1
                }
                if (!this.anims.isPlaying)
                {
                    this.state = ""
                    this.body.velocity.x = this.flipX ? this.speed : -this.speed
                }
                break

            default:
                this.anims.play('slime_move', true)
                if (this.body.velocity.x === 0)
                {
                    this.flipX = !this.flipX
                    this.body.velocity.x = this.flipX ? this.speed : -this.speed
                }
                break
        }
    }

    death()
    {
        this.scene.add.sprite(this.x, this.y, 'slime').anims.play('slime_death')
        this.scene.sound.play('snd_slime_death')
        this.destroy()
    }
}

export class Bee extends O_EnemyBase 
{
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'bee')
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.HP = 3
        this.state = ""
        this.speed = Phaser.Math.Between(0, 1) == 0 ? 25 : -25;
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        this.body.setSize(24, 24)
        this.setCollideWorldBounds(true)
        this.anims.play('bee')
        this.body.velocity.y = this.speed
    }

    update()
    {
        if (this.body.velocity.y === 0)
        {
            this.speed = -this.speed
            this.body.velocity.y = this.speed
        }
    }

    death()
    {
        var dying = this.scene.add.sprite(this.x, this.y, "enemy_death")
        dying.anims.play('enemy_death')
        dying.on('animationcomplete', () => {dying.destroy()})
        this.scene.sound.play('snd_insect_death')
        this.destroy()
    }
}