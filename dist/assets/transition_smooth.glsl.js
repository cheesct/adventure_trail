---
type: fragment
uniform.flag: { "type": "1i", "value": 0 }
uniform.progress: { "type": "1f", "value": 0.0 }
uniform.inversion: { "type": "1i", "value": 0 }
---

precision mediump float;

const float smooth_area = 0.1;

uniform int flag;
uniform float progress;
uniform bool inversion;
uniform vec2 resolution;

void main( void )
{
    float t = (1.0 + 2.*smooth_area) * (progress) - smooth_area;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.y = 1.-uv.y;
    if (flag == 0)
    {
        uv.x = 2.*uv.x;
        uv.y = 0.;
    }
    else if (flag == 2)
    {
        uv.x = 0.;
        uv.y = 2.*uv.y;
    }
    else if (flag == 3)
    {
        uv.x = 1.-uv.x;
    }
    else if (flag == 4)
    {
        uv.x = 2.*(1.-uv.x);
        uv.y = 0.;
    }
    else if (flag == 5)
    {
        uv.x = 1.-uv.x;
        uv.y = 1.-uv.y;
    }
    else if (flag == 6)
    {
        uv.x = 0.;
        uv.y = 2.*(1.-uv.y);
    }
    else if (flag == 7)
    {
        uv.y = 1.-uv.y;
    }
    float a = smoothstep(t - smooth_area, t + smooth_area, (uv.x + uv.y) / 2.);
    a = inversion ? a : 1.-a;
    gl_FragColor = vec4(0., 0., 0., 1.) * a;
}