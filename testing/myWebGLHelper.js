// myWebGLHelper.js
// version 2.1.0
// author Casey Koepp
// gl = WebGLRenderingContext object

const myWebGL = 
{

    // Setup WebGLRenderingContext (gl)
    glSetup: function(canvas) 
    {
        // do "document.querySelector('canvas')" for canvas argument

        let gl = canvas.getContext('webgl');
        // throw error if WebGL not supported
        if (!gl) 
        {
            alert( "WebGL isn't available" );
        }

        return gl;
    },
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
    createShader: function(gl, type, source) 
    {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) 
        {
          return shader;
        }
       
        if (type == gl.VERTEX_SHADER)
        { alert( "Failed to Create Vertex Shader" ); }
        else if ( type == gl.FRAGMENT_SHADER)
        { alert( "Failed to Create Fragment Shader" ); }
        else
        { alert( "Failed to Create Unknown Shader" ); }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    },

    // createProgram()
    // creates WebGL program from vertexShader and fragmentShader
    // gl is WebGLRenderingContext object
    createProgram: function(gl, vertexShader, fragmentShader)
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
    },

    // createProgramFromSource()
    // runs createShader() and createProgram() and returns program
    // gl is WebGLRenderingContext object
    createProgramFromSource: function(gl, vertexSourceCode, fragmentSourceCode)
    {
        const vertexShader = myWebGL.createShader(gl, gl.VERTEX_SHADER, vertexSourceCode);
        const fragmentShader = myWebGL.createShader(gl, gl.FRAGMENT_SHADER, fragmentSourceCode);
        const program = myWebGL.createProgram(gl, vertexShader, fragmentShader);
    
        return program;
    },

//-------------

    // setupAttribBuffer()
    // binds buffer, loads buffer data
    setupAttribBuffer: function(gl, buffer, bufferData, drawOption)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), drawOption);
    },

    // attribEnableBind()
    // enables attrib location given
    // binds buffer given
    attribEnableBind: function(gl, attributeLocationToEnable, bufferToBind)
    {
        // Enable Attributes
        gl.enableVertexAttribArray(attributeLocationToEnable);
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferToBind);
    },

    // run gl.vertexAttribPointer() with attribSettings object
    // V = vertex (uses vSize)
    vertexAttribPointerV: function(gl, attribute, attribSettings)
    {
        //gl.vertexAttribPointer(attribs.a_position, 
        //    vSize, type, normalize, stride, offset);

        gl.vertexAttribPointer(
            attribute, 
            attribSettings.vSize,
            attribSettings.type,
            attribSettings.normalize,
            attribSettings.stride,
            attribSettings.offset);
    },

    // run gl.vertexAttribPointer() with attribSettings object
    // C = color (uses cSize)
    vertexAttribPointerC: function(gl, attribute, attribSettings)
    {
        gl.vertexAttribPointer(
            attribute, 
            attribSettings.cSize,
            attribSettings.type,
            attribSettings.normalize,
            attribSettings.stride,
            attribSettings.offset);
    },

    // run gl.drawElements() with attribSettings object
    drawElements: function(gl, attribSettings)
    {
        //gl.drawElements(primitiveType, count, indexType, drawOffset);

        gl.drawElements(
            attribSettings.primitiveType,
            attribSettings.count,
            attribSettings.indexType,
            attribSettings.indexOffset);
    },

/**
 * *********************************************
 *          ---=    Misc.    =---
 * *********************************************
 */
    
    // randArr3()
    // returns array of 3 elements with random values
    randArr3: () =>
    {
        return [Math.random(), Math.random(), Math.random()];
    },
} // end namespace/object

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