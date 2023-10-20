import { FONTINFO,VERTEXSHADER,FRAGMENTSHADER } from "./globals";

const canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;
const gl = canvas?.getContext("webgl2");
var pg:WebGLProgram | null
var u_matrix:GLint, u_color:GLint, u_texture: GLint 


function init() { 
    if (!canvas || !gl) {throw new Error("no context")}
    //set up shaders 
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    
    if(!vs || !fs) {throw new Error("no shaders")}
    gl.shaderSource(vs,VERTEXSHADER)
    gl.shaderSource(fs,FRAGMENTSHADER)

    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs,gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vs))
    }
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs,gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fs))
    }

    pg = gl.createProgram();
    if(!pg) {throw new Error("no program")}
    gl.attachShader(pg,vs)
    gl.attachShader(pg,fs)
    gl.linkProgram(pg)
    if(!gl.getProgramParameter(pg, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(pg))
    }

    //get refs to gl uniforms
    //sampler2D, u_matrix, u_color
    u_matrix = gl.getAttribLocation(pg,'u_matrix');
    u_color = gl.getAttribLocation(pg,'u_color');
    u_texture = gl.getAttribLocation(pg,'u_texture');
    if (u_color < 0 || u_matrix < 0 || u_texture < 0 ) {throw new Error("no attrs")}

    //setup texture for each character TODO get more then 40 chars
    //https://github.com/gfxfundamentals/webgl-fundamentals/blob/cb23af068f6e9cb1e48c7bc4ad2b39c10204aedb/webgl/webgl-text-glyphs.html#L145
}

function render() {
    if (!canvas || !gl || !pg) { return; }

    //merging our output with our screen
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    //need to do this since when you change screen wgl just resets this
    gl.clearColor(0.08,0.08,0.08,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    // rassterizer - which pixels are part of our rendering here we use the whole screen
    gl.viewport(0,0,canvas.width,canvas.height) 
    //enable and select which programs to use 
    gl.useProgram(pg)
    gl.enableVertexAttribArray(u_color) 
    gl.enableVertexAttribArray(u_texture) 
    gl.enableVertexAttribArray(u_matrix) 
    
    //setting up how to read buffer
    //https://github.com/sessamekesh/webgl-tutorials-2023/blob/ed68584cc4177ec9bd93da4f7cdf07653eb8924b/src/01-hello-triangle/hello-triangle.js#L155

    // draw_elements
}

function renderChar(c:number,pos:{x:number,y:number}) {
    //https://github.com/gfxfundamentals/webgl-fundamentals/blob/cb23af068f6e9cb1e48c7bc4ad2b39c10204aedb/webgl/webgl-text-glyphs.html#L298
    //fyi code above is ittering through each name
    //
    //normalize screen coor to view space/clip space coor (note proj and view space are diff)
    //scale and translate the resultng matrix to spot 

    //set uniforms/shared data 
        //u_matrix to matix
        //u_texture to gl.texture
    //fyi u_color is set in obj
    //https://github.com/gfxfundamentals/webgl-fundamentals/blob/cb23af068f6e9cb1e48c7bc4ad2b39c10204aedb/webgl/webgl-text-glyphs.html#L198
}
