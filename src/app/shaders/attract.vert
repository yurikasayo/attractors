#version 300 es

in vec3 position;

out vec3 vPosition;

uniform int mode;
uniform float dt;
uniform float param1;
uniform float param2;
uniform float param3;
uniform float param4;
uniform float param5;

void main(){
    vec3 p;
    vec3 dP;
    float a, b, c, d, e, f;
    switch(mode) {
        case 0: // thomas
            p = position;
            a = mix(0.08, 0.22, param1);
            dP = vec3(
                sin(p.y) - a * p.x,
                sin(p.z) - a * p.y,
                sin(p.x) - a * p.z
            );
            dP *= mix(0.001, 0.05, dt);
            break;

        case 1: // lorenz
            p = position * 9.0;
            a = mix(2.0, 18.0, param1);
            b = mix(20.0, 36.0, param2);
            c = mix(1.0, 3.0, param3);
            dP = vec3(
                a * (-p.x + p.y),
                -p.x * p.z + b * p.x - p.y,
                p.x * p.y - c * p.z
            ) / 9.0;
            dP *= mix(0.0005, 0.005, dt);
            break;

        case 2: // dadras
            p = position * 2.0;
            a = mix(0.5, 5.0, param1);
            b = mix(0.5, 6.0, param2);
            c = mix(1.5, 4.0, param3);
            d = mix(1.0, 3.0, param4);
            e = mix(5.0, 20.0, param5);
            dP = vec3(
                p.y - a * p.x + b * p.y * p.z,
                c * p.y - p.x * p.z + p.z,
                d * p.x * p.y - e * p.z
            ) / 2.0;
            dP *= mix(0.0001, 0.01, dt);
            break;

        case 3: // halvorsen
            p = position * 2.0;
            a = mix(0.5, 5.0, param1);
            dP = vec3(
                -a * p.x - 4.0 * p.y - 4.0 * p.z - p.y * p.y,
                -a * p.y - 4.0 * p.z - 4.0 * p.x - p.z * p.z,
                -a * p.z - 4.0 * p.x - 4.0 * p.y - p.x * p.x
            ) / 2.0;
            dP *= mix(0.0001, 0.002, dt);
            break;

        case 4: // arneodo
            p = position * 30.0;
            a = mix(1.0, 10.0, param1);
            b = mix(1.0, 6.0, param2);
            c = mix(0.00001, 0.002, param3);
            dP = vec3(
                p.y,
                p.z,
                a * p.x - b * p.y - p.z - c * pow(p.x, 3.0)
            ) / 30.0;
            dP *= mix(0.0001, 0.01, dt);
            break;

        default:
            break;
    }

    vPosition = position + dP;
}