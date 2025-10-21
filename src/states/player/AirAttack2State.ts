import BaseState from '../BaseState'

export default class AirAttack2State extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        owner.setVelocityY(Math.min(owner.getVelocity().y, 10))
        switch(this.flag)
        {
            case 0:
                owner.setVelocityX(0)
                owner.playAnim('hero_attack_air_2', true)
                owner.start_attacking(owner.flipX ? -20 : 20, 0)
                this.scene.sound.play('snd_sword_slash')
                this.flag = 1
                break

            case 1:
                if (!owner.isPlayingAnim("hero_attack_air_2"))
                {
                    owner.change_state()
                    owner.attack_cooldown = 1
                    owner.playAnim('hero_idle2', true)
                }
                break
        }
    }
}