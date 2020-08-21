const rust = require('vite-plugin-rust');

module.exports = {
  a:123,
  plugins: [
    rust({
      crates: {
        rust_crate: './crate',
      }
    }),
  ]
};
