//https://www.adammarcwilliams.co.uk/creating-bitmap-text-pixi/

interface Wasm {
  add(a: number, b: number): number;
  plyMove(l: number, d: number, u: number, r: number): number;
  tick(): number;
  get_height(): number;
  get_width(): number;
  memory: WebAssembly.Memory;
}

var kill = document.getElementById("test")
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
        
       const ptr = sim.tick();
       const arr = new Uint8Array(sim.memory.buffer, ptr, 10 * 10);
       //TODO do this is a some kind of animation loop
       let out = "";
       for (let j = 0; j < h; j++) {
         for (let i = 0; i < w; i++) {
           out += " " + String.fromCharCode(arr[getIndex(j, i)]) + " ";
         }
         out += "\n";
       }
       if (kill) {
           kill.textContent = out
       }
  });
