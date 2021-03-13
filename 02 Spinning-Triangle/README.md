# Spinning Triangle
This example takes the previous multi-colored triangle and makes it smaller and spinning.

This example is useful for learning **basic transformations** (translate, rotate, scale), the basics of **working with matricies**, and the basics of **animation**.

[glMatrix](https://glmatrix.net/), a Matrix/Vector library, was added to make working with matricies easier.
All of it's functions are in the glMatrix namespace, the top of spinningTriangle.js has a declaration for mat4 which is like the "using" statement in C++.

A basic border was added with CSS to make the canvas window edges visable.

The GLSL Shader source code was moved from HTML script tags into string variables in spinningTriangle.js

## Steps to take
- download glMatrix library, add the file to your folder and make sure to load it in HTML
- the `const mat4` at the top allows us to use `mat4` instead of `glMatrix.mat4`, just like a C++ "using" statement
- a uniform variable for the matrix must be added to the Vertex Shader GLSL Source code
- the matricies are applied by multiplying them by the position in the Vertex Shader GLSL Source code
- **!!IMPORTANT!!** - **order of matrix multiplcation matters**, GLSL allows you to multiply matricies with the multiplication operator, however, if multiplying in javascript then you must use a function since JS operators can't be overloaded.
- create JS matrix and then perform one-time (not animated) transformations before `render()` function
- **!!IMPORTANT!!** - transformations are just applying matrix multiplication and thus **order matters**. The order they are performed is the reverse of what they're listed in the code. Suggested to do translation last (first in code).
- inside render function add `requestAnimationFrame(render);` for animation ("render" is name of the function)
- before `gl.drawArrays()` inside `render()`, get the matrix locations, in this case `uniformLocations` is an object that can store multiple uniform locations


## Files
- SpinningTriangle.html - Basic HTML file
- main.css - Basic CSS file for canvas border
- spinningTriangle.js - JavaScript WebGL program
- myWebGLHelper.js - functions to handle creating shaders and program (given source code)
- gl-matrix.js - a Matrix and Vector library from [glMatrix](https://glmatrix.net/)
