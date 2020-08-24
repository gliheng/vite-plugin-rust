# vite-plugin-rust

vite-plugin-rust is a vite plugin that intergrate wasm-pack.

## Getting Started

- Config plugin in `vite.config.js`
```js
const rust = require('vite-plugin-rust');

module.exports = {
  plugins: [
    rust({
      crates: {
        rust_crate: './crate',
      }
    }),
  ]
};
```
It's not needed to add wasm-pack generated package to package.json dependency list.

- Wasm loading
You can use wasm-pack generated package with import or dynamic import.

```js
// Static Import
import init from 'rust_crate';
init().then(m => {
  m.greet();
});
```

```js
// Dynamic Import
import('rust_crate').then(async m => {
  await m.default();
  m.greet();
});
```

## License

MIT
