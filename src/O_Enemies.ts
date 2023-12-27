import * as Phaser from 'phaser'
import LevelBase from './LevelBase'
import { Vector } from 'matter'

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
        this.scene.physics.world.enable(corpse)
        this.scene.tweens.add({ targets: corpse, alpha: 0, duration: 1000, delay: 1000,
                onComplete: () => { corpse.destroy() }
            })
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
        dying.on('animationcomplete', () => { dying.destroy() })
        this.scene.sound.play('snd_insect_death')
        super.death()
    }
}

export class PiranhaPlant extends O_EnemyBase 
{
    private sensor_track: Phaser.GameObjects.Zone
    private sensor_attack: Phaser.GameObjects.Zone

    private target: any
    private should_attack: boolean
    private need_initialize: boolean
    private attack_countdown: number

    constructor(scene, x: number, y: number)
    {
        super(scene, x, y, 'piranha_plant')
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.HP = 5
        this.state = "";
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        this.body.setSize(24, 32)
        this.setCollideWorldBounds(true)
        this.anims.play('piranha_plant_idle')
        this.attack_countdown = 0
        this.need_initialize = true
        this.should_attack = false
        this.target = null
    }

    update(delta: number)
    {
        if (this.need_initialize)
        {
            const level_base = (this.scene as LevelBase)
            this.sensor_track = this.scene.add.zone(this.x, this.y, 320, 160);
            level_base.EnemySensors.add(this.sensor_track)
            this.scene.physics.add.overlap(this.sensor_track, level_base.Players, (zone, player) => { this.target = player })
            this.sensor_attack = this.scene.add.zone(this.x, this.y, 240, 32);
            level_base.EnemySensors.add(this.sensor_attack)
            this.scene.physics.add.overlap(this.sensor_attack, level_base.Players, (zone, player) => { this.should_attack = true })
            this.need_initialize = false
        }
        if (this.stagger_countdown >= 0)
        {
            this.stagger_countdown -= delta
        }
        if (this.attack_countdown >= 0)
        {
            this.attack_countdown -= delta
        }
        switch (this.state)
        {
            case "Attack":
                switch (this.flag)
                {
                    case 0:
                        this.flag = 1
                        this.anims.play('piranha_plant_warning')
                        break
                    
                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.flag = 2
                            const bullet = new O_PiranhaPlantProjectile(this.scene, this.x, this.y, "")
                            bullet.fired(this.flipX ? 0 : 180, 80)
                            this.anims.play('piranha_plant_attack')
                        }
                        break
                    
                    case 2:
                        if (!this.anims.isPlaying)
                        {
                            this.attack_countdown = 1
                            this.change_state("")
                        }
                        break
                }
                break
            
            case "Hurt":
                switch (this.flag)
                {
                    case 0:
                        this.flag = 1
                        this.anims.pause()
                        this.setTintFill()
                        this.stagger_countdown = 0.2
                        break
                    
                    case 1:
                        if (this.stagger_countdown <= 0)
                        {
                            this.clearTint()
                            this.anims.resume()
                            this.change_state("")
                            this.attack_countdown = 0.05
                        }
                        break
                }
                break

            default:
                if (!this.flag)
                {
                    this.flag = 1
                    this.anims.play('piranha_plant_idle')
                }
                if (this.should_attack && this.attack_countdown <= 0)
                {
                    this.change_state("Attack")
                    this.flipX = this.target.x > this.x
                }
                break
        }
        this.should_attack = false
    }

    death()
    {
        var dying = this.scene.add.sprite(this.x, this.y, "enemy_death")
        dying.anims.play('enemy_death')
        dying.on('animationcomplete', () => {dying.destroy()})
        this.scene.sound.play('snd_insect_death')
        this.sensor_track.destroy()
        this.sensor_attack.destroy()
        super.death()
    }
}

export class Grenadier extends O_EnemyBase 
{
    private sensor_track: Phaser.GameObjects.Zone
    private sensor_attack: Phaser.GameObjects.Zone

    private target: any
    private should_attack: boolean
    private need_initialize: boolean
    private attack_countdown: number

    constructor(scene, x: number, y: number)
    {
        super(scene, x, y, 'piranha_plant2')
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.HP = 5
        this.state = "";
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
        this.body.setSize(24, 32)
        this.setCollideWorldBounds(true)
        this.anims.play('piranha_plant2_idle')
        this.attack_countdown = 0
        this.need_initialize = true
        this.should_attack = false
        this.target = null
    }

