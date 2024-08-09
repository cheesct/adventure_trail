import BaseState from '../BaseState'

export default class GroundAttack3State extends BaseState
{
    update(dt: number)
    {
        const owner = this.owner
        const ownerVel = owner.getVelocity()
        owner.setVelocityY(Math.min(ownerVel.y, 0))
        switch(this.flag)
        {
            case 0:
                owner.knock_y = -200
                owner.start_attacking(owner.flipX ? -16 : 16, 0)
                owner.playAnim('hero_attack_rise', true)
                owner.setVelocityY(Math.min(ownerVel.y, -200))
                owner.setVelocityX(ownerVel.x * 0.5)
                this.flag = 1
                break

            case 1:
                if (owner.isPlayingAnim("hero_attack_rise"))
                {
                    owner.createAfterImage(200)
                }
                else
                {
                    owner.change_state()
                }
                break
        }
    }
}