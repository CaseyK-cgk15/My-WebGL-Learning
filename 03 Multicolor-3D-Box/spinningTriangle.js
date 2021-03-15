"use strict";

{
    const mat4 = glMatrix.mat4;

    // setup Canvas and WebGLRenderingContext (gl)
    let gl;
    WebGLSetup();

    /**
     * *********************************************
     *     ---= Create Shaders & Program =---
     * *********************************************
     */

    // Vertex Shader
    const vertexShaderSourceCode = 
    `    
    precision mediump float;       
            
    // an attribute will receive data from a buffer
    attribute vec4 position;
    attribute vec3 color;
    varying vec3 vColor;

    uniform mat4 GLSLmatrix;
   
    // all shaders have a main function
    void main() {
   
        vColor = color;

        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = GLSLmatrix * position;
    }

    `

    // Fragment Shader
    const fragmentShaderSourceCode =
    `

    // set precision
    precision mediump float;

    varying vec3 vColor;
   
    void main() {
      // gl_FragColor is a special variable a fragment shader
      // is responsible for setting
      gl_FragColor = vec4(vColor, 1); // return reddish-purple
    }
   
    `
    // create shaders
    const vertexShader = myWebGLHelper_createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode);
    const fragmentShader = myWebGLHelper_createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode);
    // create program
    const program = myWebGLHelper_createProgram(gl, vertexShader, fragmentShader);

    /**
     * *********************************************
     * ---= Buffers, Data, Attribute Locations =---
     * *********************************************
     */
    
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

    // Matrix & Transformations
    const myMatrix = mat4.create(); // create identity matrix
    // transformations are done in reverse order of code
    // these transformations will be performed in order of rotate->scale->translate
    // do rotation/scale BEFORE translate (after in code)
    mat4.translate(myMatrix, myMatrix, [.2, .5, 0]);
    mat4.scale(myMatrix, myMatrix, [0.25, 0.25, 0.25]);
    // rotate moved to render()
    //mat4.rotateZ(myMatrix, myMatrix, Math.PI/2); // rotate in radians, this is 90 degrees
    console.log(myMatrix); // displays array of data in console (for debugging purposes, not needed)

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
        // Animate
        requestAnimationFrame(render); // parameter is name of function it's in

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

        // Matrix Locations
        const uniformLocations =
        {
            matrix: gl.getUniformLocation(program, "GLSLmatrix"),
        };
        mat4.rotateZ(myMatrix, myMatrix, Math.PI/2 /70);
        gl.uniformMatrix4fv(uniformLocations.matrix, false, myMatrix);

        // Ask WebGL to execute GLSL program
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    };
}
