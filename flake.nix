{
  description = "A kanji seach tool";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem(system:
      let
        pkgs = import nixpkgs { inherit system; };
        python-packages = ps: with ps; [
          beautifulsoup4
          requests
        ];
      in
      {
        devShells = {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              typescript
              (python3.withPackages python-packages)
            ];
          };
        };
      }
    );
}
