//must be kept in sync with lib.rs
interface Wasm {
    add(a:number,b:number): number;
    plyMove(l:number,d:number,u:number,r:number):number;
    tick():number;
    test(): number;
    memory: WebAssembly.Memory

}

fetch("./build/wasm32-unknown-unknown/debug/logic.wasm ")
  .then((res) => res.arrayBuffer())
  .then((bytees) =>
    WebAssembly.instantiate(bytees, {})
  )
  .then((model) => {
      //Read:: https://radu-matei.com/blog/practical-guide-to-wasm-memory/
      const test:Wasm = (model.instance.exports as any);
      let ptr = test.tick();
      console.log(model.instance.exports)
      const arr = new Uint8Array(test.memory.buffer,ptr, 10*10)
      console.log(arr)
      // while (true) {
      //   //wasm tick
      //   //canvas render
      // }
  });

