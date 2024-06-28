
import BaseState from './BaseState'

export default class StateMachine
{
    private keys: Array<string>
    private states: object
    private current: BaseState

    constructor(states: object)
    {
        this.keys = Object.keys(states)
        this.states = states
        this.current = new BaseState(null, null)
    }

    change(name, params = null)
    {
        if (this.keys.includes(name))
        {
            this.current.exit()
            this.current = this.states[name]()
            this.current.enter(params)
        }
    }

    update(dt)
    {
        this.current.update(dt)
    }
}