import { spawnSync } from 'child_process';
import { WasmPackOpts } from "./config";
import chalk from 'chalk';

const debug = require('debug')('vite-plugin-rust:compiler');

export function compile(wasmPack: string, crates: Record<string, WasmPackOpts>, sync: boolean = false) {
    debug('Compile using wasm-pack at', wasmPack);
    for (let crate in crates) {
        let opt = crates[crate];
        let mode = '--dev';
        const cmd = `wasm-pack.exe build ${mode} --out-name ${opt.outName} --target web`;
        debug('Running subprocess with command: ', cmd);
        if (sync) {
            let ps = spawnSync(cmd, {
                shell: true,
                cwd: opt.path,
                encoding: 'utf-8',
                stdio: ['inherit', 'inherit', 'inherit'],
            });
            if (ps.status != 0) {
                throw chalk.red(`wasm-pack for crate ${crate} failed`);
            }
        }
    }
}