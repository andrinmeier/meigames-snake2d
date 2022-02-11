import vertexShaderText from './shaders/VertexShader';
import fragmentShaderText from './shaders/FragmentShader';

export const loadAndCompileShaders = (context: any) => {
    var vertexShaderSource = vertexShaderText;
    var fragmentShaderSource = fragmentShaderText;
    if (vertexShaderSource === null || fragmentShaderSource === null) {
        console.log("Could not load shader files");
        return false;
    }
    var vertexShader = context.createShader(context.VERTEX_SHADER);
    context.shaderSource(vertexShader, vertexShaderSource);
    context.compileShader(vertexShader);
    if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
        alert("Vertex Shader Error: " + context.getShaderInfoLog(vertexShader));
        return false;
    }

    var fragmentShader = context.createShader(context.FRAGMENT_SHADER);
    context.shaderSource(fragmentShader, fragmentShaderSource);
    context.compileShader(fragmentShader);

    if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
        alert("Fragment Shader Error: " + context.getShaderInfoLog(fragmentShader));
        return false;
    }
    return setupProgram(context, vertexShader, fragmentShader);
}

const setupProgram = (gl: any, vertexShader: any, fragmentShader: any) => {
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shader");
        return false;
    }
    gl.useProgram(shaderProgram);
    return shaderProgram;
}
