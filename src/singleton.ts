import { TransitionDiamondFX } from './O_CustomPipelines'

export default class Singleton
{
    public static readonly TransitionDiamond = "TransitionDiamondFX"

    private static instance: Singleton

    public static transition_name: string
    public static transition_flag: number = 0

    public static is_waypoint_travel: boolean = false
    public static waypoint_landing_x: number = 0
    public static waypoint_landing_y: number = 0

    private constructor()
    {
    }

    public static getInstance(): Singleton
    {
        if (!Singleton.instance)
        {
            Singleton.instance = new Singleton()
        }
        return Singleton.instance;
    }

    public static sceneAddPostPipeline(scene: Phaser.Scene)
    {
        const renderer = scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
        renderer.pipelines.addPostPipeline('TransitionDiamondFX', TransitionDiamondFX)
        scene.cameras.main.setPostPipeline(renderer.pipelines.getPostPipeline(TransitionDiamondFX))
    }

    public static sceneTransIn(scene: Phaser.Scene)
    {
        Singleton.transition_name = null
        const transition = (scene.cameras.main.getPostPipeline("TransitionDiamondFX") as TransitionDiamondFX)
        transition.flag = Singleton.transition_flag
        transition.inversion = true
        transition.progress = 0
        scene.tweens.add({ targets: transition, progress: 1.0, ease: 'Linear', duration: 1000 })
    }

    public static sceneTransOut(scene: Phaser.Scene, flag: number, to: string)
    {
        const transition = (scene.cameras.main.getPostPipeline("TransitionDiamondFX") as TransitionDiamondFX)
        Singleton.transition_name = Singleton.TransitionDiamond
        Singleton.transition_flag = flag
        transition.flag = Singleton.transition_flag
        transition.inversion = false
        transition.progress = 0
        scene.tweens.add({ targets: transition, progress: 1.0, ease: 'Linear', duration: 1000,
            onComplete: () => { scene.scene.start(to) }
        })
    }
}