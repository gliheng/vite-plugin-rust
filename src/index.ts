import { resolver } from './resolver';
import { rustServerPlugin } from './serverPlugin';
import { rustTransform } from './transform';
import { setConfig } from './config';

interface PluginConfig {
  crates: any,
}

module.exports = (config: PluginConfig) => {
  setConfig(config);
  return {
    resolvers: [ resolver ],
    configureServer: rustServerPlugin,
    transforms: [ rustTransform ]
  };
};