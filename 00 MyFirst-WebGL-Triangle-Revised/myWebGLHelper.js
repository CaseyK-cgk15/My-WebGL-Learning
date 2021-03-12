// myWebGLHelper.js
// gl = WebGLRenderingContext object

// createShader()
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
