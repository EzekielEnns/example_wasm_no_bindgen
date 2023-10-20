export const WIDTH = 10;
export const height = 10;
export const VERTEXSHADER =`#version 300 es
    //lowp
    precision mediump float;
    in vec4 a_pos; //postion of vert
    attribute vec2 a_textCoor; //coordinate of text 
    
    //uniform mat4 u_matrix; //used for postion of glyph
    out vec4 v_textCoor;     //glyph coor

    void main() {
        //multiply postion by the matrix 
        gl_Position = a_pos;
        //Pass coor
        v_textCoor = a_textCoor;
    }

`;
export const FRAGMENTSHADER =`#version 300 es
    precision mediump float;
    in vec2 v_textCoor; //from vert
    
    //set by js, sampler2D is a type
    uniform sampler2D u_texture;
    //uniform vec4 u_color;
    

    void main() {
        //https://thebookofshaders.com/glossary/?search=texture2D
        //getting color from texture at current coor/pixel
        gl_FragColor = texture2D(u_texture, v_textCoor); // * u_color;
    }
`;
//https://opengameart.org/content/8x8-font-chomps-wacky-worlds-beta
export const FONTINFO = {
  letterHeight: 8,
  spaceWidth: 8,
  spacing: -1,
  textureWidth: 64,
  textureHeight: 40,
  glyphInfos: {
    a: { x: 0, y: 0, width: 8 },
    b: { x: 8, y: 0, width: 8 },
    c: { x: 16, y: 0, width: 8 },
    d: { x: 24, y: 0, width: 8 },
    e: { x: 32, y: 0, width: 8 },
    f: { x: 40, y: 0, width: 8 },
    g: { x: 48, y: 0, width: 8 },
    h: { x: 56, y: 0, width: 8 },
    i: { x: 0, y: 8, width: 8 },
    j: { x: 8, y: 8, width: 8 },
    k: { x: 16, y: 8, width: 8 },
    l: { x: 24, y: 8, width: 8 },
    m: { x: 32, y: 8, width: 8 },
    n: { x: 40, y: 8, width: 8 },
    o: { x: 48, y: 8, width: 8 },
    p: { x: 56, y: 8, width: 8 },
    q: { x: 0, y: 16, width: 8 },
    r: { x: 8, y: 16, width: 8 },
    s: { x: 16, y: 16, width: 8 },
    t: { x: 24, y: 16, width: 8 },
    u: { x: 32, y: 16, width: 8 },
    v: { x: 40, y: 16, width: 8 },
    w: { x: 48, y: 16, width: 8 },
    x: { x: 56, y: 16, width: 8 },
    y: { x: 0, y: 24, width: 8 },
    z: { x: 8, y: 24, width: 8 },
    "0": { x: 16, y: 24, width: 8 },
    "1": { x: 24, y: 24, width: 8 },
    "2": { x: 32, y: 24, width: 8 },
    "3": { x: 40, y: 24, width: 8 },
    "4": { x: 48, y: 24, width: 8 },
    "5": { x: 56, y: 24, width: 8 },
    "6": { x: 0, y: 32, width: 8 },
    "7": { x: 8, y: 32, width: 8 },
    "8": { x: 16, y: 32, width: 8 },
    "9": { x: 24, y: 32, width: 8 },
    "-": { x: 32, y: 32, width: 8 },
    "*": { x: 40, y: 32, width: 8 },
    "!": { x: 48, y: 32, width: 8 },
    "?": { x: 56, y: 32, width: 8 },
  },
};
