import path from 'path';
import { Resolver } from 'vite';
import { getConfig } from './config';

export const resolver: Resolver = {
    alias(id) {
        const config = getConfig();
        if (id in config.crates) {
            // return '@jiji/abc';
            return '/' + path.join(config.crates[id], 'pkg', 'rust_crate.js').replace(/\\/g, '/');
        }
    }
};