import * as Phaser from 'phaser'

export default class Singleton
{
    private static instance: Singleton
    private static transition_Diamond_Shader: Phaser.Display.BaseShader

    public static readonly DEPTH_BACK_DROP: number = -10
    public static readonly DEPTH_BACK_LONG: number = -5
    public static readonly DEPTH_BACK_NEAR: number = -2

    private constructor()
    {
        const transition_diamond = `
        precision mediump float;

        const float diamondPixelSize = 16.;
        
        uniform int flag;
        uniform float progress;
        uniform bool inversion;
        uniform vec2 resolution;
        
        #define iResolution resolution
        
        void main(void)
        {
            gl_FragColor = vec4(0., 0., 0., 1.);
            float xFraction = fract(gl_FragCoord.x / diamondPixelSize);
            float yFraction = fract(gl_FragCoord.y / diamondPixelSize);
            float xDistance = abs(xFraction - 0.5);
            float yDistance = abs(yFraction - 0.5);
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            float numOfElement = 4.;
            if (flag == 0)
            {
                uv.y = 0.;
                numOfElement = 3.;
            }
            else if (flag == 2)
            {
                uv.x = 0.;
                numOfElement = 3.;
            }
            else if (flag == 3)
            {
                uv.x = 1.-uv.x;
            }
            else if (flag == 4)
            {
                uv.x = 1.-uv.x;
                uv.y = 0.;
                numOfElement = 3.;
            }
            else if (flag == 5)
            {
                uv.x = 1.-uv.x;
                uv.y = 1.-uv.y;
            }
            else if (flag == 6)
            {
                uv.x = 0.;
                uv.y = 1.-uv.y;
                numOfElement = 3.;
            }
            else if (flag == 7)
            {
                uv.y = 1.-uv.y;
            }
            if (inversion)
            {
                if (xDistance + yDistance + uv.x + uv.y < progress * numOfElement)
                {
                    discard;
                }
            }
            else
            {
                if (xDistance + yDistance + uv.x + uv.y > progress * numOfElement)
                {
                    discard;
                }
            }
        }`;
        Singleton.transition_Diamond_Shader = new Phaser.Display.BaseShader(
            'transition_diamond',
            transition_diamond,
            null,
            {
                flag: { type: '1i', value: 0 },
                progress: { type: '1f', value: 0 },
                inversion: { type: '1i', value: false },
            }
        );
    }

    public static getInstance(): Singleton
    {
        if (!Singleton.instance)
        {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    public static sceneTransIn(scene, flag: number = 0)
    {
        if (true)
        {
            Singleton.getInstance()
            const transition = scene.add.shader(Singleton.transition_Diamond_Shader, scene.cameras.main.centerX, scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height).setScrollFactor(0)
            transition.depth = 10
            transition.setUniform("flag.value", flag)
            transition.setUniform("progress.value", 0)
            transition.setUniform("inversion.value", true)
            var temp = { value: 0 }
            scene.tweens.add({ targets: temp, value: 1.0, ease: 'Linear', duration: 1000,
                onUpdate: () =>  { transition.setUniform("progress.value", temp.value) },
                onComplete: () => { transition.destroy() }
            })
        }
        else
        {
			scene.cameras.main.fadeIn(1500)
        }
    }

    public static sceneTransOut(scene, flag: number, to: string, data: any = null)
    {
        if (scene.game.config.renderType == Phaser.WEBGL)
        {
            Singleton.getInstance()
            const transition = scene.add.shader(Singleton.transition_Diamond_Shader, scene.cameras.main.centerX, scene.cameras.main.centerY, scene.cameras.main.width, scene.cameras.main.height).setScrollFactor(0)
            transition.depth = 10
            transition.setUniform("flag.value", flag)
            transition.setUniform("progress.value", 0)
            transition.setUniform("inversion.value", false)
            var temp = { value: 0 }
            if (data)
            {
                data.transitionFlag = flag
            }
            else
            {
                data = { transitionFlag: flag }
            }
            scene.tweens.add({ targets: temp, value: 1.0, ease: 'Linear', duration: 1000,
                onUpdate: () =>  { transition.setUniform("progress.value", temp.value) },
                onComplete: () => { scene.scene.start(to, data) }
            })
        }
        else
        {
            scene.cameras.main.fadeOut()
            scene.time.addEvent({ delay: 1000, callback: () => { scene.scene.start(to, data) } })
        }
    }
}