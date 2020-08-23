import { createRustRollupPlugin } from './rustRollupPlugin';

interface PluginOpts {
  crates: any,
}

const PREFIX = '/@rust/';

module.exports = (opts: PluginOpts) => {

  return {
    alias: {
      '/@rust/rust_crate/': 'C:\\Users\\juju\\Develop\\vite-plugin-rust\\example\\crate\\pkg'
    },
    resolvers: [{
      alias(id: string) {
        let parts = id.split('/', 1);
        if (parts.length >= 1) {
          let crate = parts[0];
          if (crate in opts.crates) {
            return PREFIX + crate + '/' + (parts[1] || 'rust_crate.js');
          }
        }
      }
    }],
    rollupInputOptions: {
      plugins: [
        createRustRollupPlugin(),
      ]
    }
  };
};