// myWebGLHelper.js
// version 1.1
// author Casey Koepp
// gl = WebGLRenderingContext object

/**
 * *********************************************
 * ---= Shaders & WebGL Program =---
 * *********************************************
 */

// createShader()
// creates vertex or fragment shaders given gl and source code
// gl is WebGLRenderingContext object
// type is gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
// source is source code in form of a string
function myWebGLHelper_createShader(gl, type, source)
{
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) 
    {
      return shader;
    }
   
    alert( "Failed to Create Shader" );
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
};

// createProgram()
// creates WebGL program from vertexShader and fragmentShader
// gl is WebGLRenderingContext object
function myWebGLHelper_createProgram(gl, vertexShader, fragmentShader)
{
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) 
    {
      return program;
    }
   
    alert( "Failed to Create Program" );
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
};

// createProgramFromSource()
// runs createShader() and createProgram() and returns program
// gl is WebGLRenderingContext object
function myWebGLHelper_createProgramFromSource(gl, vertexSourceCode, fragmentSourceCode)
{
    const vertexShader = myWebGLHelper_createShader(gl, gl.VERTEX_SHADER, vertexSourceCode);
    const fragmentShader = myWebGLHelper_createShader(gl, gl.FRAGMENT_SHADER, fragmentSourceCode);
    const program = myWebGLHelper_createProgram(gl, vertexShader, fragmentShader);

    return program;
};

/**
 * *********************************************
 *          ---=    Misc.    =---
 * *********************************************
 */

// randArr3()
// returns array of 3 elements with random values
function myWebGLHelper_randArr3() 
{ return [Math.random(), Math.random(), Math.random()]; }

// creates array of 6 vertices to make 2 triangles that make a square
// creates square face in the XY plane
function myWebGLHelper_squareXY(side)
{
    return [
        // bottom left triangle
        -side, side, 0,
        side, -side, 0,
        -side, -side, 0,

        // top right triangle
        -side, side, 0,
        side, -side, 0,
        side, side, 0,
    ];
}

// array of vertices that form triangles that form a cube that spans -1 to 1
const myWebGLHelper_cubeVertexData = [
    -1.0,-1.0,-1.0, -1.0,-1.0, 1.0, -1.0, 1.0, 1.0, //1
    1.0, 1.0,-1.0, -1.0,-1.0,-1.0, -1.0, 1.0,-1.0, //2
    1.0,-1.0, 1.0, -1.0,-1.0,-1.0, 1.0,-1.0,-1.0, //3
    1.0, 1.0,-1.0, 1.0,-1.0,-1.0, -1.0,-1.0,-1.0, //4
    -1.0,-1.0,-1.0, -1.0, 1.0, 1.0, -1.0, 1.0,-1.0, //5
    1.0,-1.0, 1.0, -1.0,-1.0, 1.0, -1.0,-1.0,-1.0, //6
    -1.0, 1.0, 1.0, -1.0,-1.0, 1.0, 1.0,-1.0, 1.0, //7
    1.0, 1.0, 1.0, 1.0,-1.0,-1.0, 1.0, 1.0,-1.0, //8 
    1.0,-1.0,-1.0, 1.0, 1.0, 1.0, 1.0,-1.0, 1.0, //9
    1.0, 1.0, 1.0, 1.0, 1.0,-1.0, -1.0, 1.0,-1.0, //10
    1.0, 1.0, 1.0, -1.0, 1.0,-1.0, -1.0, 1.0, 1.0, //11
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0,-1.0, 1.0 //12
];