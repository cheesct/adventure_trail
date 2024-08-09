
import * as Phaser from 'phaser'
import { HP } from './O_StatsGUI'
import Helper from './helper'
import InputKey from './InputKey'
import StateMachine from './states/StateMachine'

import DefaultState from './states/player/DefaultState'
import AirAttack1State from './states/player/AirAttack1State'
import AirAttack2State from './states/player/AirAttack2State'
import AirAttackDownState from './states/player/AirAttackDownState'
import AirJumpState from './states/player/AirJumpState'
import GroundAttack1State from './states/player/GroundAttack1State'
import GroundAttack2State from './states/player/GroundAttack2State'
import GroundAttack3State from './states/player/GroundAttack3State'
import GroundAttackRiseState from './states/player/GroundAttackRiseState'
import HurtState from './states/player/HurtState'
import DeathState from './states/player/DeathState'
import SlideState from './states/player/SlideState'

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    private HP: HP
    private jump: number
    private hurt: number
    private death: boolean
    private invincible: boolean
    private key: Array<string>

    private can_stand: boolean
    private speed_walk: number

    private slide_time: number
    private slide_speed: number
    private slide_cooldown: number

    private offset: number
    private knock_y: number
    private attack_area: Phaser.GameObjects.Zone
    private attack_group: Phaser.Physics.Arcade.StaticGroup
    private attack_timer: number
    private attack_cooldown: number
    private attacked_entities: Array<any>

    private Z: InputKey
    private X: InputKey
    private C: InputKey
    private Up: InputKey
    private Down: InputKey
    private Left: InputKey
    private Right: InputKey

    private heal_emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private blood_emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private run_dust_emitter: Phaser.GameObjects.Particles.ParticleEmitter
    private jump_dust_emitter: Phaser.GameObjects.Particles.ParticleEmitter

    private heal_emitter_zone: Phaser.Geom.Line

    private current_slope: any
    private current_jumpPad: any
    private is_jumpPad_jump: boolean
    private states: StateMachine


    constructor(scene, x, y) 
    {
        super(scene, x, y, 'hero')
        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.HP = new HP(scene, 5, 5)
        this.key = []
        this.depth = 2
        this.state = ""
        this.death = false
        this.invincible = false
        this.offset = scene.ObjectOffset

        this.jump = 0
        this.hurt = 0
        this.can_stand = true
        this.speed_walk = 75

        this.slide_speed = 150
        this.slide_cooldown = 0

        this.is_jumpPad_jump = false

        this.knock_y = 0
        this.attack_timer = 0
        this.attack_cooldown = 0
        this.attack_group = scene.PlayerAttacks

        this.Z = new InputKey(scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z))
        this.X = new InputKey(scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X))
        this.C = new InputKey(scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C))
        let cursor = scene.input.keyboard.createCursorKeys()
        this.Up = new InputKey(cursor.up)
        this.Down = new InputKey(cursor.down)
        this.Left = new InputKey(cursor.left)
        this.Right = new InputKey(cursor.right)

        this.setCollideWorldBounds(true)
        this.body.setSize(16, 24)
        this.body.offset.y = 10 + this.offset

        this.heal_emitter_zone = new Phaser.Geom.Line()
        this.heal_emitter = this.scene.add.particles(this.x, this.y, 'flares', {
            frame: 'white',
            emitting: false,
            lifespan: { min: 300, max: 500 } ,
            scale: { start: 0.2, end: 0, random: true },
            speed: { min: 50, max: 125 },
            tint: 0x00FF00,
            angle: -90,
            emitZone: { source: this.heal_emitter_zone }
        })
        this.blood_emitter = this.scene.add.particles(this.x, this.y, 'flares', {
            frame: 'white',
            blendMode: Phaser.BlendModes.ADD,
            emitting: false,
            lifespan: { min: 300, max: 500 } ,
            scale: { start: 0.2, end: 0, random: true },
            speed: { min: 50, max: 125 },
            tint: 0xFF0000
        })
        this.run_dust_emitter = this.scene.add.particles(this.x, this.y, 'fx_dust_run', {
            emitting: false,
            anim: 'fx_dust_run',
            quantity: 1,
            lifespan: 350,
        })
        this.jump_dust_emitter = this.scene.add.particles(this.x, this.y, 'fx_dust_jump', {
            emitting: false,
            anim: 'fx_dust_jump',
            quantity: 1,
            lifespan: 420,
        })

        this.states = new StateMachine({
            "": () => { return new DefaultState(this, scene) },
            "Attack": () => { return new GroundAttack1State(this, scene) },
            "Attack2": () => { return new GroundAttack2State(this, scene) },
            "Attack3": () => { return new GroundAttack3State(this, scene) },
            "AttackRise": () => { return new GroundAttackRiseState(this, scene) },
            "AttackAir": () => { return new AirAttack1State(this, scene) },
            "AttackAir2": () => { return new AirAttack2State(this, scene) },
            "AttackAirDown": () => { return new AirAttackDownState(this, scene) },
            "AirJump": () => { return new AirJumpState(this, scene) },
            "Hurt": () => { return new HurtState(this, scene) },
            "Death": () => { return new DeathState(this, scene) },
            "Slide": () => { return new SlideState(this, scene) },
        })
        this.states.change("")
    }

    update(delta)
    {
        if(!this.death)
        {
            this.heal_emitter_zone.setTo(this.body.center.x - 8, this.body.bottom, this.body.center.x + 8, this.body.bottom)
            if(this.y > this.scene.physics.world.bounds.height)
            {
                this.change_state("Death", false, true)
            }
        }
        if (this.hurt > 0)
        {
            this.hurt = Math.max(this.hurt - delta, 0)
            if (!this.hurt)
            {
                this.alpha = 1
            }
            else
            {
                this.alpha = Phaser.Math.FloatBetween(0.6, 1)
            }
        }
        if (this.attack_timer > 0)
        {
            this.attack_timer = Math.max(this.attack_timer - delta, 0)
            if (!this.hurt)
            {
                this.stop_attacking()
            }
        }
        if (this.attack_cooldown > 0)
        {
            this.attack_cooldown = Math.max(this.attack_cooldown - delta, 0)
        }
        if (this.slide_time > 0)
        {
            this.slide_time = Math.max(this.slide_time - delta, 0)
        }
        if (this.slide_cooldown > 0)
        {
            this.slide_cooldown = Math.max(this.slide_cooldown - delta, 0)
        }
        if (this.heal_emitter)
        {
            this.heal_emitter.x = this.x
            this.heal_emitter.y = this.y
        }
        let isOnGround = this.isOnGround()

        this.states.update(delta)
        
        if (this.current_slope != null && isOnGround)
        {
            let dX = 1
            if (this.current_slope.width > 0)
            {
                dX = Phaser.Math.Clamp(this.body.position.x + this.body.width - this.current_slope.x, 0, this.current_slope.width) / this.current_slope.width
            }
            else
            {
                dX = Phaser.Math.Clamp(this.body.position.x - this.current_slope.x, this.current_slope.width, 0) / this.current_slope.width
            }
            this.body.position.y = this.current_slope.y + this.current_slope.height * (1 - dX) - this.body.height
            this.body.velocity.y = Math.min(this.body.velocity.y, 0)
        }
        this.can_stand = true
        this.current_slope = null
        this.current_jumpPad = null
    }