    update(delta: number)
    {
        if (this.need_initialize)
        {
            const level_base = (this.scene as LevelBase)
            this.sensor_track = this.scene.add.zone(this.x, this.y, 320, 160);
            level_base.EnemySensors.add(this.sensor_track)
            this.scene.physics.add.overlap(this.sensor_track, level_base.Players, (zone, player) => { this.target = player })
            this.sensor_attack = this.scene.add.zone(this.x, this.y, 240, 32);
            level_base.EnemySensors.add(this.sensor_attack)
            this.scene.physics.add.overlap(this.sensor_attack, level_base.Players, (zone, player) => { this.should_attack = true })
            this.need_initialize = false
        }
        if (this.stagger_countdown >= 0)
        {
            this.stagger_countdown -= delta
        }
        if (this.attack_countdown >= 0)
        {
            this.attack_countdown -= delta
        }
        switch (this.state)
        {
            case "Attack":
                switch (this.flag)
                {
                    case 0:
                        this.flag = 1
                        this.anims.play('piranha_plant2_warning')
                        break
                    
                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.flag = 2
                            this.aim((this.flipX ? 200 : -200), 0)
                            this.anims.play('piranha_plant2_attack')
                        }
                        break
                    
                    case 2:
                        if (!this.anims.isPlaying)
                        {
                            this.attack_countdown = 1
                            this.change_state("")
                        }
                        break
                }
                break
            
            case "Hurt":
                switch (this.flag)
                {
                    case 0:
                        this.flag = 1
                        this.anims.pause()
                        this.setTintFill()
                        this.stagger_countdown = 0.2
                        break
                    
                    case 1:
                        if (this.stagger_countdown <= 0)
                        {
                            this.clearTint()
                            this.anims.resume()
                            this.change_state("")
                            this.attack_countdown = 0.05
                        }
                        break
                }
                break

            default:
                if (!this.flag)
                {
                    this.flag = 1
                    this.anims.play('piranha_plant2_idle')
                }
                if (this.should_attack && this.attack_countdown <= 0)
                {
                    this.change_state("Attack")
                    this.flipX = this.target.x > this.x
                }
                break
        }
        this.should_attack = false
    }

    death()
    {
        var dying = this.scene.add.sprite(this.x, this.y, "enemy_death")
        dying.anims.play('enemy_death')
        dying.on('animationcomplete', () => {dying.destroy()})
        this.scene.sound.play('snd_insect_death')
        this.sensor_track.destroy()
        this.sensor_attack.destroy()
        super.death()
    }

    aim(x: number, y: number)
    {
        const height = 160
        const time_to_peak = 1

        const velocity_x = (x / time_to_peak) / 2
        const velocity_y = ((2.0 * height) / time_to_peak) * -1.0
        const gravity = (2.0 * height) / (time_to_peak * time_to_peak)

        const bullet = new O_Grenade(this.scene, this.x, this.y, "")
        let vec2 = new Phaser.Math.Vector2(velocity_x, velocity_y)
        bullet.fired(vec2.angle(), vec2.length());
        (bullet.body as Phaser.Physics.Arcade.Body).setGravityY(gravity)
    }
}

class O_EnemyAttackProjectile extends Phaser.Physics.Arcade.Sprite
{
    private life: number
    private fading: boolean

    constructor(scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.world.enable(this)
        scene.EnemyBullets.add(this)
        this.life = 2
        this.fading = false
    }

    update(delta: number)
    {
        if (this.life <= 0 && !this.fading)
        {
            (this.scene as LevelBase).EnemyBullets.remove(this)
            this.fading = true
            this.scene.tweens.add({ targets: this, alpha: 0.0, ease: 'Linear', duration: 100,
                onComplete: () => { this.destroy }
            })
            return
        }
        if (!this.scene.physics.world.bounds.contains(this.x, this.y))
        {
            this.destroy()
            return
        }
        this.life -= delta
    }

    impact()
    {
        this.destroy()
    }

    fired(angle: number, speed: number)
    {
        this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity)
    }
}

class O_PiranhaPlantProjectile extends O_EnemyAttackProjectile
{
    constructor(scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, 'piranha_plant_projectile')
        this.anims.play('piranha_plant_projectile')
    }

    fired(angle: number, speed: number)
    {
        super.fired(angle, speed)
        this.angle = angle
    }

    impact()
    {
        var dying = this.scene.add.sprite(this.x, this.y, "piranha_plant_projectile_blast")
        dying.anims.play('piranha_plant_projectile_blast')
        dying.on('animationcomplete', () => { dying.destroy() })
        super.impact()
    }
}

class O_Grenade extends O_EnemyAttackProjectile
{
    private gravity: number

    constructor(scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, 'piranha_plant_projectile')
        this.gravity = 60
        this.anims.play('piranha_plant_projectile');
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true).setGravityY(this.gravity)
    }

    fired(angle: number, speed: number, gravity: number = 0)
    {
        super.fired(angle, speed);
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(gravity)
        this.angle = angle
    }

    impact()
    {
        var dying = this.scene.add.sprite(this.x, this.y, "piranha_plant_projectile_blast")
        dying.anims.play('piranha_plant_projectile_blast')
        dying.on('animationcomplete', () => { dying.destroy() })
        super.impact()
    }

    update(delta: number)
    {
        if (!this.scene.physics.world.bounds.contains(this.x, this.y))
        {
            this.destroy()
            return
        }
    }
}