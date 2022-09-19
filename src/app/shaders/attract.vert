#version 300 es

in vec3 position;

out vec3 vPosition;

uniform float dt;
uniform float b;

void main(){
    vPosition = position + dt * vec3(
        sin(position.y) - b * position.x,
        sin(position.z) - b * position.y,
        sin(position.x) - b * position.z
    );
}