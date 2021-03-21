// main.js
// 3D Isometric Robot
// author Casey Koepp
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

    const vec3 lightDirection = normalize(vec3(0.5, 0.7, 1.0));
    const float ambient = 0.2;
            
    // an attribute will receive data from a buffer
    attribute vec3 a_position;
    attribute vec4 a_color;
    attribute vec3 a_normal;

    varying vec4 v_color;
    varying float v_brightness;

    uniform mat4 u_GLSLmatrix;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;

    // inverse function
    mat4 inverse(mat4 m) {
        float
            a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
            a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
            a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
            a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],
      
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
      
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      
        return mat4(
            a11 * b11 - a12 * b10 + a13 * b09,
            a02 * b10 - a01 * b11 - a03 * b09,
            a31 * b05 - a32 * b04 + a33 * b03,
            a22 * b04 - a21 * b05 - a23 * b03,
            a12 * b08 - a10 * b11 - a13 * b07,
            a00 * b11 - a02 * b08 + a03 * b07,
            a32 * b02 - a30 * b05 - a33 * b01,
            a20 * b05 - a22 * b02 + a23 * b01,
            a10 * b10 - a11 * b08 + a13 * b06,
            a01 * b08 - a00 * b10 - a03 * b06,
            a30 * b04 - a31 * b02 + a33 * b00,
            a21 * b02 - a20 * b04 - a23 * b00,
            a11 * b07 - a10 * b09 - a12 * b06,
            a00 * b09 - a01 * b07 + a02 * b06,
            a31 * b01 - a30 * b03 - a32 * b00,
            a20 * b03 - a21 * b01 + a22 * b00) / det;
      }

    mat4 transpose(in mat4 inMatrix) {
        vec4 i0 = inMatrix[0];
        vec4 i1 = inMatrix[1];
        vec4 i2 = inMatrix[2];
        vec4 i3 = inMatrix[3];
    
        mat4 outMatrix = mat4(
                     vec4(i0.x, i1.x, i2.x, i3.x),
                     vec4(i0.y, i1.y, i2.y, i3.y),
                     vec4(i0.z, i1.z, i2.z, i3.z),
                     vec4(i0.w, i1.w, i2.w, i3.w)
                     );
    
        return outMatrix;
    }
   
    // all shaders have a main function
    void main() {
        mat4 mvMatrix = u_viewMatrix * u_GLSLmatrix;
        mat4 mvpMatrix = u_projectionMatrix * mvMatrix;

        mat4 normalMatrix = inverse(mvMatrix);
        normalMatrix = transpose(normalMatrix);
        
        vec3 worldNormal = normalize((normalMatrix * vec4(a_normal, 1.0)).xyz);
        float diffuse = max(0.0, dot(worldNormal, lightDirection));
       
        v_color = a_color;
        v_brightness = diffuse + ambient;

        // gl_Position is a special variable a vertex shader is responsible for setting
        gl_Position =  mvpMatrix * vec4(a_position, 1);
    }

    `

    // Fragment Shader
    const fragmentShaderSourceCode =
    `

    // set precision
    precision mediump float;

    varying vec4 v_color;
    varying float v_brightness;
   
    void main() {
        //vec4 texel = texture2d(textureID, vUV);
        //texel.xyz * v_brightness;
        vec4 pixel = v_color;
        pixel.xyz *= v_brightness;

        // gl_FragColor is a special variable a fragment shader is responsible for setting
        gl_FragColor = pixel;
    }
   
    `
    // create program
    const program = myWebGL.createProgramFromSource(gl, vertexShaderSourceCode, fragmentShaderSourceCode);

    /**
     * *********************************************
     *             ---=    Data     =---
     * *********************************************
     */
    
    // F|Ba|T|Bo|R|L
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

    let colorDataGrey = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    { colorDataGrey = colorDataGrey.concat(faceColors[0]); }

    let colorDataRed = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    { colorDataRed = colorDataRed.concat(faceColors[1]); }

    let colorDataGreen = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    { colorDataGreen = colorDataGreen.concat(faceColors[2]); }

    let colorDataBlue = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    { colorDataBlue = colorDataBlue.concat(faceColors[3]); }

    let colorDataPurple = [];
    for (let i = 0; i < faceColors.length*4; ++i)
    { colorDataPurple = colorDataPurple.concat(faceColors[5]); }
    
    const indices = myWebGLData.indexCube01;

    // F|Ba|T|Bo|R|L
    const faceNormals = [
        [ 0, 0, 1],    // Front face: +Z
        [ 0, 0,-1],    // Back face: -Z
        [ 0, 1, 0],    // Top face: +Y
        [ 0,-1, 0],    // Bottom face: -Y
        [ 1, 0, 0],    // Right face: +X
        [-1, 0, 0],    // Left face: -X
    ];
    let normalData = [];
    // F|Ba|T|Bo|R|L
    for (var j = 0; j < faceNormals.length*4; ++j)
    {
        const c = faceNormals[j];

        // Repeat each normal vector four times for the four vertices of the face
        normalData = normalData.concat(c, c, c, c);
    }

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
        a_normal: gl.getAttribLocation(program, "a_normal"),
    };
    // holds buffers
    let attribBuffers =
    {
        positionCube: gl.createBuffer(),

        color0: gl.createBuffer(),
        colorGrey: gl.createBuffer(),
        colorRed: gl.createBuffer(),
        colorGreen: gl.createBuffer(),
        colorBlue: gl.createBuffer(),
        colorPurple: gl.createBuffer(),

        normalCube: gl.createBuffer(),
    };


    // position buffers
    myWebGL.setupAttribBuffer(gl, attribBuffers.positionCube, myWebGLData.vertexCube01, gl.STATIC_DRAW);
    
    // color buffers
    myWebGL.setupAttribBuffer(gl, attribBuffers.color0, colorData, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorGrey, colorDataGrey, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorRed, colorDataRed, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorGreen, colorDataGreen, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorBlue, colorDataBlue, gl.STATIC_DRAW);
    myWebGL.setupAttribBuffer(gl, attribBuffers.colorPurple, colorDataPurple, gl.STATIC_DRAW);

    // normal buff
    myWebGL.setupAttribBuffer(gl, attribBuffers.normalCube, normalData, gl.STATIC_DRAW);

    // index buffer
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
    const bodyScale = mat4.create();
    let finalMatrix = mat4.create();

    // code: translate->scale->rotate
    // actually performed: rotate->scale->translate

    // transformations are done in reverse order of code
    mat4.translate(myMatrix, myMatrix, [0,0,-1]);
    const scaleFactor = 0.15;
    mat4.scale(myMatrix, myMatrix, [scaleFactor, scaleFactor, scaleFactor]);

    const bodyWidth = 2;
    const bodyHeight = 3;
    mat4.scale(bodyScale, bodyScale, [bodyWidth, bodyHeight, 1]);

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
    mat4.translate(viewMatrix, viewMatrix, [-1, 1.5, 0.5]);
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
        u_viewMatrix: gl.getUniformLocation(program, "u_viewMatrix"),
        
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

        // normals
        myWebGL.attribEnableBind(gl, attribs.a_normal, attribBuffers.normalCube);
        myWebGL.vertexAttribPointerV(gl, attribs.a_normal, attribSettings);

        // color
        myWebGL.attribEnableBind(gl, attribs.a_color, attribBuffers.color0);
        myWebGL.vertexAttribPointerC(gl, attribs.a_color, attribSettings);

        // center (body)
        mat4.multiply(finalMatrix, bodyScale, myMatrix);
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // head
        mat4.translate(finalMatrix, mat4.create(), [ 0, bodyHeight*3/2, 0]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // neck
        mat4.translate(finalMatrix, mat4.create(), [ 0, bodyHeight, 0]);
        mat4.scale(finalMatrix, finalMatrix, [0.75,0.75,0.75]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // left shoulder (right from Robot POV)
        mat4.translate(finalMatrix, mat4.create(), [-(bodyWidth + 1.1), (bodyHeight*2/3), 0]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // right shoulder (left from Robot POV)
        mat4.translate(finalMatrix, mat4.create(), [ (bodyWidth + 1.1), (bodyHeight*2/3), 0]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // left leg (right from Robot POV)
        mat4.translate(finalMatrix, mat4.create(), [ -1, -bodyHeight*1.8, 0]);
        mat4.scale(finalMatrix, finalMatrix, [0.80, 0.80, 0.80]);
        mat4.scale(finalMatrix, finalMatrix, [1, bodyHeight, 1]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // right leg (left from Robot POV)
        mat4.translate(finalMatrix, mat4.create(), [ 1, -bodyHeight*1.8, 0]);
        mat4.scale(finalMatrix, finalMatrix, [0.80, 0.80, 0.80]);
        mat4.scale(finalMatrix, finalMatrix, [1, bodyHeight, 1]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);
        
        // left arm (right from Robot POV)
        mat4.translate(finalMatrix, mat4.create(), [-(bodyWidth + 1.1), 0, 0]);
        mat4.scale(finalMatrix, finalMatrix, [0.75, 0.75, 0.75]);
        mat4.scale(finalMatrix, finalMatrix, [1, bodyHeight, 1]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);

        // right arm (left from Robot POV)
        mat4.translate(finalMatrix, mat4.create(), [ (bodyWidth + 1.1), 0, 0]);
        mat4.scale(finalMatrix, finalMatrix, [0.75, 0.75, 0.75]);
        mat4.scale(finalMatrix, finalMatrix, [1, bodyHeight, 1]);
        mat4.multiply(finalMatrix, myMatrix, finalMatrix); //scale down
        gl.uniformMatrix4fv(uniformLocations.u_modelMatrix, false, finalMatrix);

        myWebGL.drawElements(gl, attribSettings);
        
    };
}
