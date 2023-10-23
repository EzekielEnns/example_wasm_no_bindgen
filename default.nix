{ pkgs ? import <nixpkgs> {
  overlays = [
    (import (builtins.fetchTarball
      "https://github.com/oxalica/rust-overlay/archive/master.tar.gz"))
  ];
} }:
with pkgs;
let rust = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;
 unstableTarball = fetchTarball
    "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz";
  unstable = import unstableTarball { };
in pkgs.mkShell { packages = [ rust rust-analyzer unstable.bun  ]; }
#cargo b --manifest-path=logic/Cargo.toml
