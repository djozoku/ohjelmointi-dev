const path = require('path');
const withTypescript = require('@zeit/next-typescript');
module.exports = withTypescript({
  distDir: '../../dist/functions/next',
});
