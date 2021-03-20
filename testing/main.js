"use strict";

const OPTIONS =
{
    Rotating: false,
    Isometric_View: true,
    Animate: false,
};

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
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
    attribute vec3 a_position;
    attribute vec4 a_color;

    varying vec4 v_color;

    uniform mat4 u_GLSLmatrix;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
   
    // all shaders have a main function
    void main() {
       
        v_color = a_color;

        // gl_Position is a special variable a vertex shader is responsible for setting
        gl_Position =  u_projectionMatrix * u_viewMatrix * u_GLSLmatrix * vec4(a_position, 1);
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

    let colorDataBlue = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    {
        colorDataBlue = colorDataBlue.concat(faceColors[3]);
    }

    let colorDataPurple = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    {
        colorDataPurple = colorDataPurple.concat(faceColors[5]);
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
        colorBlue: gl.createBuffer(),
        colorPurple: gl.createBuffer(),
    };


    // position buffers
    myWebGL.setupAttribBuffer(gl, attribBuffers.positionCube, myWebGLData.vertexCube01, gl.STATIC_DRAW);
    
    // color buffers
    myWebGL.setupAttribBuffer(gl, attribBuffers.color0, colorData, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorRed, colorDataRed, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorGreen, colorDataGreen, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorBlue, colorDataBlue, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorPurple, colorDataPurple, gl.STATIC_DRAW);

    // create the buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    /**
     * *********************************************
     *   ---= Matricies & Uniforms =---
     * *********************************************
     */

    // Matrix & Transformations
    const myMatrix = mat4.create(); // create identity matrix
    const transMatrix = mat4.create(); 
    const bodyScale = mat4.create();
    let finalMatrix = mat4.create();

    // code: translate->scale->rotate
    // actually performed: rotate->scale->translate

    // transformations are done in reverse order of code
    mat4.translate(myMatrix, myMatrix, [0,0,-1]);
    const scaleFactor = 0.25;
    mat4.scale(myMatrix, myMatrix, [scaleFactor, scaleFactor, scaleFactor]);
    mat4.scale(bodyScale, bodyScale, [1, 2, 1]);

    const isoMatrix = mat4.create();
    if (OPTIONS.Isometric_View)
    {
        // true iso view is:
        // rotate X 45 degrees (pi/4 radians)
        // rotate Y approx. 35.3644 degrees (approx. 0.617225218 radians)
        // pi * 0.2 = approx. 0.62831853071 radians
        // pi * 0.2 is used
        mat4.rotateX(isoMatrix, isoMatrix, Math.PI/4);
        mat4.rotateY(isoMatrix, isoMatrix, Math.PI * 0.2);         
    }

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [-1, 2, 0.5]);
    mat4.invert(viewMatrix, viewMatrix);

    const perspectiveMatrix = mat4.create();
    mat4.perspective(perspectiveMatrix,
        120 * Math.PI/180,// Vertical FOV (angle, radians)
        canvas.width/canvas.height, // aspect W/H
        1e-4, // near cull distance/plane
        1e4, // far cull distance/plane
        );

    const orthoMatrix = mat4.create();
    mat4.ortho(orthoMatrix, -1, 1, -1, 1, 1e-4, 1e4);
    mat4.multiply(orthoMatrix, orthoMatrix, isoMatrix);

    const uniformLocations =
    {
        u_modelMatrix: gl.getUniformLocation(program, "u_GLSLmatrix"),
        u_transMatrix: gl.getUniformLocation(program, "u_transMatrix"),
        u_projectionMatrix: gl.getUniformLocation(program, "u_projectionMatrix"),
        u_viewMatrix: gl.getUniformLocation(program, "u_viewMatrix")
        
    };

    const attribSettings =
    {
        // attrib pointer vars
        // draw vars
        primitiveType: gl.TRIANGLES,
        vSize: 3,          // 3 components per iteration
        cSize: 4,          // 4 components per iteration
        type: gl.FLOAT,    // the data is 32bit floats
        indexType: gl.UNSIGNED_SHORT, // 2 byte shorts
        normalize: false,  // don't normalize the data
        stride: 0,         // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset: 0,         // start at the beginning of the buffer
        indexOffset: 0,    // same as offset but for draw elements

        //var count = vertexData.length / 3;
        count: 36, // 6 verticies per face * 6 faces
    };

    render();

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function render()
    {
        // Animate
        if (OPTIONS.Animate)
            requestAnimationFrame(render); // parameter is name of function it's in

        /*
        *   [Resizing Canvas code would go here]
        */
        //resizeCanvasToDisplaySize(canvas);

        // Map clipboard coords to canvas size
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Execute WebGL Program
        gl.useProgram(program);
  
        // Matrix Locations
        //gl.uniformMatrix4fv(uniformLocations.isoMatrix, false, isoMatrix);
        if (OPTIONS.Rotating)
        {
            mat4.rotateZ(myMatrix, myMatrix, Math.PI/2 /90);
            mat4.rotateX(myMatrix, myMatrix, Math.PI/2 /70);    
        }

        gl.uniformMatrix4fv(uniformLocations.u_projectionMatrix, false, orthoMatrix);
        gl.uniformMatrix4fv(uniformLocations.u_viewMatrix, false, viewMatrix);

        // Ask WebGL to execute GLSL program

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        // position (Verticies for Cubes)
        myWebGL.attribEnableBind(gl, attribs.a_position, attribBuffers.positionCube);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); // bind the buffer containing the indices
        myWebGL.vertexAttribPointerV(gl, attribs.a_position, attribSettings); // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

        // center
        // color
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.color0);
        myWebGL.vertexAttribPointerC(gl, attribs.a_color, attribSettings);

        mat4.multiply(finalMatrix, bodyScale, myMatrix);
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // left
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.color0);
        myWebGL.vertexAttribPointerC(gl, attribs.a_color, attribSettings);

        finalMatrix = mat4.create();
        mat4.translate(finalMatrix, finalMatrix, [-2.1,0,0]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // right 
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.color0);
        myWebGL.vertexAttribPointerC(gl, attribs.a_color, attribSettings);

        finalMatrix = mat4.create();
        mat4.translate(finalMatrix, finalMatrix, [2.1,0,0]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);


        myWebGL.drawElements(gl, attribSettings);
    };
}
