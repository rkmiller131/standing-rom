/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const bundleAnalyzer = new BundleAnalyzerPlugin();
const path = require('path');

module.exports = {
 mode: 'production',
 entry: './src/main.tsx',
 output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
 },
 resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
 },
 module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['file-loader']
      },
      {
        test: /\.(gltf|glb|fbx|bin|vrm)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/models',
            limit: false,
            name: '[name].[ext]'
          }
        }],
        type: 'javascript/auto'
      },
    ],
 },
 plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './production.index.html'),
      filename: 'index.html',
      inject: false
    }),
    bundleAnalyzer
  ],
};