//-------------------------------------------------------------------------------------------------------------------------------------

    isVulnerable()
    {
        if(this.death || this.hurt != 0 || this.invincible)
            return false
        return true
    }

    slide_lock(tile)
    {
        if (tile.index >= 0)
        {
            this.can_stand = false
        }
    }

    set_jumpPad(pad)
    {
        this.current_jumpPad = pad
    }

    set_slope(slope)
    {
        if (slope.width != 0)
        {
            this.current_slope = slope
        }
    }


    attack_hit(attack, object)
    {
        if (this.attacked_entities.includes(object))
            return
        
        let impact_x = Helper.middleIntersectRange(attack.body.x, attack.body.right, object.body.x, object.body.right)
        let impact_y = Helper.middleIntersectRange(attack.body.y, attack.body.bottom, object.body.y, object.body.bottom)

        this.scene.cameras.main.shake(40, 0.02)
        this.scene.sound.play('snd_sword_hit', { rate: Phaser.Math.FloatBetween(1, 1.25) })

        var effect = this.scene.add.sprite(impact_x, impact_y, 'fx_attack').setAngle(Math.random() * 360).setScale(0.5)
        effect.anims.play("fx_attack").on('animationcomplete', () => { effect.destroy() })
        
        var slash = this.scene.add.sprite(impact_x, impact_y, 'fx_slash', 5).setAngle(Math.random() * 360).setScale(2, 1)
        this.scene.tweens.add({ targets: slash, 
            scaleY: { value: 0, ease: 'Sine.easeOut', duration: 250}, 
            scaleX: { value: 0, ease: 'Linear', duration: 250},
            onComplete: () => { slash.destroy() } })
        if (typeof object.hurt === 'function')
        {
            if (this.knock_y != 0)
            {
                object.apply_force(new Phaser.Math.Vector2(0, this.knock_y))
            }
            object.hurt(1)
            if (!object.is_dead)
            {
                this.attacked_entities.push(object)
            }
        }
    }

    player_get_hit(enemy)
    {
        if (this.isVulnerable() && enemy.is_attacking())
        {
            this.player_get_hurt()
        }
    }

    player_get_shot(bullet)
    {
        if (this.isVulnerable())
        {
            this.player_get_hurt()
            bullet.impact()
        }
    }

    player_get_spiked(tile)
    {
        if (tile.index > 0 && this.isVulnerable())
        {
            this.player_get_hurt()
        }
    }

    player_get_hurt()
    {
        this.blood_emitter.explode(25, this.x, this.y)
        if(!this.HP.add(-1))
        {
            this.change_state("Hurt")
        }
        else
        {
            this.change_state("Death")
        }
    }

    player_heal_one()
    {
        this.HP.add(1)
        this.tint = 0x00ff00
        this.scene.tweens.add({ targets: this, tint: 0xffffff, ease: 'Power1', duration: 500, delay: 100 })
    }

    player_heal_full()
    {
        this.HP.add(5)
        this.heal_emitter.start(0, 1000)
    }

    change_state(state: string = "", force = false, def = null)
    {
        if (this.state != state || force)
        {
            this.states.change(state, def)
            this.stop_attacking()
            this.state = state
        }
    }

    start_attacking(x: number, y: number, w: number = 32, h: number = 32)
    {
        this.attacked_entities = []
        this.attack_timer = 0
        this.attack_area = this.scene.add.zone(this.x + x, this.y + y, w, h)
        this.attack_group.add(this.attack_area)
    }

    stop_attacking()
    {
        if (this.attack_area instanceof Phaser.GameObjects.GameObject)
        {
            this.attack_area.destroy()
            this.knock_y = 0
        }
    }

    emit_run_dust()
    {
        if (this.flipX)
        {
            const h = this.run_dust_emitter.explode(1, this.body.right, this.body.bottom - 4)
            h.scaleX = -1
        }
        else
        {
            this.run_dust_emitter.explode(1, this.body.left, this.body.bottom - 4)
        }
    }
    
    emit_jump_dust()
    {
        if (this.flipX)
        {
            const h = this.jump_dust_emitter.explode(1, this.body.center.x, this.body.bottom - 10)
            h.scaleX = -1
        }
        else
        {
            this.jump_dust_emitter.explode(1, this.body.center.x, this.body.bottom - 10)
        }
    }

    isOnGround()
    {
        return this.body.blocked.down || (this.current_slope && this.body.velocity.y >= 0)
    }

    isAttackRequest()
    {
        return this.X.pressed && !this.attack_cooldown
    }

    isSlideRequest()
    {
        return this.C.pressed && (!this.slide_cooldown || !this.isOnGround())
    }

    isJumpRequest()
    {
        return this.Z.pressed
    }

    getHorizonInput()
    {
        return Number(this.Right.down) - Number(this.Left.down)
    }

    getVerticalInput()
    {
        return Number(this.Down.down) - Number(this.Up.down)
    }

    playAnim(key, ignore: boolean = false)
    {
        this.anims.play(key, ignore)
    }
    
    isPlayingAnim(key: string)
    {
        return this.anims.getName() == key && this.anims.isPlaying
    }

    isAttackHit()
    {
        return this.attacked_entities.length > 0
    }

    setAttackSize(x?: number, y?: number)
    {
        const body = this.attack_area.body as Phaser.Physics.Arcade.StaticBody
        body.setSize(x ? x : body.width, y ? y : body.height, true)
    }

    setAttackPos(x?: number, y?: number)
    {
        const body = this.attack_area.body as Phaser.Physics.Arcade.StaticBody
        if (x)
        {
            body.x = x
        }
        if (y)
        {
            body.y = y
        }
        body.updateCenter()
    }

    createAfterImage(duration)
    {
        const fade = this.scene.add.image(this.x, this.y, 'hero', this.anims.currentFrame.frame.name).setAlpha(0.25).setTint(0xff0000)
        fade.flipX = this.flipX
        this.scene.tweens.add({ targets: fade, alpha: 0, ease: 'Power1', duration: duration, onComplete: () => { fade.destroy() }})
    }

    createAirJumpVfx()
    {
        var effect = this.scene.add.sprite(this.x, this.y, 'fx_ring')
        effect.on('animationcomplete', () => { effect.destroy() })
        effect.anims.play("fx_ring")
        effect.setAngle(this.body.velocity.x == 0 ? 0 : (this.flipX ? -30 : 30))
        effect.setScale(0.5)
        effect.setTint(0xff0000)
        this.scene.tweens.add({ targets: effect, alpha: 0, ease: 'Power1', duration: 250, })
    }
    
    getVelocity()
    {
        return this.body.velocity
    }

    setBody(w, h, offsetY = null)
    {
        this.body.setSize(w, h)
        if (offsetY)
        {
            this.body.offset.y = offsetY + this.offset
        }
    }
}