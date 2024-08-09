import BaseState from '../BaseState'
import Helper from '../../helper'

export default class HurtState extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        switch(this.flag)
        {
            case 0:
                this.flag = 1
                owner.playAnim('hero_hurt', true)
                this.scene.sound.play('snd_slap', { volume: 0.7, rate: Helper.randomRange(0.8, 1.0) })
                owner.setVelocityX(owner.flipX ? 90 : -90)
                owner.setVelocityY(-100)
                owner.setTint(0xff0000)
                this.scene.time.addEvent({ delay: 200, callback: () => {
                    owner.setTint(0xffffff) 
                    owner.hurt = 3
                }})
                break

            case 1:
                if (owner.isOnGround())
                {
                    owner.setVelocityX(owner.getVelocity().x * 0.95)
                }
                if (!owner.isPlayingAnim("hero_hurt"))
                {
                    owner.change_state("")
                    owner.playAnim('hero_idle2', true)
                }
                break
        }
    }

    enter()
    {
        this.owner.hurt = -1
    }
}