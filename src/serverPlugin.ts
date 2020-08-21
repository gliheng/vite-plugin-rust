import { ServerPlugin } from 'vite';
// readBody

export const rustServerPlugin: ServerPlugin = ({ app }) => {
    console.log('>>> what is server plugin');
};