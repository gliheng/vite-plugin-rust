import { Plugin } from 'rollup';
import { resolveAsset, registerAssets } from 'vite/dist/node/build/buildPluginAsset';
import { PluginConfig } from './config';

const LINE = "input = import.meta.url.replace(/\\.js$/, '_bg.wasm');"

// TODO: Is it possible to get these options from vite?
export const createRustRollupPlugin = (
  cfg: PluginConfig,
  publicBase: string = '/',
  assetsDir: string = '_assets',
  inlineLimit: number = 4096,
): Plugin => {
  const assets = new Map<string, Buffer>()

  return {
    name: 'vite:rust',

    async transform(code, id) {
      let crateInfo = cfg.crateForFile(id);
      if (crateInfo) {
        if (cfg.isEntryForCrate(...crateInfo)) {
          let idx = id.lastIndexOf('.');
          let wasmId = id.substring(0, idx) + '_bg.wasm';
          const { fileName, content, url } = await resolveAsset(
            wasmId,
            cfg.root,
            publicBase,
            assetsDir,
            inlineLimit,
          );
          if (fileName && content && url) {
            assets.set(fileName, content);
            let replLine = `input = '${url}';`;
            code = code.replace(LINE, replLine);
            return code;
          }  
        }
      }
      return null;
    },

    generateBundle(_options, bundle) {
      registerAssets(assets, bundle);
    },
  }
}
