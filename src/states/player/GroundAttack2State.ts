import BaseState from '../BaseState'

export default class GroundAttack2State extends BaseState
{
    private combo: number
    
    enter(def: any)
    {
        super.enter(def)
        this.combo = 0
    }

    update(dt: number)
    {
        var owner = this.owner
        switch(this.flag)
        {
            case 0:
                owner.setVelocityX(0)
                owner.playAnim('hero_attack_2_1', true)
                this.flag = 1
                break

            case 1:
                if (!owner.isPlayingAnim("hero_attack_2_1"))
                {
                    this.flag = 2
                    this.scene.sound.play('snd_sword_slash')
                    owner.playAnim('hero_attack_2_2', true)
                    owner.start_attacking(owner.flipX ? -20 : 20, 0)
                    owner.attack_timer = 0.05
                }
                break

            case 2:
                if(owner.isAttackRequest())
                    this.combo = 1
                if (!owner.isPlayingAnim("hero_attack_2_2"))
                {
                    if(this.combo)
                        owner.change_state("Attack3")
                    else
                    {
                        owner.change_state()
                        owner.playAnim('hero_idle2', true)
                    }
                }
                break
        }
    }
}