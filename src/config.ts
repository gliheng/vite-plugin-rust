import which from 'which';
import chalk from 'chalk';
import path from 'path'

export interface UserConfig {
  crates: Record<string, string | WasmPackOpts>,
  wasmPack?: string,
}

export interface WasmPackOpts {
  path: string,
  outName: string, // --out-name passed to wasm-pack
}

export class PluginConfig {
  wasmPack: string;
  crates: Record<string, WasmPackOpts>;
  root: string;

  constructor(wasmPack: string, crates: Record<string, WasmPackOpts>, root: string) {
    this.wasmPack = wasmPack;
    this.crates = crates;
    this.root = root;
  }

  // given a local file absolute path, check if it's in one of our crates
  // if so, split it into crate and remaining path
  public crateForFile(filePath: string): [string, string] | undefined {
    for (let crate in this.crates) {
      let cratePath = this.crates[crate].path + path.sep + 'pkg';
      if (filePath.startsWith(cratePath)) {
        return [crate, filePath.substring(cratePath.length + 1)];
      }
    }
  }

  public filePathForCrate(crate: string, filePath: string): string | undefined {
    if (crate in this.crates) {
      let cratePath = this.crates[crate].path;
      return path.resolve(cratePath, 'pkg', filePath);
    }
  }

  // if the given relative file path is crate entry js file
  public isEntryForCrate(crate: string, filePath: string): boolean {
    if (crate in this.crates) {
      let outName = this.crates[crate].outName;
      return filePath == outName + '.js';
    }
    return false;
  }
}

export function normalizeConfig(cfg: UserConfig, root: string): PluginConfig {
  let wasmPack = cfg.wasmPack;
  if (!wasmPack) {
    wasmPack = which.sync('wasm-pack', { nothrow: true }) || undefined;
    if (!wasmPack) {
      throw chalk.red('Cannot find wasm-pack in your PATH. Please make sure wasm-pack is installed');
    }
  }

  let newCrates: Record<string, WasmPackOpts> = {};
  for (let crate in cfg.crates) {
    let opt = cfg.crates[crate];
    let newCrate;
    if (typeof opt == 'string') {
      newCrate = {
        path: path.resolve(root, opt),
        outName: nameForCrate(crate),
      }
    } else {
      newCrate = {
        path: path.resolve(root, opt.path),
        outName: opt.outName,
      };
    }
    newCrates[crate] = newCrate;
  }

  return new PluginConfig(wasmPack, newCrates, root);
}

function nameForCrate(crate: string): string {
  return crate.replace(/-/g, '_').toLowerCase();
}
