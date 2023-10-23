// src/index.ts
var cvs = document.getElementById("test");
fetch("./build/wasm32-unknown-unknown/debug/logic.wasm ").then((res) => res.arrayBuffer()).then((bytees) => WebAssembly.instantiate(bytees, {})).then((model) => {
  const sim = model.instance.exports;
  window.addEventListener("keydown", (e) => {
    console.log(e.key);
    let mv = 0;
    if (e.key == "h") {
      mv |= 128;
    }
    if (e.key == "j") {
      mv |= 64;
    }
    if (e.key == "k") {
      mv |= 32;
    }
    if (e.key == "l") {
      mv |= 16;
    }
    sim.plyMove(mv);
  });
  window.addEventListener("keyup", (e) => {
    console.log(e.key);
    let mv = 0;
    if (e.key == "h") {
      mv &= 112;
    }
    if (e.key == "j") {
      mv &= 176;
    }
    if (e.key == "k") {
      mv &= 208;
    }
    if (e.key == "l") {
      mv &= 224;
    }
    sim.plyMove(mv);
  });
  const w = sim.get_width();
  const h = sim.get_height();
  const getIndex = (x, y) => {
    return x * w + y;
  };
  const renderLoop = () => {
    const ptr = sim.tick();
    const arr = new Uint8Array(sim.memory.buffer, ptr, h * w);
    let out = "";
    for (let j = 0;j < h; j++) {
      for (let i = 0;i < w; i++) {
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
