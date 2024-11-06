import * as Phaser from 'phaser'

export default class Singleton
{
    private static instance: Singleton
    private static progress: number = 0

    public static transition_name: string
    public static transition_flag: number = 0

    public static is_waypoint_travel: boolean = false
    public static waypoint_landing_x: number = 0
    public static waypoint_landing_y: number = 0

    public static checkpoint_level: string = null
    public static checkpoint_x: number = 0
    public static checkpoint_y: number = 0

    public static readonly DEPTH_BACK_DROP: number = -10
    public static readonly DEPTH_BACK_LONG: number = -5
    public static readonly DEPTH_BACK_NEAR: number = -2

    private constructor()
    {
    }

    public static getInstance(): Singleton
    {
        return Singleton.instance;
    }

    public static sceneTransIn(scene)
    {
        scene.cameras.main.fadeIn(1500)
        return
        scene.transition = scene.add.shader("transition_diamond", scene.cameras.main.scrollX + scene.cameras.main.centerX, scene.cameras.main.scrollY + scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height).setScrollFactor(0)
        scene.transition.depth = 10
        Singleton.transition_name = null
        scene.transition.uniforms.flag.value = Singleton.transition_flag
        scene.transition.uniforms.progress.value = 0
        scene.transition.uniforms.inversion.value = true
        Singleton.progress = 0;
        scene.tweens.add({ targets: Singleton.progress, value: 1.0, ease: 'Linear', duration: 1000,
            onUpdate: () =>  { scene.transition.progress.value = Singleton.progress },
        })
    }

    public static sceneTransOut(scene, flag: number, to: string)
    {
        scene.cameras.main.fadeOut()
        scene.time.addEvent({ delay: 1000, callback: () => { scene.scene.start(to) } })
        return
        if (scene.game.config.renderType == Phaser.WEBGL)
        {
            if (scene.transition === undefined)
            {
                scene.transition = scene.add.shader("transition_diamond", scene.cameras.main.scrollX + scene.cameras.main.centerX, scene.cameras.main.scrollY + scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height).setScrollFactor(0)
            }
            Singleton.transition_name = "1"
            Singleton.transition_flag = flag
            scene.transition.uniforms.flag.value = flag
            scene.transition.uniforms.progress.value = 0
            scene.transition.uniforms.inversion.value = false
            Singleton.progress = 0;
            scene.tweens.add({ targets: Singleton.progress, value: 1.0, ease: 'Linear', duration: 1000,
                onUpdate: () =>  { scene.transition.progress.value = Singleton.progress },
                onComplete: () => { scene.scene.start(to) }
            })
        }
        else
        {
        }
    }
}