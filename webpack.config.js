const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/javascript/demo.js',
  output: {
    path: path.resolve(__dirname, 'public', 'javascript'),
    filename: 'demo.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
