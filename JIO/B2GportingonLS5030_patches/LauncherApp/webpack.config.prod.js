var config = require('./webpack.config.dev');
var webpack = require('webpack');

config.plugins = ((plugins) => {
  var defineOptions = {
    'process.env.NODE_ENV': JSON.stringify('production')
  };

  var uglifyOptions = {
    sourceMap: true,
    beautify: false,
    comments: false,
    compress: {
      collapse_vars: true,
      drop_console: false,
      screw_ie8: true,
      warnings: true
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      screw_ie8: true,
      comments: false
    }
  };

  return [new webpack.DefinePlugin(defineOptions)]
    .concat(plugins || [])
    .concat([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin(uglifyOptions)
    ]);
})(config.plugins);

module.exports = config;
