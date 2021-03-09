var webpack = require('webpack');

module.exports = {

  output: {
    library: 'ReactSoftKey',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]
}