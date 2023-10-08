# Kanji Search

A tool for searching kanji by components. This is meant only for _searching_
kanji, not to view information such as meaning, readings or stroke order. Use
another tool for this.

## Development

### With nix

If you have nix installed, you can use the flake with `nix develop` and then do
`make all` to compile. The compiled site will be in `release/`. An `.envrc` for
use with direnv is also provided.

### Without nix

Will need:

- make
- typescript (tsc in particular)
- python with the following packages:
  ```
  requests
  beautifulsoup4
  lxml
  ```

Then compile with `make all`. The compiled site will be in `release/`.
