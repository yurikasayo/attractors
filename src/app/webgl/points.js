import { Geometry } from './geometry';

export class Points extends Geometry {
    constructor(renderer, position) {
        super(renderer);

        this.createVertexBuffer('position', position, true);

        this.indexLength = position.length / 3;
    }
}