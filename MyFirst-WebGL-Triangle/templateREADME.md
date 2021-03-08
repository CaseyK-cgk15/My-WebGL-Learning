# Template
Hello, I made this template as a basic setup, it was thrown together relatively quickly while I was learning WebGL.
The code was based off two different instructions for the same task (drawing a basic red triangle),
so the code I made has some elements copied from both. The examples I followed are:
[Class Triangle Example](http://www.cs.uakron.edu/~xiao/graphics/Triangle1.zip),
[Learn WebGL Youtube Tutorial Playlist](https://youtube.com/playlist?list=PL2935W76vRNHFpPUuqmLoGCzwx_8eq5yK).
If following the youtube playlist, this file was made by following the first 3 videos, not including the node.js instructions. DISCLAIMER: I do not know WebGL, the purpose of this is to help assist other students with the same learning of WebGL that I am doing.

## Files
This template should include this readme + 2 other files: template.html, and template.js

# Extra Helpful Notes
## Graphics Pipeline
WebGL works like this: data (ex. vertex positions) is stored in JS arrays, this is still on the CPU.
###
In order to send data to the GPU, it must be sent to the buffer (which is part of the GPU). JS Arrays are different than C-Style arrays and need to be "flattened" before sending (converted to Float32 arrays).
###
Vertex and Fragment Shaders are part of the program that runs on the GPU.
###
(TODO: add more info)

## Some Function Info
When writing the vertex and fragment shaders, all the GLSL code is in a JS string.
###
Vertex Shader contains attributes and global position variable. Fragment Shader contains global color variable.
###
gl.vertexAttribPointer() - parameters in order are: (1)attribute position, (2)number of values to read at one time (3 for 3D position), (3)gl.FLOAT is a type of data to read, (4)bool option for "normalized" feature which optimizes more advanced things, (5,6)last 2 numbers are stride and offset
###
gl.drawArrays() - parameters in order are: (1)OpenGL primitive type (ex. gl.TRIANGLES), (2)string position, (3)number of *vertices*

## Unorganized/Misc. Notes
The 2 shaders must be linked to a program.
###
"vec3" is a vector of 3 components i.e. (x, y, z), "vec2" is 2 components i.e. (x, y), "vec4" is 4 components.
###
RGBA values are on a scale of 0 to 1. Position values are on a scale of -1 to 1.
