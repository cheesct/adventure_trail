export default class BaseState
{
    protected owner: any
    protected scene: any
    protected flag: number = 0

    constructor(owner, scene)
    {
        this.owner = owner
        this.scene = scene
    }

    enter(def: any)
    {
        this.flag = 0
    }

    update(dt: number)
    {
    }

    exit()
    {
    }
}