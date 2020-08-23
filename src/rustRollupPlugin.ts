import { Plugin } from 'rollup';
import { resolveAsset, registerAssets } from 'vite/dist/node/build/buildPluginAsset';
import path from 'path';

const LINE = "input = import.meta.url.replace(/\\.js$/, '_bg.wasm');"

export const createRustRollupPlugin = (
  root: string = process.cwd(),
  publicBase: string = '/',
  assetsDir: string = '_assets',
  inlineLimit: number = 4096,
): Plugin => {
  const assets = new Map<string, Buffer>()

  return {
    name: 'vite:rust',

    resolveId(id) {
      console.log('resolve', id);
      return null;
    },
    
    async transform(code, id) {
      if (id.endsWith('rust_crate.js')) {
        let idx = id.lastIndexOf('.');
        let wasmId = id.substring(0, idx) + '_bg.wasm';
        const { fileName, content, url } = await resolveAsset(
          wasmId,
          root,
          publicBase,
          assetsDir,
          inlineLimit
        )
        if (fileName && content) {
          assets.set(fileName, content)
          let wasmUrl = path.join(publicBase, assetsDir, fileName).replace(/\\/g, '/');
          let replLine = `input = '${wasmUrl}';`;
          code = code.replace(LINE, replLine);
          return code;
        }
      }
      return null;
    },

    generateBundle(_options, bundle) {
      registerAssets(assets, bundle)
    }
  }
}
