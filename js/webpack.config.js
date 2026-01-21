const config = require('flarum-webpack-config')();

config.entry = {
  forum: './src/forum/index.js'  // Explicitly set
};

module.exports = config;