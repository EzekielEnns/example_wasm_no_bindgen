//https://www.khronos.org/files/webgl20-reference-guide.pdf
//https://webgl2fundamentals.org/webgl/lessons/webgl-image-processing.html
import { FONTINFO,VERTEXSHADER,FRAGMENTSHADER } from "./globals";

const canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;
const gl = canvas?.getContext("webgl2");
var pg:WebGLProgram | null
var a_pos:GLint, u_color:GLint, u_texture: GLint 
var pos_buf:WebGLBuffer | null
var text_coor_buff:WebGLBuffer | null


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
    a_pos = gl.getAttribLocation(pg,'a_pos'); //set at render time
    //https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html

    u_color = gl.getAttribLocation(pg,'u_color');
    u_texture = gl.getAttribLocation(pg,'u_texture'); //set at render time
    if (u_color < 0 || a_pos < 0 || u_texture < 0 ) {throw new Error("no attrs")}

    //textures
    let glyphTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,glyphTex)
    //fill texture with 1x1 blue pixel
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
    //load img
    var image = new Image();
    image.src = "font.png"
    image.addEventListener('load',function(){
        //loading image data into gl
        gl.bindTexture(gl.TEXTURE_2D, glyphTex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    })
    //https://github.com/gfxfundamentals/webgl-fundamentals/blob/cb23af068f6e9cb1e48c7bc4ad2b39c10204aedb/webgl/webgl-text-glyphs.html#L145
    //create bufs for pos
    pos_buf = gl.createBuffer();
    text_coor_buff = gl.createBuffer();
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
    gl.enableVertexAttribArray(a_pos) 
    
    //setting up how to read buffer
    //https://github.com/sessamekesh/webgl-tutorials-2023/blob/ed68584cc4177ec9bd93da4f7cdf07653eb8924b/src/01-hello-triangle/hello-triangle.js#L155
    const test = makeVerticesForString("hello world")
    //update buffers 
    gl.bindBuffer(gl.ARRAY_BUFFER, pos_buf)
    gl.bufferData(gl.ARRAY_BUFFER, test.arrays.position,gl.DYNAMIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, text_coor_buff)
    gl.bufferData(gl.ARRAY_BUFFER, test.arrays.texcoord,gl.DYNAMIC_DRAW)
    
    let desiredTextScale = -1 /gl.canvas.height;
    var scale  = 1 * desiredTextScale
    
    gl.drawArrays(gl.TRIANGLES,0,test.numVertices)


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


function makeVerticesForString(s:string) {
  var len = s.length;
  var numVertices = len * 6;
  var positions = new Float32Array(numVertices * 2);
  var texcoords = new Float32Array(numVertices * 2);
  var offset = 0;
  var x = 0;
  var maxX = FONTINFO.textureWidth;
  var maxY = FONTINFO.textureHeight;
  for (var ii = 0; ii < len; ++ii) {
    var letter = s[ii];
    //@ts-ignore
    var glyphInfo = FONTINFO.glyphInfos[letter];
    if (glyphInfo) {
      var x2 = x + glyphInfo.width;
      var u1 = glyphInfo.x / maxX;
      var v1 = (glyphInfo.y + FONTINFO.letterHeight - 1) / maxY;
      var u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX;
      var v2 = glyphInfo.y / maxY;

      // 6 vertices per letter
      positions[offset + 0] = x;
      positions[offset + 1] = 0;
      texcoords[offset + 0] = u1;
      texcoords[offset + 1] = v1;

      positions[offset + 2] = x2;
      positions[offset + 3] = 0;
      texcoords[offset + 2] = u2;
      texcoords[offset + 3] = v1;

      positions[offset + 4] = x;
      positions[offset + 5] = FONTINFO.letterHeight;
      texcoords[offset + 4] = u1;
      texcoords[offset + 5] = v2;

      positions[offset + 6] = x;
      positions[offset + 7] = FONTINFO.letterHeight;
      texcoords[offset + 6] = u1;
      texcoords[offset + 7] = v2;

      positions[offset + 8] = x2;
      positions[offset + 9] = 0;
      texcoords[offset + 8] = u2;
      texcoords[offset + 9] = v1;

      positions[offset + 10] = x2;
      positions[offset + 11] = FONTINFO.letterHeight;
      texcoords[offset + 10] = u2;
      texcoords[offset + 11] = v2;

      x += glyphInfo.width + FONTINFO.spacing;
      offset += 12;
    } else {
      // we don't have this character so just advance
      x += FONTINFO.spaceWidth;
    }
  } 
  // return ArrayBufferViews for the portion of the TypedArrays
  // that were actually used.
  return {
    arrays: {
      position: new Float32Array(positions.buffer, 0, offset),
      texcoord: new Float32Array(texcoords.buffer, 0, offset),
    },
    numVertices: offset / 2,
  };
}
