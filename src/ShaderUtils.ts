const loadResource = async (name: string) => {
    const response = await fetch(name);
    if (response.status === 200) {
        return await response.text();
    }
    throw new Error("Failed to load shader.");
}

export const loadAndCompileShaders = async (
    gl: any,
    vertexShaderFileName: string,
    fragmentShaderFileName: string
) => {
    var vertexShaderSource = await loadResource(vertexShaderFileName);
    var fragmentShaderSource = await loadResource(fragmentShaderFileName);
    if (vertexShaderSource === null || fragmentShaderSource === null) {
        console.log("Could not load shader files");
        return false;
    }
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert("Vertex Shader Error: " + gl.getShaderInfoLog(vertexShader));
        return false;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert("Fragment Shader Error: " + gl.getShaderInfoLog(fragmentShader));
        return false;
    }
    return setupProgram(gl, vertexShader, fragmentShader);
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
