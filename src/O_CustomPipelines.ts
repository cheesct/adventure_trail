import * as Phaser from 'phaser'

const TransitionDiamondShader = `
#define SHADER_NAME DIAMOND_FS

precision mediump float;
const float diamondPixelSize = 16.;

uniform sampler2D uMainSampler;
uniform int flag;
uniform bool inversion;
uniform float progress;

varying vec2 outTexCoord;

void main(void)
{
    gl_FragColor = vec4(0., 0., 0., 1.);
    vec2 uv = outTexCoord;
    float xFraction = fract(gl_FragCoord.x / diamondPixelSize);
    float yFraction = fract(gl_FragCoord.y / diamondPixelSize);
    float xDistance = abs(xFraction - 0.5);
    float yDistance = abs(yFraction - 0.5);
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
            gl_FragColor = texture2D(uMainSampler, outTexCoord);
        }
    }
    else
    {
        if (xDistance + yDistance + uv.x + uv.y > progress * numOfElement)
        {
            gl_FragColor = texture2D(uMainSampler, outTexCoord);
        }
    }
}`;

const hueFragShader = `
#define SHADER_NAME HUE_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;

varying vec2 outTexCoord;
varying float outTexId;
varying vec4 outTint;
varying vec2 fragCoord;

void main()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    float c = cos(uTime * uSpeed);
    float s = sin(uTime * uSpeed);

    mat4 r = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0,  0.0, 0.0, 1.0);
    mat4 g = mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0);
    mat4 b = mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0);

    mat4 hueRotation = r + g * c + b * s;

    gl_FragColor = texture * hueRotation;
}`;

export class TransitionDiamondFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    public flag: number
    public progress: number
    public inversion: boolean

    constructor(game)
    {
        super({
            game,
            renderTarget: true,
            fragShader: TransitionDiamondShader
        });
        this.flag = 0
        this.progress = 0
        this.inversion = false
    }

    onPreRender()
    {
        this.set1i('flag', this.flag);
        this.set1f('progress', this.progress);
        this.setBoolean('inversion', this.inversion);
    }
}