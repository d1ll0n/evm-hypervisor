'use strict';

const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'assemble'),
  output: {
    path: __dirname,
    filename: 'emasm.umd.js',
    library: 'emasm',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  devtool: 'source-map'
};
