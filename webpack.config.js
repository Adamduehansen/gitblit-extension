const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type { import('webpack').Configuration } */
module.exports = {
  mode: 'production',
  entry: {
    contentScript: './src/contentScript.ts',
    background: './src/background.ts',
    popup: './src/popup/popup.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        './assets/manifest.json',
        './assets/popup.css',
        {
          from: './assets/images',
          to: 'images',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './assets/popup.html',
      chunks: ['popup'],
      filename: 'popup.html',
    }),
  ],
};
