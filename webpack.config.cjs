/* eslint-disable @typescript-eslint/no-var-requires */
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
        test: /\.(vrm|glb)$/,
        type: 'asset/resource',
      },
    ],
 }
};