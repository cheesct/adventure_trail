import BaseState from '../BaseState'

export default class AirJumpState extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        switch(this.flag)
        {
            case 0:
                this.scene.sound.play('snd_jump', { rate: 2.5, volume: 0.75 })
                owner.playAnim('hero_boost', true)
                owner.setVelocityY(-200)
                owner.createAirJumpVfx()
                this.flag = 1
                break

            case 1:
                if (!owner.isPlayingAnim("hero_boost") || owner.isOnGround())
                {
                    owner.change_state()
                }
                break
        }
    }

    exit()
    {
        this.owner.invincible = false
    }

    enter()
    {
        this.owner.invincible = true
    }
}