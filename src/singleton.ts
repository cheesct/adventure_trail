export default class Singleton
{
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

    public static sceneTransIn(scene)
    {
        if (!scene.transition)
        {
            scene.transition = scene.add.shader("transition_diamond", scene.cameras.main.scrollX + scene.cameras.main.centerX, scene.cameras.main.scrollY + scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height).setScrollFactor(0)
            scene.transition.depth = 10
        }
        Singleton.transition_name = "1"
        scene.transition.uniforms.flag.value = Singleton.transition_flag
		scene.transition.uniforms.progress.value = 0
        scene.transition.uniforms.inversion.value = true
        scene.tweens.add({ targets: scene.transition.uniforms.progress, value: 1.0, ease: 'Linear', duration: 1000 })
    }

    public static sceneTransOut(scene, flag: number, to: string)
    {
        if (!scene.transition)
        {
            scene.transition = scene.add.shader("transition_diamond", scene.cameras.main.scrollX + scene.cameras.main.centerX, scene.cameras.main.scrollY + scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height).setScrollFactor(0)
            scene.transition.depth = 10
        }
        Singleton.transition_name = null
        Singleton.transition_flag = flag
        scene.transition.uniforms.flag.value = flag
		scene.transition.uniforms.progress.value = 0
        scene.transition.uniforms.inversion.value = false
        scene.tweens.add({ targets: scene.transition.uniforms.progress, value: 1.0, ease: 'Linear', duration: 1000,
            onComplete: () => { scene.scene.start(to) }
        })
    }
}