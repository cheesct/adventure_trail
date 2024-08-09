import BaseState from '../BaseState'

export default class GroundAttack3State extends BaseState
{
    update(dt: number)
    {
        var owner = this.owner
        switch(this.flag)
        {
            case 0:
                owner.setVelocityX(owner.flipX ? -50 : 50)
                owner.playAnim('hero_attack_3_1', true)
                this.flag = 1
                break

            case 1:
                if (!owner.isPlayingAnim("hero_attack_3_1"))
                {
                    this.flag = 2
                    this.scene.sound.play('snd_sword_slash', { rate: 0.8 })
                    owner.playAnim('hero_attack_3_2', true)
                    owner.setVelocityX(0)
                    owner.start_attacking(owner.flipX ? -20 : 20, 0)
                    owner.attack_timer = 0.05
                }
                break

            case 2:
                if (!owner.isPlayingAnim("hero_attack_3_2"))
                {
                    owner.change_state()
                    owner.playAnim('hero_idle2', true)
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