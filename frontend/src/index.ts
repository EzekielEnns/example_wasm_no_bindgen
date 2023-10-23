//https://www.adammarcwilliams.co.uk/creating-bitmap-text-pixi/

interface Wasm {
  plyMove(a:number): number;
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
      let mv = 0b00000000;
      if (e.key == "h") {
          mv |= 0b10000000;
      }
      if (e.key == "j") {
          mv |= 0b01000000;
      }
      if (e.key == "k") {
          mv |= 0b00100000;
      }
      if (e.key == "l") {
          mv |= 0b00010000;
      }
      sim.plyMove(mv)
    });
    window.addEventListener("keyup", (e) => {
      console.log(e.key);
      let mv = 0b00000000;
      if (e.key == "h") {
          mv &= 0b01110000;
      }
      if (e.key == "j") {
          mv &= 0b10110000;
      }
      if (e.key == "k") {
          mv &= 0b11010000;
      }
      if (e.key == "l") {
          mv &= 0b11100000;
      }
      sim.plyMove(mv)
    });
    const w = sim.get_width();
    const h = sim.get_height();
    const getIndex = (x: number, y: number) => {
      return x * w + y;
    };
    const renderLoop = () => {
      const ptr = sim.tick();
      const arr = new Uint8Array(sim.memory.buffer, ptr, h * w);
      let out = "";
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          out += "" + String.fromCharCode(arr[getIndex(j, i)]) + "";
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
