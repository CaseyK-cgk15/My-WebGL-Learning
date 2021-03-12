/**
 * @fileoverview Template file to setup webgl
 *
 */

/*
 *************************************************************
 *       (CODE SECTION HEADER)
 *       (code section description)
 *************************************************************
 */

var gl;

window.onload = function init() {
    /*
    *************************************************************
    *       PRELIMINARY WEBGL CODE SECTION
    *       setup webgl
    *************************************************************
    */

    // WebGL Canvas Code (sets up gl object)
    var canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl');

    // throw error if WebGL not supported
    if (!gl) 
    {
        throw new Error('WebGL not supported');
        // Alternate Option instead of throwing error
        // alert( "WebGL isn't available" );
    }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    /*
    *************************************************************
    *       DATA + BUFFER CODE SECTION
    *       create vertex data, create buffer,
    *       load vertex data into buffer
    *************************************************************
    */

    // Create JS array of vertex data
    // (last comma optional)
    var vertexData = [
        0, 1, 0,
        1, -1, 0,
        -1, -1, 0,
    ];

    // create buffer
    var buffer = gl.createBuffer();

    // load vertex data into buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // new Float32Array() does same thing as flatten()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    /*
    *************************************************************
    *       SHADERS + PROGRAM CODE SECTION
    *       create vertex shader, create fragment shader
    *       create program, attach shaders to program
    *       enable vertex attributes
    *       tell webgl which program to use
    *************************************************************
    */

    // Create Vertex Shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    // gl.shaderSource(vertexShader, ``);
    gl.shaderSource(vertexShader, `
    // Inside this JS string is GLSL code

    // Attribute list
    attribute vec3 position;

    void main() 
    {
        // gobal variable output of vertex shader
        gl_Position = vec4(position, 1);
    }
    `);
    gl.compileShader(vertexShader);

    // Create Fragment Shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // gl.shaderSource(fragmentShader, ``);
    gl.shaderSource(fragmentShader, `
    // Inside this JS string is GLSL code

    void main() 
    {
        // gl_FragColor is output of fragment shader
        gl_FragColor = vec4(1, 0, 0, 1); //rgba vec
    }
    `);
    gl.compileShader(fragmentShader);

    // Create Program
    const program = gl.createProgram();

    // Attach Shaders to Program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Enable Vertex Attributes
    // get location of an attribute
    var positionLocation = gl.getAttribLocation(program, `position`);
    // enable attribute located at that location
    gl.enableVertexAttribArray(positionLocation);
    // how to retrieve attribute data from current buffer
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Tell WebGL Which Program to Use
    // (creates executable program on GPU)
    gl.useProgram(program); 

    // Render Function (Part of Next Code Section)
    render();
};

/*
 *************************************************************
 *       RENDER FUNCTION CODE SECTION
 *       clear and draw image
 *************************************************************
 */
function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
