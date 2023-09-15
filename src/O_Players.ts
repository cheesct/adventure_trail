
import * as Phaser from 'phaser'
import { HP } from './O_StatsGUI'

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    private HP: HP
    private flag: number
    private jump: number
    private hurt: number
    private death: boolean
    private key: Array<string>

    private can_stand: boolean
    private speed_walk: number

    private slide_time: number
    private slide_speed: number
    private slide_cooldown: number

    private combo: number
    private knock_y: number
    private attack_area: Phaser.GameObjects.GameObject
    private attack_cooldown: number
    private attacked_entities: Array<any>
    public player_attack: Phaser.Physics.Arcade.StaticGroup

    private Cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private Z: Phaser.Input.Keyboard.Key
    private X: Phaser.Input.Keyboard.Key
    private C: Phaser.Input.Keyboard.Key
    private Space: Phaser.Input.Keyboard.Key

    private current_jumpPad: any
    private is_jumpPad_jump: boolean

    constructor(scene, x, y) 
    {
        super(scene, x, y, 'hero')
        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.HP = new HP(scene, 5, 5)
        this.flag = 0
        this.depth = 2
        this.state = ""
        this.death = false
        this.key = []

        this.jump = 0
        this.hurt = 0
        this.can_stand = true
        this.speed_walk = 75

        this.slide_speed = 150
        this.slide_cooldown = 0

        this.is_jumpPad_jump = false

        this.knock_y = 0
        this.attack_cooldown = 0
        this.player_attack = this.scene.physics.add.staticGroup()

        this.Space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.Z = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        this.X = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        this.C = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        this.Cursors = scene.input.keyboard.createCursorKeys()
        this.setCollideWorldBounds(true)
        this.body.setSize(16, 24)
        this.body.offset.y = 8
    }

    attack_hit(attack, object)
    {
        if (this.attacked_entities.includes(object))
            return
        this.scene.cameras.main.shake(50, 0.02)
        this.scene.sound.play('snd_sword_hit', { rate: Phaser.Math.FloatBetween(1, 1.25) })

        var effect = this.scene.add.sprite(attack.x, attack.y, 'fx_attack').setAngle(Math.random() * 360).setScale(0.5)
        effect.anims.play("fx_attack").on('animationcomplete', () => { effect.destroy() })
        

        var slash = this.scene.add.sprite(attack.x, attack.y, 'fx_slash', 5).setAngle(Math.random() * 360).setScale(2, 1)
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
        if (!this.death && enemy.is_attacking())
        {
            this.player_get_hurt()
        }
    }

    player_get_spiked(tile)
    {
        if (tile.index > 0)
        {
            this.player_get_hurt()
        }
    }

    player_get_hurt()
    {
        if (this.isVulnerable())
        {
            if(!this.HP.add(-1))
            {
                this.change_state("Hurt")
            }
            else
            {
                this.change_state("Death")
            }
        }
    }

    update(delta)
    {
        if(!this.death)
        {
            if(this.y > this.scene.physics.world.bounds.height)
            {
                this.change_state("DeathSpike")
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
        if (this.slide_time > 0)
        {
            this.slide_time = Math.max(this.slide_time - delta, 0)
        }
        if (this.slide_cooldown > 0)
        {
            this.slide_cooldown = Math.max(this.slide_cooldown - delta, 0)
        }
        switch(this.state)
        {
            case "Attack":
                switch(this.flag)
                {
                    case -2:
                        this.setVelocityX(0)
                        this.anims.play('hero_unsealth_sword', true)
                        this.flag = -1
                        break

                    case -1:
                        if (!this.anims.isPlaying)
                            this.flag = 0
                        break

                    case 0:
                        this.combo = 0
                        this.setVelocityX(0)
                        this.anims.play('hero_attack_1_1', true)
                        this.flag = 1
                        break

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.scene.sound.play('snd_sword_slash')
                            this.anims.play('hero_attack_1_2', true)
                            this.flag = 2
                            this.attack_area = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false)
                        }
                        break

                    case 2:
                        if(Phaser.Input.Keyboard.JustDown(this.X))
                            this.combo = 1
                        if (!this.anims.isPlaying)
                        {
                            if(this.combo)
                                this.change_state("Attack2")
                            else
                            {
                                this.change_state("")
                                this.anims.play('hero_idle2', true)
                            }
                        }
                        break
                }
                break

            case "Attack2":
                switch(this.flag)
                {
                    case 0:
                        this.setVelocityX(0)
                        this.anims.play('hero_attack_2_1', true)
                        this.combo = 0
                        this.flag = 1
                        break

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.scene.sound.play('snd_sword_slash')
                            this.anims.play('hero_attack_2_2', true)
                            this.flag = 2
                            this.attack_area = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false)
                        }
                        break

                    case 2:
                        if(Phaser.Input.Keyboard.JustDown(this.X))
                            this.combo = 1
                        if (!this.anims.isPlaying)
                        {
                            if(this.combo)
                                this.change_state("Attack3")
                            else
                            {
                                this.change_state("")
                                this.anims.play('hero_idle2', true)
                            }
                        }
                        break
                    }
                break

            case "Attack3":
                switch(this.flag)
                {
                    case 0:
                        this.anims.play('hero_attack_3_1', true)
                        this.flag = 1
                        this.setVelocityX((this.flipX ? -1 : 1)*50)
                        break

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.scene.sound.play('snd_sword_slash', { rate: 0.8 })
                            this.anims.play('hero_attack_3_2', true)
                            this.setVelocityX(0)
                            this.attack_area = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false)
                            this.flag = 2
                        }
                        break

                    case 2:
                        if (!this.anims.isPlaying)
                        {
                            this.change_state("")
                            this.anims.play('hero_idle2', true)
                        }
                        break
                }
                break

            case "AttackAir":
                this.body.velocity.y = Math.min(this.body.velocity.y, 10)
                this.body.velocity.x = 0
                switch(this.flag)
                {
                    case 0:
                        this.combo = 0
                        this.attack_area = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false)
                        this.anims.play('hero_attack_air', true)
                        this.scene.sound.play('snd_sword_slash')
                        this.flag = 1
                        break

                    case 1:
                        if(Phaser.Input.Keyboard.JustDown(this.X))
                            this.combo = 1
                        if (!this.anims.isPlaying)
                        {
                            if (this.combo == 1 && this.attacked_entities.length > 0)
                            {
                                this.change_state("AttackAir2")
                            }
                            else
                            {
                                this.change_state("")
                            }
                            this.attack_cooldown = 1
                            this.scene.time.addEvent({ delay: 500, callback: () => { this.attack_cooldown = 0 } })
                            this.anims.play('hero_idle2', true)
                        }
                        break
                }
                break
            
            case "AttackAir2":
                this.body.velocity.y = Math.min(this.body.velocity.y, 10)
                this.body.velocity.x = 0
                switch(this.flag)
                {
                    case 0:
                        this.combo = 0
                        this.attack_area = this.player_attack.create(this.x + (this.flipX ? -20 : 20), this.y, "", "", false)
                        this.anims.play('hero_attack_air_2', true)
                        this.scene.sound.play('snd_sword_slash')
                        this.flag = 1
                        break

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.change_state("")
                            this.attack_cooldown = 1
                            this.scene.time.addEvent({ delay: 500, callback: () => { this.attack_cooldown = 0 } })
                            this.anims.play('hero_idle2', true)
                        }
                        break
                }
                break
            
                case "AttackAirDown":
                    switch(this.flag)
                    {
                        case 0:
                            this.anims.play('hero_attack_air_down_prep', true)
                            this.body.velocity.y = Math.min(this.body.velocity.y, -150)
                            this.flag += 1
                            break
    
                        case 1:
                            if (!this.anims.isPlaying)
                            {
                                this.body.velocity.y = Math.max(this.body.velocity.y, 300)
                                this.body.velocity.x = 0
                                this.anims.play({ key: 'hero_attack_air_down_loop', repeat: -1 }, true)
                                this.flag += 1
                            }
                            break
                        
                        case 2:
                            if (this.body.blocked.down)
                            {
                                this.attack_area = this.player_attack.create(this.x + (this.flipX ? -16 : 16), this.y, "", "", false);
                                (this.attack_area.body as Phaser.Physics.Arcade.StaticBody).setSize(64, 32, true)
                                this.anims.play('hero_attack_air_down_land', true)
                                this.scene.cameras.main.shake(50, 0.02)
                                this.flag += 1
                            }
                            else
                            {
                                var fade = this.scene.add.image(this.x, this.y, 'hero', this.anims.currentFrame.frame.name).setAlpha(0.25).setTint(0xff0000)
                                fade.flipX = this.flipX
                                this.scene.tweens.add({ targets: fade, alpha: 0, ease: 'Power1', duration: 400, onComplete: () => { fade.destroy() }})
                            }
                            break
                        
                        case 3:
                            if (!this.anims.isPlaying)
                            {
                                this.change_state()
                            }
                            break
                    }
                    break

                    case "AttackRise":
                        this.body.velocity.y = Math.min(this.body.velocity.y, 0)
                        switch(this.flag)
                        {
                            case 0:
                                this.knock_y = -200
                                this.attack_area = this.player_attack.create(this.x + (this.flipX ? -16 : 16), this.y, "", "", false)
                                this.anims.play('hero_attack_rise')
                                this.body.velocity.y = Math.min(this.body.velocity.y, -200)
                                this.body.velocity.x *= 0.5
                                this.flag += 1
                                break
        
                            case 1:
                                if (!this.anims.isPlaying)
                                {
                                    this.change_state()
                                }
                                else
                                {
                                    var fade = this.scene.add.image(this.x, this.y, 'hero', this.anims.currentFrame.frame.name).setAlpha(0.3).setTint(0xff0000)
                                    fade.flipX = this.flipX
                                    this.scene.tweens.add({ targets: fade, alpha: 0, ease: 'Power1', duration: 200, onComplete: () => { fade.destroy() }})
                                }
                                break
                        }
                        break

            case "Slide":
                switch(this.flag)
                {
                    case 0:
                        this.body.setSize(16, 16)
                        this.body.offset.y = 16
                        this.scene.sound.play('snd_slide', { rate: 1.5, volume: 0.8 })
                        this.anims.play({ key: 'hero_slide', repeat: -1 }, true)
                        this.setVelocityX(this.flipX ? -this.slide_speed : this.slide_speed)
                        this.flag = 1
                        this.slide_time = 0.3
                        break

                    case 1:
                        if (!this.slide_time && this.can_stand)
                        {
                            this.anims.play('hero_slide_recover')
                            this.change_state()
                        }
                        else
                        {
                            var fade = this.scene.add.image(this.x, this.y, 'hero', this.anims.currentFrame.frame.name).setAlpha(0.1).setTint(0xff0000)
                            fade.flipX = this.flipX
                            this.scene.tweens.add({ targets: fade, alpha: 0, ease: 'Power1', duration: 250, onComplete: () => { fade.destroy() }})
                        }
                        break
                }
                break

            case "Boost":
                switch(this.flag)
                {
                    case 0:
                        this.scene.sound.play('snd_jump', { rate: 2.5, volume: 0.75 })
                        this.anims.play('hero_boost', true)
                        this.setVelocityY(-200)
                        this.flag = 1
                        var effect = this.scene.add.sprite(this.x, this.y, 'fx_ring')
                        effect.on('animationcomplete', () => { effect.destroy() })
                        effect.anims.play("fx_ring")
                        effect.setAngle(this.body.velocity.x == 0 ? 0 : (this.flipX ? -30 : 30))
                        effect.setScale(0.5)
                        effect.setTint(0xff0000)
                        this.scene.tweens.add({ targets: effect, alpha: 0, ease: 'Power1', duration: 250, })
                        break

                    case 1:
                        if (!this.anims.isPlaying || this.body.blocked.down)
                            this.change_state("")
                        break
                }
                break

            case "Hurt":
                switch(this.flag)
                {
                    case 0:
                        this.flag = 1
                        this.hurt = -1
                        this.anims.play('hero_hurt', true)
                        this.scene.sound.play('snd_hurt', { volume: 0.6 })
                        this.setVelocityX((this.flipX ? 1 : -1)*90)
                        this.setVelocityY(-100)
                        this.setTint(0xff0000)
                        this.scene.time.addEvent({ delay: 200, callback: () => {
                            this.setTint(0xffffff) 
                            this.hurt = 3
                        }})
                        break

                    case 1:
                        if (this.body.blocked.down)
                            this.body.velocity.x *= 0.95
                        if (!this.anims.isPlaying)
                        {
                            this.change_state("")
                            this.anims.play('hero_idle2', true)
                        }
                        break
                }
                break

            case "Death":
                if (this.body.blocked.down)
                    this.body.velocity.x *= 0.9
                switch(this.flag)
                {
                    case 0:
                        this.scene.sound.play('snd_dead')
                        this.anims.play('hero_defeat', true)
                        this.setVelocityX((this.flipX ? 1 : -1)*125)
                        this.setVelocityY(-100)
                        this.flag = 1
                        this.death = true
                        this.scene.cameras.main.flash(500, 255, 0, 0)
                        break

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.flag = 2
                            this.scene.time.addEvent({  delay: 1000, callback: () => { this.scene.cameras.main.fade(1000, 0, 0, 0)} })
                            this.scene.time.addEvent({  delay: 2000, callback: () => { this.scene.scene.restart()} })
                        }
                        break
                }
                break

            case "DeathSpike":
                switch(this.flag)
                {
                    case 0:
                        this.HP.set(0)
                        this.scene.sound.play('snd_dead')
                        this.anims.play('hero_defeat', true)
                        this.setVelocityX(0)
                        this.flag = 1
                        this.death = true
                        this.scene.cameras.main.flash(500, 255, 0, 0)
                        break

                    case 1:
                        if (!this.anims.isPlaying)
                        {
                            this.flag = 2
                            this.scene.time.addEvent({  delay: 1000, callback: () => { this.scene.cameras.main.fade(1000, 0, 0, 0)} })
                            this.scene.time.addEvent({  delay: 2000, callback: () => { this.scene.scene.restart()} })
                        }
                        break
                }
                break

            default:
                var direction = Number(this.Cursors.right.isDown) - Number(this.Cursors.left.isDown)
                this.flag = 0
                if (this.body.blocked.down)
                {
                    this.jump = 9
                    this.is_jumpPad_jump = false
                    if(Phaser.Input.Keyboard.JustDown(this.X) && !this.attack_cooldown)
                    {
                        if (this.Cursors.up.isDown)
                        {
                            this.change_state("AttackRise")
                        }
                        else
                        {
                            this.change_state("Attack")
                        }
                    }
                    else if(Phaser.Input.Keyboard.JustDown(this.C) && !this.slide_cooldown)
                    {
                        this.change_state("Slide")
                    }
                    else if (Phaser.Input.Keyboard.JustDown(this.Z))
                    {
                        this.setVelocityY(-200)
                        this.anims.play('hero_up', true)
                        this.scene.sound.play('snd_jump', { rate: 2, volume: 0.6 })
                    }
                    else if (direction != 0)
                    {
                        this.setVelocityX(direction*this.speed_walk)
                        this.anims.play('hero_walk', true)
                        this.flipX = direction < 0
                    }
                    else
                    {
                        this.setVelocityX(0)
                        let current_anim = this.anims.getName()
                        if (current_anim == 'hero_slide_recover')
                        {
                            if (!this.anims.isPlaying)
                            {
                                this.anims.play('hero_idle', true)
                            }
                        }
                        else if (current_anim != 'hero_idle2')
                        {
                            this.anims.play('hero_idle', true)
                        }
                            
                    }
                }
                else
                {
                    if(Phaser.Input.Keyboard.JustDown(this.Z) && this.jump)
                    {
                        this.jump--
                        this.setVelocityY(-200)
                        this.anims.play('hero_up', true)
                    }
                    // if(Phaser.Input.Keyboard.JustDown(this.C) && this.jump)
                    // {
                    //     this.jump--
                    //     this.change_state("Boost")
                    // }
                    else if(Phaser.Input.Keyboard.JustDown(this.X))
                    {
                        if (this.Cursors.down.isDown)
                        {
                            this.change_state("AttackAirDown")
                        }
                        else if (!this.attack_cooldown)
                        {
                            this.change_state("AttackAir")
                        }
                    }
                    else if (direction != 0)
                    {
                        this.setVelocityX(direction*this.speed_walk)
                        this.flipX = direction < 0
                    }
                    else
                        this.setVelocityX(0)
                    if (this.body.velocity.y > 0)
                    {
                        if (this.current_jumpPad != null)
                        {
                            this.anims.play('hero_up', true)
                            this.setVelocityY(this.current_jumpPad.get_boost())
                            this.current_jumpPad.play_animation()
                            this.is_jumpPad_jump = true
                        }
                        else if (this.anims.getName() != 'hero_fall')
                        {
                            this.anims.play('hero_fall', true)
                        }
                    }
                    else if (this.body.velocity.y < 0 && this.Z.isUp && !this.is_jumpPad_jump)
                            this.body.velocity.y *= 0.8
                }
                break
        }
        this.can_stand = true
        this.current_jumpPad = null
    }

    isVulnerable()
    {
        if(this.death || this.hurt != 0 || ["AttackAirDown", "Attack3", "Boost", "Slide", "Hurt"].includes(this.state as string))
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

    change_state(state: string = "", force = false)
    {
        if (this.state != state || force)
        {
            if (this.state == "Slide")
            {
                this.slide_cooldown = 0.1
                this.body.setSize(16, 24)
                this.body.offset.y = 8
            }
            else if (this.state == "AttackAirDown")
            {
                
            }
            if (this.attack_area instanceof Phaser.GameObjects.GameObject)
            {
                this.attack_area.destroy()
                this.knock_y = 0
            }
            this.attacked_entities = []
            this.state = state
            this.flag = 0
        }
    }
}