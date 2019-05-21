const path = require('path');
const withTypescript = require('@zeit/next-typescript');
module.exports = withTypescript({
  distDir: '../../dist/functions/next',
  // TODO: remove this as shared won't have credentials stored anymore as firebase-admin sdk is soon being served through the express server
  webpack(config, options) {
    config.module.rules.push({
      test: path.resolve(__dirname, '..', 'shared', 'credentials', 'server.ts'),
      use: 'null-loader',
    });
    return config;
  },
});
