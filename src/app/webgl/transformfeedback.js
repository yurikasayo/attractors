import { Points } from "./points";

export class TransformFeedback {
    constructor(renderer, positions) {
        this.renderer = renderer;
        this.positions = positions;

        this.tfId = 0;
        this.tf = new Array(2);
        this.tf[0] = this.createTransformFeedback(this.positions);
        this.tf[1] = this.createTransformFeedback(this.positions);
        this.points = this.tf[1].points;
    }

    createTransformFeedback(positions) {
        const gl = this.renderer.gl;

        const points = new Points(this.renderer, positions);
        const tf = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, points.vbos["position"])

        return { points, tf };
    }

    render() {
        this.renderer.render({
            tf: this.tf[this.tfId].tf
        })

        this.points = this.tf[this.tfId].points;
        this.tfId = 1 - this.tfId;
    }
}