import BaseState from '../BaseState'

export default class AirAttack2State extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        switch(this.flag)
        {
            case 0:
                owner.setVelocityY(Math.min(owner.getVelocity().y, -150))
                this.flag = 1
                break

            case 1:
                if (!owner.isPlayingAnim("hero_attack_air_down_prep"))
                {
                    owner.setVelocityX(0)
                    owner.setVelocityY(Math.max(owner.getVelocity().y, 300))
                    owner.playAnim({ key: 'hero_attack_air_down_loop', repeat: -1 }, true)
                    owner.start_attacking(owner.flipX ? -16 : 16, 0)
                    this.flag = 2
                }
                break

            case 2:
                if (owner.isOnGround())
                {
                    owner.setAttackSize(64, 32)
                    owner.playAnim('hero_attack_air_down_land', true)
                    this.scene.cameras.main.shake(40, 0.02)
                    this.flag = 3
                }
                else
                {
                    owner.setAttackPos(null, owner.y)
                    owner.createAfterImage(400)
                }
                break
            
            case 3:
                if (!owner.isPlayingAnim("hero_attack_air_down_land"))
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

    enter(def)
    {
        this.owner.invincible = true
    }
}