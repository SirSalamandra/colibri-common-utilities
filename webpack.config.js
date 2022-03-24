const path = require('path');

module.exports = {
  entry: {
    websocket: ['./lib/nirvana.js', './lib/paho-mqtt.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './lib'),
  },
};