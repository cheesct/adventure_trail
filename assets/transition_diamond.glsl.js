---
type: fragment
uniform.flag: { "type": "1i", "value": 0 }
uniform.progress: { "type": "1f", "value": 0.0 }
uniform.inversion: { "type": "1i", "value": 0 }
---

precision mediump float;

const float diamondPixelSize = 16.;

uniform int flag;
uniform float progress;
uniform bool inversion;
uniform vec2 resolution;

void main(void)
{
    gl_FragColor = vec4(0., 0., 0., 1.);
    float xFraction = fract(gl_FragCoord.x / diamondPixelSize);
    float yFraction = fract(gl_FragCoord.y / diamondPixelSize);
    float xDistance = abs(xFraction - 0.5);
    float yDistance = abs(yFraction - 0.5);
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.y = 1.-uv.y;
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
}