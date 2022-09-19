import { Shader } from './webgl/shader';
import { TransformFeedback } from './webgl/transformfeedback';

import vertexShader from './shaders/attract.vert';
import fragmentShader from './shaders/point.frag';

export class Attractor {
    constructor(renderer, num, size) {
        this.renderer = renderer;
        this.num = num;
        this.size = size;

        const positions = [];
        for (let i = 0; i < this.num * 3; i++) {
            positions.push((Math.random() - 0.5) * this.size);
        }
        this.system = new TransformFeedback(this.renderer, positions);

        this.shader = new Shader(this.renderer, vertexShader, fragmentShader, ["vPosition"]);
        this.shader.createAttributes({position: 3});
        this.shader.createUniforms({
            mode: 'int',
            dt: 'float',
            param1: 'float',
            param2: 'float',
            param3: 'float',
            param4: 'float',
            param5: 'float',
            param6: 'float',
        });
        
        const that = this;
        this.param = {
            mode: 0,
            dt: 0.5,
            param1: 0.5,
            param2: 0.5,
            param3: 0.5,
            param4: 0.5,
            param5: 0.5,
            param6: 0.5,
            reset() {
                that.reset();
            },
        }
    }

    reset() {
        const positions = [];
        for (let i = 0; i < this.num * 3; i++) {
            positions.push((Math.random() - 0.5) * this.size);
        }
        this.system.resetPoints(positions);
    }

    render() {
        const uniforms = {
            mode: this.param.mode,
            dt: this.param.dt,
            param1: this.param.param1,
            param2: this.param.param2,
            param3: this.param.param3,
            param4: this.param.param4,
            param5: this.param.param5,
            param6: this.param.param6,
        };
        this.renderer.set(this.system.points, this.shader, uniforms);
        this.system.render();
    }
}