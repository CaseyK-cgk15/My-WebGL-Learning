# Multicolor 3D Box
**!! NOTE !!: myWebGLHelper was updated with this example**

In this example, we go to 3D, mainly just by adding more verticies to make a cube, and then rotating to see the object from a view that makes it noticable as 3D.
The new important new information learned in this is how to use draw elements instead of draw arrays, so that less verticies need to be specified in vertex data.
This example also contains a little bit about using rgba vectors instead of rgb vectors.

[glMatrix](https://glmatrix.net/), a Matrix/Vector library, is included to make working with matricies easier.
All of it's functions are in the glMatrix namespace, the top of main.js has a declaration for mat4 which is like the "using" statement in C++.

## The Jump from 2D to 3D
In this example we go to 3D, however, concepts of a camera aren't introduced and nothing fundamentally new is introduced.
This example just takes the previous example, adds more triangles/verticies with depth, and rotates the object so we can see that it's 3D.
Technically, the only new thing is `gl.enable(gl.DEPTH_TEST);` which is added right before we draw arrays.
However, to make life easier for drawing objects with multiple triangles, this example also introduces using draw elements instead of draw arrays.

## From draw arrays to draw elements
When using draw arrays, the each of the verticies for a given triangle need to be specificed, even if the triangle has overlapping verticies with another.
One solution is to use functions and other methods to create the array for us with specifying less of the numbers.

However, there is a simpler option that is built-in and that's draw elements. In this example, the vertexData stores verticies for each square face of a cube instead of triangles, that's 2 less verticies per square face, which means specifying 24 verticies instead of 36.

To do this, we add another array of data, just like the vertex data or color data, but this one is for indicies. This array is basically used to index the vertexData in a way that results in triangles.

**!!IMPORTANT!!** - the number of vectors in the color data must match the vertex data. That means that color data will also have 24 color vectors. In this example, the color data was automatically filled, and every 4 verticies were set to the same color, meaning that each face of the cube would have one solid color.

In order to do this, we need to do the following:
- make an array of index data
- create, bind, and load data into another buffer for indicies
- **!!IMPORTANT!!** this buffer is different because we must specify `gl.ELEMENT_ARRAY_BUFFER` instead of `gl.ARRAY_BUFFER` and `new Uint16Array(X)` instead of `new Float32Array(X)`
- we must run the same bind function later in our render function, just like the other binds
- finally `gl.drawArrays(X, Y, Z);` get changed to `gl.drawElements(X, Y, gl.UNSIGNED_SHORT, Z);`

## Change Color from vec3(RGB) to vec4(RGBA)
this example makes a vec4 instead of vec3 inside the JS code (i.e. rgba vector instead of rgb), which is different than the previous example.

in order to make use of this properly, a number of things bust be changed

- attribute `color` in the vertex shader code must change vec3 -> vec4
- varying `vColor` in the vertex AND fragment shader must change vec3 -> vec4
- inside fragment shader `gl_FragColor = vec4(vColor, 1);` must change to `gl_FragColor = vColor;`
- colorData must be made up of vec4's instead of vec3's
- the size in `gl.vertexAttribPointer(colorAttribLocation,...` must change from 3 to 4 (reading 4 array elements at a time for a vec4)


## Files
- Multicolor3DBox.html - Basic HTML file
- main.css - Basic CSS file for canvas border
- main.js - JavaScript WebGL program
- myWebGLHelper.js - functions to handle creating shaders and program (given source code), along with other various utilities
- gl-matrix.js - a Matrix and Vector library from [glMatrix](https://glmatrix.net/)
