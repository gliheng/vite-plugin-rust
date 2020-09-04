import { spawnSync, spawn } from 'child_process';
import { PluginConfig, WasmPackOpts } from "./config";
import chalk from 'chalk';
import chokidar from 'chokidar';

const debug = require('debug')('vite-plugin-rust:compiler');

function compileOne(crate: string, opt: WasmPackOpts, sync: boolean) {
    // TODO: toggle this mode base on build profile
    let mode = '--dev';
    let exe = 'wasm-pack';
    if (process.platform == 'win32') {
        exe = 'wasm-pack.exe';
    }
    const args = ['build', mode, '--out-name', opt.outName, '--target', 'web'];
    debug('Running subprocess with command: ', exe, args.join(' '));
    if (sync) {
        let ps = spawnSync(exe, args, {
            shell: true,
            cwd: opt.path,
            encoding: 'utf-8',
            stdio: ['inherit', 'inherit', 'inherit'],
        });
        if (ps.status != 0) {
            throw chalk.red(`wasm-pack for crate ${crate} failed`);
        }
    } else {
        let ps = spawn(exe, args, {
            shell: true,
            cwd: opt.path,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
        ps.on('close', code => {
            if (code != 0) {
                throw chalk.red(`wasm-pack for crate ${crate} failed`);
            }
        });
    }
}

export function compile(cfg: PluginConfig, crate?: string, sync?: boolean) {
    const { crates, wasmPack } = cfg;
    debug('Compile using wasm-pack at', wasmPack);
    for (let crate in crates) {
        let opt = crates[crate];
        compileOne(crate, opt, sync || false);
    }
}

type WatchCallback = (crateName: string) => void;

export function watch(cfg: PluginConfig, cbk: WatchCallback) {
    Object.entries(cfg.crates).forEach(([crateName, opt]) => {        
        chokidar.watch(opt.path).on('all', (event, path) => {
          console.log('crate', crateName, 'changed:', event, path);
          cbk(crateName);
        });
    });
}