const vertexShader = `
attribute vec2 position;
uniform mat3 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main () {
    vec3 worldPosition = modelMatrix * vec3(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
}
`;
export default vertexShader;