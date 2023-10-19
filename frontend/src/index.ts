//must be kept in sync with lib.rs
interface Wasm {
    add(a:number,b:number): number;
    plyMove(l:number,d:number,u:number,r:number):number;
    tick():number;
    get_height():number;
    get_width():number;
    memory: WebAssembly.Memory

}
fetch("./build/wasm32-unknown-unknown/debug/logic.wasm ")
  .then((res) => res.arrayBuffer())
  .then((bytees) =>
    WebAssembly.instantiate(bytees, {})
  )
  .then((model) => {
      //Read:: https://radu-matei.com/blog/practical-guide-to-wasm-memory/
      const sim:Wasm = (model.instance.exports as any);
      const canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;
      canvas.height = 500;
      canvas.width = 500;
      const ctx = canvas?.getContext('2d');
      const w = sim.get_width()
      const h = sim.get_height()
      const getIndex = (x:number, y:number) => {
          return x* w+ y;
      };
      let aniId;
      const renderLoop = () => {

          if (ctx) {
//https://webglfundamentals.org/
              //fml guess ill do webgl
              let lineHeight = ctx.measureText("@").width * 1.2;
              console.log("hi")
              ctx.font = "50px serif";
              const ptr = sim.tick() 
              const arr = new Uint8Array(sim.memory.buffer,ptr, 10*10)
              for (let y = 0; y < h; y++) {
                  let outStr = ""
                  for (let x=0; x < w; x++) {
                    const i = getIndex(x,y) 
                    outStr +=" "+ String.fromCharCode(arr[i]) + "  "
                  }
                  ctx.fillText(outStr, 0, y*lineHeight);
              }
          }
          aniId = requestAnimationFrame(renderLoop)
      }
      renderLoop()
  });

