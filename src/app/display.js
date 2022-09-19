import { Shader } from './webgl/shader';
import { Camera } from './webgl/camera';
import vertexShader from './shaders/point.vert';
import fragmentShader from './shaders/point.frag';

export class Display {
    constructor(renderer, width, height) {
        this.renderer = renderer;
        this.size = {width, height};

        this.shader = new Shader(this.renderer, vertexShader, fragmentShader);
        this.shader.createAttributes({position: 3});
        this.shader.createUniforms({
            modelMatrix: 'mat4', 
            viewMatrix: 'mat4', 
            projectionMatrix: 'mat4',
        });

        this.camera = new Camera();
        this.camera.setRadius(10);
        this.camera.perspective(Math.PI / 4, width / height, 0.001, 200);

        this.radius = 10;
        this.rotation = {dtheta: 0, dphi: 0, decay: 0.95};

        this.param = {
        };
    }

    updateCamera() {
        this.camera.setRadius(this.radius);
        this.camera.rotate(this.rotation.dtheta, this.rotation.dphi);
        this.rotation.dtheta *= this.rotation.decay;
        this.rotation.dphi *= this.rotation.decay;
    }

    resize(width, height) {
        this.size = {width, height};
        this.camera.perspective(Math.PI / 4, width / height, 0.001, 20);
    }

    render(points) {
        this.renderer.resize(this.size.width, this.size.height);
        const uniforms = {
        };
        this.renderer.set(points, this.shader, uniforms, this.camera);
        this.renderer.render({
            clearColor: [0.0, 0.0, 0.0, 1.0],
            clearDepth: 1.0,
        });
    }
}