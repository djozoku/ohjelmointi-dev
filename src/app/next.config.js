const path = require('path');
const withTypescript = require('@zeit/next-typescript');
module.exports = withTypescript({
  distDir: '../../dist/functions/next',
  webpack(config, options) {
    config.module.rules.push({
      test: path.resolve(__dirname, '..', 'shared', 'credentials', 'server.ts'),
      use: 'null-loader',
    });
    return config;
  },
});
