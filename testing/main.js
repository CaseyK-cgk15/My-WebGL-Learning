"use strict";

const OPTIONS =
{
    Rotating: false,
    Isometric_View: true,
}

{
    const mat4 = glMatrix.mat4;

    let canvas = document.querySelector('canvas');
    let gl = myWebGL.glSetup(canvas);
    //let gl = WebGLUtils.setupWebGL(canvas);

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
    attribute vec4 a_position;
    attribute vec4 a_color;

    varying vec4 v_color;

    uniform mat4 u_GLSLmatrix;
    uniform mat4 u_transMatrix;
   
    // all shaders have a main function
    void main() {
       
        v_color = a_color;

        // gl_Position is a special variable a vertex shader is responsible for setting
        gl_Position = u_transMatrix * u_GLSLmatrix * a_position;
    }

    `

    // Fragment Shader
    const fragmentShaderSourceCode =
    `

    // set precision
    precision mediump float;

    varying vec4 v_color;
   
    void main() {
      
      // gl_FragColor is a special variable a fragment shader is responsible for setting
      gl_FragColor = v_color;
    }
   
    `
    // create program
    const program = myWebGL.createProgramFromSource(gl, vertexShaderSourceCode, fragmentShaderSourceCode);

    /**
     * *********************************************
     *             ---=    Data     =---
     * *********************************************
     */
      
    const faceColors = [
        [0.2,  0.2,  0.2,  1.0],    // Front face: grey
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];

    // Convert the array of colors into a table for all the vertices.

    let colorData = [];

    for (var j = 0; j < faceColors.length; ++j)
    {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colorData = colorData.concat(c, c, c, c);
    }

    let colorDataRed = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    {
        colorDataRed = colorDataRed.concat(faceColors[1]);
    }

    let colorDataGreen = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    {
        colorDataGreen = colorDataGreen.concat(faceColors[2]);
    }
    
    const indices = myWebGLData.indexCube01;

    /**
     * *********************************************
     *   ---= Buffers & Attribute Locations =---
     * *********************************************
     */

    // Setup all the buffers and attributes

    // holds attribute locations
    let attribs = 
    {
        a_position: gl.getAttribLocation(program, "a_position"),
        a_color: gl.getAttribLocation(program, "a_color"),
    };
    // holds buffers
    let attribBuffers =
    {
        positionCube: gl.createBuffer(),
        color0: gl.createBuffer(),
        colorRed: gl.createBuffer(),
        colorGreen: gl.createBuffer(),
    };


    // position buffers
    myWebGL.setupAttribBuffer(gl, attribBuffers.positionCube, myWebGLData.vertexCube01, gl.STATIC_DRAW);
    
    // color buffers
    myWebGL.setupAttribBuffer(gl, attribBuffers.color0, colorData, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorRed, colorDataRed, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorGreen, colorDataGreen, gl.STATIC_DRAW);

    // create the buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
/*
    const indexBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
*/
    /**
     * *********************************************
     *   ---= Matricies & Uniforms =---
     * *********************************************
     */

    // Matrix & Transformations
    const myMatrix = mat4.create(); // create identity matrix

    // transformations are done in reverse order of code
    mat4.scale(myMatrix, myMatrix, [0.2, 0.2, 0.2]);

    if (OPTIONS.Isometric_View)
    {
        mat4.rotateZ(myMatrix, myMatrix, Math.PI/4);
        mat4.rotateY(myMatrix, myMatrix, Math.PI/4);
        mat4.rotateX(myMatrix, myMatrix, Math.PI/4);            
    }

    let transMatrix = mat4.create(); 

    const uniformLocations =
    {
        matrix: gl.getUniformLocation(program, "u_GLSLmatrix"),
        transMatrix: gl.getUniformLocation(program, "u_transMatrix")
        
    };

    render();

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
        let vSize = 3;          // 3 components per iteration
        let cSize = 4;          // 4 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer

        // position
        myWebGL.attribEnableBind(gl, attribs.a_position, attribBuffers.positionCube);
        // bind the buffer containing the indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(attribs.a_position, 
            vSize, type, normalize, stride, offset);

        // color
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.color0);
        gl.vertexAttribPointer(attribs.a_color,
            cSize, type, normalize, stride, offset);

        // Matrix Locations
        if (OPTIONS.Rotating)
        {
            mat4.rotateZ(myMatrix, myMatrix, Math.PI/2 /90);
            mat4.rotateX(myMatrix, myMatrix, Math.PI/2 /70);    
        }

        gl.uniformMatrix4fv(uniformLocations.matrix, false, myMatrix);
        transMatrix = mat4.create();
        gl.uniformMatrix4fv(uniformLocations.transMatrix, false, transMatrix);

        // Ask WebGL to execute GLSL program
        let primitiveType = gl.TRIANGLES;
        let drawOffset = 0;
        //var count = vertexData.length / 3;
        let count = 36 // 6 verticies per face * 6 faces
        let indexType = gl.UNSIGNED_SHORT;

        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);

        gl.drawElements(primitiveType, count, indexType, drawOffset);

        // color change 
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.colorGreen);
        gl.vertexAttribPointer(attribs.a_color,
            cSize, type, normalize, stride, offset);

        mat4.translate(transMatrix, transMatrix, [0.5, 0, 0]);
        gl.uniformMatrix4fv(uniformLocations.transMatrix, false, transMatrix);
        gl.drawElements(primitiveType, count, indexType, 0);

        // color change 
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.colorRed);
        gl.vertexAttribPointer(attribs.a_color,
            cSize, type, normalize, stride, offset);
            

        transMatrix = mat4.create();
        mat4.translate(transMatrix, transMatrix, [-0.5, 0, 0]);
        gl.uniformMatrix4fv(uniformLocations.transMatrix, false, transMatrix);
        gl.drawElements(primitiveType, count, indexType, 0);


    };
}
