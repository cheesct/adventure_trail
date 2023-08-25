import * as Phaser from 'phaser'

class O_EnemyBase extends Phaser.Physics.Arcade.Sprite
{
    protected HP: number
    protected flag: number
    protected speed: number
    protected selected_movement: Phaser.Math.Vector2
    protected knocked_y: number
    protected forced_movement_resist: number
    protected stagger_countdown: number
    protected is_dead: boolean

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
        this.stagger_countdown = 0
        this.is_dead = false
    }

    change_state(state, force = false)
    {
        if (this.state != state || force)
        {
            this.state = state
            this.flag = 0
        }
    }

    update(delta: number): void 
    {
    }

    death(): void 
    {
        this.is_dead = true
        this.destroy()
    }

    hurt(damage: number): void 
    {
        this.HP -= damage
        if (this.HP < 1)
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

    is_attacking(): boolean 
    {
        return this.stagger_countdown <= 0
    }
}

export class Slime extends O_EnemyBase
{
    private hurt_countdown: number
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
        this.hurt_countdown = 0
    }

    update(delta: number)
    {
        if (this.stagger_countdown >= 0)
        {
            this.stagger_countdown -= delta
        }
        if (this.hurt_countdown >= 0)
        {
            this.hurt_countdown -= delta
        }
        if (this.knocked_y != 0)
        {
            this.stagger_countdown = 1
            this.body.velocity.y = this.knocked_y
            this.knocked_y = 0
        }
        switch(this.state)
        {
            case "Hurt":
                this.setVelocityX(0)
                switch(this.flag)
                {
                    case 0:
                        this.scene.sound.play('snd_slime_splat', { rate: 0.8 })
                        this.anims.play({ key: 'slime_hurt', repeat: -1 })
                        this.hurt_countdown = 0.5
                        this.flag = 1
                        break

                    case 1:
                        if (this.hurt_countdown <= 0)
                        {
                            this.change_state("")
                        }
                }
                break

            default:
                this.anims.play('slime_move', true)
                if (this.body.blocked.left || this.body.blocked.right)
                {
                    this.flipX = !this.flipX
                }
                if (this.body.velocity.x === 0)
                {
                    this.body.velocity.x = this.flipX ? this.speed : -this.speed
                }
                break
        }
    }

    death()
    {
        const corpse = this.scene.add.sprite(this.x, this.y, 'slime').anims.play('slime_death')
        if (!this.body.blocked.down)
        {
            this.scene.physics.world.enable(corpse)
        }
        this.scene.sound.play('snd_slime_death')
        super.death()
    }

    hurt(damage: number): void 
    {
        this.body.velocity.y = Math.min(this.body.velocity.y, -75)
        this.HP -= damage
        if (this.HP < 1)
        {
            this.death()
        }
        else
        {
            this.change_state("Hurt", true)
        }
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

    update(delta: number)
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
        super.death()
    }
}