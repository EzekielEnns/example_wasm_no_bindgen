//must be kept in sync with lib.rs
import * as THREE from "three";
interface Wasm {
  add(a: number, b: number): number;
  plyMove(l: number, d: number, u: number, r: number): number;
  tick(): number;
  get_height(): number;
  get_width(): number;
  memory: WebAssembly.Memory;
}
//TODO
//https://codesandbox.io/s/css-tricks-text-as-canvas-texture-6q6o7?from-embed=&file=/src/Text.js
//https://css-tricks.com/techniques-for-rendering-text-with-webgl/
fetch("./build/wasm32-unknown-unknown/debug/logic.wasm ")
  .then((res) => res.arrayBuffer())
  .then((bytees) => WebAssembly.instantiate(bytees, {}))
  .then((model) => {
    //Read:: https://radu-matei.com/blog/practical-guide-to-wasm-memory/
    const sim: Wasm = model.instance.exports as any;
    const w = sim.get_width();
    const h = sim.get_height();
    const getIndex = (x: number, y: number) => {
      return x * w + y;
    };
    //let aniId;
    // const renderLoop = () => {
    //   const ptr = sim.tick();
    //   const arr = new Uint8Array(sim.memory.buffer, ptr, 10 * 10);
    //   aniId = requestAnimationFrame(renderLoop);
    // };
    // renderLoop();
  });
