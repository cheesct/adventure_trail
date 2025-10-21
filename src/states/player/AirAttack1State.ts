import BaseState from '../BaseState'

export default class AirAttack1State extends BaseState
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
        owner.setVelocityY(Math.min(owner.getVelocity().y, 10))
        switch(this.flag)
        {
            case 0:
                owner.setVelocityX(0)
                owner.playAnim('hero_attack_air', true)
                owner.start_attacking(owner.flipX ? -20 : 20, 0)
                this.scene.sound.play('snd_sword_slash')
                this.flag = 1
                break

            case 1:
                if(owner.isAttackRequest())
                    this.combo = 1
                if (!owner.isPlayingAnim("hero_attack_air"))
                {
                    if(this.combo && owner.isAttackHit())
                        owner.change_state("AttackAir2")
                    else
                    {
                        owner.change_state()
                    }
                    owner.attack_cooldown = 0.5
                    owner.playAnim('hero_idle2', true)
                }
                break
        }
    }
}