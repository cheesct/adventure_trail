import BaseState from '../BaseState'
import Helper from '../../helper'

export default class DefaultState extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        var direction = this.owner.getHorizonInput()
        owner.flag = 0
        if (owner.isOnGround())
        {
            owner.jump = 1
            owner.is_jumpPad_jump = false
            if(owner.isAttackRequest())
            {
                if (owner.getVerticalInput() < 0)
                {
                    owner.change_state("AttackRise")
                }
                else
                {
                    owner.change_state("Attack")
                }
            }
            else if(owner.isSlideRequest())
            {
                owner.change_state("Slide")
            }
            else if (owner.isJumpRequest())
            {
                owner.setVelocityY(-200)
                owner.playAnim('hero_up', true)
                this.scene.sound.play('snd_jump', { rate: 2, volume: 0.6 })
                owner.emit_run_dust()
            }
            else if (direction != 0)
            {
                owner.setVelocityX(direction*owner.speed_walk)
                owner.playAnim('hero_walk', true)
                owner.flipX = direction < 0
            }
            else
            {
                owner.setVelocityX(0)
                let current_anim = owner.anims.getName()
                if (current_anim == 'hero_slide_recover')
                {
                    if (!owner.anims.isPlaying)
                    {
                        owner.playAnim('hero_idle', true)
                    }
                }
                else if (current_anim != 'hero_idle2')
                {
                    owner.playAnim('hero_idle', true)
                }
                    
            }
        }
        else
        {
            if(owner.isSlideRequest() && owner.jump)
            {
                owner.jump--
                owner.change_state("Boost")
            }
            else if(owner.isAttackRequest())
            {
                if (owner.getVerticalInput() > 0)
                {
                    owner.change_state("AttackAirDown")
                }
                else
                {
                    owner.change_state("AttackAir")
                }
            }
            else if (direction != 0)
            {
                owner.flipX = direction < 0
                owner.setVelocityX(direction*owner.speed_walk)
            }
            else
            {
                owner.setVelocityX(0)
            }
            if (owner.getVelocity().y > 0)
            {
                if (owner.current_jumpPad != null)
                {
                    owner.playAnim('hero_up', true)
                    owner.setVelocityY(owner.current_jumpPad.get_boost())
                    owner.current_jumpPad.play_animation()
                    this.scene.sound.play('snd_bounce', { volume: 0.2, rate: Helper.randomRange(0.8, 1) } )
                    owner.is_jumpPad_jump = true
                }
                else if (!owner.isPlayingAnim('hero_fall'))
                {
                    owner.playAnim('hero_fall', true)
                }
            }
            else if (owner.Z.isUp && !owner.is_jumpPad_jump)
                owner.setVelocityY(owner.getVelocity().y * 0.8)
        }
    }

    exit()
    {
    }
}