//must be kept in sync with lib.rs
interface Wasm {
    add(a:number,b:number): number;
}

fetch("./build/wasm32-unknown-unknown/debug/logic.wasm ")
  .then((res) => res.arrayBuffer())
  .then((bytees) =>
    WebAssembly.instantiate(bytees, { })
  )
  .then((model) => {
      const test:Wasm = (model.instance.exports as any);
      //main code here
      alert(`${test.add(1,2)}`)
      // while (true) {
      //   //wasm tick
      //   //canvas render
      // }
  });

