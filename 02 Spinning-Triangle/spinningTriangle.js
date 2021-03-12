"use strict";

{
    // setup Canvas and WebGLRenderingContext (gl)
    let gl;
    WebGLSetup();

    // grab shader source code
    const vertexShaderSource = document.querySelector("#vertex-shader-3d").text;
    const fragmentShaderSource = document.querySelector("#fragment-shader-3d").text;
    // create shaders
    const vertexShader = myWebGLHelper_createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = myWebGLHelper_createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // create program
    const program = myWebGLHelper_createProgram(gl, vertexShader, fragmentShader);

    // ---= Buffers, Data, Attribute Locations =---
    
    // get attribute location
    const positionAttribLocation = gl.getAttribLocation(program, "position");
    const colorAttribLocation = gl.getAttribLocation(program, "color");

    // three 3d points
    const vertexData = [
        0, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        ];

    const colorData = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];

    // create & bind buffer, load data into buffer

    // positionBuffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    // colorBuffer
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

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

        // attrib pointer vars
        let size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer

        // position
        // Enable Attributes
        gl.enableVertexAttribArray(positionAttribLocation);
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            positionAttribLocation, size, type, normalize, stride, offset)

        // color
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            colorAttribLocation, size, type, normalize, stride, offset)

        // Ask WebGL to execute GLSL program
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    };
}
