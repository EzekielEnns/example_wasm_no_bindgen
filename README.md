# example of using raw wasm32-unknown-unknown inside browser
this is a simple text based 'game' you just move a `@` on a map using `hjkl` (vim motions)
this code is broken up into two dir's
### ./simulation 
is a rust project with two neat expections: the default build output it 
set to `wasm32-unknown-unknown` and two custom commands are set for cargo
- `cargo b` outputs a build to the ./frontend directory
- `cargo t` a quick way to run tests on linux, due to [this](https://github.com/rustwasm/team/issues/173)
the idea in that thread is that the rust teams wants you to simulate your rust tests with a wasm runner,
thats alot of work esspially for a simple project so this is a quick fix till i get around to making one

### ./frontend
a bunjs app setup to bundle and serve a template site, you can find the code for servering in
`./frontend/index.ts` and the source code for the actual page `./frontend/src/index.ts`
bun actually helps alot by  alleviating the need to install esbuild and some random static site
hosting lib, you can bundle and run the site 
via the command `npm run start` or `bun --watch index.ts`, this will hot reload and all you gotta
do is refresh your browser


### default.nix
if you are using [nix](https://nixos.org/) feel free to clone and run `nix-shell` to get all the deps 
flakes maybe supported down the road
