/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const bundleAnalyzer = new BundleAnalyzerPlugin();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        include: [path.resolve(__dirname, 'src/assets'), path.resolve(__dirname, 'public')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        ],
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
      {
        test: /\.mp3$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/audio',
            name: '[name].[ext]'
          }
        }],
      },
      {
        test: /\.mp4$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/video',
            name: '[name].[ext]'
          }
        }],
      }
    ],
 },
 plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './production.index.html'),
      filename: 'index.html',
      inject: false,
      favicon: path.resolve(__dirname, 'public/uvxicon.svg'), 
    }),
    // bundleAnalyzer,
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [ // optimize js
      new TerserPlugin({
        parallel: true,
      }),
    ]
  },
};