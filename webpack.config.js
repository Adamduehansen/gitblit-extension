const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

/** @type { import('webpack').Configuration } */
module.exports = {
  mode: 'production',
  entry: {
    contentScript: './src/contentScript.ts',
    background: './src/background.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        './assets/manifest.json',
        {
          from: './assets/images',
          to: 'images',
        },
      ],
    }),
  ],
};
