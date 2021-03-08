"use strict";

{
    // setup Canvas and WebGLRenderingContext (gl)
    let gl;
    WebGLSetup();

    // grab shader source code
    let vertexShaderSource = document.querySelector("#vertex-shader-3d").text;
    let fragmentShaderSource = document.querySelector("#fragment-shader-3d").text;
    // create shaders
    let vertexShader = myWebGLHelper_createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = myWebGLHelper_createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // create program
    let program = myWebGLHelper_createProgram(gl, vertexShader, fragmentShader);

    // get attribute location
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // create & bind buffer
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // three 3d points
    let positions = [
        0, 0, 0,
        0, 0.5, 0,
        0.7, 0, 0,
        ];
    // load data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    render();

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function WebGLSetup()
    {
        // Setup Canvas and WebGLRenderingContext (gl)
        var canvas = document.querySelector('canvas');
        gl = canvas.getContext('webgl');
        // throw error if WebGL not supported
        if (!gl) 
        {
            alert( "WebGL isn't available" );
        }
    };

    function render()
    {
        /*
        *   [Resizing Canvas code would go here]
        */

        // Map clipboard coords to canvas size
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Execute WebGL Program
        gl.useProgram(program);

        // Enable Attributes
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset)

        // Ask WebGL to execute GLSL program
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    };
}
