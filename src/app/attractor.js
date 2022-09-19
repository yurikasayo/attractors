import { Shader } from './webgl/shader';
import { TransformFeedback } from './webgl/transformfeedback';

import vertexShader from './shaders/attract.vert';
import fragmentShader from './shaders/point.frag';

export class Attractor {
    constructor(renderer, num, size) {
        this.renderer = renderer;

        const positions = [];
        for (let i = 0; i < num * 3; i++) {
            positions.push((Math.random() - 0.5) * size);
        }
        this.system = new TransformFeedback(this.renderer, positions);

        this.shader = new Shader(this.renderer, vertexShader, fragmentShader, ["vPosition"]);
        this.shader.createAttributes({position: 3});
        this.shader.createUniforms({
            dt: 'float',
            b: 'float',
        });
        
        const that = this;
        this.param = {
            dt: 0.01,
            b: 0.013,
            reset() {
                that.reset();
            },
        }
    }

    reset() {
        
    }

    render() {
        const uniforms = {
            dt: this.param.dt,
            b: this.param.b
        };
        this.renderer.set(this.system.points, this.shader, uniforms);
        this.system.render();
    }
}