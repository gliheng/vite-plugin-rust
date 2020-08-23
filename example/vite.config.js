const rust = require('vite-plugin-rust');

module.exports = {
  minify: 'esbuild',
  plugins: [
    rust({
      crates: {
        rust_crate: './crate',
      }
    }),
  ]
};
