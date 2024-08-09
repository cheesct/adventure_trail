import BaseState from '../BaseState'
import Helper from '../../helper'

export default class DeathState extends BaseState
{
    private def: any

    update(dt: number)
    {
        var owner = this.owner
        switch(this.flag)
        {
            case 0:
                this.flag = 1
                owner.playAnim('hero_defeat', true)
                if (this.def)
                {
                    owner.setVelocityX(0)
                }
                else
                {
                    owner.setVelocityY(-100)
                    owner.setVelocityX(owner.flipX ? 125 : -125)
                }
                owner.death = true
                this.scene.sound.play('snd_dead')
                this.scene.cameras.main.flash(500, 255, 0, 0)
                break

            case 1:
                if (owner.isOnGround())
                {
                    owner.setVelocityX(owner.getVelocity().x * 0.9)
                }
                if (!owner.isPlayingAnim("hero_defeat"))
                {
                    this.flag = 2
                    this.scene.time.addEvent({ delay: 1000, callback: () => { this.scene.cameras.main.fadeOut()} })
                    this.scene.time.addEvent({ delay: 2000, callback: () => { this.scene.scene.restart() } })
                }
                break
        }
    }

    enter(def)
    {
        this.owner.hurt = -1
        this.def = def 
    }
}