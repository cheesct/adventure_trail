import BaseState from '../BaseState'
import Helper from '../../helper'

export default class SlideState extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        owner.setVelocityX(owner.flipX ? -owner.slide_speed : owner.slide_speed)
        switch(this.flag)
        {
            case 0:
                owner.slide_time = 0.3
                owner.setBody(16, 16, 18)
                owner.playAnim({ key: 'hero_slide', repeat: -1 }, true)
                this.scene.sound.play('snd_slide', { rate: Helper.randomRange(1.3, 1.6), volume: 0.8 })
                this.flag = 1
                break

            case 1:
                if (!owner.slide_time && owner.can_stand)
                {
                    owner.playAnim('hero_slide_recover')
                    owner.change_state()
                }
                else
                {
                    var fade = this.scene.add.image(owner.x, owner.y, 'hero', owner.anims.currentFrame.frame.name).setAlpha(0.1).setTint(0xff0000)
                    fade.flipX = owner.flipX
                    this.scene.tweens.add({ targets: fade, alpha: 0, ease: 'Power1', duration: 250, onComplete: () => { fade.destroy() }})
                }
                break
        }
    }

    exit()
    {
        this.owner.slide_cooldown = 0.1
        this.owner.setBody(16, 24, 10)
    }
}