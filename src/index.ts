import { UserConfig, normalizeConfig } from './config';
import { compile } from './compiler';
import { createRustRollupPlugin } from './rustRollupPlugin';

const debug = require('debug')('vite-plugin-rust:index');

const URL_PREFIX = '/@rust/';

function urlForCrate(crate: string, ...pathes: string[]): string {
  let tail = pathes.map(p => p.replace(/\\/g, '/')).join('/')
  return `${URL_PREFIX}${crate}/${tail}`;
}

module.exports = (config: UserConfig) => {
  let root = process.cwd();
  let cfg = normalizeConfig(config, root);

  debug('vite-plugin-rust config', cfg);
  // Do initial compile in dev mode
  // wasm-pack compile in build is done in rollup plugin
  compile(cfg.wasmPack, cfg.crates, true);

  return {
    resolvers: [{
      alias(id: string) {
        let parts = id.split('/', 2);
        if (parts.length >= 1) {
          let [crate, filePath] = parts;
          if (crate in cfg.crates) {
            if (!filePath) {
              filePath = cfg.crates[crate].outName + '.js';
            }
            return urlForCrate(crate, filePath);
          }
        }
      },
      requestToFile(publicPath: string, root: string) {
        if (publicPath.startsWith(URL_PREFIX)) {
          let seg = publicPath.substring(URL_PREFIX.length);
          let [crate, filePath] = seg.split('/', 2);
          return cfg.filePathForCrate(crate, filePath);
        }
      },
      fileToRequest(filePath: string, root: string) {
        let crateInfo = cfg.crateForFile(filePath);
        if (crateInfo) {
          return urlForCrate(...crateInfo);
        }
      },
    }],
    rollupInputOptions: {
      plugins: [
        createRustRollupPlugin(cfg),
      ]
    }
  };
};