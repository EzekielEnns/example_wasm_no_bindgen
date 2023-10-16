interface Wasm {
    add(a:number,b:number): number;
}


alert("hi")

fetch("./logic.wasm")
  .then((res) => res.arrayBuffer())
  .then((bytees) =>
    WebAssembly.instantiate(bytees, { })
  )
  .then((wasm) => {
      const test:Wasm = (wasm.instance.exports as any);
      console.log(test.add(1,2))
  });

// while (true) {
//   //wasm tick
//   //canvas render
// }
