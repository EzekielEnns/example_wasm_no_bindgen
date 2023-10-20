//https://www.adammarcwilliams.co.uk/creating-bitmap-text-pixi/

interface Wasm {
  add(a: number, b: number): number;
  plyMove(l: number, d: number, u: number, r: number): number;
  tick(): number;
  get_height(): number;
  get_width(): number;
  memory: WebAssembly.Memory;
}
var cvs = document.getElementById("test");
fetch("./build/wasm32-unknown-unknown/debug/logic.wasm ")
  .then((res) => res.arrayBuffer())
  .then((bytees) => WebAssembly.instantiate(bytees, {}))
  .then((model) => {
    //Read:: https://radu-matei.com/blog/practical-guide-to-wasm-memory/
    const sim: Wasm = model.instance.exports as any;
    window.addEventListener("keydown", (e) => {
      console.log(e.key);
      if (e.key == "k") {
          sim.plyMove(0,0,1,0)
      }
      if (e.key == "j") {
          sim.plyMove(0,1,0,0)
      }
      if (e.key == "h") {
          sim.plyMove(1,0,0,0)
      }
      if (e.key == "l") {
          sim.plyMove(0,0,0,1)
      }
    });
    const w = sim.get_width();
    const h = sim.get_height();
    const getIndex = (x: number, y: number) => {
      return x * w + y;
    };
    const renderLoop = () => {
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
      if (cvs) {
        cvs.textContent = out;
      }
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  });
